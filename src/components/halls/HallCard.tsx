import { Link } from 'react-router-dom';
import { Hall } from '@/lib/api';
import { MapPin, Users, IndianRupee } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HallCardProps {
  hall: Hall;
}

export function HallCard({ hall }: HallCardProps) {
  const imageUrl = hall.images?.[0]?.image_url || '/placeholder.svg';

  return (
    <div className="group bg-card rounded-xl overflow-hidden shadow-soft hover:shadow-elevated transition-all duration-500 border border-border">
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={imageUrl}
          alt={hall.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/80 via-transparent to-transparent" />
        
        {/* Price Badge */}
        <div className="absolute top-4 right-4 bg-gold text-navy-dark px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
          <IndianRupee className="w-3 h-3" />
          {hall.price_per_hour.toLocaleString()}/hr
        </div>

        {/* Location */}
        <div className="absolute bottom-4 left-4 flex items-center gap-1 text-card text-sm">
          <MapPin className="w-4 h-4" />
          {hall.location}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        <div>
          <h3 className="font-display text-xl font-semibold text-foreground group-hover:text-gold transition-colors">
            {hall.name}
          </h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {hall.description}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Users className="w-4 h-4" />
            <span className="text-sm">Up to {hall.capacity} guests</span>
          </div>
        </div>

        <Button variant="gold" className="w-full" asChild>
          <Link to={`/halls/${hall.id}`}>View Details</Link>
        </Button>
      </div>
    </div>
  );
}
