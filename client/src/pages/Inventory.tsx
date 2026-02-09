import { useState, useMemo, useEffect } from "react";
import { warehouses as initialWarehouses, Product, type Warehouse } from "@/lib/mockData";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, Download, Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const STORAGE_KEY = "jkt_wms_inventory_data";

const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  type: z.enum(['pants', 'shirt', 'socks', 'jacket', 'hat'] as const),
  sku: z.string().min(3, "SKU must be at least 3 characters"),
  size: z.string().min(1, "Size is required"),
  price: z.coerce.number().min(0, "Price must be positive"),
  quantity: z.coerce.number().min(0, "Quantity must be positive"),
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function Inventory() {
  const { toast } = useToast();
  const [warehouses, setWarehouses] = useState<Warehouse[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved) as Warehouse[];
      } catch (e) {
        return initialWarehouses;
      }
    }
    return initialWarehouses;
  });
  
  const [activeWarehouseId, setActiveWarehouseId] = useState(initialWarehouses[0].id);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(warehouses));
  }, [warehouses]);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      type: "shirt",
      sku: "",
      size: "",
      price: 0,
      quantity: 0,
    },
  });

  const handleOpenAdd = () => {
    setEditingProduct(null);
    form.reset({
      name: "",
      type: "shirt",
      sku: "",
      size: "",
      price: 0,
      quantity: 0,
    });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    form.reset({
      name: product.name,
      type: product.type,
      sku: product.sku,
      size: product.size,
      price: product.price,
      quantity: product.quantity,
    });
    setIsDialogOpen(true);
  };

  const onSubmit = (values: ProductFormValues) => {
    const updatedWarehouses = warehouses.map(wh => {
      if (wh.id === activeWarehouseId) {
        if (editingProduct) {
          return {
            ...wh,
            inventory: wh.inventory.map(p => 
              p.id === editingProduct.id ? { ...p, ...values } : p
            )
          };
        } else {
          const newProduct: Product = {
            id: `PROD-${Math.random().toString(36).substr(2, 9)}`,
            ...values,
          };
          return {
            ...wh,
            inventory: [newProduct, ...wh.inventory]
          };
        }
      }
      return wh;
    });

    setWarehouses(updatedWarehouses);
    setIsDialogOpen(false);
    toast({
      title: editingProduct ? "Product Updated" : "Product Added",
      description: `Successfully ${editingProduct ? "updated" : "added"} ${values.name}.`,
    });
  };

  const handleDelete = () => {
    if (!productToDelete) return;

    const updatedWarehouses = warehouses.map(wh => {
      if (wh.id === activeWarehouseId) {
        return {
          ...wh,
          inventory: wh.inventory.filter(p => p.id !== productToDelete.id)
        };
      }
      return wh;
    });

    setWarehouses(updatedWarehouses);
    setProductToDelete(null);
    toast({
      title: "Product Deleted",
      description: "The product has been removed from the warehouse.",
      variant: "destructive",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);
  };

  const activeWarehouse = useMemo(() => 
    warehouses.find(wh => wh.id === activeWarehouseId) || warehouses[0],
    [warehouses, activeWarehouseId]
  );

  const filteredInventory = useMemo(() => {
    const products = activeWarehouse.inventory;
    if (!searchTerm) return products;
    return products.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [activeWarehouse, searchTerm]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Global Inventory</h1>
          <p className="text-muted-foreground">Manage stock levels across all distribution centers.</p>
        </div>
        <div className="flex items-center gap-2">
           <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
           </Button>
           <Button variant="default" size="sm" onClick={handleOpenAdd}>
            <Plus className="mr-2 h-4 w-4" /> Add Product
           </Button>
        </div>
      </div>

      <Tabs 
        value={activeWarehouseId} 
        onValueChange={setActiveWarehouseId} 
        className="w-full space-y-6"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <TabsList className="bg-muted/50 h-auto p-1 flex-wrap justify-start">
            {warehouses.map((wh) => (
              <TabsTrigger 
                key={wh.id} 
                value={wh.id}
                className="data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm"
              >
                {wh.name}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by SKU or Name..." 
              className="pl-8 bg-background"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <TabsContent value={activeWarehouseId} className="animate-in fade-in-50 duration-300">
          <Card>
            <CardHeader>
              <div className="flex justify-between">
                <div>
                  <CardTitle>{activeWarehouse.name} Stock List</CardTitle>
                  <CardDescription>{activeWarehouse.location} • ID: {activeWarehouse.id}</CardDescription>
                </div>
                <div className="flex gap-2">
                   <Badge variant="secondary" className="font-mono">
                      {activeWarehouse.inventory.length} SKUs
                   </Badge>
                   <Badge variant="outline" className="font-mono">
                      {((activeWarehouse.inventory.reduce((sum, item) => sum + item.quantity, 0) / activeWarehouse.capacity) * 100).toFixed(0)}% Capacity
                   </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-muted/50">
                    <TableHead className="w-[100px]">SKU</TableHead>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInventory.map((product) => (
                    <TableRow key={product.id} className="group">
                      <TableCell className="font-mono font-medium text-xs">{product.sku}</TableCell>
                      <TableCell className="font-medium text-foreground">{product.name}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="capitalize text-xs font-normal">
                          {product.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{product.size}</TableCell>
                      <TableCell className="text-right font-mono text-muted-foreground group-hover:text-foreground">
                        {formatCurrency(product.price)}
                      </TableCell>
                      <TableCell className="text-right font-mono font-bold">
                        <div className="flex items-center justify-end gap-2">
                          {product.quantity < 50 && (
                            <Badge variant="destructive" className="h-1.5 w-1.5 rounded-full p-0" />
                          )}
                          {product.quantity}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-muted-foreground hover:text-primary"
                            onClick={() => handleOpenEdit(product)}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => setProductToDelete(product)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredInventory.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                        No products found in this warehouse.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
            <DialogDescription>
              {editingProduct ? "Update product details in this warehouse." : "Add a new product to the current warehouse inventory."}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Blue Denim Jacket" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="sku"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SKU</FormLabel>
                      <FormControl>
                        <Input placeholder="JKT-001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="pants">Pants</SelectItem>
                          <SelectItem value="shirt">Shirt</SelectItem>
                          <SelectItem value="socks">Socks</SelectItem>
                          <SelectItem value="jacket">Jacket</SelectItem>
                          <SelectItem value="hat">Hat</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="size"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Size</FormLabel>
                      <FormControl>
                        <Input placeholder="L, XL, 32" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price (IDR)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">{editingProduct ? "Save Changes" : "Add Product"}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!productToDelete} onOpenChange={(open) => !open && setProductToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product
              <span className="font-bold text-foreground"> {productToDelete?.name}</span> from this warehouse.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete Product
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
