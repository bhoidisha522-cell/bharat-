import React, { useRef } from 'react';
import { X, Printer, Share2, Copy, Check, Phone, MapPin, Calendar, Clock, Music } from 'lucide-react';
import { Order, BusinessProfile } from '../types';

interface BillModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  profile: BusinessProfile;
}

export const BillModal: React.FC<BillModalProps> = ({
  isOpen,
  onClose,
  order,
  profile
}) => {
  const [copied, setCopied] = React.useState(false);
  const billRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsAppShare = () => {
    const rawPhone = order.clientPhone.replace(/\D/g, '');
    const cleanPhone = rawPhone.length === 10 ? `91${rawPhone}` : rawPhone;
    
    const message = `*|| શ્રી ગણેશાય નમઃ || || જય માતાજી ||*
*I. S. K Sound & Live DJ – બુકિંગ બિલ / પહોંચ*
━━━━━━━━━━━━━━━━━━━━
📄 *બીલ નંબર:* ${order.billNo}
📅 *તારીખ:* ${order.date}
👤 *ગ્રાહક:* ${order.clientName}
📍 *સ્થળ:* ${order.village} ${order.toVillage ? 'થી ' + order.toVillage : ''}
⏰ *પહોંચવાનો સમય:* ${order.arrivalDateTime}
⏰ *છૂટા કરવાનો સમય:* ${order.departureDateTime}
🎵 *સેટઅપ:* ${order.soundSetupType}

💰 *હિસાબ વિગત:*
• નક્કી કરેલ કિંમત: ₹ ${order.fixedPrice.toLocaleString('en-IN')}
• જમા એડવાન્સ: ₹ ${order.advanceAmount.toLocaleString('en-IN')}
• *બાકી ચૂકવવાની રકમ:* ₹ ${order.remainingAmount.toLocaleString('en-IN')}
${order.notes ? `\n📝 *નોંધ:* ${order.notes}` : ''}
━━━━━━━━━━━━━━━━━━━━
🙏 *સંપર્ક & બુકિંગ:*
*${profile.businessName}*
પ્રો. ${profile.ownerName}
📞 મો. ${profile.authorizedMobile}
${profile.address}`;

    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleCopyText = () => {
    const message = `*I. S. K Sound & Live DJ – બુકિંગ બિલ*
બીલ નંબર: ${order.billNo}
તારીખ: ${order.date}
ગ્રાહક: ${order.clientName} (મો. ${order.clientPhone})
ગામ: ${order.village} -> ${order.toVillage}
પહોંચવાનો સમય: ${order.arrivalDateTime}
છૂટા કરવાનો સમય: ${order.departureDateTime}
નક્કી કિંમત: ₹${order.fixedPrice}
એડવાન્સ જમા: ₹${order.advanceAmount}
બાકી રકમ: ₹${order.remainingAmount}
પ્રો. ભરત કે. (મો. 9624235014)`;

    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white text-slate-900 rounded-2xl shadow-2xl overflow-hidden my-4 border-2 border-[#d4af37]">
        
        {/* Modal Action Bar (Hidden in Print) */}
        <div className="no-print bg-[#070d1e] text-white px-4 py-3 flex items-center justify-between border-b border-[#d4af37]/40">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#f3c64c] uppercase tracking-wider">
              ગુજરાતી બીલ પ્રિન્ટ &amp; શેર
            </span>
            <span className="text-xs text-slate-400 font-mono">
              #{order.billNo}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-[#d4af37] text-[#070d1e] font-bold text-xs rounded-lg hover:brightness-110 flex items-center gap-1.5 transition-colors shadow"
              title="PDF ડાઉનલોડ અથવા પ્રિન્ટ કરો"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>PDF / પ્રિન્ટ</span>
            </button>

            <button
              onClick={handleWhatsAppShare}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 transition-colors shadow"
              title="ગ્રાહકને વોટ્સએપ પર બીલ મોકલો"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>WhatsApp શેર</span>
            </button>

            <button
              onClick={handleCopyText}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg flex items-center gap-1 transition-colors"
              title="ટેક્સ્ટ કોપી કરો"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE BILL CONTAINER */}
        <div ref={billRef} className="print-bill-container p-6 sm:p-8 bg-white text-slate-900 font-sans">
          
          {/* Top Devotional Heading */}
          <div className="text-center pb-2 border-b border-amber-900/20">
            <p className="text-xs font-bold tracking-widest text-amber-900">
              || શ્રી ગણેશાય નમઃ || || જય માતાજી || || જય ચેહર માં ||
            </p>
          </div>

          {/* Grand Header */}
          <div className="flex items-center justify-between gap-4 py-4 border-b-2 border-[#001f54]">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-[#d4af37] via-[#001f54] to-[#d4af37] shrink-0">
                <img 
                  src="/src/assets/images/isk_sound_logo_1793339507815.jpg" 
                  alt="I.S.K Sound" 
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#001f54] font-serif">
                  {profile.businessName}
                </h1>
                <p className="text-xs font-semibold text-amber-800">
                  હાઈ-ડેસિબલ DJ સાઉન્ડ • લાઈવ સ્ટેજ પ્રોગ્રામ • વરઘોડો • શાર્પી લાઈટ્સ &amp; ટ્રસ
                </p>
                <p className="text-[11px] text-slate-600">
                  {profile.address}
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <div className="bg-[#001f54] text-white px-3 py-1 rounded text-xs font-bold font-mono">
                ઓર્ડર બુકિંગ બીલ
              </div>
              <p className="text-xs font-bold text-slate-900 mt-1">
                પ્રો. {profile.ownerName}
              </p>
              <p className="text-xs font-bold text-[#001f54] font-mono">
                મો. {profile.authorizedMobile}
              </p>
            </div>
          </div>

          {/* Meta Information Grid (Bill No, Date, Client Details) */}
          <div className="grid grid-cols-2 gap-4 py-3.5 border-b border-slate-200 text-xs">
            <div className="space-y-1">
              <p>
                <span className="font-bold text-slate-700">શ્રીમાનનું નામ: </span>
                <strong className="text-slate-900 text-sm">{order.clientName}</strong>
              </p>
              <p>
                <span className="font-bold text-slate-700">ગ્રાહકનો મોબાઈલ: </span>
                <span className="font-mono font-bold text-slate-900">{order.clientPhone}</span>
              </p>
              <p>
                <span className="font-bold text-slate-700">ગામ (સ્થળ): </span>
                <span className="text-slate-900 font-medium">{order.village}</span>
              </p>
              {order.toVillage && (
                <p>
                  <span className="font-bold text-slate-700">ત્યાંથી બીજા ગામ સુધી: </span>
                  <span className="text-slate-900 font-medium">{order.toVillage}</span>
                </p>
              )}
            </div>

            <div className="space-y-1 text-right">
              <p>
                <span className="font-bold text-slate-700">બીલ નંબર: </span>
                <strong className="font-mono text-sm text-[#001f54]">{order.billNo}</strong>
              </p>
              <p>
                <span className="font-bold text-slate-700">તારીખ: </span>
                <span className="font-mono text-slate-900">{order.date}</span>
              </p>
              <p>
                <span className="font-bold text-slate-700">પહોંચવાનો સમય: </span>
                <span className="text-slate-900">{order.arrivalDateTime}</span>
              </p>
              <p>
                <span className="font-bold text-slate-700">છૂટા કરવાનો સમય: </span>
                <span className="text-slate-900">{order.departureDateTime}</span>
              </p>
            </div>
          </div>

          {/* Setup Type */}
          <div className="py-2.5 px-3 my-3 bg-amber-50 border border-amber-200 rounded text-xs">
            <span className="font-bold text-amber-900">સાઉન્ડ / ડીજે સેટઅપ: </span>
            <span className="text-amber-950 font-semibold">{order.soundSetupType}</span>
            {order.notes && (
              <span className="block mt-1 text-slate-600 text-[11px]">
                <strong className="text-slate-700">નોંધ: </strong> {order.notes}
              </span>
            )}
          </div>

          {/* Accounts Table */}
          <div className="mt-3">
            <table className="w-full text-xs text-left border-collapse border border-slate-300">
              <thead>
                <tr className="bg-[#001f54] text-white">
                  <th className="border border-slate-300 p-2 text-center w-12">ક્રમ</th>
                  <th className="border border-slate-300 p-2">કાર્યક્રમ અને હિસાબ વિગત</th>
                  <th className="border border-slate-300 p-2 text-right w-36">રકમ (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="border border-slate-300 p-2.5 text-center font-mono">૧</td>
                  <td className="border border-slate-300 p-2.5">
                    <strong>{order.soundSetupType}</strong>
                    <div className="text-[11px] text-slate-500">
                      રૂટ: {order.village} થી {order.toVillage || order.village} | પૂર્ણ કાર્યક્રમ
                    </div>
                  </td>
                  <td className="border border-slate-300 p-2.5 text-right font-mono font-bold">
                    ₹ {order.fixedPrice.toLocaleString('en-IN')}
                  </td>
                </tr>

                <tr className="bg-slate-50 font-medium">
                  <td colSpan={2} className="border border-slate-300 p-2 text-right text-slate-700">
                    કુલ નક્કી કિંમત (Total Amount):
                  </td>
                  <td className="border border-slate-300 p-2 text-right font-mono font-bold text-slate-900">
                    ₹ {order.fixedPrice.toLocaleString('en-IN')}
                  </td>
                </tr>

                <tr className="bg-emerald-50 text-emerald-900">
                  <td colSpan={2} className="border border-slate-300 p-2 text-right font-bold">
                    જમા થયેલ એડવાન્સ રકમ (Advance Paid):
                  </td>
                  <td className="border border-slate-300 p-2 text-right font-mono font-bold text-emerald-700">
                    - ₹ {order.advanceAmount.toLocaleString('en-IN')}
                  </td>
                </tr>

                <tr className="bg-amber-100 text-[#001f54] text-sm">
                  <td colSpan={2} className="border border-slate-300 p-2.5 text-right font-black">
                    બાકી ચૂકવવાની રકમ (Remaining Balance):
                  </td>
                  <td className="border border-slate-300 p-2.5 text-right font-mono font-black text-red-700 text-base">
                    ₹ {order.remainingAmount.toLocaleString('en-IN')}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Terms and Conditions */}
          <div className="mt-4 pt-3 border-t border-slate-300 text-[10px] text-slate-600 space-y-1">
            <p className="font-bold text-slate-800">નિયમો અને શરતો:</p>
            {profile.terms.map((term, idx) => (
              <p key={idx}>{term}</p>
            ))}
          </div>

          {/* Signatures */}
          <div className="mt-8 pt-4 flex items-end justify-between text-xs">
            <div className="text-center">
              <div className="w-36 border-b border-slate-400 mb-1"></div>
              <p className="font-bold text-slate-700">ગ્રાહકની સહી</p>
            </div>

            <div className="text-center">
              <p className="font-bold text-slate-900 font-serif mb-1">
                I. S. K Sound &amp; Live DJ
              </p>
              <div className="w-40 border-b border-slate-400 mb-1"></div>
              <p className="font-bold text-slate-900">ભરત કે. (પ્રોપરાઈટર)</p>
              <p className="text-[10px] text-slate-500 font-mono">મો. ૯૬૨૪૨૩૫૦૧૪</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
