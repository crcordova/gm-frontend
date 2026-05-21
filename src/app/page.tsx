import Link from 'next/link';
import { getProperties, type Property } from '@/lib/api';
import { PropertyCard } from '@/components/PropertyCard';
import { HeroSection } from '@/components/HeroSection';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Search, ArrowRight } from 'lucide-react';

export default async function Home() {
  let properties: Property[] = [];
  let error: string | null = null;

  try {
    const result = await getProperties({ limit: 6 });
    properties = Array.isArray(result) ? result : [];
  } catch (e) {
    error = e instanceof Error ? e.message : 'Error al cargar propiedades';
    console.error('Error fetching properties:', e);
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <HeroSection />

      {/* Featured Properties */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-text-primary mb-2">
              Propiedades Destacadas
            </h2>
            <p className="text-text-secondary">
              Explora las últimas propiedades disponibles en todo Chile
            </p>
          </div>
          <Link
            href="/buscar"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-hover transition-colors"
          >
            Ver todas
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {error ? (
          <div className="bg-error-bg border border-error/20 rounded-2xl p-8 text-center">
            <p className="text-error font-medium mb-2">Error al cargar propiedades</p>
            <p className="text-text-secondary text-sm mb-6">{error}</p>
            <div className="text-text-secondary text-sm space-y-2 max-w-lg mx-auto">
              <p className="font-medium text-text-primary">Verifica que:</p>
              <ul className="list-disc list-inside text-left">
                <li>El backend esté ejecutándose en http://localhost:8000</li>
                <li>La base de datos esté conectada</li>
                <li>No haya errores de CORS</li>
              </ul>
              <p className="mt-4">
                Prueba abrir:{' '}
                <a
                  href="http://localhost:8000/docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  http://localhost:8000/docs
                </a>
              </p>
            </div>
          </div>
        ) : properties.length === 0 ? (
          <div className="bg-warning-bg border border-warning/20 rounded-2xl p-8 text-center">
            <p className="text-warning font-medium mb-2">No hay propiedades disponibles</p>
            <p className="text-text-secondary text-sm mb-6">
              Sé el primero en publicar una propiedad en nuestra plataforma
            </p>
            <Link
              href="/publicar"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors font-medium"
            >
              <Search className="w-4 h-4" />
              Publicar Propiedad
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link
                href="/buscar"
                className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-primary text-primary rounded-xl font-semibold hover:bg-primary hover:text-white transition-all duration-200"
              >
                <Search className="w-5 h-5" />
                Ver Todas las Propiedades
              </Link>
            </div>
          </>
        )}
      </main>

      {/* Why Us Section */}
      <section className="bg-surface border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-text-primary mb-3">
              ¿Por qué elegir GM Propiedades?
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              La plataforma más completa para comprar, vender y arrendar propiedades en Chile
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                title: 'Búsqueda Inteligente',
                description: 'Filtra por ubicación, precio, características y encuentra exactamente lo que buscas.',
              },
              {
                title: 'Publicación Gratuita',
                description: 'Publica tus propiedades sin costo y llega a miles de potenciales compradores.',
              },
              {
                title: 'Seguridad Garantizada',
                description: 'Todas las propiedades son verificadas para tu tranquilidad.',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="p-6 sm:p-8 rounded-2xl bg-background border border-border-subtle hover:shadow-soft transition-shadow duration-300"
              >
                <h3 className="font-display text-lg font-semibold text-text-primary mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
