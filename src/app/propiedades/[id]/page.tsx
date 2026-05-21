import Link from 'next/link';
import { getProperty, formatPrice, getPropertyTypeLabel } from '@/lib/api';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import {
  Bed,
  Bath,
  Square,
  Car,
  MapPin,
  Home,
  ArrowLeft,
  Phone,
  Mail,
  Heart,
  Share2,
  Calendar,
  Tag,
} from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const { id } = await params;
  let property = null;
  let error = null;

  try {
    property = await getProperty(id);
  } catch (e) {
    error = e instanceof Error ? e.message : 'Error al cargar la propiedad';
  }

  if (error || !property) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />

        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-error-bg border border-error/20 rounded-2xl p-8 text-center max-w-xl mx-auto">
            <p className="text-error font-medium mb-2 text-lg">Propiedad no encontrada</p>
            <p className="text-text-secondary text-sm mb-6">{error}</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al Inicio
            </Link>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 w-full">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-text-secondary mb-6">
          <Link href="/" className="hover:text-primary transition-colors">
            Inicio
          </Link>
          <span className="text-text-muted">/</span>
          <Link href="/buscar" className="hover:text-primary transition-colors">
            Buscar
          </Link>
          <span className="text-text-muted">/</span>
          <span className="text-text-primary truncate max-w-[200px] sm:max-w-md">
            {property.title}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Placeholder */}
            <div className="relative h-64 sm:h-96 bg-surface-muted rounded-2xl border border-border overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center bg-primary/5">
                <Home className="w-16 h-16 text-primary/20" />
              </div>
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1.5 rounded-lg bg-surface/90 backdrop-blur-sm text-xs font-semibold text-text-primary border border-border shadow-sm">
                  <Tag className="w-3 h-3 inline mr-1" />
                  {getPropertyTypeLabel(property.property_type)}
                </span>
              </div>
              {property.status && property.status !== 'activo' && (
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1.5 rounded-lg bg-surface/90 backdrop-blur-sm text-xs font-semibold text-text-secondary border border-border shadow-sm">
                    {property.status.toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {/* Title & Price */}
            <div className="bg-surface rounded-2xl border border-border p-6 sm:p-8 shadow-soft">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <h1 className="font-display text-2xl sm:text-3xl font-bold text-text-primary mb-2">
                    {property.title}
                  </h1>
                  <p className="text-text-secondary flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-primary shrink-0" />
                    {property.comuna?.name}
                    {property.comuna?.province && `, ${property.comuna.province.name}`}
                    {property.comuna?.province?.region && ` - ${property.comuna.province.region.name}`}
                  </p>
                  {property.barrio && (
                    <p className="text-sm text-text-muted mt-1">
                      Barrio: {property.barrio}
                    </p>
                  )}
                  {property.direccion && (
                    <p className="text-sm text-text-muted mt-0.5">
                      {property.direccion}
                    </p>
                  )}
                </div>
                <div className="shrink-0 text-left sm:text-right">
                  <p className="font-display text-3xl font-bold text-accent">
                    {formatPrice(property.price, property.currency)}
                  </p>
                  <p className="text-sm text-text-muted mt-1">
                    Publicado el {property.created_at ? new Date(property.created_at).toLocaleDateString('es-CL') : 'N/A'}
                  </p>
                </div>
              </div>

              {/* Quick Features */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-border-subtle">
                {[
                  { icon: Square, value: property.m2_construidos, label: 'M² Construidos' },
                  { icon: Square, value: property.m2_totales, label: 'M² Totales' },
                  { icon: Bed, value: property.dormitorios, label: 'Dormitorios' },
                  { icon: Bath, value: property.banos, label: 'Baños' },
                  { icon: Car, value: property.estacionamientos, label: 'Estacionamientos' },
                ].filter((f) => f.value !== undefined && f.value !== null).map((feature) => (
                  <div
                    key={feature.label}
                    className="flex flex-col items-center p-3 bg-surface-muted rounded-xl"
                  >
                    <feature.icon className="w-5 h-5 text-primary mb-1" />
                    <span className="font-display text-lg font-bold text-text-primary">{feature.value}</span>
                    <span className="text-xs text-text-muted text-center">{feature.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            {property.description && (
              <div className="bg-surface rounded-2xl border border-border p-6 sm:p-8 shadow-soft">
                <h2 className="font-display text-xl font-semibold text-text-primary mb-4">
                  Descripción
                </h2>
                <p className="text-text-secondary leading-relaxed whitespace-pre-line">
                  {property.description}
                </p>
              </div>
            )}

            {/* Features */}
            {property.features && Object.keys(property.features).length > 0 && (
              <div className="bg-surface rounded-2xl border border-border p-6 sm:p-8 shadow-soft">
                <h2 className="font-display text-xl font-semibold text-text-primary mb-4">
                  Características Adicionales
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.entries(property.features).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-2 text-text-secondary p-3 bg-surface-muted rounded-lg">
                      <span className="font-medium capitalize text-text-primary">
                        {key.replace(/_/g, ' ')}:
                      </span>
                      <span>{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Amenities */}
            {((property.amenities && property.amenities.length > 0) ||
              (property.amenity_keys && property.amenity_keys.length > 0)) && (
              <div className="bg-surface rounded-2xl border border-border p-6 sm:p-8 shadow-soft">
                <h2 className="font-display text-xl font-semibold text-text-primary mb-4">
                  Amenidades
                </h2>
                <div className="flex flex-wrap gap-2">
                  {property.amenities && property.amenities.length > 0 ? (
                    property.amenities.map((amenity) => (
                      <span
                        key={amenity.id}
                        className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-sm font-medium border border-primary/20"
                      >
                        {amenity.label}
                      </span>
                    ))
                  ) : property.amenity_keys ? (
                    property.amenity_keys.map((amenity) => (
                      <span
                        key={amenity}
                        className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-sm font-medium border border-primary/20"
                      >
                        {amenity.replace(/_/g, ' ')}
                      </span>
                    ))
                  ) : null}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Contact Card */}
              <div className="bg-surface rounded-2xl border border-border p-6 shadow-soft">
                <h3 className="font-display text-lg font-semibold text-text-primary mb-4">
                  ¿Interesado en esta propiedad?
                </h3>
                <p className="text-sm text-text-secondary mb-6">
                  Contáctanos para más información o para agendar una visita presencial.
                </p>
                <div className="space-y-3">
                  <button
                    type="button"
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-hover transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    Contactar
                  </button>
                  <button
                    type="button"
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-primary text-primary rounded-xl font-semibold hover:bg-primary/5 transition-colors"
                  >
                    <Calendar className="w-4 h-4" />
                    Agendar Visita
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="bg-surface rounded-2xl border border-border p-6 shadow-soft">
                <div className="flex flex-col gap-3">
                  <button
                    type="button"
                    className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-surface-muted rounded-xl transition-colors"
                  >
                    <Heart className="w-4 h-4" />
                    Guardar Favorito
                  </button>
                  <button
                    type="button"
                    className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-surface-muted rounded-xl transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                    Compartir
                  </button>
                </div>
              </div>

              {/* Agent Info */}
              <div className="bg-primary rounded-2xl p-6 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold">Agente GM Propiedades</p>
                    <p className="text-sm text-white/80">Contacto directo</p>
                  </div>
                </div>
                <p className="text-sm text-white/80 leading-relaxed">
                  Nuestros agentes están disponibles para ayudarte en todo el proceso de compra, venta o arriendo.
                </p>
              </div>
            </div>
          </aside>
        </div>

        {/* Back Button */}
        <div className="mt-8">
          <Link
            href="/buscar"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-hover transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a la búsqueda
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
