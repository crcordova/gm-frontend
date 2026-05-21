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
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useAnalytics } from '@/lib/analytics';
import {
  Upload,
  Home,
  MapPin,
  DollarSign,
  Ruler,
  Bed,
  Bath,
  Car,
  Check,
  AlertCircle,
  ChevronRight,
  Loader2,
} from 'lucide-react';

export default function PublicarPage() {
  const router = useRouter();
  const { track } = useAnalytics();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

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

  useEffect(() => {
    track('page_view', { path: '/publicar' });
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
    track('property_publish_started');

    try {
      if (!formData.title || !formData.property_type || !formData.price || !formData.comuna_id) {
        throw new Error('Por favor completa todos los campos obligatorios');
      }

      const propertyData: PropertyCreate = {
        ...formData as PropertyCreate,
        amenity_keys: selectedAmenities.length > 0 ? selectedAmenities : undefined,
      };

      track('property_publish_submitted', {
        property_type: formData.property_type,
        price: formData.price,
        comuna_id: formData.comuna_id,
      });

      const property = await createProperty(propertyData);
      setSuccess(true);
      track('property_publish_success', { property_id: property.id });

      setTimeout(() => {
        router.push(`/propiedades/${property.id}`);
      }, 2000);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Error al crear la propiedad';
      setError(message);
      track('property_publish_error', { error: message });
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { id: 1, label: 'Básico', icon: Home },
    { id: 2, label: 'Características', icon: Ruler },
    { id: 3, label: 'Ubicación', icon: MapPin },
    { id: 4, label: 'Amenities', icon: Check },
  ];

  const canProceed = () => {
    if (currentStep === 1) return formData.title && formData.price;
    if (currentStep === 3) return formData.comuna_id;
    return true;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
        <div className="mb-8">
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-text-primary mb-2">
            Publicar Nueva Propiedad
          </h1>
          <p className="text-text-secondary">
            Completa el formulario para publicar tu propiedad en nuestro marketplace
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex items-center gap-2 min-w-max px-1">
            {steps.map((step, idx) => (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => {
                    if (step.id < currentStep) setCurrentStep(step.id);
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentStep === step.id
                      ? 'bg-primary text-white'
                      : currentStep > step.id
                      ? 'bg-primary/10 text-primary'
                      : 'bg-surface-muted text-text-muted'
                  }`}
                >
                  <step.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{step.label}</span>
                </button>
                {idx < steps.length - 1 && (
                  <ChevronRight className="w-4 h-4 text-text-muted mx-1" />
                )}
              </div>
            ))}
          </div>
        </div>

        {success && (
          <div className="mb-6 p-4 bg-success-bg border border-success/20 rounded-xl flex items-start gap-3">
            <Check className="w-5 h-5 text-success shrink-0 mt-0.5" />
            <div>
              <p className="text-success font-medium">Propiedad creada exitosamente</p>
              <p className="text-sm text-text-secondary mt-0.5">Redirigiendo a la propiedad...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-error-bg border border-error/20 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-error shrink-0 mt-0.5" />
            <p className="text-error font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-surface rounded-2xl border border-border shadow-soft p-6 sm:p-8">
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-text-primary mb-1.5">
                  Título <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title || ''}
                  onChange={handleChange}
                  required
                  placeholder="Ej: Hermosa Casa en Las Condes"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-surface text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-text-primary mb-1.5">
                  Descripción
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description || ''}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Describe la propiedad en detalle..."
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-surface text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="property_type" className="block text-sm font-medium text-text-primary mb-1.5">
                    Tipo <span className="text-error">*</span>
                  </label>
                  <select
                    id="property_type"
                    name="property_type"
                    value={formData.property_type}
                    onChange={handleChange}
                    required
                    className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  >
                    {PROPERTY_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-text-primary mb-1.5">
                    Estado
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  >
                    {PROPERTY_STATUS.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-text-primary mb-1.5">
                    Precio <span className="text-error">*</span>
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price || ''}
                      onChange={handleChange}
                      required
                      min="0"
                      placeholder="Ej: 250000000"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-lg border border-border bg-surface text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="currency" className="block text-sm font-medium text-text-primary mb-1.5">
                    Moneda
                  </label>
                  <select
                    id="currency"
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
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
          )}

          {/* Step 2: Characteristics */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="m2_construidos" className="block text-sm font-medium text-text-primary mb-1.5">
                    <span className="inline-flex items-center gap-1.5">
                      <Ruler className="w-3.5 h-3.5 text-text-muted" />
                      M² Construidos
                    </span>
                  </label>
                  <input
                    type="number"
                    id="m2_construidos"
                    name="m2_construidos"
                    value={formData.m2_construidos || ''}
                    onChange={handleChange}
                    min="0"
                    placeholder="Ej: 150"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-surface text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="m2_totales" className="block text-sm font-medium text-text-primary mb-1.5">
                    <span className="inline-flex items-center gap-1.5">
                      <Ruler className="w-3.5 h-3.5 text-text-muted" />
                      M² Totales
                    </span>
                  </label>
                  <input
                    type="number"
                    id="m2_totales"
                    name="m2_totales"
                    value={formData.m2_totales || ''}
                    onChange={handleChange}
                    min="0"
                    placeholder="Ej: 200"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-surface text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="dormitorios" className="block text-sm font-medium text-text-primary mb-1.5">
                    <span className="inline-flex items-center gap-1.5">
                      <Bed className="w-3.5 h-3.5 text-text-muted" />
                      Dormitorios
                    </span>
                  </label>
                  <input
                    type="number"
                    id="dormitorios"
                    name="dormitorios"
                    value={formData.dormitorios || ''}
                    onChange={handleChange}
                    min="0"
                    placeholder="Ej: 3"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-surface text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="banos" className="block text-sm font-medium text-text-primary mb-1.5">
                    <span className="inline-flex items-center gap-1.5">
                      <Bath className="w-3.5 h-3.5 text-text-muted" />
                      Baños
                    </span>
                  </label>
                  <input
                    type="number"
                    id="banos"
                    name="banos"
                    value={formData.banos || ''}
                    onChange={handleChange}
                    min="0"
                    placeholder="Ej: 2"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-surface text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="estacionamientos" className="block text-sm font-medium text-text-primary mb-1.5">
                    <span className="inline-flex items-center gap-1.5">
                      <Car className="w-3.5 h-3.5 text-text-muted" />
                      Estacionamientos
                    </span>
                  </label>
                  <input
                    type="number"
                    id="estacionamientos"
                    name="estacionamientos"
                    value={formData.estacionamientos || ''}
                    onChange={handleChange}
                    min="0"
                    placeholder="Ej: 2"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-surface text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="material_construccion" className="block text-sm font-medium text-text-primary mb-1.5">
                    Material de Construcción
                  </label>
                  <select
                    id="material_construccion"
                    name="material_construccion"
                    value={formData.material_construccion || ''}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
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
                  <label htmlFor="material_ventanas" className="block text-sm font-medium text-text-primary mb-1.5">
                    Material de Ventanas
                  </label>
                  <select
                    id="material_ventanas"
                    name="material_ventanas"
                    value={formData.material_ventanas || ''}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
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
                  <label htmlFor="cubierta" className="block text-sm font-medium text-text-primary mb-1.5">
                    Tipo de Cubierta
                  </label>
                  <select
                    id="cubierta"
                    name="cubierta"
                    value={formData.cubierta || ''}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
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

              <div className="flex items-center gap-3 p-4 bg-surface-muted rounded-xl border border-border-subtle">
                <input
                  type="checkbox"
                  name="condominio"
                  id="condominio"
                  checked={formData.condominio || false}
                  onChange={handleChange}
                  className="w-5 h-5 text-primary border-border rounded focus:ring-primary"
                />
                <label htmlFor="condominio" className="text-sm text-text-primary cursor-pointer">
                  ¿Es condominio?
                </label>
              </div>
            </div>
          )}

          {/* Step 3: Location */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div>
                <label htmlFor="direccion" className="block text-sm font-medium text-text-primary mb-1.5">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-text-muted" />
                    Dirección
                  </span>
                </label>
                <input
                  type="text"
                  id="direccion"
                  name="direccion"
                  value={formData.direccion || ''}
                  onChange={handleChange}
                  placeholder="Ej: Av. Apoquindo 1234"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-surface text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="region" className="block text-sm font-medium text-text-primary mb-1.5">
                    Región <span className="text-error">*</span>
                  </label>
                  <select
                    id="region"
                    value={selectedRegion || ''}
                    onChange={(e) => handleRegionChange(Number(e.target.value))}
                    disabled={loadingLocations || regions.length === 0}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all disabled:bg-surface-muted disabled:text-text-muted"
                  >
                    <option value="">Seleccionar...</option>
                    {regions.map((region) => (
                      <option key={region.id} value={region.id}>
                        {region.name}
                      </option>
                    ))}
                  </select>
                  {regions.length === 0 && !loadingLocations && (
                    <p className="text-xs text-warning mt-1.5">
                      Endpoint no disponible. Necesitas implementar /api/v1/locations/regions/ en el backend
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="province" className="block text-sm font-medium text-text-primary mb-1.5">
                    Provincia <span className="text-error">*</span>
                  </label>
                  <select
                    id="province"
                    value={selectedProvince || ''}
                    onChange={(e) => handleProvinceChange(Number(e.target.value))}
                    disabled={!selectedRegion || loadingLocations || provinces.length === 0}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all disabled:bg-surface-muted disabled:text-text-muted"
                  >
                    <option value="">Seleccionar...</option>
                    {provinces.map((province) => (
                      <option key={province.id} value={province.id}>
                        {province.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="comuna" className="block text-sm font-medium text-text-primary mb-1.5">
                    Comuna <span className="text-error">*</span>
                  </label>
                  <select
                    id="comuna"
                    value={formData.comuna_id || ''}
                    onChange={(e) => handleComunaChange(Number(e.target.value))}
                    disabled={!selectedProvince || loadingLocations || comunas.length === 0}
                    required
                    className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all disabled:bg-surface-muted disabled:text-text-muted"
                  >
                    <option value="">Seleccionar...</option>
                    {comunas.map((comuna) => (
                      <option key={comuna.id} value={comuna.id}>
                        {comuna.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="barrio" className="block text-sm font-medium text-text-primary mb-1.5">
                  Barrio
                </label>
                <input
                  type="text"
                  id="barrio"
                  name="barrio"
                  value={formData.barrio || ''}
                  onChange={handleChange}
                  placeholder="Ej: El Golf"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-surface text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
              </div>
            </div>
          )}

          {/* Step 4: Amenities */}
          {currentStep === 4 && (
            <div className="animate-in fade-in duration-300">
              {loadingAmenities ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 text-primary animate-spin mr-2" />
                  <span className="text-text-secondary">Cargando amenities...</span>
                </div>
              ) : amenities.length === 0 ? (
                <div className="p-6 bg-warning-bg border border-warning/20 rounded-xl">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
                    <div>
                      <p className="text-warning font-medium text-sm">No se pudieron cargar los amenities</p>
                      <p className="text-text-secondary text-sm mt-1">
                        El endpoint /api/v1/amenities/ está disponible pero no retornó datos.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-text-secondary mb-4">
                    Selecciona los amenities que tiene la propiedad:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {amenities.map((amenity) => (
                      <label
                        key={amenity.key}
                        className={`flex items-start p-4 rounded-xl border cursor-pointer transition-all ${
                          selectedAmenities.includes(amenity.key)
                            ? 'bg-primary/5 border-primary/30'
                            : 'bg-surface border-border hover:bg-surface-muted'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedAmenities.includes(amenity.key)}
                          onChange={() => handleAmenityToggle(amenity.key)}
                          className="w-4 h-4 text-primary border-border rounded focus:ring-primary mt-0.5 shrink-0"
                        />
                        <div className="ml-3">
                          <span className="text-sm font-medium text-text-primary">
                            {amenity.label}
                          </span>
                          {amenity.description && (
                            <p className="text-xs text-text-muted mt-0.5">
                              {amenity.description}
                            </p>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>

                  {selectedAmenities.length > 0 && (
                    <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-xl">
                      <p className="text-sm text-primary font-medium">
                        <strong>Seleccionados ({selectedAmenities.length}):</strong>{' '}
                        {selectedAmenities.join(', ')}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
            <div>
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="px-5 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
                >
                  Atrás
                </button>
              ) : (
                <Link
                  href="/"
                  className="px-5 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
                >
                  Cancelar
                </Link>
              )}
            </div>

            <div className="flex gap-3">
              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep + 1)}
                  disabled={!canProceed()}
                  className="px-6 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Siguiente
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading || success}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-accent text-white rounded-lg font-medium hover:bg-accent-hover transition-colors disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Publicando...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Publicar Propiedad
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
