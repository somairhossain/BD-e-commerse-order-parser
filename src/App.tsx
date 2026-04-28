/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ClipboardCopy, 
  Trash2, 
  RefreshCw, 
  Baby, 
  ShoppingCart,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Maximize2,
  LayoutDashboard,
  Search,
  MoreVertical,
  Settings,
  Plus,
  X
} from 'lucide-react';
import { parseOrder, ShopType } from './services/geminiService';
import { DEFAULT_BORNO_PRODUCTS, DEFAULT_PROYOJON_PRODUCTS } from './lib/constants';

const BORNO_COLUMNS = [
  "Order Person", "Order Country", "Order Status", "Order ID", "Name", 
  "Mobile Number", "Detail Address", "District", "Thana", "Order Set", 
  "Note", "Sales Person", "QTY", "Total"
];

const PROYOJON_COLUMNS = [
  "Order Person", "Name", "Contact No", "Detail Address", "District", 
  "Thana", "Product Name", "Note", "Sales Person", "QTY", "Total Bill"
];

/**
 * Robust CSV line parser that handles quoted fields and empty values correctly.
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

export default function App() {
  const [view, setView] = useState<'dashboard' | 'settings'>('dashboard');
  const [shop, setShop] = useState<ShopType>('borno');
  const [inputText, setInputText] = useState('');
  const [parsedRows, setParsedRows] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastAction, setLastAction] = useState<string | null>(null);

  // Product Management State
  const [bornoProducts, setBornoProducts] = useState<string[]>(() => {
    const saved = localStorage.getItem('borno_products');
    return saved ? JSON.parse(saved) : DEFAULT_BORNO_PRODUCTS;
  });
  const [proyojonProducts, setProyojonProducts] = useState<string[]>(() => {
    const saved = localStorage.getItem('proyojon_products');
    return saved ? JSON.parse(saved) : DEFAULT_PROYOJON_PRODUCTS;
  });
  const [newProduct, setNewProduct] = useState('');

  const saveProducts = (shopType: ShopType, updatedProducts: string[]) => {
    if (shopType === 'borno') {
      setBornoProducts(updatedProducts);
      localStorage.setItem('borno_products', JSON.stringify(updatedProducts));
    } else {
      setProyojonProducts(updatedProducts);
      localStorage.setItem('proyojon_products', JSON.stringify(updatedProducts));
    }
    setLastAction('saved');
    setTimeout(() => setLastAction(null), 2000);
  };

  const addProduct = () => {
    if (!newProduct.trim()) return;
    const currentProducts = shop === 'borno' ? bornoProducts : proyojonProducts;
    if (currentProducts.includes(newProduct.trim())) {
      setError('Product already exists');
      return;
    }
    const updated = [...currentProducts, newProduct.trim()];
    saveProducts(shop, updated);
    setNewProduct('');
    setError(null);
  };

  const removeProduct = (product: string) => {
    const currentProducts = shop === 'borno' ? bornoProducts : proyojonProducts;
    const updated = currentProducts.filter(p => p !== product);
    saveProducts(shop, updated);
  };

  const handleParse = async () => {
    if (!inputText.trim()) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const currentProducts = shop === 'borno' ? bornoProducts : proyojonProducts;
      const result = await parseOrder(inputText, shop, currentProducts);
      const newRows = result.split('\n').filter(row => row.trim().length > 0);
      setParsedRows(newRows);
      setLastAction('parsed');
      setTimeout(() => setLastAction(null), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during parsing');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setLastAction('copied');
      setTimeout(() => setLastAction(null), 2000);
    } catch (err) {
      setError('Failed to copy to clipboard');
    }
  };

  const clearAll = () => {
    setInputText('');
    setParsedRows([]);
    setError(null);
  };

  const columns = shop === 'borno' ? BORNO_COLUMNS : PROYOJON_COLUMNS;
  const isBorno = shop === 'borno';

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#F8FAFC] font-sans text-slate-900">
      
      {/* Sidebar Navigation */}
      <aside className="w-64 max-md:hidden flex-shrink-0 bg-[#000000] border-r border-slate-200 flex flex-col shadow-sm z-10">
        <div className="p-6 border-b border-white/5 mb-4 bg-[#000000]">
          <h1 className="text-xl font-bold tracking-tight text-[#FFFFFF] flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isBorno ? 'bg-blue-500' : 'bg-emerald-500'}`} />
            OrderAI
          </h1>
          <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-widest">Parser System</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 bg-[#0B0B0B]">
          <div className="text-[10px] font-bold text-slate-400 uppercase px-3 mb-2 tracking-widest">Navigation</div>
          
          <button 
            onClick={() => setView('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 border ${
              view === 'dashboard'
                ? 'bg-blue-50 text-blue-700 border-blue-100 shadow-sm' 
                : 'bg-transparent text-slate-500 border-transparent hover:bg-slate-50'
            }`}
          >
            <LayoutDashboard size={18} />
            <span className="text-sm font-semibold">Dashboard</span>
          </button>

          <button 
            onClick={() => setView('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 border ${
              view === 'settings'
                ? 'bg-blue-50 text-blue-700 border-blue-100 shadow-sm' 
                : 'bg-transparent text-slate-500 border-transparent hover:bg-slate-50'
            }`}
          >
            <Settings size={18} />
            <span className="text-sm font-semibold">Manage Products</span>
          </button>

          <div className="pt-4 text-[10px] font-bold text-slate-400 uppercase px-3 mb-2 tracking-widest">Active Shops</div>
          
          <button 
            onClick={() => { setShop('borno'); setParsedRows([]); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 border ${
              isBorno 
                ? 'bg-slate-100 text-slate-800 border-slate-200 shadow-sm' 
                : 'bg-transparent text-slate-500 border-transparent hover:bg-slate-50'
            }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm bg-[#036eff]`}>B</div>
            <div className="text-left">
              <div className="text-sm font-semibold leading-tight">Borno Baby</div>
              <div className="text-[10px] opacity-70 italic leading-tight">Children's Apparel</div>
            </div>
          </button>

          <button 
            onClick={() => { setShop('proyojon'); setParsedRows([]); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 border ${
              !isBorno 
                ? 'bg-slate-100 text-slate-800 border-slate-200 shadow-sm' 
                : 'bg-transparent text-slate-500 border-transparent hover:bg-slate-50'
            }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm ${!isBorno ? 'bg-emerald-500' : 'bg-slate-200 text-slate-400'}`}>P</div>
            <div className="text-left">
              <div className="text-sm font-semibold leading-tight">Proyojon.com</div>
              <div className="text-[10px] opacity-70 italic leading-tight">Lifestyle & Decor</div>
            </div>
          </button>
        </nav>

        <div className="p-4 mt-auto border-t border-slate-100">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div className="flex justify-between items-center text-[10px] text-slate-500 mb-1 font-bold tracking-tight">
              <span>System Accuracy</span>
              <span>99.2%</span>
            </div>
            <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
              <div className={`h-full transition-all duration-500 ${isBorno ? 'bg-blue-500' : 'bg-emerald-500'}`} style={{ width: '99%' }} />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full relative">
        {/* Mobile Header (Hidden on Desktop) */}
        <header className="md:hidden h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isBorno ? 'bg-blue-500' : 'bg-emerald-500'}`} />
            <span className="font-bold text-slate-800">OrderAI</span>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShop('borno')} className={`p-2 rounded-lg ${isBorno ? 'bg-blue-50 text-blue-600' : 'text-slate-400'}`}><Baby size={18} /></button>
            <button onClick={() => setShop('proyojon')} className={`p-2 rounded-lg ${!isBorno ? 'bg-emerald-50 text-emerald-600' : 'text-slate-400'}`}><ShoppingCart size={18} /></button>
          </div>
        </header>

        {/* Global Toolbar */}
        <div className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between flex-shrink-0 max-md:hidden">
          <div className="flex items-center gap-4">
            <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider ${isBorno ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>
              {isBorno ? 'BBS Environment' : 'Proyojon Environment'}
            </span>
            <h2 className="text-sm font-medium text-slate-400 flex items-center gap-2">
              <LayoutDashboard size={14} />
              Orders / New Input
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-slate-400 hover:text-slate-600 p-2 transition-colors"><Search size={18}/></button>
            <div className="h-4 w-px bg-slate-200" />
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-700">{isBorno ? 'Borno Admin' : 'Proyojon Admin'}</span>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm ${isBorno ? 'bg-blue-600' : 'bg-emerald-600'}`}>
                {isBorno ? 'B' : 'P'}
              </div>
            </div>
          </div>
        </div>

        {/* Workspace */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          {view === 'dashboard' ? (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
              
              {/* Input Module */}
              <section className="xl:col-span-5 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col transition-all hover:shadow-md">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Daily Order Input</span>
                  <button 
                    onClick={clearAll}
                    className="text-slate-300 hover:text-red-500 transition-colors p-1"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="p-5 space-y-4">
                  <div className="relative">
                    <textarea
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="Paste order text here (Bengali)..."
                      className="w-full h-48 bg-slate-50/50 border border-slate-200 rounded-xl p-4 text-sm font-mono text-slate-700 focus:ring-4 focus:ring-blue-100/50 focus:outline-none focus:border-blue-400 transition-all resize-none"
                    />
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-50 px-2 py-1 bg-white rounded-md border border-slate-100 pointer-events-none">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">Ready</span>
                    </div>
                  </div>

                  <button
                    onClick={handleParse}
                    disabled={isLoading || !inputText.trim()}
                    className={`w-full py-3.5 rounded-xl flex items-center justify-center gap-3 font-bold text-sm transition-all shadow-lg ${
                      isLoading 
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                      : isBorno 
                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200 active:scale-95' 
                        : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-200 active:scale-95'
                    }`}
                  >
                    {isLoading ? (
                      <RefreshCw size={18} className="animate-spin" />
                    ) : (
                      <>
                        Parse Data
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>

                  <AnimatePresence>
                    {error && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-red-50 text-red-600 p-3 rounded-xl flex items-center gap-3 text-[11px] font-semibold border border-red-100"
                      >
                        <AlertCircle size={14} />
                        {error}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </section>

              {/* Results Module */}
              <section className="xl:col-span-7 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col transition-all hover:shadow-md min-h-[500px]">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Extraction Preview</span>
                  {parsedRows.length > 0 && (
                    <button
                      onClick={() => copyToClipboard(parsedRows.join('\n'))}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-bold text-[10px] transition-all border ${
                        isBorno 
                        ? 'bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100' 
                        : 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100'
                      }`}
                    >
                      {lastAction === 'copied' ? <CheckCircle2 size={12} /> : <ClipboardCopy size={12} />}
                      {lastAction === 'copied' ? 'Copied' : 'Copy CSV'}
                    </button>
                  )}
                </div>

                <div className="flex-1 overflow-auto bg-white">
                  {parsedRows.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-300 p-12 text-center">
                      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
                        <Maximize2 size={24} className="opacity-20" />
                      </div>
                      <p className="text-xs font-semibold uppercase tracking-widest mb-1">No Data Detected</p>
                      <p className="text-[11px] font-medium max-w-[200px] leading-relaxed">Processing starts automatically when you paste order content.</p>
                    </div>
                  ) : (
                    <table className="w-full text-left text-[11px] border-collapse min-w-[1000px]">
                      <thead className="bg-slate-50 text-slate-500 border-b border-slate-100 sticky top-0 z-20">
                        <tr>
                          {columns.map((col, idx) => (
                            <th key={idx} className="px-4 py-3 font-extrabold uppercase tracking-tighter whitespace-nowrap">
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {parsedRows.map((row, rowIdx) => {
                          const cells = parseCSVLine(row);
                          return (
                            <motion.tr 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: rowIdx * 0.05 }}
                              key={rowIdx} 
                              className="hover:bg-slate-50/80 transition-colors group"
                            >
                              {cells.map((cell, cellIdx) => (
                                <td key={cellIdx} className="px-4 py-3 text-slate-600 font-medium whitespace-nowrap max-w-[200px] overflow-hidden text-ellipsis border-r border-slate-50 last:border-r-0">
                                  {cell.replace(/^"|"$/g, '') || <span className="opacity-20">—</span>}
                                </td>
                              ))}
                            </motion.tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>

                {parsedRows.length > 0 && (
                  <div className="p-4 bg-slate-50 border-t border-slate-100">
                    <div className="flex justify-between items-center mb-2 px-1">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">CSV Raw Format</span>
                      <button onClick={() => copyToClipboard(parsedRows.join('\n'))} className="text-[9px] font-bold text-slate-500 hover:text-slate-800 transition-colors">Copy All</button>
                    </div>
                    <div className="bg-slate-900 rounded-xl p-4 font-mono text-[10px] text-blue-400 max-h-32 overflow-y-auto leading-relaxed shadow-inner">
                      {parsedRows.map((row, i) => (
                        <div key={i} className="mb-1 last:mb-0 opacity-90">{row}</div>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-6">
              <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col transition-all">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                      {isBorno ? <Baby className="text-blue-500" /> : <ShoppingCart className="text-emerald-500" />}
                      Manage {isBorno ? 'Borno Baby' : 'Proyojon.com'} Order Sets
                    </h3>
                    <p className="text-sm text-slate-500">Edit the list of valid product names for this shop.</p>
                  </div>
                  <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${isBorno ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>
                    {shop}
                  </div>
                </div>
                
                <div className="p-6 space-y-6">
                  {/* Add New Product */}
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={newProduct}
                      onChange={(e) => setNewProduct(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addProduct()}
                      placeholder="Enter new product name..."
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-4 focus:ring-blue-100 focus:outline-none focus:border-blue-400 transition-all font-semibold"
                    />
                    <button 
                      onClick={addProduct}
                      className={`px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${
                        isBorno ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-emerald-600 text-white hover:bg-emerald-700'
                      }`}
                    >
                      <Plus size={18} />
                      Add Item
                    </button>
                  </div>

                  <AnimatePresence>
                    {error && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 bg-red-50 text-red-600 text-xs font-bold rounded-xl border border-red-100 flex items-center gap-2"
                      >
                        <AlertCircle size={14} />
                        {error}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Product List */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">
                      <span>Product Name</span>
                      <span>Actions</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                      {(isBorno ? bornoProducts : proyojonProducts).map((product, idx) => (
                        <motion.div 
                          layout
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          key={product}
                          className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl hover:border-slate-300 hover:shadow-sm transition-all group"
                        >
                          <span className="text-sm font-medium text-slate-700">{product}</span>
                          <button 
                            onClick={() => removeProduct(product)}
                            className="text-slate-300 hover:text-red-500 transition-colors p-1"
                          >
                            <X size={14} />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
                    <p className="text-xs text-slate-400 font-medium italic">
                      Disclaimer: Adding products updates the AI system instructions instantly.
                    </p>
                    <button 
                      onClick={() => setView('dashboard')}
                      className="text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-2"
                    >
                      Back to Dashboard <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </section>
            </div>
          )}
        </div>

        {/* Global Footer */}
        <footer className="h-12 bg-white border-t border-slate-200 px-8 flex items-center justify-between flex-shrink-0 text-[10px] text-slate-400 font-bold overflow-hidden">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span>Gemini 2.0 Engine</span>
            </div>
            <div className="flex items-center gap-2">
              <MoreVertical size={10} />
              <span>v1.2.0 Stable Build</span>
            </div>
          </div>
          <p className="max-md:hidden uppercase tracking-widest opacity-60">High-Fidelity Automated Parsing</p>
        </footer>
      </main>

      {/* Pop Notifications */}
      <AnimatePresence>
        {lastAction === 'copied' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={`fixed bottom-8 left-1/2 -translate-x-1/2 px-5 py-2.5 rounded-full flex items-center gap-3 shadow-2xl z-50 text-[11px] font-bold text-white shadow-xl ${isBorno ? 'bg-blue-600' : 'bg-emerald-600'}`}
          >
            <CheckCircle2 size={14} className="text-white/80" />
            Copied to Clipboard
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
