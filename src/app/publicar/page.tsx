'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  createProperty, 
  type PropertyCreate,
  getRegions,
  getProvincesByRegion,
  getComunasByProvince,
  getAmenities,
  type Region,
  type Province,
  type Comuna,
  type Amenity,
} from '@/lib/api';
import {
  PROPERTY_TYPES,
  CURRENCIES,
  PROPERTY_STATUS,
  CONSTRUCTION_MATERIALS,
  WINDOW_MATERIALS,
  ROOF_TYPES,
  DEFAULT_OWNER_ID,
} from '@/lib/constants';

export default function PublicarPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Location state
  const [regions, setRegions] = useState<Region[]>([]);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [comunas, setComunas] = useState<Comuna[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<number | null>(null);
  const [selectedProvince, setSelectedProvince] = useState<number | null>(null);
  const [loadingLocations, setLoadingLocations] = useState(false);

  // Amenities state
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [loadingAmenities, setLoadingAmenities] = useState(false);

  const [formData, setFormData] = useState<Partial<PropertyCreate>>({
    owner_id: DEFAULT_OWNER_ID,
    property_type: 'casa',
    status: 'activo',
    currency: 'CLP',
    condominio: false,
  });

  // Load regions and amenities on mount
  useEffect(() => {
    loadRegions();
    loadAmenities();
  }, []);

  const loadRegions = async () => {
    try {
      setLoadingLocations(true);
      const data = await getRegions();
      setRegions(data);
    } catch (err) {
      console.error('Error loading regions:', err);
      setError('No se pudieron cargar las regiones. Verifica que el backend tenga el endpoint /api/v1/locations/regions/');
    } finally {
      setLoadingLocations(false);
    }
  };

  const loadAmenities = async () => {
    try {
      setLoadingAmenities(true);
      const data = await getAmenities();
      setAmenities(data);
    } catch (err) {
      console.error('Error loading amenities:', err);
      // No mostramos error aquí porque los amenities son opcionales
    } finally {
      setLoadingAmenities(false);
    }
  };

  const handleRegionChange = async (regionId: number) => {
    setSelectedRegion(regionId);
    setSelectedProvince(null);
    setProvinces([]);
    setComunas([]);
    setFormData((prev) => ({ ...prev, comuna_id: undefined }));

    if (regionId) {
      try {
        setLoadingLocations(true);
        const data = await getProvincesByRegion(regionId);
        setProvinces(data);
      } catch (err) {
        console.error('Error loading provinces:', err);
        setError('No se pudieron cargar las provincias');
      } finally {
        setLoadingLocations(false);
      }
    }
  };

  const handleProvinceChange = async (provinceId: number) => {
    setSelectedProvince(provinceId);
    setComunas([]);
    setFormData((prev) => ({ ...prev, comuna_id: undefined }));

    if (provinceId) {
      try {
        setLoadingLocations(true);
        const data = await getComunasByProvince(provinceId);
        setComunas(data);
      } catch (err) {
        console.error('Error loading comunas:', err);
        setError('No se pudieron cargar las comunas');
      } finally {
        setLoadingLocations(false);
      }
    }
  };

  const handleComunaChange = (comunaId: number) => {
    setFormData((prev) => ({ ...prev, comuna_id: comunaId }));
  };

  const handleAmenityToggle = (amenityKey: string) => {
    setSelectedAmenities((prev) => {
      if (prev.includes(amenityKey)) {
        return prev.filter((key) => key !== amenityKey);
      } else {
        return [...prev, amenityKey];
      }
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData((prev) => ({ ...prev, [name]: value ? parseFloat(value) : undefined }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Validate required fields
      if (!formData.title || !formData.property_type || !formData.price || !formData.comuna_id) {
        throw new Error('Por favor completa todos los campos obligatorios');
      }

      // Add selected amenities to form data
      const propertyData: PropertyCreate = {
        ...formData as PropertyCreate,
        amenity_keys: selectedAmenities.length > 0 ? selectedAmenities : undefined,
      };

      const property = await createProperty(propertyData);
      setSuccess(true);
      
      // Redirect to property detail after 2 seconds
      setTimeout(() => {
        router.push(`/propiedades/${property.id}`);
      }, 2000);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al crear la propiedad');
    } finally {
      setLoading(false);
    }
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
                className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Buscar
              </Link>
              <Link
                href="/publicar"
                className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium"
              >
                Publicar Propiedad
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          Publicar Nueva Propiedad
        </h2>

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 font-medium">
              ✓ Propiedad creada exitosamente. Redirigiendo...
            </p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 font-medium">Error: {error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
          {/* Basic Information */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Información Básica
            </h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Título <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title || ''}
                  onChange={handleChange}
                  required
                  placeholder="Ej: Hermosa Casa en Las Condes"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description || ''}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Describe la propiedad en detalle..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="property_type" className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Propiedad <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="property_type"
                    name="property_type"
                    value={formData.property_type}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {PROPERTY_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Estado
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {PROPERTY_STATUS.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Precio</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Precio <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price || ''}
                  onChange={handleChange}
                  required
                  min="0"
                  placeholder="Ej: 250000000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
                  Moneda
                </label>
                <select
                  id="currency"
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {CURRENCIES.map((currency) => (
                    <option key={currency.value} value={currency.value}>
                      {currency.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Characteristics */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Características
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label htmlFor="m2_construidos" className="block text-sm font-medium text-gray-700 mb-1">
                  M² Construidos
                </label>
                <input
                  type="number"
                  id="m2_construidos"
                  name="m2_construidos"
                  value={formData.m2_construidos || ''}
                  onChange={handleChange}
                  min="0"
                  placeholder="Ej: 150"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="m2_totales" className="block text-sm font-medium text-gray-700 mb-1">
                  M² Totales
                </label>
                <input
                  type="number"
                  id="m2_totales"
                  name="m2_totales"
                  value={formData.m2_totales || ''}
                  onChange={handleChange}
                  min="0"
                  placeholder="Ej: 200"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="dormitorios" className="block text-sm font-medium text-gray-700 mb-1">
                  Dormitorios
                </label>
                <input
                  type="number"
                  id="dormitorios"
                  name="dormitorios"
                  value={formData.dormitorios || ''}
                  onChange={handleChange}
                  min="0"
                  placeholder="Ej: 3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="banos" className="block text-sm font-medium text-gray-700 mb-1">
                  Baños
                </label>
                <input
                  type="number"
                  id="banos"
                  name="banos"
                  value={formData.banos || ''}
                  onChange={handleChange}
                  min="0"
                  placeholder="Ej: 2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="estacionamientos" className="block text-sm font-medium text-gray-700 mb-1">
                  Estacionamientos
                </label>
                <input
                  type="number"
                  id="estacionamientos"
                  name="estacionamientos"
                  value={formData.estacionamientos || ''}
                  onChange={handleChange}
                  min="0"
                  placeholder="Ej: 2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Ubicación</h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="direccion" className="block text-sm font-medium text-gray-700 mb-1">
                  Dirección
                </label>
                <input
                  type="text"
                  id="direccion"
                  name="direccion"
                  value={formData.direccion || ''}
                  onChange={handleChange}
                  placeholder="Ej: Av. Apoquindo 1234"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Hierarchical Location Selector */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-1">
                    Región <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="region"
                    value={selectedRegion || ''}
                    onChange={(e) => handleRegionChange(Number(e.target.value))}
                    disabled={loadingLocations || regions.length === 0}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  >
                    <option value="">Seleccionar región...</option>
                    {regions.map((region) => (
                      <option key={region.id} value={region.id}>
                        {region.name}
                      </option>
                    ))}
                  </select>
                  {regions.length === 0 && !loadingLocations && (
                    <p className="text-xs text-red-500 mt-1">
                      ⚠️ Endpoint no disponible. Necesitas implementar /api/v1/locations/regions/ en el backend
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="province" className="block text-sm font-medium text-gray-700 mb-1">
                    Provincia <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="province"
                    value={selectedProvince || ''}
                    onChange={(e) => handleProvinceChange(Number(e.target.value))}
                    disabled={!selectedRegion || loadingLocations || provinces.length === 0}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  >
                    <option value="">Seleccionar provincia...</option>
                    {provinces.map((province) => (
                      <option key={province.id} value={province.id}>
                        {province.name}
                      </option>
                    ))}
                  </select>
                  {!selectedRegion && (
                    <p className="text-xs text-gray-500 mt-1">
                      Primero selecciona una región
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="comuna" className="block text-sm font-medium text-gray-700 mb-1">
                    Comuna <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="comuna"
                    value={formData.comuna_id || ''}
                    onChange={(e) => handleComunaChange(Number(e.target.value))}
                    disabled={!selectedProvince || loadingLocations || comunas.length === 0}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  >
                    <option value="">Seleccionar comuna...</option>
                    {comunas.map((comuna) => (
                      <option key={comuna.id} value={comuna.id}>
                        {comuna.name}
                      </option>
                    ))}
                  </select>
                  {!selectedProvince && (
                    <p className="text-xs text-gray-500 mt-1">
                      Primero selecciona una provincia
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="barrio" className="block text-sm font-medium text-gray-700 mb-1">
                  Barrio
                </label>
                <input
                  type="text"
                  id="barrio"
                  name="barrio"
                  value={formData.barrio || ''}
                  onChange={handleChange}
                  placeholder="Ej: El Golf"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Additional Options */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Opciones Adicionales
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="material_construccion" className="block text-sm font-medium text-gray-700 mb-1">
                  Material de Construcción
                </label>
                <select
                  id="material_construccion"
                  name="material_construccion"
                  value={formData.material_construccion || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccionar...</option>
                  {CONSTRUCTION_MATERIALS.map((material) => (
                    <option key={material.value} value={material.value}>
                      {material.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="material_ventanas" className="block text-sm font-medium text-gray-700 mb-1">
                  Material de Ventanas
                </label>
                <select
                  id="material_ventanas"
                  name="material_ventanas"
                  value={formData.material_ventanas || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccionar...</option>
                  {WINDOW_MATERIALS.map((material) => (
                    <option key={material.value} value={material.value}>
                      {material.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="cubierta" className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Cubierta
                </label>
                <select
                  id="cubierta"
                  name="cubierta"
                  value={formData.cubierta || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccionar...</option>
                  {ROOF_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="condominio"
                  checked={formData.condominio || false}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  ¿Es condominio?
                </span>
              </label>
            </div>
          </div>

          {/* Amenities */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Amenities
            </h3>
            
            {loadingAmenities ? (
              <p className="text-gray-500">Cargando amenities...</p>
            ) : amenities.length === 0 ? (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800 text-sm">
                  ⚠️ No se pudieron cargar los amenities. El endpoint /api/v1/amenities/ está disponible pero no retornó datos.
                </p>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-600 mb-3">
                  Selecciona los amenities que tiene la propiedad:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {amenities.map((amenity) => (
                    <label
                      key={amenity.key}
                      className="flex items-start p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedAmenities.includes(amenity.key)}
                        onChange={() => handleAmenityToggle(amenity.key)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
                      />
                      <div className="ml-3">
                        <span className="text-sm font-medium text-gray-900">
                          {amenity.label}
                        </span>
                        {amenity.description && (
                          <p className="text-xs text-gray-500 mt-0.5">
                            {amenity.description}
                          </p>
                        )}
                        {amenity.category && (
                          <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                            {amenity.category}
                          </span>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
                {selectedAmenities.length > 0 && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Seleccionados ({selectedAmenities.length}):</strong>{' '}
                      {selectedAmenities.join(', ')}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading || success}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-400"
            >
              {loading ? 'Publicando...' : 'Publicar Propiedad'}
            </button>
            <Link
              href="/"
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors font-medium text-center"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}
