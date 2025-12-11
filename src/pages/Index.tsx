import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HallCard } from '@/components/halls/HallCard';
import { Calendar, Shield, Clock, Star, ArrowRight, CheckCircle, Loader2 } from 'lucide-react';
import heroImage from '@/assets/hero-hall.jpg';
import { Hall, hallsApi } from '@/lib/api';

const features = [
  {
    icon: Calendar,
    title: 'Easy Booking',
    description: 'Check real-time availability and book your preferred slot in minutes.',
  },
  {
    icon: Shield,
    title: 'Secure Payments',
    description: 'Pay securely with Razorpay integration and get instant confirmations.',
  },
  {
    icon: Clock,
    title: '24/7 Support',
    description: 'Our dedicated team is always ready to help with your bookings.',
  },
  {
    icon: Star,
    title: 'Premium Venues',
    description: 'Curated selection of the finest halls and banquet venues.',
  },
];

const stats = [
  { value: '500+', label: 'Venues' },
  { value: '10K+', label: 'Events Hosted' },
  { value: '98%', label: 'Satisfaction' },
  { value: '50+', label: 'Cities' },
];

export default function Index() {
  const [featuredHalls, setFeaturedHalls] = useState<Hall[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFeaturedHalls = async () => {
      try {
        const halls = await hallsApi.getAll();
        setFeaturedHalls(halls.slice(0, 3)); // Show first 3 as featured
      } catch (error) {
        console.error('Failed to load halls:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadFeaturedHalls();
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center gradient-hero overflow-hidden">
        {/* Background Image Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-navy-dark via-navy-dark/95 to-navy-dark/70" />

        {/* Animated Shapes */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-gold/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-gold/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />

        <div className="container mx-auto px-4 relative z-10 pt-20">
          <div className="max-w-3xl">
            <div className="animate-fade-in">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/20 text-gold text-sm font-medium mb-6">
                <Star className="w-4 h-4" />
                Premium Hall Booking Platform
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white leading-tight mb-6 animate-slide-up">
              Find the Perfect{' '}
              <span className="text-gradient-gold">Venue</span>
              {' '}for Your Special Moments
            </h1>

            <p className="text-lg md:text-xl text-white/70 mb-8 leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Discover stunning halls and banquet venues for weddings, corporate events, 
              and celebrations. Book instantly with real-time availability.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Button variant="gold" size="xl" asChild>
                <Link to="/halls" className="gap-2">
                  Explore Venues
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button variant="heroLight" size="xl" asChild>
                <Link to="/auth">Sign In</Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              {stats.map((stat) => (
                <div key={stat.label}>
                  <div className="text-3xl md:text-4xl font-display font-bold text-gold">
                    {stat.value}
                  </div>
                  <div className="text-sm text-white/60">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-white/50 rounded-full" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Why Choose HallBook?
            </h2>
            <p className="text-muted-foreground">
              We make venue booking simple, secure, and seamless for all your events.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="group p-6 rounded-2xl bg-card border border-border hover:border-gold/50 hover:shadow-elevated transition-all duration-500"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-14 h-14 rounded-xl bg-gold/10 flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors">
                  <feature.icon className="w-7 h-7 text-gold" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Halls */}
      <section className="py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                Featured Venues
              </h2>
              <p className="text-muted-foreground max-w-xl">
                Handpicked premium venues for your most memorable occasions.
              </p>
            </div>
            <Button variant="outline" asChild className="mt-4 md:mt-0">
              <Link to="/halls" className="gap-2">
                View All Venues
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading ? (
              [1, 2, 3].map((i) => (
                <div key={i} className="h-96 bg-muted rounded-xl animate-pulse" />
              ))
            ) : featuredHalls.length > 0 ? (
              featuredHalls.map((hall) => (
                <HallCard key={hall.id} hall={hall} />
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-gold mx-auto mb-4" />
                <p className="text-muted-foreground">No venues available yet</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: `url(${heroImage})` }} />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">
              Ready to Book Your Perfect Venue?
            </h2>
            <p className="text-white/70 text-lg mb-8">
              Join thousands of satisfied customers who have found their dream venues through HallBook.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="gold" size="lg" asChild>
                <Link to="/auth?mode=register">Create Free Account</Link>
              </Button>
              <Button variant="heroLight" size="lg" asChild>
                <Link to="/halls">Browse Venues</Link>
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-white/60 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-gold" />
                No booking fees
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-gold" />
                Instant confirmation
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-gold" />
                Secure payments
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
