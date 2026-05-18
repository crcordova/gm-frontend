'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getProperties, createQuote, type Property, type PropertyFilters } from '@/lib/api';
import { PropertyCard } from '@/components/PropertyCard';
import { PROPERTY_TYPES, DEFAULT_OWNER_ID } from '@/lib/constants';

export default function SearchPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quoteCreated, setQuoteCreated] = useState(false);

  // Search filters
  const [propertyType, setPropertyType] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minDormitorios, setMinDormitorios] = useState('');
  const [minBanos, setMinBanos] = useState('');

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async (filters?: PropertyFilters) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProperties({ ...filters, limit: 50 });
      setProperties(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar propiedades');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setQuoteCreated(false);

    const filters: PropertyFilters = {
      property_type: propertyType || undefined,
      min_price: minPrice ? parseInt(minPrice) : undefined,
      max_price: maxPrice ? parseInt(maxPrice) : undefined,
      min_dormitorios: minDormitorios ? parseInt(minDormitorios) : undefined,
    };

    // Create a quote for this search
    try {
      await createQuote({
        created_by: DEFAULT_OWNER_ID,
        desired_property_type: propertyType || undefined,
        min_price: filters.min_price,
        max_price: filters.max_price,
        min_dormitorios: filters.min_dormitorios,
        min_banos: minBanos ? parseInt(minBanos) : undefined,
        currency: 'CLP',
      });
      setQuoteCreated(true);
    } catch (e) {
      console.error('Error creating quote:', e);
      // Continue with search even if quote creation fails
    }

    await loadProperties(filters);
  };

  const handleReset = () => {
    setPropertyType('');
    setMinPrice('');
    setMaxPrice('');
    setMinDormitorios('');
    setMinBanos('');
    setQuoteCreated(false);
    loadProperties();
  };

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
                className="px-4 py-2 text-blue-600 font-medium"
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
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          Buscar Propiedades
        </h2>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div>
              <label htmlFor="property_type" className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Propiedad
              </label>
              <select
                id="property_type"
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos</option>
                {PROPERTY_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="min_price" className="block text-sm font-medium text-gray-700 mb-1">
                Precio Mínimo (CLP)
              </label>
              <input
                type="number"
                id="min_price"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="Ej: 50000000"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="max_price" className="block text-sm font-medium text-gray-700 mb-1">
                Precio Máximo (CLP)
              </label>
              <input
                type="number"
                id="max_price"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Ej: 200000000"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="min_dormitorios" className="block text-sm font-medium text-gray-700 mb-1">
                Dormitorios Mínimos
              </label>
              <input
                type="number"
                id="min_dormitorios"
                value={minDormitorios}
                onChange={(e) => setMinDormitorios(e.target.value)}
                placeholder="Ej: 2"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="min_banos" className="block text-sm font-medium text-gray-700 mb-1">
                Baños Mínimos
              </label>
              <input
                type="number"
                id="min_banos"
                value={minBanos}
                onChange={(e) => setMinBanos(e.target.value)}
                placeholder="Ej: 1"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-400"
            >
              {loading ? 'Buscando...' : 'Buscar'}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors font-medium"
            >
              Limpiar
            </button>
          </div>

          {quoteCreated && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-800">
                ✓ Búsqueda guardada exitosamente
              </p>
            </div>
          )}
        </form>

        {/* Results */}
        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-800 font-medium mb-2">Error al cargar propiedades</p>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        ) : loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Cargando propiedades...</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <p className="text-yellow-800 font-medium mb-2">
              No se encontraron propiedades
            </p>
            <p className="text-yellow-700 text-sm">
              Intenta ajustar los filtros de búsqueda
            </p>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <p className="text-gray-600">
                Se encontraron <span className="font-semibold">{properties.length}</span> propiedades
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
