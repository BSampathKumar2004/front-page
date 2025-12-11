import { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HallCard } from '@/components/halls/HallCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, SlidersHorizontal, MapPin, Users, X } from 'lucide-react';
import { Hall, hallsApi } from '@/lib/api';
import heroImage from '@/assets/hero-hall.jpg';

export default function Halls() {
  const [halls, setHalls] = useState<Hall[]>([]);
  const [filteredHalls, setFilteredHalls] = useState<Hall[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [locationFilter, setLocationFilter] = useState('');
  const [capacityFilter, setCapacityFilter] = useState('');

  useEffect(() => {
    loadHalls();
  }, []);

  useEffect(() => {
    filterHalls();
  }, [halls, searchQuery, locationFilter, capacityFilter]);

  const loadHalls = async () => {
    try {
      const data = await hallsApi.getAll();
      setHalls(data);
      setError(null);
    } catch (err) {
      setError('Failed to load venues. Please check your connection.');
      console.error('Failed to load halls:', err);
    } finally {
      setIsLoading(false);
    }
  };

const filterHalls = () => {
    let filtered = [...halls];

    if (searchQuery) {
      filtered = filtered.filter(
        (hall) =>
          hall.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          hall.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          hall.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (locationFilter) {
      filtered = filtered.filter((hall) =>
        hall.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    if (capacityFilter) {
      const capacity = parseInt(capacityFilter);
      filtered = filtered.filter((hall) => hall.capacity >= capacity);
    }

    setFilteredHalls(filtered);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setLocationFilter('');
    setCapacityFilter('');
  };

  const locations = [...new Set(halls.map((h) => h.location))];

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 flex flex-col items-center justify-center min-h-[60vh]">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={loadHalls}>Try Again</Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <section className="pt-24 pb-12 bg-muted/50">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            Browse Venues
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Discover our curated collection of premium halls and banquet venues for your special occasions.
          </p>

          {/* Search & Filters */}
          <div className="mt-8 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search by name, location, or description..."
                  className="pl-12 h-12"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button
                variant="outline"
                className="h-12 gap-2"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {(locationFilter || capacityFilter) && (
                  <span className="ml-1 px-2 py-0.5 bg-gold text-navy-dark text-xs rounded-full">
                    Active
                  </span>
                )}
              </Button>
            </div>

            {/* Filter Panel */}
            {showFilters && (
              <div className="p-6 bg-card rounded-xl border border-border animate-scale-in">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Filters</h3>
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <X className="w-4 h-4 mr-1" />
                    Clear all
                  </Button>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gold" />
                      Location
                    </label>
                    <select
                      className="w-full h-10 px-3 rounded-lg border border-input bg-background"
                      value={locationFilter}
                      onChange={(e) => setLocationFilter(e.target.value)}
                    >
                      <option value="">All Locations</option>
                      {locations.map((loc) => (
                        <option key={loc} value={loc}>
                          {loc}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Users className="w-4 h-4 text-gold" />
                      Minimum Capacity
                    </label>
                    <select
                      className="w-full h-10 px-3 rounded-lg border border-input bg-background"
                      value={capacityFilter}
                      onChange={(e) => setCapacityFilter(e.target.value)}
                    >
                      <option value="">Any Capacity</option>
                      <option value="50">50+ guests</option>
                      <option value="100">100+ guests</option>
                      <option value="200">200+ guests</option>
                      <option value="300">300+ guests</option>
                      <option value="500">500+ guests</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Halls Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-96 bg-muted rounded-xl animate-pulse"
                />
              ))}
            </div>
          ) : filteredHalls.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No venues found
              </h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search or filters
              </p>
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-6">
                Showing {filteredHalls.length} venue{filteredHalls.length !== 1 ? 's' : ''}
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredHalls.map((hall) => (
                  <HallCard key={hall.id} hall={hall} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
