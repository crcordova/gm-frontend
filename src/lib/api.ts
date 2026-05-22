// API client for GM Real Estate Backend
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface Property {
  id: string; // Changed from number to string (UUID)
  title: string;
  description?: string;
  property_type: string;
  status: string;
  price: number;
  currency: string;
  m2_construidos?: number;
  m2_totales?: number;
  dormitorios?: number;
  banos?: number;
  estacionamientos?: number;
  direccion?: string;
  barrio?: string;
  comuna_id: number;
  comuna?: {
    id: number;
    name: string;
    province?: {
      name: string;
      region?: {
        name: string;
      };
    };
  };
  features?: Record<string, any>;
  amenity_keys?: string[];
  amenities?: Array<{
    id: number;
    key: string;
    label: string;
    category?: string;
  }>;
  lat?: number;
  lon?: number;
  owner_id: string;
  created_at?: string;
  updated_at?: string;
  condominio?: boolean;
  numeracion?: string;
  numero?: string;
  material_construccion?: string;
  material_ventanas?: string;
  cubierta?: string;
}

export interface PropertyCreate {
  owner_id: string;
  title: string;
  description?: string;
  property_type: string;
  status?: string;
  price: number;
  currency?: string;
  m2_construidos?: number;
  m2_totales?: number;
  dormitorios?: number;
  banos?: number;
  estacionamientos?: number;
  direccion?: string;
  barrio?: string;
  comuna_id: number;
  lat?: number;
  lon?: number;
  features?: Record<string, any>;
  amenity_keys?: string[];
  condominio?: boolean;
  material_construccion?: string;
  material_ventanas?: string;
  cubierta?: string;
}

export interface Quote {
  id: number;
  created_by: string;
  desired_property_type?: string;
  min_price?: number;
  max_price?: number;
  currency?: string;
  min_m2?: number;
  max_m2?: number;
  min_dormitorios?: number;
  min_banos?: number;
  min_estacionamientos?: number;
  preferred_comunas?: string[];
  preferred_barrios?: string[];
  required_amenities?: string[];
  optional_amenities?: string[];
  desired_features?: Record<string, any>;
  created_at?: string;
}

export interface QuoteCreate {
  created_by: string;
  desired_property_type?: string;
  min_price?: number;
  max_price?: number;
  currency?: string;
  min_m2?: number;
  max_m2?: number;
  min_dormitorios?: number;
  min_banos?: number;
  min_estacionamientos?: number;
  preferred_comunas?: string[];
  preferred_barrios?: string[];
  required_amenities?: string[];
  optional_amenities?: string[];
  desired_features?: Record<string, any>;
}

export interface PropertyFilters {
  property_type?: string;
  min_price?: number;
  max_price?: number;
  comuna_id?: number;
  min_dormitorios?: number;
  status?: string;
  skip?: number;
  limit?: number;
}

// Properties API
export async function getProperties(filters?: PropertyFilters): Promise<Property[]> {
  try {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }
    
    const url = `${API_BASE}/api/v1/properties/${params.toString() ? '?' + params.toString() : ''}`;
    const response = await fetch(url, { cache: 'no-store' });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch properties: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Handle paginated response with {items: [...]} structure
    if (data && typeof data === 'object' && 'items' in data && Array.isArray(data.items)) {
      return data.items;
    }
    
    // Handle direct array response
    if (Array.isArray(data)) {
      return data;
    }
    
    // Unexpected format
    console.error('API returned unexpected data format:', data);
    return [];
  } catch (error) {
    console.error('Error in getProperties:', error);
    throw error;
  }
}

export async function getProperty(id: string): Promise<Property> {
  const response = await fetch(`${API_BASE}/api/v1/properties/${id}`, { cache: 'no-store' });
  
  if (!response.ok) {
    throw new Error(`Property not found: ${response.statusText}`);
  }
  
  return response.json();
}

// Parse FastAPI error responses into human-readable messages
function parseApiError(data: any): string {
  if (typeof data.detail === 'string') {
    return data.detail;
  }
  if (Array.isArray(data.detail)) {
    // FastAPI validation error format: [{ loc: ['body', 'field'], msg: '...', type: '...' }]
    const messages = data.detail.map((err: any) => {
      if (typeof err === 'string') return err;
      const field = err.loc?.filter((l: string) => l !== 'body').join('.') || 'campo';
      const msg = err.msg || 'Error de validación';
      return `${field}: ${msg}`;
    });
    return messages.join('; ');
  }
  if (data.message && typeof data.message === 'string') {
    return data.message;
  }
  return 'Error desconocido del servidor';
}

export async function createProperty(data: PropertyCreate): Promise<Property> {
  const response = await fetch(`${API_BASE}/api/v1/properties/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(parseApiError(errorData));
  }

  return response.json();
}

// Quotes API
export async function createQuote(data: QuoteCreate): Promise<Quote> {
  const response = await fetch(`${API_BASE}/api/v1/quotes/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(parseApiError(errorData));
  }

  return response.json();
}

// Utility functions
export function formatPrice(price: number, currency: string = 'CLP'): string {
  if (currency === 'CLP') {
    return `$${price.toLocaleString('es-CL')}`;
  }
  return `${currency} ${price.toLocaleString('es-CL')}`;
}

export function getPropertyTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    casa: 'Casa',
    departamento: 'Departamento',
    parcela: 'Parcela',
    oficina: 'Oficina',
    local_comercial: 'Local Comercial',
    bodega: 'Bodega',
    sitio: 'Sitio',
  };
  return labels[type] || type;
}

// Location Types
export interface Region {
  id: number;
  name: string;
  code: string;
  roman_numeral: string;
}

export interface Province {
  id: number;
  name: string;
  region_id: number;
}

export interface Comuna {
  id: number;
  name: string;
  province_id: number;
}

// Amenity Type
export interface Amenity {
  id: number;
  key: string;
  label: string;
  description?: string;
  category?: string;
}

// Location API
export async function getRegions(): Promise<Region[]> {
  try {
    const response = await fetch(`${API_BASE}/api/v1/locations/regions/`, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`Failed to fetch regions: ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error('Error in getRegions:', error);
    throw error;
  }
}

export async function getProvincesByRegion(regionId: number): Promise<Province[]> {
  try {
    const response = await fetch(`${API_BASE}/api/v1/locations/regions/${regionId}/provinces/`, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`Failed to fetch provinces: ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error('Error in getProvincesByRegion:', error);
    throw error;
  }
}

export async function getComunasByProvince(provinceId: number): Promise<Comuna[]> {
  try {
    const response = await fetch(`${API_BASE}/api/v1/locations/provinces/${provinceId}/comunas/`, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`Failed to fetch comunas: ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error('Error in getComunasByProvince:', error);
    throw error;
  }
}

// Amenities API
export async function getAmenities(): Promise<Amenity[]> {
  try {
    const response = await fetch(`${API_BASE}/api/v1/amenities/`, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`Failed to fetch amenities: ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error('Error in getAmenities:', error);
    throw error;
  }
}
