import { BusinessProfile, Order, Staff } from '../types';

export const INITIAL_BUSINESS_PROFILE: BusinessProfile = {
  businessName: 'I. S. K Sound & Live DJ',
  ownerName: 'ભરત કે. (Bharat K)',
  authorizedMobile: '9624235014',
  tagline: 'ઓર્ડર બુક ડાયરી અને ડિજિટલ હિસાબ',
  address: 'દહેગામ, ગાંધીનગર, ગુજરાત',
  terms: [
    '૧. કાર્યક્રમ રદ થશે તો એડવાન્સ પરત મળશે નહીં.',
    '૨. કાર્યક્રમના સ્થળે વીજળી (લાઈટ/પાવર) અથવા જનરેટરની જવાબદારી આયોજકની રહેશે.',
    '૩. કાર્યક્રમ પૂર્ણ થયેથી તરત જ બાકી રકમ ચૂકવવાની રહેશે.',
    '૪. સાઉન્ડ સિસ્ટમ વગાડવા માટે પોલીસ અથવા વહીવટી તંત્રની મંજૂરી ગ્રાહકે જાતે લેવાની રહેશે.',
    '૫. અણધાર્યા વરસાદ અથવા કુદરતી આપત્તિમાં સાઉન્ડની સુરક્ષા સહકાર આપવો.'
  ]
};

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord_1',
    billNo: 'ISK-2026-001',
    date: '2026-10-25',
    clientName: 'પટેલ વિજયભાઈ સોમાભાઈ',
    clientPhone: '9825123456',
    village: 'રાજેન્દ્રનગર',
    toVillage: 'મેઘરજ (જાન પ્રસ્થાન)',
    arrivalDateTime: '2026-11-04 15:00',
    departureDateTime: '2026-11-05 06:00',
    soundSetupType: 'લગ્ન પ્રસંગ - વરઘોડો સ્પેશિયલ DJ & શાર્પી લાઈટ્સ',
    fixedPrice: 35000,
    advanceAmount: 10000,
    remainingAmount: 25000,
    notes: 'જનરેટર સાથે, ટ્રસ અને ૪ બેઝ + ૪ ટોપ સ્પીકર્સ',
    status: 'confirmed',
    createdAt: '2026-10-25T10:30:00Z'
  },
  {
    id: 'ord_2',
    billNo: 'ISK-2026-002',
    date: '2026-10-26',
    clientName: 'ઠાકોર રમેશજી કાળુજી',
    clientPhone: '9724567890',
    village: 'ધનસુરા',
    toVillage: 'ધનસુરા (સ્થાનિક ગ્રાઉન્ડ)',
    arrivalDateTime: '2026-11-08 18:00',
    departureDateTime: '2026-11-09 01:00',
    soundSetupType: 'રાસ-ગરબા અને સ્ટેજ લાઈવ સાઉન્ડ સિસ્ટમ',
    fixedPrice: 22000,
    advanceAmount: 7000,
    remainingAmount: 15000,
    notes: '૪ કોર્ડલેસ માઈક, ૨ મોનિટર, ડિજિટલ મિક્સર સાથે',
    status: 'confirmed',
    createdAt: '2026-10-26T14:15:00Z'
  },
  {
    id: 'ord_3',
    billNo: 'ISK-2026-003',
    date: '2026-10-28',
    clientName: 'ચૌધરી મહેશભાઈ પ્રભુભાઈ',
    clientPhone: '9428901234',
    village: 'પ્રાંતિજ',
    toVillage: 'તલોદ',
    arrivalDateTime: '2026-11-12 16:00',
    departureDateTime: '2026-11-12 23:30',
    soundSetupType: 'ડીજે સેટઅપ + સ્મોક અને સ્પાર્કલર ફાયર',
    fixedPrice: 18000,
    advanceAmount: 8000,
    remainingAmount: 10000,
    notes: 'વરઘોડા માટે ટ્રોલી DJ',
    status: 'confirmed',
    createdAt: '2026-10-28T09:00:00Z'
  },
  {
    id: 'ord_4',
    billNo: 'ISK-2026-004',
    date: '2026-10-20',
    clientName: 'શાહ સંજયકુમાર કાંતિલાલ',
    clientPhone: '9898112233',
    village: 'હિંમતનગર',
    toVillage: 'હિંમતનગર ટાઉન હોલ',
    arrivalDateTime: '2026-10-24 10:00',
    departureDateTime: '2026-10-24 19:00',
    soundSetupType: 'લાઈવ ઓર્કેસ્ટ્રા & કોન્ફરન્સ સાઉન્ડ',
    fixedPrice: 25000,
    advanceAmount: 25000,
    remainingAmount: 0,
    notes: 'સંપૂર્ણ પેમેન્ટ ચૂકવાઈ ગયું છે.',
    status: 'completed',
    createdAt: '2026-10-20T11:00:00Z'
  }
];

export const INITIAL_STAFF: Staff[] = [
  {
    id: 'stf_1',
    name: 'જીગ્નેશ પટેલ (ઓપરેટર)',
    phone: '9909012345',
    role: 'મુખ્ય DJ ઓપરેટર & મિક્સર',
    dailySalary: 1200,
    joinedDate: '2025-01-10',
    upadList: [
      {
        id: 'upd_1',
        date: '2026-10-15',
        amount: 3000,
        reason: 'ઘરખર્ચ માટે ઉપાડ',
        paymentMode: 'ઓનલાઇન (GPay/UPI)'
      },
      {
        id: 'upd_2',
        date: '2026-10-25',
        amount: 1500,
        reason: 'તહેવાર માટે એડવાન્સ',
        paymentMode: 'રોકડ'
      }
    ],
    attendanceList: [
      { id: 'att_1', date: '2026-10-20', status: 'હાજર', orderRef: 'ISK-2026-004' },
      { id: 'att_2', date: '2026-10-24', status: 'હાજર', orderRef: 'ISK-2026-004' },
      { id: 'att_3', date: '2026-10-26', status: 'હાજર' }
    ]
  },
  {
    id: 'stf_2',
    name: 'સુરેશ ઠાકોર (વાહન ચાલક)',
    phone: '9824054321',
    role: 'DJ વાહન ચાલક & સ્પીકર સેટઅપ',
    dailySalary: 900,
    joinedDate: '2025-03-01',
    upadList: [
      {
        id: 'upd_3',
        date: '2026-10-18',
        amount: 2000,
        reason: 'વાહન રિપેરિંગ અને અંગત ખર્ચ',
        paymentMode: 'રોકડ'
      }
    ],
    attendanceList: [
      { id: 'att_4', date: '2026-10-20', status: 'હાજર', orderRef: 'ISK-2026-004' },
      { id: 'att_5', date: '2026-10-24', status: 'હાજર', orderRef: 'ISK-2026-004' }
    ]
  },
  {
    id: 'stf_3',
    name: 'કિરણ પરમાર (લાઈટ્સ હેલ્પર)',
    phone: '9712098765',
    role: 'શાર્પી લાઈટ્સ & ટ્રસ વાયરિંગ',
    dailySalary: 700,
    joinedDate: '2025-08-15',
    upadList: [
      {
        id: 'upd_4',
        date: '2026-10-22',
        amount: 1000,
        reason: 'મોબાઈલ રિચાર્જ અને ખર્ચ',
        paymentMode: 'રોકડ'
      }
    ],
    attendanceList: [
      { id: 'att_6', date: '2026-10-20', status: 'હાજર' },
      { id: 'att_7', date: '2026-10-24', status: 'હાજર' }
    ]
  }
];
