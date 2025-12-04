import { Link } from 'react-router-dom';
import { Building2, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-navy-dark text-card/80">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gold/20">
                <Building2 className="w-6 h-6 text-gold" />
              </div>
              <span className="text-xl font-display font-semibold text-card">
                HallBook
              </span>
            </Link>
            <p className="text-sm leading-relaxed">
              Discover and book the perfect venue for your special occasions. 
              From intimate gatherings to grand celebrations.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-card mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/halls" className="text-sm hover:text-gold transition-colors">
                  Browse Halls
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm hover:text-gold transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm hover:text-gold transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/auth" className="text-sm hover:text-gold transition-colors">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* For Admins */}
          <div>
            <h4 className="font-display font-semibold text-card mb-4">For Admins</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/auth?mode=admin" className="text-sm hover:text-gold transition-colors">
                  Admin Login
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-sm hover:text-gold transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-card mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-gold" />
                hello@hallbook.com
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-gold" />
                +91 98765 43210
              </li>
              <li className="flex items-start gap-2 text-sm">
                <MapPin className="w-4 h-4 text-gold mt-0.5" />
                <span>123 Event Street, Mumbai, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-card/10 text-center text-sm">
          <p>© {new Date().getFullYear()} HallBook. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
