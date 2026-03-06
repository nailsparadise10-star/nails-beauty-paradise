import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { Calendar, FileText, AlertCircle, Package, UserCheck, Users, BarChart3 } from "lucide-react";
import AdminBookingManager from "./AdminBookingManager";
import AdminBlogManager from "./AdminBlogManager";
import ServiceManager from "@/components/ServiceManager";
import StaffManager from "@/components/StaffManager";
import CustomerManager from "@/components/CustomerManager";

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();
  const bookingsQuery = trpc.bookings.list.useQuery();
  const blogQuery = trpc.blog.list.useQuery();

  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Access Denied
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground/70">
              You do not have permission to access the admin dashboard. Only administrators can view this page.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-foreground/60 mt-2">Manage bookings and blog posts</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bookingsQuery.data?.length || 0}</div>
              <p className="text-xs text-foreground/60">All time bookings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
              <FileText className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{blogQuery.data?.length || 0}</div>
              <p className="text-xs text-foreground/60">Published articles</p>
            </CardContent>
          </Card>
        </div>

        {/* Management Tabs */}
        <Tabs defaultValue="bookings" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="bookings" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Bookings</span>
            </TabsTrigger>
            <TabsTrigger value="services" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              <span className="hidden sm:inline">Services</span>
            </TabsTrigger>
            <TabsTrigger value="staff" className="flex items-center gap-2">
              <UserCheck className="w-4 h-4" />
              <span className="hidden sm:inline">Staff</span>
            </TabsTrigger>
            <TabsTrigger value="customers" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Customers</span>
            </TabsTrigger>
            <TabsTrigger value="blog" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Blog</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bookings" className="space-y-4">
            <AdminBookingManager />
          </TabsContent>

          <TabsContent value="services" className="space-y-4">
            <ServiceManager />
          </TabsContent>

          <TabsContent value="staff" className="space-y-4">
            <StaffManager />
          </TabsContent>

          <TabsContent value="customers" className="space-y-4">
            <CustomerManager />
          </TabsContent>

          <TabsContent value="blog" className="space-y-4">
            <AdminBlogManager />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
