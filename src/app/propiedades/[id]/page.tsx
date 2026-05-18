import Link from 'next/link';
import { getProperty, formatPrice, getPropertyTypeLabel } from '@/lib/api';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const { id } = await params;
  let property = null;
  let error = null;

  try {
    // ID is already a string (UUID), no need to parse
    property = await getProperty(id);
  } catch (e) {
    error = e instanceof Error ? e.message : 'Error al cargar la propiedad';
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link href="/">
              <h1 className="text-2xl font-bold text-blue-600">GM Propiedades</h1>
            </Link>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-800 font-medium mb-2">Propiedad no encontrada</p>
            <p className="text-red-600 text-sm mb-4">{error}</p>
            <Link
              href="/"
              className="inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              Volver al Inicio
            </Link>
          </div>
        </main>
      </div>
    );
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link href="/" className="text-blue-600 hover:underline">
            Inicio
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link href="/buscar" className="text-blue-600 hover:underline">
            Buscar
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-600">{property.title}</span>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header Section */}
          <div className="p-6 border-b">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {property.title}
                </h1>
                <p className="text-lg text-gray-600">
                  {property.comuna?.name}
                  {property.comuna?.province && `, ${property.comuna.province.name}`}
                  {property.comuna?.province?.region && ` - ${property.comuna.province.region.name}`}
                </p>
                {property.barrio && (
                  <p className="text-gray-500">Barrio: {property.barrio}</p>
                )}
                {property.direccion && (
                  <p className="text-gray-500">{property.direccion}</p>
                )}
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-blue-600">
                  {formatPrice(property.price, property.currency)}
                </p>
                <p className="text-sm text-gray-500">
                  {getPropertyTypeLabel(property.property_type)}
                </p>
              </div>
            </div>

            {property.status && property.status !== 'activo' && (
              <div className="inline-block px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm font-semibold">
                {property.status.toUpperCase()}
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="p-6">
            {/* Key Features */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              {property.m2_construidos && (
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">
                    {property.m2_construidos}
                  </p>
                  <p className="text-sm text-gray-600">M² Construidos</p>
                </div>
              )}
              {property.m2_totales && (
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">
                    {property.m2_totales}
                  </p>
                  <p className="text-sm text-gray-600">M² Totales</p>
                </div>
              )}
              {property.dormitorios !== undefined && (
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">
                    {property.dormitorios}
                  </p>
                  <p className="text-sm text-gray-600">Dormitorios</p>
                </div>
              )}
              {property.banos !== undefined && (
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">
                    {property.banos}
                  </p>
                  <p className="text-sm text-gray-600">Baños</p>
                </div>
              )}
              {property.estacionamientos !== undefined && (
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">
                    {property.estacionamientos}
                  </p>
                  <p className="text-sm text-gray-600">Estacionamientos</p>
                </div>
              )}
            </div>

            {/* Description */}
            {property.description && (
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                  Descripción
                </h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {property.description}
                </p>
              </div>
            )}

            {/* Features */}
            {property.features && Object.keys(property.features).length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                  Características Adicionales
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.entries(property.features).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-2 text-gray-700">
                      <span className="font-medium capitalize">
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
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                  Amenidades
                </h2>
                <div className="flex flex-wrap gap-2">
                  {property.amenities && property.amenities.length > 0 ? (
                    property.amenities.map((amenity) => (
                      <span
                        key={amenity.id}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {amenity.label}
                      </span>
                    ))
                  ) : property.amenity_keys ? (
                    property.amenity_keys.map((amenity) => (
                      <span
                        key={amenity}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {amenity.replace(/_/g, ' ')}
                      </span>
                    ))
                  ) : null}
                </div>
              </div>
            )}

            {/* Contact Section */}
            <div className="mt-8 p-6 bg-blue-50 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                ¿Interesado en esta propiedad?
              </h2>
              <p className="text-gray-700 mb-4">
                Contáctanos para más información o para agendar una visita.
              </p>
              <div className="flex gap-4">
                <button className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium">
                  Contactar
                </button>
                <button className="px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors font-medium">
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-6">
          <Link
            href="/buscar"
            className="inline-block px-6 py-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Volver a la búsqueda
          </Link>
        </div>
      </main>
    </div>
  );
}
