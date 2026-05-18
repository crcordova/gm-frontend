import Link from 'next/link';
import { getProperties, type Property } from '@/lib/api';
import { PropertyCard } from '@/components/PropertyCard';

export default async function Home() {
  let properties: Property[] = [];
  let error: string | null = null;

  try {
    const result = await getProperties({ limit: 12 });
    properties = Array.isArray(result) ? result : [];
  } catch (e) {
    error = e instanceof Error ? e.message : 'Error al cargar propiedades';
    console.error('Error fetching properties:', e);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/">
              <h1 className="text-2xl font-bold text-blue-600">GM Propiedades</h1>
            </Link>
            <nav className="flex gap-4">
              <Link
                href="/buscar"
                className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Buscar
              </Link>
              <Link
                href="/publicar"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
              >
                Publicar Propiedad
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Encuentra tu Propiedad Ideal en Chile
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Miles de propiedades disponibles en todo el país
          </p>
          <Link
            href="/buscar"
            className="inline-block px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Comenzar Búsqueda
          </Link>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Propiedades Destacadas
          </h3>
          <p className="text-gray-600">
            Explora las últimas propiedades disponibles
          </p>
        </div>

        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-800 font-medium mb-2">Error al cargar propiedades</p>
            <p className="text-red-600 text-sm mb-4">{error}</p>
            <div className="text-gray-600 text-sm space-y-2">
              <p className="font-medium">Verifica que:</p>
              <ul className="list-disc list-inside text-left max-w-md mx-auto">
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
                  className="text-blue-600 hover:underline"
                >
                  http://localhost:8000/docs
                </a>
              </p>
            </div>
          </div>
        ) : properties.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <p className="text-yellow-800 font-medium mb-2">No hay propiedades disponibles</p>
            <p className="text-yellow-700 text-sm mb-4">
              Sé el primero en publicar una propiedad
            </p>
            <Link
              href="/publicar"
              className="inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              Publicar Propiedad
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}

        {properties.length > 0 && (
          <div className="mt-8 text-center">
            <Link
              href="/buscar"
              className="inline-block px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Ver Todas las Propiedades
            </Link>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            © 2025 GM Propiedades - Marketplace Inmobiliario de Chile
          </p>
        </div>
      </footer>
    </div>
  );
}
