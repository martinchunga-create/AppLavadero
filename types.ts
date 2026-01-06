
export interface InventoryRecord {
  id: string;
  evento: string;
  detalle: string;
  prenda: string;
  cantidad: number;
}

// Add missing type exports used in constants.ts
export type EventType = string;
export type DetailType = string;

// Valores esperados en la columna 'evento'
export const EVENTO_IDEAL_DIA = 'CANTIDAD IDEAL / DIA';
export const EVENTO_IDEAL_X3 = 'IDEAL X 3';

// Valores esperados en la columna 'detalle'
export const DETALLE_OPTIONS = [
  'CANTIDAD IDEAL / DIA',
  'Descarte + Residuos',
  'Descarte + Desvios',
  'IDEAL X 3',
  'Lectura BERAZATEGUI',
  'Lectura SANATORIO',
  'LECTURA LB+SMD',
  'COMPRAS'
];