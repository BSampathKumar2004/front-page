import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  MapPin, Users, IndianRupee, Wifi, Car, Music, 
  Utensils, AirVent, Check, ChevronLeft, ChevronRight,
  Clock, CalendarDays, Loader2
} from 'lucide-react';
import { Hall, hallsApi, amenitiesApi, bookingsApi, Amenity, TimeSlot } from '@/lib/api';
import heroImage from '@/assets/hero-hall.jpg';

const amenityIcons: Record<string, typeof Wifi> = {
  wifi: Wifi,
  car: Car,
  music: Music,
  utensils: Utensils,
  'air-vent': AirVent,
};

export default function HallDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  const [hall, setHall] = useState<Hall | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    loadHallDetails();
  }, [id]);

  useEffect(() => {
    if (selectedDate && hall) {
      loadAvailableSlots();
    }
  }, [selectedDate, hall]);

  const loadHallDetails = async () => {
    try {
      const [hallData, amenitiesData] = await Promise.all([
        hallsApi.getById(Number(id)),
        amenitiesApi.getByHall(Number(id)),
      ]);
      setHall(hallData);
      setAmenities(amenitiesData);
      setError(null);
    } catch (err) {
      setError('Failed to load venue details');
      console.error('Failed to load hall:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadAvailableSlots = async () => {
    if (!selectedDate || !hall) return;
    
    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      const slots = await bookingsApi.getAvailableSlots(hall.id, dateStr);
      setAvailableSlots(slots);
    } catch (err) {
      console.error('Failed to load slots:', err);
      setAvailableSlots([]);
    }
  };

  const handleBooking = async () => {
    if (!isAuthenticated) {
      toast({
        title: 'Please sign in',
        description: 'You need to sign in to make a booking',
      });
      navigate('/auth');
      return;
    }

    if (!selectedDate || !selectedSlot || !hall) {
      toast({
        title: 'Select date and time',
        description: 'Please select a date and time slot',
        variant: 'destructive',
      });
      return;
    }

    setIsBooking(true);
    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      await bookingsApi.create({
        hall_id: hall.id,
        booking_date: dateStr,
        start_time: selectedSlot.start_time,
        end_time: selectedSlot.end_time,
      });
      toast({
        title: 'Booking created!',
        description: 'Proceed to payment to confirm your booking.',
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: 'Booking failed',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setIsBooking(false);
    }
  };

  const nextImage = () => {
    if (hall?.images) {
      setCurrentImageIndex((prev) => (prev + 1) % hall.images!.length);
    }
  };

  const prevImage = () => {
    if (hall?.images) {
      setCurrentImageIndex((prev) => (prev - 1 + hall.images!.length) % hall.images!.length);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    );
  }

  if (error || !hall) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 flex flex-col items-center justify-center min-h-[60vh]">
          <p className="text-destructive mb-4">{error || 'Hall not found'}</p>
          <Button onClick={() => navigate('/halls')}>Back to Venues</Button>
        </div>
        <Footer />
      </div>
    );
  }

  const images = hall.images?.length ? hall.images : [{ id: 0, hall_id: hall.id, image_url: heroImage }];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Image Gallery */}
      <section className="pt-16 relative">
        <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
          <img
            src={images[currentImageIndex].image_url}
            alt={hall.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          
          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Image Indicators */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentImageIndex ? 'bg-gold' : 'bg-card/50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Left Column - Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Header */}
              <div>
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <MapPin className="w-4 h-4" />
                  <span>{hall.location}</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">
                  {hall.name}
                </h1>
              </div>

              {/* Quick Info */}
              <div className="flex flex-wrap gap-4">
                <Badge variant="secondary" className="gap-2 px-4 py-2">
                  <Users className="w-4 h-4" />
                  Up to {hall.capacity} guests
                </Badge>
                <Badge variant="secondary" className="gap-2 px-4 py-2">
                  <IndianRupee className="w-4 h-4" />
                  {hall.price_per_hour.toLocaleString()}/hour
                </Badge>
                <Badge variant="secondary" className="gap-2 px-4 py-2">
                  <CalendarDays className="w-4 h-4" />
                  {hall.price_per_day.toLocaleString()}/day
                </Badge>
              </div>

              {/* Description */}
              <div>
                <h2 className="text-xl font-display font-semibold mb-4">About this venue</h2>
                <p className="text-muted-foreground leading-relaxed">{hall.description}</p>
              </div>

              {/* Amenities */}
              {amenities.length > 0 && (
              <div>
                <h2 className="text-xl font-display font-semibold mb-4">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {amenities.map((amenity) => {
                    const IconComponent = amenityIcons[amenity.icon || 'wifi'] || Check;
                    return (
                      <div
                        key={amenity.id}
                        className="flex items-center gap-3 p-4 rounded-lg bg-muted/50"
                      >
                        <div className="w-10 h-10 rounded-lg bg-gold/20 flex items-center justify-center">
                          <IconComponent className="w-5 h-5 text-gold" />
                        </div>
                        <span className="font-medium">{amenity.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              )}
            </div>

            {/* Right Column - Booking */}
            <div>
              <div className="sticky top-24 p-6 bg-card rounded-2xl border border-border shadow-elevated">
                <h3 className="text-xl font-display font-semibold mb-6">Book This Venue</h3>

                {/* Calendar */}
                <div className="mb-6">
                  <label className="text-sm font-medium mb-2 block">Select Date</label>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date()}
                    className="rounded-lg border"
                  />
                </div>

                {/* Time Slots */}
                {selectedDate && (
                  <div className="mb-6 animate-fade-in">
                    <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Available Time Slots
                    </label>
                    <div className="space-y-2">
                      {availableSlots.length === 0 ? (
                        <p className="text-sm text-muted-foreground">Loading slots...</p>
                      ) : (
                        availableSlots.map((slot, index) => (
                          <button
                            key={index}
                            onClick={() => slot.available && setSelectedSlot(slot)}
                            disabled={!slot.available}
                            className={`w-full p-3 rounded-lg border text-left transition-all ${
                              selectedSlot === slot
                                ? 'border-gold bg-gold/10'
                                : slot.available
                                ? 'border-border hover:border-gold/50'
                                : 'border-border bg-muted opacity-50 cursor-not-allowed'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium">
                                {slot.start_time} - {slot.end_time}
                              </span>
                              {!slot.available && (
                                <Badge variant="secondary">Booked</Badge>
                              )}
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* Price Summary */}
                {selectedSlot && (
                  <div className="mb-6 p-4 bg-muted/50 rounded-lg animate-fade-in">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Price per hour</span>
                      <span>₹{hall.price_per_hour.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Duration</span>
                      <span>3 hours</span>
                    </div>
                    <div className="h-px bg-border my-3" />
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span className="text-gold">₹{(hall.price_per_hour * 3).toLocaleString()}</span>
                    </div>
                  </div>
                )}

                <Button
                  variant="gold"
                  className="w-full"
                  size="lg"
                  onClick={handleBooking}
                  disabled={!selectedDate || !selectedSlot || isBooking}
                >
                  {isBooking ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Book Now'
                  )}
                </Button>

                {!isAuthenticated && (
                  <p className="text-xs text-muted-foreground text-center mt-3">
                    You'll need to sign in to complete the booking
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
