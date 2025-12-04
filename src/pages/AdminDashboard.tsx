import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  Building2, Users, Calendar, IndianRupee, TrendingUp, 
  BarChart3, LogOut, Menu, X, Home, Settings, PlusCircle, Loader2
} from 'lucide-react';
import { 
  adminPanelApi, adminAnalyticsApi, Hall, User 
} from '@/lib/api';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

// Mock analytics data
const mockMonthlyRevenue = [
  { month: 'Jan', revenue: 250000 },
  { month: 'Feb', revenue: 320000 },
  { month: 'Mar', revenue: 280000 },
  { month: 'Apr', revenue: 410000 },
  { month: 'May', revenue: 390000 },
  { month: 'Jun', revenue: 520000 },
];

const mockRevenueByHall = [
  { hall_name: 'Grand Ballroom', revenue: 850000 },
  { hall_name: 'Royal Garden', revenue: 620000 },
  { hall_name: 'Conference Center', revenue: 340000 },
  { hall_name: 'Sunset Terrace', revenue: 280000 },
];

const COLORS = ['hsl(45, 93%, 47%)', 'hsl(222, 47%, 20%)', 'hsl(160, 84%, 39%)', 'hsl(220, 14%, 60%)'];

export default function AdminDashboard() {
  const { admin, isAdmin, isLoading: authLoading, logout } = useAuth();
  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  
  // Data states
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState(mockMonthlyRevenue);
  const [revenueByHall, setRevenueByHall] = useState(mockRevenueByHall);
  const [halls, setHalls] = useState<Hall[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate('/auth?mode=admin');
    }
  }, [authLoading, isAdmin, navigate]);

  useEffect(() => {
    if (isAdmin) {
      loadDashboardData();
    }
  }, [isAdmin]);

  const loadDashboardData = async () => {
    try {
      const [revenueData, monthlyData, hallRevenueData, hallsData, usersData] = await Promise.all([
        adminAnalyticsApi.getTotalRevenue().catch(() => ({ total: 2170000 })),
        adminAnalyticsApi.getMonthlyRevenue(new Date().getFullYear()).catch(() => mockMonthlyRevenue),
        adminAnalyticsApi.getRevenueByHalls().catch(() => mockRevenueByHall),
        adminPanelApi.getHalls().catch(() => []),
        adminPanelApi.getUsers().catch(() => []),
      ]);

      setTotalRevenue(revenueData.total);
      if (Array.isArray(monthlyData) && monthlyData.length > 0 && typeof monthlyData[0].month === 'number') {
        const formatted = (monthlyData as { month: number; revenue: number }[]).map((d) => ({
          month: new Date(2024, d.month - 1).toLocaleString('en', { month: 'short' }),
          revenue: d.revenue,
        }));
        setMonthlyRevenue(formatted);
      }
      if (Array.isArray(hallRevenueData)) {
        setRevenueByHall(hallRevenueData);
      }
      setHalls(hallsData);
      setUsers(usersData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (authLoading || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    );
  }

  const stats = [
    { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, icon: IndianRupee, color: 'text-gold' },
    { label: 'Total Halls', value: halls.length || 6, icon: Building2, color: 'text-primary' },
    { label: 'Total Users', value: users.length || 150, icon: Users, color: 'text-emerald' },
    { label: 'Bookings', value: 89, icon: Calendar, color: 'text-gold' },
  ];

  const sidebarLinks = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'halls', label: 'Manage Halls', icon: Building2 },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-300 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-20'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-border">
            <Link to="/" className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gold/20">
                <Building2 className="w-6 h-6 text-gold" />
              </div>
              {isSidebarOpen && (
                <span className="text-xl font-display font-semibold">HallBook</span>
              )}
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {sidebarLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === link.id
                    ? 'bg-gold/10 text-gold'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <link.icon className="w-5 h-5" />
                {isSidebarOpen && <span>{link.label}</span>}
              </button>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
            >
              <LogOut className="w-5 h-5" />
              {isSidebarOpen && <span>Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-lg border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <div>
                <h1 className="text-xl font-display font-semibold">
                  {sidebarLinks.find((l) => l.id === activeTab)?.label || 'Dashboard'}
                </h1>
                <p className="text-sm text-muted-foreground">Welcome back, {admin?.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" asChild>
                <Link to="/" className="gap-2">
                  <Home className="w-4 h-4" />
                  View Site
                </Link>
              </Button>
              <Button variant="gold" className="gap-2">
                <PlusCircle className="w-4 h-4" />
                Add Hall
              </Button>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-gold" />
            </div>
          ) : activeTab === 'overview' ? (
            <div className="space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <div
                    key={stat.label}
                    className="p-6 bg-card rounded-2xl border border-border hover:shadow-soft transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                        <p className="text-2xl font-bold mt-1">{stat.value}</p>
                      </div>
                      <div className={`w-12 h-12 rounded-xl bg-muted flex items-center justify-center ${stat.color}`}>
                        <stat.icon className="w-6 h-6" />
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mt-4 text-sm text-emerald">
                      <TrendingUp className="w-4 h-4" />
                      <span>+12% from last month</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Charts */}
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Revenue Chart */}
                <div className="p-6 bg-card rounded-2xl border border-border">
                  <h3 className="text-lg font-display font-semibold mb-6">Monthly Revenue</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={monthlyRevenue}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                        formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Revenue']}
                      />
                      <Bar dataKey="revenue" fill="hsl(45, 93%, 47%)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Revenue by Hall */}
                <div className="p-6 bg-card rounded-2xl border border-border">
                  <h3 className="text-lg font-display font-semibold mb-6">Revenue by Hall</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={revenueByHall}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="revenue"
                        nameKey="hall_name"
                      >
                        {revenueByHall.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                        formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Revenue']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-wrap justify-center gap-4 mt-4">
                    {revenueByHall.map((hall, index) => (
                      <div key={hall.hall_name} className="flex items-center gap-2 text-sm">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="text-muted-foreground">{hall.hall_name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 bg-card rounded-2xl border border-border">
              <p className="text-muted-foreground">
                {sidebarLinks.find((l) => l.id === activeTab)?.label} section coming soon
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
