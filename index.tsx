import React, { useState, useMemo, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { 
  LayoutDashboard, Target, TrendingUp, AlertCircle, ChevronDown, 
  CalendarDays, ArrowDownToLine, CheckCircle2, UploadCloud 
} from 'lucide-react';
import * as XLSX from 'xlsx';

// --- CONFIGURACIÓN Y TIPOS ---
const EVENTO_IDEAL_DIA = 'CANTIDAD IDEAL / DIA';
const EVENTO_IDEAL_X3 = 'IDEAL X 3';

const PRENDAS_INICIALES = [
  "SMD. ZALEA GOMA", "SMD. ZALEITA VS COLOR", "SMD. ALMOHADA", 
  "SMD. BATA AZUL", "SMD. BATITA BEBE", "SMD. BOLSA ARO"
];

const MESES_INICIALES = [
  'INVENTARIO OCTUBRE', 'INVENTARIO NOVIEMBRE', 'INVENTARIO DICIEMBRE', 'INVENTARIO ENERO'
];

// --- COMPONENTES INTERNOS ---

const StatCard = ({ label, value, icon, color }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
    <div className={`${color} p-3 rounded-xl text-white shadow-lg`}>
      {icon}
    </div>
    <div>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</p>
      <p className="text-2xl font-black text-slate-900">{value}</p>
    </div>
  </div>
);

const FileUpload = ({ onDataLoaded }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const rawJson = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

        const findKey = (row, possibleNames) => 
          Object.keys(row).find(k => possibleNames.some(name => k.toLowerCase().includes(name.toLowerCase())));

        const mappedData = rawJson.map((row, index) => {
          const keyEvento = findKey(row, ['evento', 'mes', 'periodo']) || 'evento';
          const keyDetalle = findKey(row, ['detalle', 'descripcion', 'tipo']) || 'detalle';
          const keyPrenda = findKey(row, ['prenda', 'articulo', 'producto']) || 'prenda';
          const keyCantidad = findKey(row, ['cantidad', 'stock', 'cant']) || 'cantidad';

          return {
            id: `row-${index}-${Date.now()}`,
            evento: String(row[keyEvento] || '').trim(),
            detalle: String(row[keyDetalle] || '').trim(),
            prenda: String(row[keyPrenda] || '').trim(),
            cantidad: parseFloat(String(row[keyCantidad]).replace(',', '.')) || 0
          };
        }).filter(d => d.prenda.length > 0);

        if (mappedData.length > 0) onDataLoaded(mappedData);
        else alert("No se encontraron datos válidos.");
      } catch (err) {
        alert("Error procesando el Excel.");
      }
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="flex items-center">
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".xlsx,.xls" className="hidden" />
      <button 
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl text-sm font-black transition-all shadow-lg active:scale-95"
      >
        <UploadCloud className="w-5 h-5" />
        <span>Importar Excel</span>
      </button>
    </div>
  );
};

// --- APLICACIÓN PRINCIPAL ---

const App = () => {
  const [data, setData] = useState([]);
  const [selectedPrenda, setSelectedPrenda] = useState("");
  const [selectedMes, setSelectedMes] = useState("");

  // Generar datos mock al inicio si no hay nada
  useEffect(() => {
    const mock = [];
    PRENDAS_INICIALES.forEach(p => {
      MESES_INICIALES.forEach(m => {
        mock.push({ id: Math.random(), prenda: p, evento: m, detalle: "Lectura General", cantidad: Math.floor(Math.random() * 100) + 50 });
      });
      mock.push({ id: Math.random(), prenda: p, evento: EVENTO_IDEAL_DIA, detalle: "Meta", cantidad: 60 });
      mock.push({ id: Math.random(), prenda: p, evento: EVENTO_IDEAL_X3, detalle: "Meta", cantidad: 180 });
    });
    setData(mock);
  }, []);

  const prendaOptions = useMemo(() => [...new Set(data.map(d => d.prenda))].sort(), [data]);
  const mesOptions = useMemo(() => 
    [...new Set(data.filter(d => !d.evento.includes('IDEAL')).map(d => d.evento))].sort(), 
  [data]);

  useEffect(() => {
    if (prendaOptions.length > 0 && !selectedPrenda) setSelectedPrenda(prendaOptions[0]);
    if (mesOptions.length > 0 && !selectedMes) setSelectedMes(mesOptions[mesOptions.length - 1]);
  }, [prendaOptions, mesOptions]);

  const metrics = useMemo(() => {
    const pData = data.filter(d => d.prenda === selectedPrenda);
    const getQty = (ev) => pData.filter(d => d.evento === ev).reduce((a, b) => a + b.cantidad, 0);
    return {
      idealDia: getQty(EVENTO_IDEAL_DIA),
      idealX3: getQty(EVENTO_IDEAL_X3),
      actual: getQty(selectedMes)
    };
  }, [data, selectedPrenda, selectedMes]);

  const chartData = useMemo(() => 
    mesOptions.map(m => ({
      name: m.replace('INVENTARIO ', ''),
      full: m,
      cantidad: data.filter(d => d.prenda === selectedPrenda && d.evento === m).reduce((a, b) => a + b.cantidad, 0)
    })), 
  [data, selectedPrenda, mesOptions]);

  const isLow = metrics.actual < metrics.idealX3;

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 p-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg text-white"><LayoutDashboard /></div>
            <h1 className="text-xl font-black text-slate-800">Control de Stock</h1>
          </div>
          
          <div className="flex flex-wrap gap-4 items-center">
            <FileUpload onDataLoaded={setData} />
            <select 
              value={selectedPrenda} 
              onChange={e => setSelectedPrenda(e.target.value)}
              className="bg-white border border-slate-200 p-3 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500"
            >
              {prendaOptions.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
            <select 
              value={selectedMes} 
              onChange={e => setSelectedMes(e.target.value)}
              className="bg-white border border-slate-200 p-3 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500"
            >
              {mesOptions.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard label="Ideal Día" value={metrics.idealDia} icon={<Target />} color="bg-slate-800" />
          <StatCard label="Ideal x 3" value={metrics.idealX3} icon={<TrendingUp />} color="bg-blue-600" />
          <StatCard label={`Stock ${selectedMes}`} value={metrics.actual} icon={<CalendarDays />} color="bg-indigo-600" />
          <div className={`p-6 rounded-2xl border flex items-center gap-4 ${isLow ? 'bg-red-50 border-red-200 text-red-700' : 'bg-emerald-50 border-emerald-200 text-emerald-700'}`}>
            <div className={`p-3 rounded-xl text-white ${isLow ? 'bg-red-500' : 'bg-emerald-500'}`}>
              {isLow ? <AlertCircle /> : <CheckCircle2 />}
            </div>
            <div>
              <p className="text-xs font-bold uppercase">Estado</p>
              <p className="text-xl font-black">{isLow ? 'Stock Crítico' : 'Stock Saludable'}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-black text-slate-800 mb-6 uppercase tracking-tighter">Histórico de Prendas: {selectedPrenda}</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold'}} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#f8fafc'}} />
                <Bar dataKey="cantidad" radius={[4, 4, 0, 0]} barSize={40}>
                  {chartData.map((entry, i) => (
                    <Cell key={i} fill={entry.full === selectedMes ? '#2563eb' : '#cbd5e1'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
};

const root = createRoot(document.getElementById('root'));
root.render(<App />);
