
import { InventoryRecord } from '../types';
import { MOCK_DATA } from '../constants';

export const getFilteredData = (filters: {
  prenda?: string;
  evento?: string;
  detalle?: string;
}) => {
  return MOCK_DATA.filter(item => {
    const matchPrenda = !filters.prenda || item.prenda === filters.prenda;
    const matchEvento = !filters.evento || item.evento === filters.evento;
    const matchDetalle = !filters.detalle || item.detalle === filters.detalle;
    return matchPrenda && matchEvento && matchDetalle;
  });
};

export const getAggregatedByEvento = (prenda: string) => {
  const filtered = MOCK_DATA.filter(item => item.prenda === prenda);
  const map: Record<string, number> = {};
  
  filtered.forEach(item => {
    if (!map[item.evento]) map[item.evento] = 0;
    map[item.evento] += item.cantidad;
  });

  return Object.entries(map).map(([name, value]) => ({ name, value }));
};

export const getComparisonData = (prenda: string, detail: string) => {
  return MOCK_DATA
    .filter(item => item.prenda === prenda && item.detalle === detail)
    .map(item => ({
      name: item.evento,
      cantidad: item.cantidad
    }));
};
