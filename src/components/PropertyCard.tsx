import Link from 'next/link';
import { Property, formatPrice, getPropertyTypeLabel } from '@/lib/api';

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Link href={`/propiedades/${property.id}`}>
      <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow bg-white">
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {property.title}
          </h3>
          <p className="text-sm text-gray-500">
            {property.comuna?.name || 'Sin ubicación'}
            {property.barrio && `, ${property.barrio}`}
          </p>
        </div>

        <div className="mb-3">
          <p className="text-2xl font-bold text-blue-600">
            {formatPrice(property.price, property.currency)}
          </p>
          <p className="text-xs text-gray-500">
            {getPropertyTypeLabel(property.property_type)}
          </p>
        </div>

        {property.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {property.description}
          </p>
        )}

        <div className="flex gap-4 text-sm text-gray-700">
          {property.dormitorios !== undefined && property.dormitorios > 0 && (
            <div className="flex items-center gap-1">
              <span>🛏️</span>
              <span>{property.dormitorios}</span>
            </div>
          )}
          {property.banos !== undefined && property.banos > 0 && (
            <div className="flex items-center gap-1">
              <span>🚿</span>
              <span>{property.banos}</span>
            </div>
          )}
          {property.m2_construidos && (
            <div className="flex items-center gap-1">
              <span>📐</span>
              <span>{property.m2_construidos}m²</span>
            </div>
          )}
          {property.estacionamientos !== undefined && property.estacionamientos > 0 && (
            <div className="flex items-center gap-1">
              <span>🚗</span>
              <span>{property.estacionamientos}</span>
            </div>
          )}
        </div>

        {property.status && property.status !== 'activo' && (
          <div className="mt-3">
            <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-gray-200 text-gray-700">
              {property.status.toUpperCase()}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
