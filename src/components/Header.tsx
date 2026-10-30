import React from 'react';
import { 
  Calendar as CalendarIcon, 
  Users, 
  ShieldCheck, 
  Smartphone, 
  PlusCircle, 
  LayoutDashboard, 
  FileText,
  Lock,
  LogOut
} from 'lucide-react';
import { AuthState } from '../services/storage';

interface HeaderProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  authState: AuthState;
  onOpenNewOrder: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  authState,
  onOpenNewOrder,
  onLogout
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#070d1e]/95 backdrop-blur-md border-b border-[#d4af37]/25 shadow-lg shadow-black/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          
          {/* Brand Wordmark & Emblem */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="relative w-11 h-11 rounded-full p-[2px] bg-gradient-to-tr from-[#d4af37] via-[#f3c64c] to-[#996515] shadow-md">
              <img 
                src="/src/assets/images/isk_sound_logo_1793339507815.jpg" 
                alt="I.S.K Sound Logo" 
                className="w-full h-full object-cover rounded-full bg-[#070d1e]"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#f7e096] via-[#f3c64c] to-[#d4af37] font-serif">
                  I. S. K Sound &amp; Live DJ
                </span>
                <span className="hidden sm:inline-block text-[11px] font-semibold text-[#f3c64c] border border-[#d4af37]/40 px-2 py-0.5 rounded-sm">
                  ઓર્ડર ડાયરી
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium">
                પ્રો. ભરત કે. <span className="text-[#d4af37] font-semibold">| ૯૬૨૪૨૩૫૦૧૪</span>
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-medium">
            <button
              onClick={() => onTabChange('dashboard')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                currentTab === 'dashboard'
                  ? 'bg-[#d4af37] text-[#070d1e] font-bold shadow'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>ડેશબોર્ડ</span>
            </button>

            <button
              onClick={() => onTabChange('orders')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                currentTab === 'orders'
                  ? 'bg-[#d4af37] text-[#070d1e] font-bold shadow'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>ઓર્ડર્સ હિસાબ</span>
            </button>

            <button
              onClick={() => onTabChange('calendar')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                currentTab === 'calendar'
                  ? 'bg-[#d4af37] text-[#070d1e] font-bold shadow'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <CalendarIcon className="w-4 h-4" />
              <span>બુકિંગ કેલેન્ડર</span>
            </button>

            <button
              onClick={() => onTabChange('staff')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                currentTab === 'staff'
                  ? 'bg-[#d4af37] text-[#070d1e] font-bold shadow'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>સ્ટાફ &amp; ઉપાડ</span>
            </button>

            <button
              onClick={() => onTabChange('backup')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                currentTab === 'backup'
                  ? 'bg-[#d4af37] text-[#070d1e] font-bold shadow'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>ડેટા બેકઅપ</span>
            </button>

            <button
              onClick={() => onTabChange('android')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 border border-[#d4af37]/50 ${
                currentTab === 'android'
                  ? 'bg-[#d4af37] text-[#070d1e] font-bold shadow'
                  : 'text-[#f3c64c] hover:bg-[#d4af37]/15'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>Android APK</span>
            </button>
          </nav>

          {/* Right Action: New Order Button + Lock/Logout */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenNewOrder}
              className="bg-gradient-to-r from-[#d4af37] to-[#f3c64c] text-[#070d1e] px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md shadow-[#d4af37]/20 hover:brightness-110 active:scale-95 transition-all"
            >
              <PlusCircle className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden xs:inline">નવો ઓર્ડર બુક</span>
              <span className="xs:hidden">નવો ઓર્ડર</span>
            </button>

            {authState.isAuthenticated && (
              <button
                onClick={onLogout}
                title="સુરક્ષિત લૉક આઉટ કરો"
                className="p-2 text-slate-400 hover:text-[#f3c64c] hover:bg-slate-800/50 rounded-lg transition-colors"
                aria-label="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Top Sub-bar with tabs */}
      <div className="lg:hidden flex items-center gap-1 overflow-x-auto px-4 py-2 border-t border-slate-800/80 bg-[#060b18] text-xs font-medium no-scrollbar">
        {[
          { id: 'dashboard', label: 'ડેશબોર્ડ', icon: LayoutDashboard },
          { id: 'orders', label: 'ઓર્ડર્સ', icon: FileText },
          { id: 'calendar', label: 'કેલેન્ડર', icon: CalendarIcon },
          { id: 'staff', label: 'સ્ટાફ ઉપાડ', icon: Users },
          { id: 'backup', label: 'બેકઅપ', icon: ShieldCheck },
          { id: 'android', label: 'APK પ્રોજેક્ટ', icon: Smartphone }
        ].map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`px-2.5 py-1 rounded-md shrink-0 flex items-center gap-1.5 transition-colors ${
                isActive 
                  ? 'bg-[#d4af37] text-[#070d1e] font-bold' 
                  : 'text-slate-300 hover:text-white bg-slate-900/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
