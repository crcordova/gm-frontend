'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getProperties, createQuote, type Property, type PropertyFilters } from '@/lib/api';
import { PropertyCard } from '@/components/PropertyCard';
import { PROPERTY_TYPES, DEFAULT_OWNER_ID } from '@/lib/constants';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useAnalytics } from '@/lib/analytics';
import { Search, SlidersHorizontal, X, Filter, List, LayoutGrid } from 'lucide-react';

export default function SearchPage() {
  const { track } = useAnalytics();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quoteCreated, setQuoteCreated] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Search filters
  const [propertyType, setPropertyType] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minDormitorios, setMinDormitorios] = useState('');
  const [minBanos, setMinBanos] = useState('');

  useEffect(() => {
    loadProperties();
    track('page_view', { path: '/buscar' });
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

    track('search_performed', {
      property_type: propertyType,
      min_price: filters.min_price,
      max_price: filters.max_price,
      min_dormitorios: filters.min_dormitorios,
    });

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
      track('filter_applied', { type: 'quote_created', filters });
    } catch (e) {
      console.error('Error creating quote:', e);
    }

    await loadProperties(filters);
    setMobileFiltersOpen(false);
  };

  const handleReset = () => {
    setPropertyType('');
    setMinPrice('');
    setMaxPrice('');
    setMinDormitorios('');
    setMinBanos('');
    setQuoteCreated(false);
    loadProperties();
    track('search_performed', { action: 'reset' });
  };

  const activeFiltersCount = [
    propertyType, minPrice, maxPrice, minDormitorios, minBanos,
  ].filter(Boolean).length;

  const FiltersContent = () => (
    <form onSubmit={handleSearch} className="space-y-5">
      <div>
        <label htmlFor="property_type" className="block text-sm font-medium text-text-primary mb-1.5">
          Tipo de Propiedad
        </label>
        <select
          id="property_type"
          value={propertyType}
          onChange={(e) => setPropertyType(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
        >
          <option value="">Todos</option>
          {PROPERTY_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="min_price" className="block text-sm font-medium text-text-primary mb-1.5">
            Precio Mín.
          </label>
          <input
            type="number"
            id="min_price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="$"
            className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-surface text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
          />
        </div>
        <div>
          <label htmlFor="max_price" className="block text-sm font-medium text-text-primary mb-1.5">
            Precio Máx.
          </label>
          <input
            type="number"
            id="max_price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="$"
            className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-surface text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="min_dormitorios" className="block text-sm font-medium text-text-primary mb-1.5">
            Dormitorios
          </label>
          <input
            type="number"
            id="min_dormitorios"
            value={minDormitorios}
            onChange={(e) => setMinDormitorios(e.target.value)}
            placeholder="Min."
            min="0"
            className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-surface text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
          />
        </div>
        <div>
          <label htmlFor="min_banos" className="block text-sm font-medium text-text-primary mb-1.5">
            Baños
          </label>
          <input
            type="number"
            id="min_banos"
            value={minBanos}
            onChange={(e) => setMinBanos(e.target.value)}
            placeholder="Min."
            min="0"
            className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-surface text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
          />
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover transition-colors disabled:opacity-60"
        >
          <Search className="w-4 h-4" />
          {loading ? 'Buscando...' : 'Buscar'}
        </button>
        {activeFiltersCount > 0 && (
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2.5 bg-surface-muted text-text-secondary rounded-lg hover:bg-border transition-colors"
            aria-label="Limpiar filtros"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {quoteCreated && (
        <div className="p-3 bg-success-bg border border-success/20 rounded-lg">
          <p className="text-sm text-success font-medium">
            Búsqueda guardada exitosamente
          </p>
        </div>
      )}
    </form>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-24 bg-surface rounded-2xl border border-border p-6 shadow-soft">
              <div className="flex items-center gap-2 mb-5">
                <SlidersHorizontal className="w-5 h-5 text-primary" />
                <h2 className="font-display text-lg font-semibold text-text-primary">
                  Filtros
                </h2>
                {activeFiltersCount > 0 && (
                  <span className="ml-auto px-2 py-0.5 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                    {activeFiltersCount}
                  </span>
                )}
              </div>
              <FiltersContent />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-text-primary">
                  Buscar Propiedades
                </h1>
                <p className="text-sm text-text-secondary mt-1">
                  {loading
                    ? 'Cargando...'
                    : `${properties.length} propiedades encontradas`}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {/* Mobile Filter Button */}
                <button
                  onClick={() => setMobileFiltersOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-surface border border-border rounded-lg text-sm font-medium text-text-primary hover:bg-surface-muted transition-colors"
                >
                  <Filter className="w-4 h-4" />
                  Filtros
                  {activeFiltersCount > 0 && (
                    <span className="px-1.5 py-0.5 bg-primary text-white text-xs rounded-full">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>

                {/* View Toggle */}
                <div className="flex items-center bg-surface border border-border rounded-lg p-0.5">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-surface-muted text-primary'
                        : 'text-text-muted hover:text-text-secondary'
                    }`}
                    aria-label="Vista grid"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'list'
                        ? 'bg-surface-muted text-primary'
                        : 'text-text-muted hover:text-text-secondary'
                    }`}
                    aria-label="Vista lista"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Results */}
            {error ? (
              <div className="bg-error-bg border border-error/20 rounded-2xl p-8 text-center">
                <p className="text-error font-medium mb-2">Error al cargar propiedades</p>
                <p className="text-text-secondary text-sm">{error}</p>
              </div>
            ) : loading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mb-4" />
                <p className="text-text-secondary">Cargando propiedades...</p>
              </div>
            ) : properties.length === 0 ? (
              <div className="bg-warning-bg border border-warning/20 rounded-2xl p-8 text-center">
                <p className="text-warning font-medium mb-2">
                  No se encontraron propiedades
                </p>
                <p className="text-text-secondary text-sm mb-6">
                  Intenta ajustar los filtros de búsqueda
                </p>
                <button
                  onClick={handleReset}
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors font-medium"
                >
                  Limpiar Filtros
                </button>
              </div>
            ) : (
              <div
                className={`grid gap-6 ${
                  viewMode === 'grid'
                    ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'
                    : 'grid-cols-1'
                }`}
              >
                {properties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Mobile Filters Drawer */}
      {mobileFiltersOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-surface z-50 shadow-2xl lg:hidden overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-lg font-semibold text-text-primary">
                  Filtros
                </h2>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-2 rounded-lg hover:bg-surface-muted transition-colors"
                >
                  <X className="w-5 h-5 text-text-secondary" />
                </button>
              </div>
              <FiltersContent />
            </div>
          </div>
        </>
      )}

      <Footer />
    </div>
  );
}
