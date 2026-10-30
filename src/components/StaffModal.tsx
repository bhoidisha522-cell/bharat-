import React, { useState } from 'react';
import { X, UserPlus, IndianRupee, CalendarCheck, Phone, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { Staff, UpadRecord, AttendanceRecord } from '../types';

interface StaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  staffList: Staff[];
  onSaveStaff: (staff: Staff[]) => void;
}

export const StaffModal: React.FC<StaffModalProps> = ({
  isOpen,
  onClose,
  staffList,
  onSaveStaff
}) => {
  const [selectedStaffId, setSelectedStaffId] = useState<string>(staffList[0]?.id || '');
  const [activeTab, setActiveTab] = useState<'upad' | 'attendance' | 'newStaff'>('upad');
  
  // New Staff form state
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newRole, setNewRole] = useState('મુખ્ય DJ ઓપરેટર');
  const [newSalary, setNewSalary] = useState<number | ''>(1000);

  // New Upad state
  const [upadAmount, setUpadAmount] = useState<number | ''>('');
  const [upadDate, setUpadDate] = useState(new Date().toISOString().split('T')[0]);
  const [upadReason, setUpadReason] = useState('રોકડ ઉપાડ / ઘરખર્ચ');
  const [paymentMode, setPaymentMode] = useState<'રોકડ' | 'ઓનલાઇન (GPay/UPI)'>('રોકડ');

  // New Attendance state
  const [attDate, setAttDate] = useState(new Date().toISOString().split('T')[0]);
  const [attStatus, setAttStatus] = useState<'હાજર' | 'ગેરહાજર' | 'અડધો દિવસ'>('હાજર');
  const [attNotes, setAttNotes] = useState('');

  if (!isOpen) return null;

  const selectedStaff = staffList.find(s => s.id === selectedStaffId) || staffList[0];

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newStaffMember: Staff = {
      id: `stf_${Date.now()}`,
      name: newName.trim(),
      phone: newPhone.trim(),
      role: newRole,
      dailySalary: Number(newSalary) || 0,
      joinedDate: new Date().toISOString().split('T')[0],
      upadList: [],
      attendanceList: []
    };

    const updated = [...staffList, newStaffMember];
    onSaveStaff(updated);
    setSelectedStaffId(newStaffMember.id);
    setNewName('');
    setNewPhone('');
    setActiveTab('upad');
  };

  const handleAddUpad = (e: React.FormEvent) => {
    e.preventDefault();
    if (!upadAmount || Number(upadAmount) <= 0 || !selectedStaff) return;

    const newUpad: UpadRecord = {
      id: `upd_${Date.now()}`,
      date: upadDate,
      amount: Number(upadAmount),
      reason: upadReason.trim(),
      paymentMode
    };

    const updatedList = staffList.map(s => {
      if (s.id === selectedStaff.id) {
        return {
          ...s,
          upadList: [newUpad, ...(s.upadList || [])]
        };
      }
      return s;
    });

    onSaveStaff(updatedList);
    setUpadAmount('');
  };

  const handleAddAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStaff) return;

    const newAtt: AttendanceRecord = {
      id: `att_${Date.now()}`,
      date: attDate,
      status: attStatus,
      notes: attNotes.trim()
    };

    const updatedList = staffList.map(s => {
      if (s.id === selectedStaff.id) {
        return {
          ...s,
          attendanceList: [newAtt, ...(s.attendanceList || [])]
        };
      }
      return s;
    });

    onSaveStaff(updatedList);
    setAttNotes('');
  };

  const handleDeleteUpad = (upadId: string) => {
    if (!selectedStaff) return;
    const updatedList = staffList.map(s => {
      if (s.id === selectedStaff.id) {
        return {
          ...s,
          upadList: s.upadList.filter(u => u.id !== upadId)
        };
      }
      return s;
    });
    onSaveStaff(updatedList);
  };

  // Staff summary calculations
  const totalUpad = selectedStaff ? selectedStaff.upadList.reduce((acc, u) => acc + u.amount, 0) : 0;
  const presentDays = selectedStaff ? selectedStaff.attendanceList.filter(a => a.status === 'હાજર').length : 0;
  const halfDays = selectedStaff ? selectedStaff.attendanceList.filter(a => a.status === 'અડધો દિવસ').length : 0;
  const effectiveDays = presentDays + halfDays * 0.5;
  const earnedSalary = selectedStaff ? effectiveDays * selectedStaff.dailySalary : 0;
  const netDue = earnedSalary - totalUpad;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#09132b] border border-[#d4af37]/50 rounded-2xl shadow-2xl overflow-hidden my-6 text-slate-200">
        
        {/* Header */}
        <div className="bg-[#001f54] px-5 py-3.5 border-b border-[#d4af37]/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-[#d4af37]/20 text-[#f3c64c]">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                સ્ટાફ ડાયરી &amp; ઉપાડ હિસાબ
              </h2>
              <p className="text-xs text-[#d4af37]">
                I. S. K Sound &amp; Live DJ • કર્મચારી હાજરી અને ઉપાડ રજિસ્ટર
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-5 max-h-[75vh] overflow-y-auto">
          
          {/* Left Column: Staff Selector & Add Staff */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#f3c64c] uppercase tracking-wide">સ્ટાફ લિસ્ટ</span>
              <button
                onClick={() => setActiveTab('newStaff')}
                className="text-xs font-semibold text-[#f3c64c] hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>નવો ઉમેરો</span>
              </button>
            </div>

            <div className="space-y-2">
              {staffList.map((staff) => {
                const staffUpad = staff.upadList.reduce((acc, u) => acc + u.amount, 0);
                const isSelected = selectedStaff?.id === staff.id;
                return (
                  <button
                    key={staff.id}
                    onClick={() => {
                      setSelectedStaffId(staff.id);
                      if (activeTab === 'newStaff') setActiveTab('upad');
                    }}
                    className={`w-full text-left p-3 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-[#001f54] border-[#d4af37] shadow-md shadow-[#d4af37]/10'
                        : 'bg-[#060b18] border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-bold text-sm text-white">{staff.name}</div>
                    <div className="text-xs text-slate-400">{staff.role}</div>
                    <div className="mt-1 flex items-center justify-between text-xs">
                      <span className="text-slate-500">રોજ: ₹{staff.dailySalary}</span>
                      <span className="text-red-400 font-mono font-bold">ઉપાડ: ₹{staffUpad}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Details, Upad & Attendance */}
          <div className="md:col-span-2 space-y-4">
            
            {activeTab === 'newStaff' ? (
              <form onSubmit={handleAddStaff} className="p-4 rounded-xl bg-[#060b18] border border-slate-700 space-y-3">
                <h3 className="text-sm font-bold text-[#f3c64c] flex items-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  <span>નવા સ્ટાફની નોંધણી કરો</span>
                </h3>

                <div>
                  <label className="block text-xs text-slate-300 mb-1">સ્ટાફનું નામ:</label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="દા.ત. અજય પરમાર"
                    className="w-full px-3 py-2 bg-[#0a1228] border border-slate-700 rounded-lg text-white text-xs sm:text-sm"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">મોબાઈલ નંબર:</label>
                    <input
                      type="tel"
                      maxLength={10}
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value.replace(/\D/g, ''))}
                      placeholder="98XXXXXXXX"
                      className="w-full px-3 py-2 bg-[#0a1228] border border-slate-700 rounded-lg text-white text-xs sm:text-sm font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">રોજ / મહેનતાણું (₹):</label>
                    <input
                      type="number"
                      value={newSalary}
                      onChange={(e) => setNewSalary(e.target.value ? Number(e.target.value) : '')}
                      placeholder="1000"
                      className="w-full px-3 py-2 bg-[#0a1228] border border-slate-700 rounded-lg text-white text-xs sm:text-sm font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-300 mb-1">કામગીરીનો પ્રકાર:</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0a1228] border border-slate-700 rounded-lg text-white text-xs sm:text-sm"
                  >
                    <option value="મુખ્ય DJ ઓપરેટર">મુખ્ય DJ ઓપરેટર</option>
                    <option value="સાઉન્ડ એન્જિનિયર & મિક્સર">સાઉન્ડ એન્જિનિયર &amp; મિક્સર</option>
                    <option value="DJ વાહન ચાલક (ડ્રાઈવર)">DJ વાહન ચાલક (ડ્રાઈવર)</option>
                    <option value="શાર્પી & લાઈટ્સ ટેકનિશિયન">શાર્પી &amp; લાઈટ્સ ટેકનિશિયન</option>
                    <option value="સ્પીકર સેટઅપ હેલ્પર">સ્પીકર સેટઅપ હેલ્પર</option>
                  </select>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('upad')}
                    className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                  >
                    રદ કરો
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#d4af37] text-[#070d1e] font-bold text-xs rounded-lg hover:brightness-110"
                  >
                    સ્ટાફ સેવ કરો
                  </button>
                </div>
              </form>
            ) : selectedStaff ? (
              <>
                {/* Staff Summary Card */}
                <div className="p-3.5 rounded-xl bg-[#001f54]/60 border border-[#d4af37]/35 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div>
                    <h3 className="text-base font-bold text-white">{selectedStaff.name}</h3>
                    <p className="text-slate-400">{selectedStaff.role} • મો. {selectedStaff.phone || 'N/A'}</p>
                    <p className="text-[#f3c64c] font-semibold mt-0.5">દૈનિક રોજ: ₹{selectedStaff.dailySalary}</p>
                  </div>
                  <div className="flex gap-4 text-right">
                    <div>
                      <div className="text-slate-400 text-[11px]">કુલ ઉપાડ:</div>
                      <div className="text-base font-bold font-mono text-red-400">₹ {totalUpad.toLocaleString('en-IN')}</div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-[11px]">હાજર દિવસ:</div>
                      <div className="text-base font-bold font-mono text-emerald-400">{effectiveDays} દિવસ</div>
                    </div>
                  </div>
                </div>

                {/* Sub Tabs: Upad vs Attendance */}
                <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs">
                  <button
                    onClick={() => setActiveTab('upad')}
                    className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-colors ${
                      activeTab === 'upad'
                        ? 'bg-[#d4af37] text-[#070d1e]'
                        : 'text-slate-300 hover:text-white bg-[#060b18]'
                    }`}
                  >
                    <IndianRupee className="w-3.5 h-3.5" />
                    <span>ઉપાડ હિસાબ ({selectedStaff.upadList.length})</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('attendance')}
                    className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-colors ${
                      activeTab === 'attendance'
                        ? 'bg-[#d4af37] text-[#070d1e]'
                        : 'text-slate-300 hover:text-white bg-[#060b18]'
                    }`}
                  >
                    <CalendarCheck className="w-3.5 h-3.5" />
                    <span>હાજરી રજિસ્ટર ({selectedStaff.attendanceList.length})</span>
                  </button>
                </div>

                {/* TAB 1: UPAD (Advance Withdrawal) */}
                {activeTab === 'upad' && (
                  <div className="space-y-4">
                    {/* New Upad Form */}
                    <form onSubmit={handleAddUpad} className="p-3 bg-[#060b18] border border-slate-800 rounded-xl space-y-2.5 text-xs">
                      <div className="font-semibold text-[#f3c64c] flex items-center gap-1">
                        <Plus className="w-3.5 h-3.5" />
                        <span>નવો ઉપાડ લખો:</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div>
                          <input
                            type="number"
                            min="100"
                            step="100"
                            value={upadAmount}
                            onChange={(e) => setUpadAmount(e.target.value ? Number(e.target.value) : '')}
                            placeholder="ઉપાડ રકમ (₹)"
                            className="w-full px-2.5 py-1.5 bg-[#0a1228] border border-slate-700 rounded-lg text-white font-mono"
                            required
                          />
                        </div>
                        <div>
                          <input
                            type="date"
                            value={upadDate}
                            onChange={(e) => setUpadDate(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-[#0a1228] border border-slate-700 rounded-lg text-white font-mono"
                            required
                          />
                        </div>
                        <div>
                          <select
                            value={paymentMode}
                            onChange={(e) => setPaymentMode(e.target.value as any)}
                            className="w-full px-2.5 py-1.5 bg-[#0a1228] border border-slate-700 rounded-lg text-white"
                          >
                            <option value="રોકડ">રોકડ (Cash)</option>
                            <option value="ઓનલાઇન (GPay/UPI)">ઓનલાઇન (GPay/UPI)</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={upadReason}
                          onChange={(e) => setUpadReason(e.target.value)}
                          placeholder="ઉપાડનું કારણ / નોંધ"
                          className="flex-1 px-2.5 py-1.5 bg-[#0a1228] border border-slate-700 rounded-lg text-white text-xs"
                        />
                        <button
                          type="submit"
                          className="px-4 py-1.5 bg-[#d4af37] text-[#070d1e] font-bold rounded-lg hover:brightness-110"
                        >
                          ઉમેરો
                        </button>
                      </div>
                    </form>

                    {/* Upad List */}
                    <div className="space-y-1.5 max-h-48 overflow-y-auto">
                      {selectedStaff.upadList.length === 0 ? (
                        <p className="text-center py-4 text-slate-500 text-xs">કોઈ ઉપાડ નોંધાયેલ નથી.</p>
                      ) : (
                        selectedStaff.upadList.map((item) => (
                          <div
                            key={item.id}
                            className="p-2.5 bg-[#060b18] border border-slate-800/80 rounded-lg flex items-center justify-between text-xs"
                          >
                            <div>
                              <span className="font-bold font-mono text-red-400">₹ {item.amount}</span>
                              <span className="text-slate-400 ml-2">({item.paymentMode})</span>
                              <div className="text-slate-500 text-[11px]">{item.date} • {item.reason}</div>
                            </div>
                            <button
                              onClick={() => handleDeleteUpad(item.id)}
                              className="p-1 text-slate-500 hover:text-red-400"
                              title="કાઢી નાખો"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 2: ATTENDANCE */}
                {activeTab === 'attendance' && (
                  <div className="space-y-4">
                    {/* Mark attendance form */}
                    <form onSubmit={handleAddAttendance} className="p-3 bg-[#060b18] border border-slate-800 rounded-xl space-y-2.5 text-xs">
                      <div className="font-semibold text-[#f3c64c] flex items-center gap-1">
                        <Plus className="w-3.5 h-3.5" />
                        <span>હાજરી નોંધો:</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div>
                          <input
                            type="date"
                            value={attDate}
                            onChange={(e) => setAttDate(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-[#0a1228] border border-slate-700 rounded-lg text-white font-mono"
                            required
                          />
                        </div>
                        <div>
                          <select
                            value={attStatus}
                            onChange={(e) => setAttStatus(e.target.value as any)}
                            className="w-full px-2.5 py-1.5 bg-[#0a1228] border border-slate-700 rounded-lg text-white"
                          >
                            <option value="હાજર">હાજર (Full Day)</option>
                            <option value="અડધો દિવસ">અડધો દિવસ (Half Day)</option>
                            <option value="ગેરહાજર">ગેરહાજર (Absent)</option>
                          </select>
                        </div>
                        <div>
                          <input
                            type="text"
                            value={attNotes}
                            onChange={(e) => setAttNotes(e.target.value)}
                            placeholder="પ્રોગ્રામ અથવા નોંધ"
                            className="w-full px-2.5 py-1.5 bg-[#0a1228] border border-slate-700 rounded-lg text-white text-xs"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="px-4 py-1.5 bg-[#d4af37] text-[#070d1e] font-bold rounded-lg hover:brightness-110"
                        >
                          હાજરી સાચવો
                        </button>
                      </div>
                    </form>

                    {/* Attendance List */}
                    <div className="space-y-1.5 max-h-48 overflow-y-auto">
                      {selectedStaff.attendanceList.length === 0 ? (
                        <p className="text-center py-4 text-slate-500 text-xs">કોઈ હાજરી નોંધાયેલ નથી.</p>
                      ) : (
                        selectedStaff.attendanceList.map((item) => (
                          <div
                            key={item.id}
                            className="p-2.5 bg-[#060b18] border border-slate-800/80 rounded-lg flex items-center justify-between text-xs"
                          >
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                                item.status === 'હાજર' 
                                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30' 
                                  : item.status === 'અડધો દિવસ'
                                  ? 'bg-amber-950 text-amber-300 border border-amber-500/30'
                                  : 'bg-red-950 text-red-300 border border-red-500/30'
                              }`}>
                                {item.status}
                              </span>
                              <span className="font-mono text-slate-300">{item.date}</span>
                              {item.notes && <span className="text-slate-400">({item.notes})</span>}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
