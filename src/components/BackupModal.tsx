import React, { useState } from 'react';
import { X, Download, Upload, ShieldCheck, Database, Copy, Check, CheckCircle2, AlertTriangle, FileCode } from 'lucide-react';
import { StorageService } from '../services/storage';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataRestored: () => void;
}

export const BackupModal: React.FC<BackupModalProps> = ({
  isOpen,
  onClose,
  onDataRestored
}) => {
  const [copiedRules, setCopiedRules] = useState(false);
  const [importStatus, setImportStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  if (!isOpen) return null;

  const handleDownloadBackup = () => {
    const jsonString = StorageService.exportBackup();
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dateStr = new Date().toISOString().split('T')[0];
    link.href = url;
    link.download = `ISK_Sound_DJ_Backup_${dateStr}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = StorageService.importBackup(content);
      if (res.success) {
        setImportStatus({ type: 'success', message: res.message });
        onDataRestored();
      } else {
        setImportStatus({ type: 'error', message: res.message });
      }
    };
    reader.readAsText(file);
  };

  const firestoreRules = StorageService.getFirestoreRules();

  const handleCopyRules = () => {
    navigator.clipboard.writeText(firestoreRules);
    setCopiedRules(true);
    setTimeout(() => setCopiedRules(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#09132b] border border-[#d4af37]/50 rounded-2xl shadow-2xl overflow-hidden my-6 text-slate-200">
        
        {/* Header */}
        <div className="bg-[#001f54] px-5 py-3.5 border-b border-[#d4af37]/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-[#d4af37]/20 text-[#f3c64c]">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                ડેટા સુરક્ષા, બેકઅપ &amp; Firebase ક્લાઉડ
              </h2>
              <p className="text-xs text-[#d4af37]">
                I. S. K Sound &amp; Live DJ • ઑફલાઇન સંગ્રહ અને ઓનલાઇન બેકઅપ
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-5 max-h-[75vh] overflow-y-auto text-xs sm:text-sm">
          
          {/* Status Banner */}
          <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-white">ઑફલાઇન સુરક્ષિત ડેટા સંગ્રહ સક્રિય છે</h3>
              <p className="text-xs text-slate-300 mt-0.5">
                તમારો તમામ ઓર્ડર અને સ્ટાફનો હિસાબ સ્થાનિક સ્ટોરેજમાં આપમેળે સુરક્ષિત રહે છે. ગામડાઓમાં ઇન્ટરનેટ નેટવર્ક ન હોય તો પણ ડાયરી કોઈપણ ખલેલ વગર ચાલે છે.
              </p>
            </div>
          </div>

          {importStatus && (
            <div className={`p-3 rounded-lg border flex items-center gap-2 text-xs ${
              importStatus.type === 'success'
                ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-200'
                : 'bg-red-950/80 border-red-500/50 text-red-200'
            }`}>
              {importStatus.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              )}
              <span>{importStatus.message}</span>
            </div>
          )}

          {/* Backup & Restore Action Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Export Backup Card */}
            <div className="p-4 rounded-xl bg-[#060b18] border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-[#f3c64c] font-bold text-sm">
                <Download className="w-4 h-4" />
                <span>બેકઅપ ડાઉનલોડ કરો</span>
              </div>
              <p className="text-xs text-slate-400">
                તમામ ઓર્ડર, બીલ અને સ્ટાફ હિસાબની એક સુરક્ષિત JSON ફાઇલ તમારા મોબાઇલ/કમ્પ્યુટરમાં સેવ કરો.
              </p>
              <button
                onClick={handleDownloadBackup}
                className="w-full py-2.5 bg-gradient-to-r from-[#d4af37] to-[#f3c64c] text-[#070d1e] font-bold text-xs rounded-lg hover:brightness-110 transition-colors shadow"
              >
                સંપૂર્ણ બેકઅપ ડાઉનલોડ કરો (JSON)
              </button>
            </div>

            {/* Import Restore Card */}
            <div className="p-4 rounded-xl bg-[#060b18] border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-[#f3c64c] font-bold text-sm">
                <Upload className="w-4 h-4" />
                <span>બેકઅપ રીસ્ટોર કરો</span>
              </div>
              <p className="text-xs text-slate-400">
                અગાઉ ડાઉનલોડ કરેલ બેકઅપ ફાઇલ અપલોડ કરીને તમામ ઓર્ડર અને સ્ટાફ ડેટા પાછો મેળવો.
              </p>
              <label className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center cursor-pointer border border-slate-700">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <span>ફાઇલ પસંદ કરી રીસ્ટોર કરો</span>
              </label>
            </div>
          </div>

          {/* Firestore Security Rules Display */}
          <div className="p-4 rounded-xl bg-[#060b18] border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
                <span>Firebase Cloud Firestore Security Rules</span>
              </div>
              <button
                onClick={handleCopyRules}
                className="text-xs text-[#f3c64c] hover:underline flex items-center gap-1 font-semibold"
              >
                {copiedRules ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedRules ? 'કોપી થયું!' : 'રૂલ્સ કોપી કરો'}</span>
              </button>
            </div>
            
            <p className="text-xs text-slate-400">
              આ નિયમો ફક્ત ભરત કે. (9624235014) ને જ રીડ અને રાઇટ અધિકાર આપે છે. બહારના કોઈપણ યુઝર માટે ડેટા સુરક્ષિત બ્લોક રહે છે:
            </p>

            <pre className="p-3 bg-black/60 rounded-lg text-[11px] font-mono text-[#f3c64c] overflow-x-auto border border-slate-800 leading-relaxed max-h-48">
              {firestoreRules}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
