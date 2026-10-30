import React, { useState, useEffect } from 'react';
import { X, Save, Calculator, AlertCircle, Calendar, Clock, MapPin, Phone, User, Music } from 'lucide-react';
import { Order } from '../types';
import { StorageService } from '../services/storage';

interface OrderFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (order: Order) => void;
  orderToEdit?: Order | null;
}

export const OrderFormModal: React.FC<OrderFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  orderToEdit
}) => {
  const [billNo, setBillNo] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [village, setVillage] = useState('');
  const [toVillage, setToVillage] = useState('');
  const [arrivalDateTime, setArrivalDateTime] = useState('');
  const [departureDateTime, setDepartureDateTime] = useState('');
  const [soundSetupType, setSoundSetupType] = useState('લગ્ન પ્રસંગ - વરઘોડો સ્પેશિયલ DJ & શાર્પી લાઈટ્સ');
  const [fixedPrice, setFixedPrice] = useState<number | ''>('');
  const [advanceAmount, setAdvanceAmount] = useState<number | ''>('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Auto calculate remaining balance
  const numFixed = typeof fixedPrice === 'number' ? fixedPrice : 0;
  const numAdvance = typeof advanceAmount === 'number' ? advanceAmount : 0;
  const remainingAmount = Math.max(0, numFixed - numAdvance);

  useEffect(() => {
    if (orderToEdit) {
      setBillNo(orderToEdit.billNo);
      setDate(orderToEdit.date);
      setClientName(orderToEdit.clientName);
      setClientPhone(orderToEdit.clientPhone);
      setVillage(orderToEdit.village);
      setToVillage(orderToEdit.toVillage);
      setArrivalDateTime(orderToEdit.arrivalDateTime);
      setDepartureDateTime(orderToEdit.departureDateTime);
      setSoundSetupType(orderToEdit.soundSetupType);
      setFixedPrice(orderToEdit.fixedPrice);
      setAdvanceAmount(orderToEdit.advanceAmount);
      setNotes(orderToEdit.notes || '');
    } else {
      setBillNo(StorageService.getNextBillNo());
      setDate(new Date().toISOString().split('T')[0]);
      setClientName('');
      setClientPhone('');
      setVillage('');
      setToVillage('');
      setArrivalDateTime('');
      setDepartureDateTime('');
      setSoundSetupType('લગ્ન પ્રસંગ - વરઘોડો સ્પેશિયલ DJ & શાર્પી લાઈટ્સ');
      setFixedPrice('');
      setAdvanceAmount('');
      setNotes('');
    }
    setError(null);
  }, [orderToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) {
      setError('કૃપા કરીને શ્રીમાનનું (ગ્રાહકનું) નામ દાખલ કરો.');
      return;
    }
    if (!clientPhone.trim() || clientPhone.replace(/\D/g, '').length < 10) {
      setError('કૃપા કરીને માન્ય ૧૦-આંકડાનો ગ્રાહકનો મોબાઈલ નંબર દાખલ કરો.');
      return;
    }
    if (!village.trim()) {
      setError('કૃપા કરીને ગામનું નામ દાખલ કરો.');
      return;
    }
    if (!fixedPrice || Number(fixedPrice) <= 0) {
      setError('કૃપા કરીને નક્કી કરેલ કિંમત (રૂ.) દાખલ કરો.');
      return;
    }

    const order: Order = {
      id: orderToEdit ? orderToEdit.id : `ord_${Date.now()}`,
      billNo: billNo || StorageService.getNextBillNo(),
      date,
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim(),
      village: village.trim(),
      toVillage: toVillage.trim() || village.trim(),
      arrivalDateTime: arrivalDateTime || `${date} 16:00`,
      departureDateTime: departureDateTime || `${date} 23:00`,
      soundSetupType,
      fixedPrice: Number(fixedPrice),
      advanceAmount: Number(advanceAmount) || 0,
      remainingAmount,
      notes: notes.trim(),
      status: remainingAmount === 0 && numFixed > 0 ? 'completed' : 'confirmed',
      createdAt: orderToEdit ? orderToEdit.createdAt : new Date().toISOString()
    };

    onSave(order);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#09132b] border border-[#d4af37]/50 rounded-2xl shadow-2xl overflow-hidden my-6">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#001f54] via-[#09132b] to-[#001f54] px-5 py-3.5 border-b border-[#d4af37]/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-[#d4af37]/20 text-[#f3c64c]">
              <Music className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                {orderToEdit ? 'ઓર્ડર સુધારો (Edit Order)' : 'નવો ઓર્ડર બુક કરો (New Booking)'}
              </h2>
              <p className="text-xs text-[#d4af37]">
                I. S. K Sound &amp; Live DJ • બીલ નં: <span className="font-mono font-bold text-white">{billNo}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mx-5 mt-4 p-3 rounded-lg bg-red-950/80 border border-red-500/40 flex items-center gap-2 text-xs text-red-200">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Booking Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-slate-200 text-xs sm:text-sm">
          
          {/* Row 1: Bill No & Booking Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-[#f3c64c] mb-1">
                ૧. બીલ નંબર (ઓટોમેટિક):
              </label>
              <input
                type="text"
                value={billNo}
                onChange={(e) => setBillNo(e.target.value)}
                className="w-full px-3 py-2 bg-[#060b18] border border-[#d4af37]/40 rounded-lg text-white font-mono font-bold text-sm focus:outline-none focus:border-[#f3c64c]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#f3c64c] mb-1">
                ૨. બુકિંગ તારીખ:
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-[#060b18] border border-slate-700 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-[#f3c64c]"
                required
              />
            </div>
          </div>

          {/* Row 2: Client Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#d4af37]" />
                ૩. શ્રીમાનનું નામ (ગ્રાહક):
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="દા.ત. પટેલ હરેશભાઈ કેશવલાલ"
                className="w-full px-3 py-2 bg-[#060b18] border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-[#f3c64c]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#d4af37]" />
                ૪. ગ્રાહકનો મોબાઈલ નંબર:
              </label>
              <input
                type="tel"
                maxLength={10}
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value.replace(/\D/g, ''))}
                placeholder="૯૮XXXXXXXX (૧૦ આંકડા)"
                className="w-full px-3 py-2 bg-[#060b18] border border-slate-700 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-[#f3c64c]"
                required
              />
            </div>
          </div>

          {/* Row 3: From Village & To Village */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
                ૫. ગામ (શરૂઆતનું સ્થળ):
              </label>
              <input
                type="text"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                placeholder="દા.ત. રાજેન્દ્રનગર"
                className="w-full px-3 py-2 bg-[#060b18] border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-[#f3c64c]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#f3c64c]" />
                ૬. ત્યાંથી બીજા ગામ સુધી (રૂટ / સ્થળ):
              </label>
              <input
                type="text"
                value={toVillage}
                onChange={(e) => setToVillage(e.target.value)}
                placeholder="દા.ત. શામળાજી (જાન પ્રસ્થાન)"
                className="w-full px-3 py-2 bg-[#060b18] border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-[#f3c64c]"
              />
            </div>
          </div>

          {/* Row 4: Arrival & Departure Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#d4af37]" />
                ૭. પહોંચવાનો સમય અને તારીખ:
              </label>
              <input
                type="text"
                value={arrivalDateTime}
                onChange={(e) => setArrivalDateTime(e.target.value)}
                placeholder="દા.ત. 15-11-2026 બપોરે 04:00 વાગ્યે"
                className="w-full px-3 py-2 bg-[#060b18] border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-[#f3c64c]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#d4af37]" />
                ૮. છૂટા કરવાનો સમય અને તારીખ:
              </label>
              <input
                type="text"
                value={departureDateTime}
                onChange={(e) => setDepartureDateTime(e.target.value)}
                placeholder="દા.ત. 16-11-2026 સવારે 06:00 વાગ્યે"
                className="w-full px-3 py-2 bg-[#060b18] border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-[#f3c64c]"
                required
              />
            </div>
          </div>

          {/* Setup Type Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              ૯. સાઉન્ડ સિસ્ટમ / ડીજે સેટઅપ પ્રકાર:
            </label>
            <select
              value={soundSetupType}
              onChange={(e) => setSoundSetupType(e.target.value)}
              className="w-full px-3 py-2 bg-[#060b18] border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-[#f3c64c]"
            >
              <option value="લગ્ન પ્રસંગ - વરઘોડો સ્પેશિયલ DJ & શાર્પી લાઈટ્સ">લગ્ન પ્રસંગ - વરઘોડો સ્પેશિયલ DJ &amp; શાર્પી લાઈટ્સ</option>
              <option value="રાસ-ગરબા અને સ્ટેજ લાઈવ સાઉન્ડ સિસ્ટમ">રાસ-ગરબા અને સ્ટેજ લાઈવ સાઉન્ડ સિસ્ટમ (મિક્સર + મોનિટર)</option>
              <option value="ટ્રેક્ટર DJ સેટઅપ (૪ બેઝ + ૪ ટોપ)">ટ્રેક્ટર DJ સેટઅપ (૪ બેઝ + ૪ ટોપ સ્પીકર્સ)</option>
              <option value="શોભાયાત્રા / સરઘસ અને ધાર્મિક ઉત્સવ DJ">શોભાયાત્રા / સરઘસ અને ધાર્મિક ઉત્સવ DJ</option>
              <option value="લાઈવ ઓર્કેસ્ટ્રા & મંડપ સાઉન્ડ સિસ્ટમ">લાઈવ ઓર્કેસ્ટ્રા &amp; મંડપ સાઉન્ડ સિસ્ટમ</option>
              <option value="જનરેટર અને ટ્રસ લાઈટિંગ સાથે ફૂલ સેટ">જનરેટર અને ટ્રસ લાઈટિંગ સાથે ફૂલ સેટ</option>
            </select>
          </div>

          {/* Financials: Fixed Price, Advance, and Auto-calculated Remaining Balance */}
          <div className="p-3.5 rounded-xl bg-[#001f54]/50 border border-[#d4af37]/35 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#f3c64c]">
              <Calculator className="w-4 h-4" />
              <span>હિસાબની ગણતરી (રૂપિયામાં):</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-slate-300 mb-1">
                  ૧૦. નક્કી કિંમત (₹):
                </label>
                <input
                  type="number"
                  min="0"
                  step="500"
                  value={fixedPrice}
                  onChange={(e) => setFixedPrice(e.target.value ? Number(e.target.value) : '')}
                  placeholder="દા.ત. 30000"
                  className="w-full px-3 py-2 bg-[#060b18] border border-slate-600 rounded-lg text-white font-mono font-bold text-base focus:outline-none focus:border-[#f3c64c]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">
                  ૧૧. એડવાન્સ જમા (₹):
                </label>
                <input
                  type="number"
                  min="0"
                  step="500"
                  value={advanceAmount}
                  onChange={(e) => setAdvanceAmount(e.target.value ? Number(e.target.value) : '')}
                  placeholder="દા.ત. 10000"
                  className="w-full px-3 py-2 bg-[#060b18] border border-slate-600 rounded-lg text-emerald-400 font-mono font-bold text-base focus:outline-none focus:border-[#f3c64c]"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">
                  ૧૨. બાકી રકમ (ઓટોમેટિક):
                </label>
                <div className={`w-full px-3 py-2 bg-[#060b18] border rounded-lg font-mono font-extrabold text-base flex items-center justify-between ${
                  remainingAmount > 0 
                    ? 'border-red-500/50 text-red-400' 
                    : 'border-emerald-500/50 text-emerald-400'
                }`}>
                  <span>₹ {remainingAmount.toLocaleString('en-IN')}</span>
                  <span className="text-[10px] font-sans font-normal opacity-75">
                    {remainingAmount > 0 ? 'બાકી' : 'ચૂકતે'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              ૧૩. સ્પેશિયલ નોંધ / શરતો:
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="જનરેટર ડીઝલ, માઈક સંખ્યા, અથવા ચોક્કસ સમય અંગેની વધારાની નોંધ..."
              className="w-full px-3 py-2 bg-[#060b18] border border-slate-700 rounded-lg text-white text-xs sm:text-sm focus:outline-none focus:border-[#f3c64c]"
            />
          </div>

          {/* Submit Actions */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors text-xs sm:text-sm"
            >
              રદ કરો
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-[#d4af37] to-[#f3c64c] text-[#070d1e] font-bold rounded-lg shadow-lg shadow-[#d4af37]/20 hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 text-xs sm:text-sm"
            >
              <Save className="w-4 h-4" />
              <span>{orderToEdit ? 'ઓર્ડર સાચવો' : 'ઓર્ડર બુક કરો'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
