import { mockRequests } from "@/lib/mockData";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, Truck, PackageCheck, FileText } from "lucide-react";

export default function Requests() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4 text-amber-500" />;
      case 'approved': return <CheckCircle2 className="h-4 w-4 text-blue-500" />;
      case 'shipped': return <Truck className="h-4 w-4 text-indigo-500" />;
      case 'delivered': return <PackageCheck className="h-4 w-4 text-green-500" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return "bg-amber-500/10 text-amber-600 border-amber-200";
      case 'approved': return "bg-blue-500/10 text-blue-600 border-blue-200";
      case 'shipped': return "bg-indigo-500/10 text-indigo-600 border-indigo-200";
      case 'delivered': return "bg-green-500/10 text-green-600 border-green-200";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Store Requests</h1>
        <p className="text-muted-foreground">Monitor and fulfill stock replenishment requests from stores.</p>
      </div>

      <div className="grid gap-6">
        {mockRequests.map((req) => (
          <Card key={req.id} className="overflow-hidden border-l-4 border-l-transparent hover:border-l-primary transition-all">
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-lg">{req.storeName}</h3>
                    <Badge variant="outline" className={`capitalize flex items-center gap-1.5 ${getStatusColor(req.status)}`}>
                      {getStatusIcon(req.status)}
                      {req.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground font-mono">ID: {req.id} • Date: {req.requestDate}</p>
                </div>
                
                <div className="flex items-center gap-2">
                  {req.status === 'pending' && (
                    <Button size="sm" className="bg-primary hover:bg-primary/90">
                      Approve Request
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    Details
                  </Button>
                </div>
              </div>

              <div className="bg-muted/30 rounded-lg p-4 border border-border/50">
                <h4 className="text-sm font-medium mb-3 text-muted-foreground uppercase tracking-wider text-xs">Requested Items</h4>
                <div className="grid gap-2">
                  {req.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm py-2 border-b border-border/50 last:border-0 last:pb-0">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs bg-background px-2 py-1 rounded border text-muted-foreground">{item.sku}</span>
                        <span className="font-medium">{item.productName}</span>
                      </div>
                      <span className="font-mono font-bold">x{item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex items-center text-xs text-muted-foreground">
                <span className="mr-2">Target Warehouse:</span>
                <span className="font-mono bg-secondary px-2 py-0.5 rounded text-secondary-foreground">{req.warehouseId}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
