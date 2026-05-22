// Constants for the application

export const PROPERTY_TYPES = [
  { value: 'casa', label: 'Casa' },
  { value: 'departamento', label: 'Departamento' },
  { value: 'terreno', label: 'Terreno' },
  { value: 'oficina', label: 'Oficina' },
  { value: 'local_comercial', label: 'Local Comercial' },
  { value: 'bodega', label: 'Bodega' },
];

export const PROPERTY_STATUS = [
  { value: 'activo', label: 'Activo' },
  { value: 'vendido', label: 'Vendido' },
  { value: 'reservado', label: 'Reservado' },
  { value: 'inactivo', label: 'Inactivo' },
];

export const CURRENCIES = [
  { value: 'CLP', label: 'Peso Chileno (CLP)' },
  { value: 'USD', label: 'Dólar (USD)' },
  { value: 'UF', label: 'Unidad de Fomento (UF)' },
];

export const CONSTRUCTION_MATERIALS = [
  { value: 'hormigon', label: 'Hormigón' },
  { value: 'ladrillo', label: 'Ladrillo' },
  { value: 'madera', label: 'Madera' },
  { value: 'acero', label: 'Acero' },
  { value: 'mixto', label: 'Mixto' },
  { value: 'otro', label: 'Otro' },
];

export const WINDOW_MATERIALS = [
  { value: 'aluminio', label: 'Aluminio' },
  { value: 'pvc', label: 'PVC' },
  { value: 'madera', label: 'Madera' },
  { value: 'termopanel', label: 'Termopanel' },
];

export const ROOF_TYPES = [
  { value: 'teja', label: 'Teja' },
  { value: 'zinc', label: 'Zinc' },
  { value: 'losa', label: 'Losa' },
  { value: 'plana', label: 'Plana' },
];

// Temporary owner ID for MVP1 (no login)
export const DEFAULT_OWNER_ID = '123e4567-e89b-12d3-a456-426614174000';
