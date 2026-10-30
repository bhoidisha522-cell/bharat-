import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Calendar, 
  Users, 
  Printer, 
  Share2, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  MapPin, 
  Phone, 
  IndianRupee,
  Sparkles,
  Smartphone
} from 'lucide-react';
import { Order, Staff, BusinessProfile } from '../types';

interface DashboardProps {
  orders: Order[];
  staff: Staff[];
  profile: BusinessProfile;
  onOpenNewOrder: () => void;
  onOpenOrder: (order: Order) => void;
  onEditOrder: (order: Order) => void;
  onDeleteOrder: (orderId: string) => void;
  onOpenCalendar: () => void;
  onOpenStaff: () => void;
  onOpenAndroid: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  orders,
  staff,
  profile,
  onOpenNewOrder,
  onOpenOrder,
  onEditOrder,
  onDeleteOrder,
  onOpenCalendar,
  onOpenStaff,
  onOpenAndroid
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed'>('all');

  // KPI Calculations
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.fixedPrice, 0);
  const totalAdvance = orders.reduce((sum, o) => sum + o.advanceAmount, 0);
  const totalPending = orders.reduce((sum, o) => sum + o.remainingAmount, 0);
  const totalStaffUpad = staff.reduce(
    (sum, s) => sum + s.upadList.reduce((uSum, u) => uSum + u.amount, 0),
    0
  );

  // Filtered orders list
  const filteredOrders = orders.filter((order) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      order.clientName.toLowerCase().includes(q) ||
      order.village.toLowerCase().includes(q) ||
      order.toVillage.toLowerCase().includes(q) ||
      order.billNo.toLowerCase().includes(q) ||
      order.clientPhone.includes(q);

    if (!matchesSearch) return false;

    if (filterStatus === 'pending') {
      return order.remainingAmount > 0;
    }
    if (filterStatus === 'completed') {
      return order.remainingAmount === 0 || order.status === 'completed';
    }
    return true;
  });

  // Upcoming Event Alert (Next earliest order)
  const todayStr = new Date().toISOString().split('T')[0];
  const upcomingOrder = orders
    .filter((o) => o.date >= todayStr)
    .sort((a, b) => a.date.localeCompare(b.date))[0];

  const handleWhatsAppQuickShare = (order: Order, e: React.MouseEvent) => {
    e.stopPropagation();
    const rawPhone = order.clientPhone.replace(/\D/g, '');
    const cleanPhone = rawPhone.length === 10 ? `91${rawPhone}` : rawPhone;
    const msg = `*|| શ્રી ગણેશાય નમઃ ||*
*I. S. K Sound & Live DJ – ઓર્ડર પહોંચ*
બીલ નંબર: ${order.billNo}
ગ્રાહક: ${order.clientName}
ગામ: ${order.village} -> ${order.toVillage}
તારીખ: ${order.date} (પહોંચ: ${order.arrivalDateTime})
સાઉન્ડ પ્રકાર: ${order.soundSetupType}
કુલ કિંમત: ₹${order.fixedPrice}
એડવાન્સ: ₹${order.advanceAmount}
*બાકી રકમ: ₹${order.remainingAmount}*
પ્રો. ભરત કે. (મો. 9624235014)`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Welcome & Quick Actions Strip */}
      <div className="bg-gradient-to-r from-[#001f54] via-[#09132b] to-[#001f54] border border-[#d4af37]/40 rounded-2xl p-4 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#f3c64c]">
              <span>|| શ્રી ગણેશાય નમઃ || || જય માતાજી ||</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white font-serif mt-0.5">
              I. S. K Sound &amp; Live DJ
            </h1>
            <p className="text-xs text-slate-300">
              માલિક: <strong className="text-white">શ્રી ભરત કે.</strong> | મો. <span className="font-mono text-[#f3c64c] font-bold">9624235014</span> | <span className="text-[#f3c64c] font-semibold">દહેગામ, ગુજરાત</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onOpenNewOrder}
              className="px-4 py-2 bg-gradient-to-r from-[#d4af37] to-[#f3c64c] text-[#070d1e] font-extrabold text-xs sm:text-sm rounded-xl hover:brightness-110 active:scale-95 transition-all shadow-md flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>નવો ઓર્ડર બુક કરો</span>
            </button>

            <button
              onClick={onOpenCalendar}
              className="px-3 py-2 bg-[#060b18] hover:bg-slate-800 text-slate-200 border border-[#d4af37]/40 rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5"
            >
              <Calendar className="w-4 h-4 text-[#f3c64c]" />
              <span>કેલેન્ડર</span>
            </button>

            <button
              onClick={onOpenStaff}
              className="px-3 py-2 bg-[#060b18] hover:bg-slate-800 text-slate-200 border border-[#d4af37]/40 rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5"
            >
              <Users className="w-4 h-4 text-[#f3c64c]" />
              <span>સ્ટાફ ઉપાડ</span>
            </button>

            <button
              onClick={onOpenAndroid}
              className="px-3 py-2 bg-[#060b18] hover:bg-slate-800 text-[#f3c64c] border border-[#d4af37]/60 rounded-xl text-xs sm:text-sm font-bold transition-colors flex items-center gap-1.5"
            >
              <Smartphone className="w-4 h-4" />
              <span>APK ગાઇડ</span>
            </button>
          </div>
        </div>

        {/* Ambient subtle glow background */}
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Upcoming Event Alert Banner */}
      {upcomingOrder && (
        <div className="p-3.5 sm:p-4 rounded-xl bg-[#0e1d42] border border-[#d4af37]/50 shadow-md flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#d4af37]/20 text-[#f3c64c]">
              <Clock className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-[#f3c64c] uppercase tracking-wider">
                આગામી નજીકનો પ્રોગ્રામ:
              </div>
              <div className="font-bold text-white text-sm sm:text-base">
                {upcomingOrder.clientName} • {upcomingOrder.village}
              </div>
              <div className="text-slate-300 text-xs">
                પહોંચવાનો સમય: <strong className="text-white font-mono">{upcomingOrder.arrivalDateTime}</strong>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenOrder(upcomingOrder)}
              className="px-3 py-1.5 bg-[#d4af37] text-[#070d1e] font-bold text-xs rounded-lg hover:brightness-110 transition-colors shadow"
            >
              બીલ &amp; વિગત જુઓ
            </button>
          </div>
        </div>
      )}

      {/* KPI Financial Cards (Grid of 5 metrics) */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        
        {/* Metric 1: Total Orders */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-[#09132b] border border-slate-800 space-y-1">
          <div className="text-slate-400 text-xs font-medium">કુલ ઓર્ડર્સ</div>
          <div className="text-xl sm:text-2xl font-black text-white font-mono">{totalOrders}</div>
          <div className="text-[11px] text-[#f3c64c]">ડાયરીમાં નોંધાયેલ</div>
        </div>

        {/* Metric 2: Total Revenue */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-[#09132b] border border-slate-800 space-y-1">
          <div className="text-slate-400 text-xs font-medium">કુલ નક્કી આવક</div>
          <div className="text-xl sm:text-2xl font-black text-white font-mono">
            ₹ {totalRevenue.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-400">કુલ પ્રોગ્રામ બિલિંગ</div>
        </div>

        {/* Metric 3: Collected Advance */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-[#09132b] border border-slate-800 space-y-1">
          <div className="text-slate-400 text-xs font-medium">જમા થયેલ એડવાન્સ</div>
          <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
            ₹ {totalAdvance.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-emerald-400">હાથ પર આવેલ રોકડ</div>
        </div>

        {/* Metric 4: Total Outstanding (Pending Balance) */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-[#09132b] border border-[#d4af37]/40 space-y-1 shadow-md shadow-red-950/20">
          <div className="text-red-400 text-xs font-bold">બાકી ઉઘરાણી</div>
          <div className="text-xl sm:text-2xl font-black text-red-400 font-mono">
            ₹ {totalPending.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-red-300">ગ્રાહક પાસેથી લેવાની</div>
        </div>

        {/* Metric 5: Staff Upad */}
        <div className="col-span-2 lg:col-span-1 p-3.5 sm:p-4 rounded-2xl bg-[#09132b] border border-slate-800 space-y-1">
          <div className="text-slate-400 text-xs font-medium">સ્ટાફ કુલ ઉપાડ</div>
          <div className="text-xl sm:text-2xl font-black text-amber-300 font-mono">
            ₹ {totalStaffUpad.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-amber-400/80">ચૂકવાયેલ એડવાન્સ</div>
        </div>
      </div>

      {/* Order Diary Section: Live Search & Filter Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4 text-[#f3c64c]" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="નામ, ગામ, મોબાઈલ અથવા બીલ નંબરથી સર્ચ..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#09132b] border border-slate-700 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-[#f3c64c] transition-colors"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-[#09132b] border border-slate-800 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                filterStatus === 'all'
                  ? 'bg-[#d4af37] text-[#070d1e] font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              બધા ({orders.length})
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                filterStatus === 'pending'
                  ? 'bg-red-500 text-white font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              બાકી પેમેન્ટ ({orders.filter((o) => o.remainingAmount > 0).length})
            </button>
            <button
              onClick={() => setFilterStatus('completed')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                filterStatus === 'completed'
                  ? 'bg-emerald-600 text-white font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ચૂકતે ({orders.filter((o) => o.remainingAmount === 0).length})
            </button>
          </div>
        </div>

        {/* Orders Cards Grid */}
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center bg-[#09132b] rounded-2xl border border-slate-800 text-slate-400 text-sm space-y-2">
            <p>કોઈ મેળ ખાતો ઓર્ડર મળ્યો નથી.</p>
            <button
              onClick={onOpenNewOrder}
              className="text-[#f3c64c] underline font-bold hover:brightness-110"
            >
              + નવો ઓર્ડર બુક કરો
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredOrders.map((order) => {
              const hasPending = order.remainingAmount > 0;
              return (
                <div
                  key={order.id}
                  onClick={() => onOpenOrder(order)}
                  className="group relative p-4 rounded-2xl bg-[#09132b] border border-slate-800 hover:border-[#d4af37]/80 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-xl hover:shadow-[#d4af37]/5 flex flex-col justify-between space-y-3"
                >
                  {/* Card Header: Bill No & Payment Status Badge */}
                  <div>
                    <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800/80">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#f3c64c] bg-[#001f54] px-2.5 py-0.5 rounded border border-[#d4af37]/30">
                          {order.billNo}
                        </span>
                        <span className="text-slate-400 font-mono text-[11px]">
                          {order.date}
                        </span>
                      </div>

                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          hasPending
                            ? 'bg-red-950/90 text-red-300 border border-red-500/40'
                            : 'bg-emerald-950/90 text-emerald-300 border border-emerald-500/40'
                        }`}
                      >
                        {hasPending ? `બાકી: ₹${order.remainingAmount.toLocaleString('en-IN')}` : 'પૂર્ણ ચૂકતે'}
                      </span>
                    </div>

                    {/* Client Name & Phone */}
                    <div className="mt-2.5">
                      <h3 className="font-bold text-base text-white group-hover:text-[#f3c64c] transition-colors leading-tight">
                        {order.clientName}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-slate-300 font-mono mt-0.5">
                        <Phone className="w-3.5 h-3.5 text-[#d4af37]" />
                        <span>{order.clientPhone}</span>
                      </div>
                    </div>

                    {/* Village Route */}
                    <div className="mt-2 space-y-1 text-xs text-slate-300">
                      <div className="flex items-start gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#d4af37] shrink-0 mt-0.5" />
                        <span className="font-medium text-white">
                          {order.village} {order.toVillage && `➡️ ${order.toVillage}`}
                        </span>
                      </div>
                      <div className="flex items-start gap-1.5 text-slate-400 text-[11px]">
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <span>પહોંચ: {order.arrivalDateTime}</span>
                      </div>
                    </div>

                    {/* Setup Type */}
                    <div className="mt-2.5 px-2.5 py-1.5 rounded-lg bg-[#060b18] border border-slate-800 text-[11px] text-slate-300 truncate">
                      <span className="text-[#f3c64c] font-semibold">સેટઅપ:</span> {order.soundSetupType}
                    </div>
                  </div>

                  {/* Card Financials & Quick Actions */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <div>
                      <div className="text-[10px] text-slate-400">કુલ કિંમત:</div>
                      <div className="font-mono font-bold text-white text-sm">
                        ₹ {order.fixedPrice.toLocaleString('en-IN')}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* Quick WhatsApp Share Button */}
                      <button
                        onClick={(e) => handleWhatsAppQuickShare(order, e)}
                        className="p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors shadow"
                        title="વોટ્સએપ પર બીલ મોકલો"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>

                      {/* View & Print Bill */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenOrder(order);
                        }}
                        className="p-1.5 bg-[#d4af37] hover:brightness-110 text-[#070d1e] rounded-lg transition-colors shadow"
                        title="ગુજરાતી બીલ જુઓ / પ્રિન્ટ કરો"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>

                      {/* Edit Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditOrder(order);
                        }}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors"
                        title="ઓર્ડર સુધારો"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm(`શું તમે ખરેખર ${order.clientName} (બીલ નં. ${order.billNo}) નો ઓર્ડર રદ કરવા માંગો છો?`)) {
                            onDeleteOrder(order.id);
                          }
                        }}
                        className="p-1.5 bg-slate-800 hover:bg-red-950 text-slate-400 hover:text-red-400 rounded-lg transition-colors"
                        title="ઓર્ડર કાઢી નાખો"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
