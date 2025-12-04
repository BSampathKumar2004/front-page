import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  Calendar, MapPin, Clock, IndianRupee, 
  Loader2, Building2, X, CheckCircle, AlertCircle
} from 'lucide-react';
import { Booking, bookingsApi } from '@/lib/api';
import heroImage from '@/assets/hero-hall.jpg';

// Mock bookings for demonstration
const mockBookings: Booking[] = [
  {
    id: 1,
    hall_id: 1,
    user_id: 1,
    booking_date: '2024-02-15',
    start_time: '15:00',
    end_time: '18:00',
    status: 'confirmed',
    total_amount: 45000,
    payment_status: 'completed',
    hall: {
      id: 1,
      name: 'Grand Ballroom',
      description: 'Elegant ballroom',
      capacity: 500,
      price_per_hour: 15000,
      price_per_day: 100000,
      location: 'Mumbai Central',
      images: [{ id: 1, hall_id: 1, image_url: heroImage }],
    },
  },
  {
    id: 2,
    hall_id: 2,
    user_id: 1,
    booking_date: '2024-02-20',
    start_time: '09:00',
    end_time: '12:00',
    status: 'pending',
    total_amount: 30000,
    payment_status: 'pending',
    hall: {
      id: 2,
      name: 'Royal Garden Hall',
      description: 'Outdoor venue',
      capacity: 300,
      price_per_hour: 10000,
      price_per_day: 75000,
      location: 'Bandra West',
      images: [{ id: 2, hall_id: 2, image_url: heroImage }],
    },
  },
];

const statusColors: Record<string, { bg: string; text: string }> = {
  confirmed: { bg: 'bg-emerald/10', text: 'text-emerald' },
  pending: { bg: 'bg-gold/10', text: 'text-gold' },
  cancelled: { bg: 'bg-destructive/10', text: 'text-destructive' },
};

const paymentStatusIcons: Record<string, typeof CheckCircle> = {
  completed: CheckCircle,
  pending: Clock,
  failed: AlertCircle,
};

export default function Dashboard() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/auth');
    }
  }, [authLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      loadBookings();
    }
  }, [isAuthenticated]);

  const loadBookings = async () => {
    try {
      const data = await bookingsApi.getMyBookings();
      setBookings(data);
    } catch (error) {
      // Use mock data if API fails
      setBookings(mockBookings);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: number) => {
    setCancellingId(bookingId);
    try {
      await bookingsApi.cancel(bookingId);
      setBookings((prev) => prev.filter((b) => b.id !== bookingId));
      toast({
        title: 'Booking cancelled',
        description: 'Your booking has been cancelled successfully.',
      });
    } catch (error) {
      toast({
        title: 'Failed to cancel',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setCancellingId(null);
    }
  };

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
              My Bookings
            </h1>
            <p className="text-muted-foreground">
              Welcome back, {user?.name}! Manage your venue bookings here.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="p-4 bg-card rounded-xl border border-border">
              <div className="text-2xl font-bold text-foreground">{bookings.length}</div>
              <div className="text-sm text-muted-foreground">Total Bookings</div>
            </div>
            <div className="p-4 bg-card rounded-xl border border-border">
              <div className="text-2xl font-bold text-emerald">
                {bookings.filter((b) => b.status === 'confirmed').length}
              </div>
              <div className="text-sm text-muted-foreground">Confirmed</div>
            </div>
            <div className="p-4 bg-card rounded-xl border border-border">
              <div className="text-2xl font-bold text-gold">
                {bookings.filter((b) => b.status === 'pending').length}
              </div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </div>
            <div className="p-4 bg-card rounded-xl border border-border">
              <div className="text-2xl font-bold text-foreground">
                ₹{bookings.reduce((acc, b) => acc + b.total_amount, 0).toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Total Spent</div>
            </div>
          </div>

          {/* Bookings List */}
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-muted rounded-xl animate-pulse" />
              ))}
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-16 bg-card rounded-2xl border border-border">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No bookings yet</h3>
              <p className="text-muted-foreground mb-6">
                Start by exploring our amazing venues
              </p>
              <Button variant="gold" asChild>
                <Link to="/halls">Browse Venues</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => {
                const PaymentIcon = paymentStatusIcons[booking.payment_status];
                const statusStyle = statusColors[booking.status];

                return (
                  <div
                    key={booking.id}
                    className="p-6 bg-card rounded-2xl border border-border hover:shadow-soft transition-shadow"
                  >
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Hall Image */}
                      <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden flex-shrink-0">
                        <img
                          src={booking.hall?.images?.[0]?.image_url || heroImage}
                          alt={booking.hall?.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Booking Details */}
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                          <div>
                            <Link
                              to={`/halls/${booking.hall_id}`}
                              className="text-xl font-display font-semibold text-foreground hover:text-gold transition-colors"
                            >
                              {booking.hall?.name || 'Hall'}
                            </Link>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                              <MapPin className="w-4 h-4" />
                              {booking.hall?.location || 'Location'}
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <Badge className={`${statusStyle.bg} ${statusStyle.text}`}>
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </Badge>
                            <Badge variant="outline" className="gap-1">
                              <PaymentIcon className="w-3 h-3" />
                              Payment {booking.payment_status}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-6 mt-4 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="w-4 h-4 text-gold" />
                            {new Date(booking.booking_date).toLocaleDateString('en-IN', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="w-4 h-4 text-gold" />
                            {booking.start_time} - {booking.end_time}
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <IndianRupee className="w-4 h-4 text-gold" />
                            {booking.total_amount.toLocaleString()}
                          </div>
                        </div>

                        {/* Actions */}
                        {booking.status !== 'cancelled' && (
                          <div className="flex gap-3 mt-4">
                            {booking.payment_status === 'pending' && (
                              <Button variant="gold" size="sm">
                                Complete Payment
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCancelBooking(booking.id)}
                              disabled={cancellingId === booking.id}
                            >
                              {cancellingId === booking.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <X className="w-4 h-4 mr-1" />
                              )}
                              Cancel
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
