
import React, { useRef } from 'react';
import { UploadCloud } from 'lucide-react';
import * as XLSX from 'xlsx';
import { InventoryRecord } from '../types';

interface FileUploadProps {
  onDataLoaded: (data: InventoryRecord[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onDataLoaded }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        // Leemos el workbook (soporta .xlsx, .xls, .csv)
        const workbook = XLSX.read(data, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convertimos a JSON. defval: "" asegura que no falten llaves si la celda está vacía
        const rawJson = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

        if (rawJson.length === 0) {
          alert("El archivo parece estar vacío.");
          return;
        }

        // Función inteligente para encontrar columnas incluso si el nombre varía un poco
        const findKey = (row: any, possibleNames: string[]) => {
          return Object.keys(row).find(k => {
            const normalizedK = k.toLowerCase().trim();
            return possibleNames.some(name => normalizedK.includes(name.toLowerCase()));
          });
        };

        const mappedData: InventoryRecord[] = rawJson.map((row: any, index: number) => {
          const keyEvento = findKey(row, ['evento', 'mes', 'periodo']) || 'evento';
          const keyDetalle = findKey(row, ['detalle', 'descripcion', 'tipo', 'lectura']) || 'detalle';
          const keyPrenda = findKey(row, ['prenda', 'articulo', 'producto', 'item']) || 'prenda';
          const keyCantidad = findKey(row, ['cantidad', 'stock', 'cant', 'total']) || 'cantidad';

          return {
            id: `row-${index}-${Date.now()}`,
            evento: String(row[keyEvento] || '').trim(),
            detalle: String(row[keyDetalle] || '').trim(),
            prenda: String(row[keyPrenda] || '').trim(),
            cantidad: parseFloat(String(row[keyCantidad]).replace(',', '.')) || 0
          };
        });

        // Solo dejamos filas que tengan al menos nombre de prenda
        const cleanData = mappedData.filter(d => d.prenda.length > 0);
        
        if (cleanData.length === 0) {
          alert("No se detectaron prendas en el archivo. Asegúrate de que la columna se llame 'prenda' o 'articulo'.");
          return;
        }

        console.log(`Cargadas ${cleanData.length} filas correctamente.`);
        onDataLoaded(cleanData);
        
        if (fileInputRef.current) fileInputRef.current.value = "";
        
      } catch (err) {
        console.error('Error detallado:', err);
        alert('Error al leer el archivo. Comprueba que no esté abierto en otra aplicación.');
      }
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="flex items-center">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".xlsx,.xls,.csv"
        className="hidden"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl text-sm font-black transition-all shadow-lg active:scale-95 border-b-4 border-blue-800"
      >
        <UploadCloud className="w-5 h-5" />
        <span>Importar Excel</span>
      </button>
    </div>
  );
};

export default FileUpload;
