export interface Order {
  id: string;
  billNo: string; // e.g. "ISK-2026-001"
  date: string; // YYYY-MM-DD
  clientName: string; // શ્રીમાનનું નામ
  clientPhone: string; // ગ્રાહકનો મોબાઈલ નંબર
  village: string; // ગામ
  toVillage: string; // ત્યાંથી બીજા ગામ સુધી
  arrivalDateTime: string; // પહોંચવાનો સમય અને તારીખ
  departureDateTime: string; // છૂટા કરવાનો સમય અને તારીખ
  soundSetupType: string; // સાઉન્ડ સિસ્ટમ / ડીજે પ્રકાર
  fixedPrice: number; // નક્કી કિંમત ₹
  advanceAmount: number; // એડવાન્સ ₹
  remainingAmount: number; // બાકી રકમ ₹ (fixedPrice - advanceAmount)
  notes?: string; // વધારાની નોંધ
  status: 'confirmed' | 'completed' | 'cancelled'; // સ્થિતિ
  createdAt: string;
}

export interface UpadRecord {
  id: string;
  date: string;
  amount: number;
  reason: string;
  paymentMode: 'રોકડ' | 'ઓનલાઇન (GPay/UPI)';
}

export interface AttendanceRecord {
  id: string;
  date: string;
  status: 'હાજર' | 'ગેરહાજર' | 'અડધો દિવસ';
  orderRef?: string;
  notes?: string;
}

export interface Staff {
  id: string;
  name: string; // સ્ટાફનું નામ
  phone: string; // સ્ટાફનો મોબાઈલ નંબર
  role: string; // કામગીરી (ઓપરેટર, સાઉન્ડ એન્જિનિયર, હેલ્પર, વાહન ચાલક)
  dailySalary: number; // રોજના / ઇવેન્ટના નક્કી મહેનતાણું
  upadList: UpadRecord[]; // સ્ટાફનો ઉપાડ
  attendanceList: AttendanceRecord[]; // સ્ટાફની હાજરી
  joinedDate: string;
}

export interface BusinessProfile {
  businessName: string;
  ownerName: string;
  authorizedMobile: string;
  tagline: string;
  address: string;
  terms: string[];
}
