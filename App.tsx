
import React, { useState, useMemo, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell
} from 'recharts';
import { 
  LayoutDashboard, 
  Target, 
  TrendingUp, 
  AlertCircle,
  ChevronDown,
  FileWarning,
  CalendarDays,
  ArrowDownToLine
} from 'lucide-react';
import { MOCK_DATA } from './constants';
import { InventoryRecord, EVENTO_IDEAL_DIA, EVENTO_IDEAL_X3 } from './types';
import StatCard from './components/StatCard';
import FileUpload from './components/FileUpload';

const App: React.FC = () => {
  const [inventoryData, setInventoryData] = useState<InventoryRecord[]>(MOCK_DATA);
  const [selectedPrenda, setSelectedPrenda] = useState("");
  const [selectedMes, setSelectedMes] = useState("");

  // Opciones de prendas (limpias de valores vacíos)
  const prendaOptions = useMemo(() => {
    // Fix: Using a type predicate to narrow the type of 'p' from unknown to string
    const unique = Array.from(new Set(inventoryData.map(d => d.prenda)))
      .filter((p): p is string => typeof p === 'string' && p.trim() !== "")
      .sort();
    return unique;
  }, [inventoryData]);

  // Meses disponibles (Inventarios)
  const allMeses = useMemo(() => {
    return Array.from(new Set(
      inventoryData
        .filter(d => d.evento.toUpperCase().includes('INVENTARIO'))
        .map(d => d.evento)
    )).sort();
  }, [inventoryData]);

  // EFECTO CRÍTICO: Sincronizar selección inicial cuando cambian los datos
  useEffect(() => {
    if (prendaOptions.length > 0) {
      // Si la prenda actual ya no existe o no hay ninguna seleccionada, elegir la primera
      if (!selectedPrenda || !prendaOptions.includes(selectedPrenda)) {
        setSelectedPrenda(prendaOptions[0]);
      }
    }
    
    if (allMeses.length > 0) {
      if (!selectedMes || !allMeses.includes(selectedMes)) {
        setSelectedMes(allMeses[allMeses.length - 1]);
      }
    }
  }, [prendaOptions, allMeses]);

  const metrics = useMemo(() => {
    const prendaData = inventoryData.filter(d => d.prenda === selectedPrenda);
    
    const idealDia = prendaData
      .filter(d => d.evento.toUpperCase().trim() === EVENTO_IDEAL_DIA.toUpperCase())
      .reduce((acc, curr) => acc + curr.cantidad, 0);

    const idealX3 = prendaData
      .filter(d => d.evento.toUpperCase().trim() === EVENTO_IDEAL_X3.toUpperCase())
      .reduce((acc, curr) => acc + curr.cantidad, 0);

    const stockActual = prendaData
      .filter(d => d.evento === selectedMes)
      .reduce((acc, curr) => acc + curr.cantidad, 0);

    return { idealDia, idealX3, stockActual };
  }, [inventoryData, selectedPrenda, selectedMes]);

  const comparisonChartData = useMemo(() => {
    return allMeses.map(mes => {
      const cant = inventoryData
        .filter(d => d.prenda === selectedPrenda && d.evento === mes)
        .reduce((acc, curr) => acc + curr.cantidad, 0);
      return { 
        name: mes.replace(/INVENTARIO/i, '').trim(), 
        fullEvento: mes,
        cantidad: cant 
      };
    });
  }, [inventoryData, selectedPrenda, allMeses]);

  const handleDataLoaded = (newData: InventoryRecord[]) => {
    setInventoryData(newData);
  };

  if (inventoryData.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4 font-sans text-center">
        <FileWarning className="w-16 h-16 text-slate-300 mb-4" />
        <h2 className="text-xl font-bold text-slate-700 mb-2">No se encontraron datos</h2>
        <p className="text-slate-500 mb-6 max-w-md">El archivo cargado no tiene el formato esperado. Asegúrate de tener las columnas: evento, detalle, prenda y cantidad.</p>
        <FileUpload onDataLoaded={handleDataLoaded} />
      </div>
    );
  }

  const isLowStock = metrics.stockActual < metrics.idealX3;
  const stockStatusColor = isLowStock ? 'text-red-600' : 'text-emerald-600';

  return (
    <div className="min-h-screen bg-slate-50 pb-12 font-sans selection:bg-blue-100">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 px-4 py-4 md:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-xl shadow-inner">
              <LayoutDashboard className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-800 leading-none">Control Stock</h1>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Dashboard Operativo</p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <FileUpload onDataLoaded={handleDataLoaded} />
            
            <div className="h-8 w-px bg-slate-200 hidden lg:block mx-2"></div>

            {/* SELECTOR DE PRENDA */}
            <div className="relative min-w-[260px]">
              <label className="text-[10px] uppercase font-black text-blue-600 absolute -top-2 left-3 px-1 bg-white z-10">Prenda</label>
              <div className="relative">
                <select 
                  value={selectedPrenda}
                  onChange={(e) => setSelectedPrenda(e.target.value)}
                  className="appearance-none bg-white border-2 border-slate-100 text-slate-800 text-sm rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 block w-full pl-4 pr-10 py-3 outline-none transition-all cursor-pointer font-bold shadow-sm"
                >
                  {prendaOptions.length > 0 ? (
                    prendaOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))
                  ) : (
                    <option value="">No hay prendas</option>
                  )}
                </select>
                <ChevronDown className="absolute right-3 top-4 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* SELECTOR DE MES */}
            <div className="relative min-w-[200px]">
              <label className="text-[10px] uppercase font-black text-blue-600 absolute -top-2 left-3 px-1 bg-white z-10">Periodo</label>
              <div className="relative">
                <select 
                  value={selectedMes}
                  onChange={(e) => setSelectedMes(e.target.value)}
                  className="appearance-none bg-white border-2 border-slate-100 text-slate-800 text-sm rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 block w-full pl-4 pr-10 py-3 outline-none transition-all cursor-pointer font-bold shadow-sm"
                >
                  {allMeses.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-4 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8 md:px-8 space-y-6">
        
        {/* CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            label="Ideal Diario" 
            value={metrics.idealDia.toLocaleString()} 
            icon={<Target className="w-6 h-6" />} 
            color="bg-slate-800" 
          />
          <StatCard 
            label="Ideal x 3" 
            value={metrics.idealX3.toLocaleString()} 
            icon={<TrendingUp className="w-6 h-6" />} 
            color="bg-blue-600" 
          />
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
            <div className="bg-indigo-600 p-3 rounded-xl text-white shadow-lg shadow-indigo-100">
              <CalendarDays className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">Stock {selectedMes}</p>
              <p className={`text-2xl font-black ${stockStatusColor}`}>{metrics.stockActual.toLocaleString()}</p>
            </div>
          </div>
          <div className={`bg-white p-6 rounded-2xl shadow-sm border transition-all ${isLowStock ? 'border-red-200 bg-red-50/20' : 'border-emerald-100'}`}>
            <div className="flex items-center space-x-4">
              <div className={`${isLowStock ? 'bg-red-500' : 'bg-emerald-500'} p-3 rounded-xl text-white shadow-lg`}>
                {isLowStock ? <AlertCircle className="w-6 h-6" /> : <ArrowDownToLine className="w-6 h-6" />}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Estado vs Ideal</p>
                <p className={`text-2xl font-black ${stockStatusColor}`}>
                  {metrics.stockActual - metrics.idealX3 >= 0 ? '+' : ''}{metrics.stockActual - metrics.idealX3}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* GRÁFICO */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <div className="mb-8">
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">Evolución Histórica</h3>
            <p className="text-slate-500">Comparativa de stock para <span className="text-blue-600 font-bold">{selectedPrenda}</span></p>
          </div>

          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 700 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="cantidad" radius={[6, 6, 0, 0]} barSize={40}>
                  {comparisonChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fullEvento === selectedMes ? '#2563eb' : '#cbd5e1'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* TABLA */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Desglose de Lecturas</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-400 uppercase text-[10px] tracking-widest font-black">
                  <th className="px-8 py-4">Ubicación / Detalle</th>
                  <th className="px-8 py-4 text-right">Cantidad</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {inventoryData
                  .filter(d => d.evento === selectedMes && d.prenda === selectedPrenda)
                  .map((row) => (
                  <tr key={row.id} className="hover:bg-blue-50/40 transition-colors">
                    <td className="px-8 py-5 font-bold text-slate-700">{row.detalle}</td>
                    <td className="px-8 py-5 text-right font-black text-slate-900 text-lg">{row.cantidad.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
