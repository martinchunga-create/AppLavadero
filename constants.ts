
import { InventoryRecord, EventType, DetailType } from './types';

export const EVENT_OPTIONS: EventType[] = [
  'CANTIDAD IDEAL / DIA',
  'IDEAL X 3',
  'INVENTARIO OCTUBRE',
  'INVENTARIO NOVIEMBRE',
  'INVENTARIO DICIEMBRE',
  'INVENTARIO ENERO'
];

export const DETAIL_OPTIONS: DetailType[] = [
  'CANTIDAD IDEAL / DIA',
  'Descarte + Residuos',
  'IDEAL X 3',
  'Lectura BERAZATEGUI',
  'Lectura SANATORIO',
  'LECTURA LB+SMD',
  'COMPRAS'
];

export const PRENDA_OPTIONS = [
  "SMD. ZALEA GOMA",
  "SMD. ZALEITA VS COLOR",
  "SMD. ALMOHADA",
  "SMD. APOYA BRAZ",
  "SMD. APOYABRAZOS",
  "SMD. BATA AZUL",
  "SMD. BATITA BEBE",
  "SMD. BATITA NIÑO",
  "SMD. BOLSA ARO"
];

const generateMockData = (): InventoryRecord[] => {
  const data: InventoryRecord[] = [];
  let idCounter = 1;

  PRENDA_OPTIONS.forEach(prenda => {
    EVENT_OPTIONS.forEach(evento => {
      DETAIL_OPTIONS.forEach(detalle => {
        // Only generate relevant combinations or randomize values
        // To simulate a real spreadsheet, we vary the quantities
        let baseQty = 50;
        if (evento.includes('IDEAL')) baseQty = 100;
        if (detalle.includes('Lectura')) baseQty = Math.floor(Math.random() * 80) + 20;
        if (detalle.includes('Descarte')) baseQty = Math.floor(Math.random() * 10);
        
        data.push({
          id: `rec-${idCounter++}`,
          evento,
          detalle,
          prenda,
          cantidad: baseQty
        });
      });
    });
  });

  return data;
};

export const MOCK_DATA = generateMockData();
