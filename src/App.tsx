/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { 
  ClipboardCopy, 
  Trash2, 
  FileText, 
  Settings, 
  Send, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Package,
  MapPin,
  Phone,
  User,
  LayoutGrid,
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { parseBengaliOrders, ParsedOrder } from './services/geminiService';
import { CSV_COLUMNS } from './constants';

export default function App() {
  const [inputText, setInputText] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [orders, setOrders] = useState<ParsedOrder[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleParse = async () => {
    if (!inputText.trim()) return;
    
    setIsParsing(true);
    setError(null);
    try {
      const results = await parseBengaliOrders(inputText);
      setOrders(results);
      // Auto-scroll to results
      setTimeout(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      setError(err.message || 'Failed to parse orders. Please check your API key.');
    } finally {
      setIsParsing(false);
    }
  };

  const copyToClipboard = () => {
    if (orders.length === 0) return;
    const csvHeader = CSV_COLUMNS.join(',');
    const csvContent = orders.map(o => o.rawCsvRow).join('\n');
    const fullCsv = `${csvHeader}\n${csvContent}`;
    
    navigator.clipboard.writeText(fullCsv);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadCSV = () => {
    if (orders.length === 0) return;
    const csvHeader = CSV_COLUMNS.join(',');
    const csvContent = orders.map(o => o.rawCsvRow).join('\n');
    const fullCsv = `${csvHeader}\n${csvContent}`;
    
    const blob = new Blob([fullCsv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const clearAll = () => {
    setInputText('');
    setOrders([]);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg shadow-indigo-200 shadow-lg">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-slate-900 tracking-tight text-lg">Bengali Order Parser</h1>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Operational Data Tool</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Input Section */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ClipboardCopy className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-semibold text-slate-700">Paste Daily Order Text</span>
            </div>
            <button 
              onClick={clearAll}
              className="text-xs font-medium text-slate-400 hover:text-red-500 flex items-center gap-1 transition-colors"
            >
              <Trash2 className="w-3 h-3" /> Clear Text
            </button>
          </div>
          <div className="p-6 space-y-4">
            <textarea
              className="w-full h-80 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-slate-700 font-mono text-sm leading-relaxed"
              placeholder="পাসব করা অর্ডারের লেখা এখানে দিন..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <div className="flex justify-end">
              <button
                onClick={handleParse}
                disabled={isParsing || !inputText.trim()}
                className={`
                  flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all shadow-lg
                  ${isParsing || !inputText.trim() 
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' 
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 shadow-indigo-200'}
                `}
              >
                {isParsing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Parsing...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Parse Orders
                  </>
                )}
              </button>
            </div>
          </div>
        </section>

        {/* Error Display */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-center gap-3 text-red-700"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Section */}
        <div ref={scrollRef}>
          <AnimatePresence>
            {orders.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <h2 className="font-bold text-slate-800">Parsed Results ({orders.length})</h2>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={copyToClipboard}
                      className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
                    >
                      {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <ClipboardCopy className="w-4 h-4" />}
                      {copied ? 'Copied!' : 'Copy CSV'}
                    </button>
                    <button
                      onClick={downloadCSV}
                      className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 border border-slate-900 rounded-lg text-sm font-semibold text-white hover:bg-slate-900 transition-colors shadow-sm"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </div>
                </div>

                <div className="grid gap-6">
                  {orders.map((order, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
                    >
                      <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Order #{idx + 1}</span>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded uppercase">
                            {order.salesPerson}
                          </span>
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded uppercase">
                            {order.orderStatus}
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Customer Info */}
                        <div className="space-y-4">
                          <div className="flex items-start gap-3">
                            <User className="w-4 h-4 mt-1 text-slate-400" />
                            <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Customer</p>
                              <p className="text-sm font-bold text-slate-900">{order.name}</p>
                              <p className="text-xs text-slate-500">Order by: {order.orderPerson}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <Phone className="w-4 h-4 mt-1 text-slate-400" />
                            <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Contact</p>
                              <p className="text-sm font-medium text-slate-700">{order.mobileNumber}</p>
                            </div>
                          </div>
                        </div>

                        {/* Location Info */}
                        <div className="space-y-4 lg:col-span-2">
                          <div className="flex items-start gap-3">
                            <MapPin className="w-4 h-4 mt-1 text-slate-400" />
                            <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Shipping Details</p>
                              <p className="text-sm text-slate-700 leading-relaxed">{order.detailAddress}</p>
                              <div className="flex gap-2 mt-2">
                                <span className="px-1.5 py-0.5 bg-slate-100 text-[10px] font-semibold text-slate-600 rounded">Dist: {order.district}</span>
                                <span className="px-1.5 py-0.5 bg-slate-100 text-[10px] font-semibold text-slate-600 rounded">Thana: {order.thana}</span>
                                <span className="px-1.5 py-0.5 bg-slate-100 text-[10px] font-semibold text-slate-600 rounded">{order.orderCountry}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Product Info */}
                        <div className="space-y-4">
                          <div className="flex items-start gap-3">
                            <Package className="w-4 h-4 mt-1 text-slate-400" />
                            <div className="w-full">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Product & Bill</p>
                              <p className="text-sm font-bold text-indigo-600 mb-1">{order.orderSet.replace(/_/g, ' ')}</p>
                              <div className="flex items-center justify-between border-t border-slate-100 pt-2 mt-2">
                                <span className="text-xs text-slate-500 font-medium">Qty: {order.qty}</span>
                                <span className="text-sm font-black text-slate-900">৳ {order.total}</span>
                              </div>
                              {order.note && (
                                <p className="mt-3 p-2 bg-amber-50 text-[11px] text-amber-800 rounded border border-amber-100 italic">
                                  Note: {order.note}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Raw CSV Row (Collapsible/Hidden ideally) */}
                      <div className="px-6 py-3 bg-slate-900 text-[10px] font-mono text-slate-400 truncate">
                        CSV: {order.rawCsvRow}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {!isParsing && orders.length === 0 && !error && (
          <div className="py-20 text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full text-slate-300">
              <LayoutGrid className="w-8 h-8" />
            </div>
            <div>
              <p className="text-slate-500 font-medium tracking-tight">No orders parsed yet</p>
              <p className="text-xs text-slate-400">Your results will appear here in a structured format</p>
            </div>
          </div>
        )}
      </main>

      <footer className="max-w-7xl mx-auto px-4 py-12 border-t border-slate-200">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            &copy; 2026 Bengali Order Processing System • AI Studio Build
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors uppercase">Documentation</a>
            <a href="#" className="text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors uppercase">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
