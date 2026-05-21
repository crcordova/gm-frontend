'use client';

import Link from 'next/link';
import { Property, formatPrice, getPropertyTypeLabel } from '@/lib/api';
import { useAnalytics } from '@/lib/analytics';
import { Bed, Bath, Square, Car, MapPin } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const { track } = useAnalytics();

  const handleClick = () => {
    track('property_view', {
      property_id: property.id,
      property_type: property.property_type,
      price: property.price,
      currency: property.currency,
    });
  };

  return (
    <Link
      href={`/propiedades/${property.id}`}
      onClick={handleClick}
      className="group block bg-surface rounded-2xl border border-border overflow-hidden hover:shadow-elevated transition-all duration-300 hover:-translate-y-1"
    >
      {/* Image Placeholder */}
      <div className="relative h-52 bg-surface-muted overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center bg-primary/5">
          <MapPin className="w-10 h-10 text-primary/30" />
        </div>
        {/* Type Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-lg bg-surface/90 backdrop-blur-sm text-xs font-semibold text-text-primary border border-border">
            {getPropertyTypeLabel(property.property_type)}
          </span>
        </div>
        {/* Price Badge */}
        <div className="absolute bottom-3 right-3">
          <span className="px-3 py-1.5 rounded-lg bg-accent text-white text-sm font-bold shadow-lg">
            {formatPrice(property.price, property.currency)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-display text-lg font-semibold text-text-primary mb-1.5 line-clamp-2 group-hover:text-primary transition-colors">
          {property.title}
        </h3>

        <p className="text-sm text-text-secondary mb-4 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-text-muted shrink-0" />
          <span className="truncate">
            {property.comuna?.name || 'Sin ubicación'}
            {property.barrio && `, ${property.barrio}`}
          </span>
        </p>

        {property.description && (
          <p className="text-sm text-text-secondary mb-4 line-clamp-2 leading-relaxed">
            {property.description}
          </p>
        )}

        {/* Features */}
        <div className="flex flex-wrap gap-3 pt-4 border-t border-border-subtle">
          {property.dormitorios !== undefined && property.dormitorios > 0 && (
            <div className="flex items-center gap-1.5 text-sm text-text-secondary">
              <Bed className="w-4 h-4 text-primary" />
              <span>{property.dormitorios}</span>
            </div>
          )}
          {property.banos !== undefined && property.banos > 0 && (
            <div className="flex items-center gap-1.5 text-sm text-text-secondary">
              <Bath className="w-4 h-4 text-primary" />
              <span>{property.banos}</span>
            </div>
          )}
          {property.m2_construidos && (
            <div className="flex items-center gap-1.5 text-sm text-text-secondary">
              <Square className="w-4 h-4 text-primary" />
              <span>{property.m2_construidos}m²</span>
            </div>
          )}
          {property.estacionamientos !== undefined && property.estacionamientos > 0 && (
            <div className="flex items-center gap-1.5 text-sm text-text-secondary">
              <Car className="w-4 h-4 text-primary" />
              <span>{property.estacionamientos}</span>
            </div>
          )}
        </div>

        {/* Status */}
        {property.status && property.status !== 'activo' && (
          <div className="mt-3">
            <span className="inline-block px-2.5 py-1 text-xs font-semibold rounded-lg bg-surface-muted text-text-secondary border border-border">
              {property.status.toUpperCase()}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
