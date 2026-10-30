import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { LoginModal } from './components/LoginModal';
import { OrderFormModal } from './components/OrderFormModal';
import { BillModal } from './components/BillModal';
import { StaffModal } from './components/StaffModal';
import { CalendarView } from './components/CalendarView';
import { BackupModal } from './components/BackupModal';
import { AndroidProjectModal } from './components/AndroidProjectModal';
import { Order, Staff, BusinessProfile } from './types';
import { StorageService, AuthState } from './services/storage';

export default function App() {
  const [profile, setProfile] = useState<BusinessProfile>(StorageService.getProfile());
  const [orders, setOrders] = useState<Order[]>(StorageService.getOrders());
  const [staff, setStaff] = useState<Staff[]>(StorageService.getStaff());
  const [authState, setAuthState] = useState<AuthState>(StorageService.getAuthState());

  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  
  // Modals state
  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);
  const [orderToEdit, setOrderToEdit] = useState<Order | null>(null);
  
  const [isBillOpen, setIsBillOpen] = useState(false);
  const [selectedOrderForBill, setSelectedOrderForBill] = useState<Order | null>(null);
  
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  const [isAndroidModalOpen, setIsAndroidModalOpen] = useState(false);

  // Sync to Storage on changes
  const handleSaveOrder = (newOrUpdatedOrder: Order) => {
    const existingIndex = orders.findIndex((o) => o.id === newOrUpdatedOrder.id);
    let updatedOrders: Order[];
    if (existingIndex >= 0) {
      updatedOrders = [...orders];
      updatedOrders[existingIndex] = newOrUpdatedOrder;
    } else {
      updatedOrders = [newOrUpdatedOrder, ...orders];
    }
    setOrders(updatedOrders);
    StorageService.saveOrders(updatedOrders);

    // Prompt to view the bill directly after saving
    setSelectedOrderForBill(newOrUpdatedOrder);
    setIsBillOpen(true);
  };

  const handleDeleteOrder = (orderId: string) => {
    const updated = orders.filter((o) => o.id !== orderId);
    setOrders(updated);
    StorageService.saveOrders(updated);
  };

  const handleSaveStaff = (updatedStaff: Staff[]) => {
    setStaff(updatedStaff);
    StorageService.saveStaff(updatedStaff);
  };

  const handleDataRestored = () => {
    setOrders(StorageService.getOrders());
    setStaff(StorageService.getStaff());
    setProfile(StorageService.getProfile());
  };

  const handleLogout = () => {
    StorageService.logout();
    setAuthState({
      isAuthenticated: false,
      phoneNumber: '',
      isOwner: false,
      loginTime: null
    });
  };

  const handleOpenNewOrder = () => {
    setOrderToEdit(null);
    setIsOrderFormOpen(true);
  };

  const handleEditOrder = (order: Order) => {
    setOrderToEdit(order);
    setIsOrderFormOpen(true);
  };

  const handleOpenBill = (order: Order) => {
    setSelectedOrderForBill(order);
    setIsBillOpen(true);
  };

  const handleNewOrderForDate = (dateStr: string) => {
    setOrderToEdit({
      id: '',
      billNo: StorageService.getNextBillNo(),
      date: dateStr,
      clientName: '',
      clientPhone: '',
      village: '',
      toVillage: '',
      arrivalDateTime: `${dateStr} 16:00`,
      departureDateTime: `${dateStr} 23:30`,
      soundSetupType: 'લગ્ન પ્રસંગ - વરઘોડો સ્પેશિયલ DJ & શાર્પી લાઈટ્સ',
      fixedPrice: 0,
      advanceAmount: 0,
      remainingAmount: 0,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    });
    setIsOrderFormOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#060b18] text-slate-100 flex flex-col font-sans">
      
      {/* App Header with Brand & Tabs */}
      <Header
        currentTab={currentTab}
        onTabChange={(tab) => {
          if (tab === 'staff') {
            setIsStaffModalOpen(true);
          } else if (tab === 'backup') {
            setIsBackupModalOpen(true);
          } else if (tab === 'android') {
            setIsAndroidModalOpen(true);
          } else {
            setCurrentTab(tab);
          }
        }}
        authState={authState}
        onOpenNewOrder={handleOpenNewOrder}
        onLogout={handleLogout}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-5 pb-12">
        {currentTab === 'calendar' ? (
          <CalendarView
            orders={orders}
            onSelectOrder={handleOpenBill}
            onNewOrderForDate={handleNewOrderForDate}
          />
        ) : (
          <Dashboard
            orders={orders}
            staff={staff}
            profile={profile}
            onOpenNewOrder={handleOpenNewOrder}
            onOpenOrder={handleOpenBill}
            onEditOrder={handleEditOrder}
            onDeleteOrder={handleDeleteOrder}
            onOpenCalendar={() => setCurrentTab('calendar')}
            onOpenStaff={() => setIsStaffModalOpen(true)}
            onOpenAndroid={() => setIsAndroidModalOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="no-print border-t border-[#d4af37]/20 bg-[#070d1e] py-4 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <span className="font-bold text-white font-serif">I. S. K Sound &amp; Live DJ</span> • ઓર્ડર બુક ડાયરી
          </div>
          <div>
            પ્રો. <strong className="text-[#f3c64c]">ભરત કે. (Bharat K)</strong> | મો. <span className="font-mono text-white">9624235014</span> | <span className="text-[#f3c64c]">દહેગામ, ગુજરાત</span>
          </div>
          <div className="text-[11px] text-slate-500">
            સુરક્ષિત ડેટાબેઝ • Jetpack Compose Native Android Project
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {/* 1. Login Modal (shown if unauthenticated) */}
      <LoginModal
        isOpen={!authState.isAuthenticated}
        onLoginSuccess={(newAuthState) => setAuthState(newAuthState)}
      />

      {/* 2. Order Form Modal */}
      <OrderFormModal
        isOpen={isOrderFormOpen}
        onClose={() => setIsOrderFormOpen(false)}
        onSave={handleSaveOrder}
        orderToEdit={orderToEdit}
      />

      {/* 3. Printable Bill & WhatsApp Modal */}
      <BillModal
        isOpen={isBillOpen}
        onClose={() => setIsBillOpen(false)}
        order={selectedOrderForBill}
        profile={profile}
      />

      {/* 4. Staff Management & Upad Modal */}
      <StaffModal
        isOpen={isStaffModalOpen}
        onClose={() => setIsStaffModalOpen(false)}
        staffList={staff}
        onSaveStaff={handleSaveStaff}
      />

      {/* 5. Backup & Security Modal */}
      <BackupModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
        onDataRestored={handleDataRestored}
      />

      {/* 6. Complete Android Studio Project & Signed APK Guide */}
      <AndroidProjectModal
        isOpen={isAndroidModalOpen}
        onClose={() => setIsAndroidModalOpen(false)}
      />
    </div>
  );
}
