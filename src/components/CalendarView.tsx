import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin, IndianRupee, FileText } from 'lucide-react';
import { Order } from '../types';

interface CalendarViewProps {
  orders: Order[];
  onSelectOrder: (order: Order) => void;
  onNewOrderForDate: (dateStr: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  orders,
  onSelectOrder,
  onNewOrderForDate
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNamesGujarati = [
    'જાન્યુઆરી', 'ફેબ્રુઆરી', 'માર્ચ', 'એપ્રિલ', 'મે', 'જૂન',
    'જુલાઈ', 'ઓગસ્ટ', 'સપ્ટેમ્બર', 'ઓક્ટોબર', 'નવેમ્બર', 'ડિસેમ્બર'
  ];

  const daysOfWeekGujarati = ['રવિ', 'સોમ', 'મંગળ', 'બુધ', 'ગુરુ', 'શુક્ર', 'શનિ'];

  // Calculate days in month
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Map orders by date: format "YYYY-MM-DD"
  const ordersByDate = orders.reduce((acc, order) => {
    const d = order.date;
    if (!acc[d]) acc[d] = [];
    acc[d].push(order);
    return acc;
  }, {} as Record<string, Order[]>);

  const selectedOrders = ordersByDate[selectedDateStr] || [];

  return (
    <div className="space-y-6">
      
      {/* Calendar Header Card */}
      <div className="bg-[#09132b] border border-[#d4af37]/40 rounded-2xl p-4 sm:p-6 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-[#f3c64c]" />
              <span>બુકિંગ કેલેન્ડર ડાયરી</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              તારીખ પ્રમાણે તમારા ડીજે અને સાઉન્ડ કાર્યક્રમોનું આયોજન
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrevMonth}
              className="p-2 rounded-lg bg-[#060b18] hover:bg-slate-800 text-slate-300 transition-colors border border-slate-700"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-base font-bold text-[#f3c64c] min-w-36 text-center font-serif">
              {monthNamesGujarati[month]} {year}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-2 rounded-lg bg-[#060b18] hover:bg-slate-800 text-slate-300 transition-colors border border-slate-700"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Days of Week */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-xs font-bold text-slate-400 py-3">
          {daysOfWeekGujarati.map((day, idx) => (
            <div key={idx} className={idx === 0 ? 'text-red-400' : ''}>
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {/* Empty cells before month starts */}
          {Array.from({ length: firstDayIndex }).map((_, idx) => (
            <div key={`empty-${idx}`} className="h-16 sm:h-20 bg-slate-900/20 rounded-xl"></div>
          ))}

          {/* Days of month */}
          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const dayNum = idx + 1;
            const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const dayOrders = ordersByDate[formattedDate] || [];
            const isBooked = dayOrders.length > 0;
            const isSelected = selectedDateStr === formattedDate;

            return (
              <button
                key={`day-${dayNum}`}
                onClick={() => setSelectedDateStr(formattedDate)}
                className={`h-16 sm:h-20 p-1 sm:p-2 rounded-xl text-left border transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#001f54] border-[#f3c64c] shadow-lg shadow-[#d4af37]/20 ring-1 ring-[#f3c64c]'
                    : isBooked
                    ? 'bg-[#0e1e42] border-[#d4af37]/50 hover:border-[#f3c64c]'
                    : 'bg-[#060b18] border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className={`text-xs sm:text-sm font-bold font-mono ${
                    isSelected ? 'text-[#f3c64c]' : isBooked ? 'text-white' : 'text-slate-400'
                  }`}>
                    {dayNum}
                  </span>
                  {isBooked && (
                    <span className="w-2 h-2 rounded-full bg-[#f3c64c] animate-pulse"></span>
                  )}
                </div>

                {isBooked ? (
                  <div className="truncate text-[10px] sm:text-[11px] font-medium text-[#f3c64c]">
                    <div className="truncate font-semibold">{dayOrders[0].village}</div>
                    <div className="truncate text-slate-300 hidden sm:block">{dayOrders[0].clientName.split(' ')[0]}</div>
                  </div>
                ) : (
                  <span className="text-[10px] text-slate-600 hidden sm:block">ઉપલબ્ધ</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Date Orders Showcase */}
      <div className="bg-[#09132b] border border-[#d4af37]/35 rounded-2xl p-4 sm:p-6 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span>તારીખ {selectedDateStr} ના બુકિંગ્સ</span>
              <span className="text-xs font-mono text-[#f3c64c] bg-[#001f54] px-2 py-0.5 rounded border border-[#d4af37]/30">
                {selectedOrders.length} ઓર્ડર
              </span>
            </h3>
          </div>

          <button
            onClick={() => onNewOrderForDate(selectedDateStr)}
            className="text-xs font-bold text-[#070d1e] bg-gradient-to-r from-[#d4af37] to-[#f3c64c] px-3.5 py-1.5 rounded-lg hover:brightness-110 transition-colors flex items-center gap-1.5"
          >
            <span>+ આ તારીખે નવો ઓર્ડર બુક કરો</span>
          </button>
        </div>

        {selectedOrders.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs sm:text-sm">
            <p>આ તારીખે કોઈ બુકિંગ નોંધાયેલ નથી.</p>
            <p className="text-slate-500 mt-1">આ દિવસે તમારી ડીજે સાઉન્ડ સિસ્ટમ ઉપલબ્ધ (Free) છે!</p>
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedOrders.map((order) => (
              <div
                key={order.id}
                className="p-4 rounded-xl bg-[#060b18] border border-[#d4af37]/40 space-y-2.5 hover:border-[#f3c64c] transition-all"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-[#f3c64c] bg-[#001f54] px-2 py-0.5 rounded">
                    {order.billNo}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    order.remainingAmount === 0 
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' 
                      : 'bg-red-950 text-red-300 border border-red-500/40'
                  }`}>
                    {order.remainingAmount === 0 ? 'ચૂકતે (Paid)' : `બાકી: ₹${order.remainingAmount.toLocaleString('en-IN')}`}
                  </span>
                </div>

                <div className="text-sm font-bold text-white">
                  {order.clientName}
                </div>

                <div className="space-y-1 text-xs text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                    <span>{order.village} {order.toVillage ? `થી ${order.toVillage}` : ''}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                    <span>પહોંચ: {order.arrivalDateTime}</span>
                  </div>
                  <div className="text-slate-400 text-[11px] truncate">
                    સેટઅપ: {order.soundSetupType}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="font-mono text-[#f3c64c] font-bold">
                    કુલ: ₹{order.fixedPrice.toLocaleString('en-IN')}
                  </span>
                  <button
                    onClick={() => onSelectOrder(order)}
                    className="text-xs text-[#f3c64c] hover:underline flex items-center gap-1"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>બીલ જુઓ / પ્રિન્ટ કરો</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
