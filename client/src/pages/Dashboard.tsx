import { warehouses, mockRequests } from "@/lib/mockData";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Package, AlertCircle, TrendingUp, ArrowUpRight } from "lucide-react";
import WarehouseMap from "@/components/WarehouseMap";

export default function Dashboard() {
  const totalStock = warehouses.reduce((acc, wh) => acc + wh.inventory.reduce((sum, item) => sum + item.quantity, 0), 0);
  const pendingRequests = mockRequests.filter(r => r.status === 'pending').length;
  const totalValue = warehouses.reduce((acc, wh) => acc + wh.inventory.reduce((sum, item) => sum + (item.price * item.quantity), 0), 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
        <p className="text-muted-foreground">Real-time warehouse status across Jakarta region.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-primary shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inventory</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">{totalStock.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Units across 5 locations</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <AlertCircle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">{pendingRequests}</div>
            <p className="text-xs text-muted-foreground mt-1">Requires immediate attention</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Asset Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">Rp {(totalValue / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground mt-1">+2.5% from last month</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-400 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Warehouses</CardTitle>
            <MapPin className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">5/5</div>
            <p className="text-xs text-muted-foreground mt-1">All systems operational</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-7 lg:grid-cols-7">
        {/* Map View */}
        <Card className="col-span-4 overflow-hidden border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle>Warehouse Network</CardTitle>
            <CardDescription>Live distribution map</CardDescription>
          </CardHeader>
          <div className="relative aspect-video w-full bg-muted/20">
            <WarehouseMap />
          </div>
        </Card>

        {/* Quick List */}
        <Card className="col-span-3 border-border/50 shadow-sm flex flex-col">
          <CardHeader>
            <CardTitle>Facility Status</CardTitle>
            <CardDescription>Capacity utilization per location</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto pr-2">
            <div className="space-y-6">
              {warehouses.map((wh) => {
                const currentStock = wh.inventory.reduce((sum, item) => sum + item.quantity, 0);
                const percentage = (currentStock / wh.capacity) * 100;

                return (
                  <div key={wh.id} className="flex flex-col space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <span className="font-medium text-sm">{wh.name}</span>
                      </div>
                      <span className="font-mono text-xs text-muted-foreground">{currentStock} / {wh.capacity}</span>
                    </div>
                    <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-primary h-full rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
          <div className="p-6 pt-0 mt-auto border-t border-border/50">
            <div className="pt-4 flex justify-between items-center text-sm text-muted-foreground">
              <span>Updated: Just now</span>
              <span className="flex items-center hover:text-primary cursor-pointer transition-colors">View detailed report <ArrowUpRight className="ml-1 h-3 w-3" /></span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
