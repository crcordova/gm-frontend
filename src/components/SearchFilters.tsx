'use client';

import { useState } from 'react';
import { PROPERTY_TYPES } from '@/lib/constants';

interface SearchFiltersProps {
  onSearch: (filters: {
    property_type?: string;
    min_price?: number;
    max_price?: number;
    min_dormitorios?: number;
  }) => void;
}

export function SearchFilters({ onSearch }: SearchFiltersProps) {
  const [propertyType, setPropertyType] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minDormitorios, setMinDormitorios] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      property_type: propertyType || undefined,
      min_price: minPrice ? parseInt(minPrice) : undefined,
      max_price: maxPrice ? parseInt(maxPrice) : undefined,
      min_dormitorios: minDormitorios ? parseInt(minDormitorios) : undefined,
    });
  };

  const handleReset = () => {
    setPropertyType('');
    setMinPrice('');
    setMaxPrice('');
    setMinDormitorios('');
    onSearch({});
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-900">Filtrar Propiedades</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
      </div>

      <div className="flex gap-3 mt-4">
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
        >
          Buscar
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors font-medium"
        >
          Limpiar
        </button>
      </div>
    </form>
  );
}
