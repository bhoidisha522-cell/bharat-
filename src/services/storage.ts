import { Order, Staff, BusinessProfile } from '../types';
import { INITIAL_BUSINESS_PROFILE, INITIAL_ORDERS, INITIAL_STAFF } from '../data/initialData';

const ORDERS_KEY = 'isk_sound_orders_v1';
const STAFF_KEY = 'isk_sound_staff_v1';
const PROFILE_KEY = 'isk_sound_profile_v1';
const AUTH_KEY = 'isk_sound_auth_v1';

export interface AuthState {
  isAuthenticated: boolean;
  phoneNumber: string;
  isOwner: boolean;
  loginTime: string | null;
}

export const StorageService = {
  getProfile(): BusinessProfile {
    try {
      const data = localStorage.getItem(PROFILE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (parsed.address?.includes('મોડાસા')) {
          parsed.address = 'દહેગામ, ગાંધીનગર, ગુજરાત';
          localStorage.setItem(PROFILE_KEY, JSON.stringify(parsed));
        }
        return parsed;
      }
      return INITIAL_BUSINESS_PROFILE;
    } catch {
      return INITIAL_BUSINESS_PROFILE;
    }
  },

  saveProfile(profile: BusinessProfile) {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  },

  getOrders(): Order[] {
    try {
      const data = localStorage.getItem(ORDERS_KEY);
      return data ? JSON.parse(data) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  },

  saveOrders(orders: Order[]) {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  },

  getStaff(): Staff[] {
    try {
      const data = localStorage.getItem(STAFF_KEY);
      return data ? JSON.parse(data) : INITIAL_STAFF;
    } catch {
      return INITIAL_STAFF;
    }
  },

  saveStaff(staff: Staff[]) {
    localStorage.setItem(STAFF_KEY, JSON.stringify(staff));
  },

  getNextBillNo(): string {
    const orders = this.getOrders();
    const currentYear = new Date().getFullYear();
    const count = orders.length + 1;
    return `ISK-${currentYear}-${String(count).padStart(3, '0')}`;
  },

  getAuthState(): AuthState {
    try {
      const data = localStorage.getItem(AUTH_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // fallback
    }
    // Default to authenticated for Bharat K so app is immediately usable, but can lock / logout anytime
    return {
      isAuthenticated: true,
      phoneNumber: '9624235014',
      isOwner: true,
      loginTime: new Date().toISOString()
    };
  },

  setAuthState(state: AuthState) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(state));
  },

  logout() {
    this.setAuthState({
      isAuthenticated: false,
      phoneNumber: '',
      isOwner: false,
      loginTime: null
    });
  },

  // Export full system backup as JSON
  exportBackup(): string {
    const backupData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      businessName: 'I. S. K Sound & Live DJ',
      owner: 'Bharat K (9624235014)',
      profile: this.getProfile(),
      orders: this.getOrders(),
      staff: this.getStaff()
    };
    return JSON.stringify(backupData, null, 2);
  },

  // Import and restore from JSON
  importBackup(jsonString: string): { success: boolean; message: string; count?: number } {
    try {
      const data = JSON.parse(jsonString);
      if (!data.orders || !Array.isArray(data.orders)) {
        return { success: false, message: 'અમાન્ય બેકઅપ ફાઇલ ફોર્મેટ છે. ઓર્ડર ડેટા મળ્યો નથી.' };
      }
      this.saveOrders(data.orders);
      if (data.staff && Array.isArray(data.staff)) {
        this.saveStaff(data.staff);
      }
      if (data.profile) {
        this.saveProfile(data.profile);
      }
      return {
        success: true,
        message: `સફળતાપૂર્વક ${data.orders.length} ઓર્ડર્સ અને ${data.staff?.length || 0} સ્ટાફ રેકોર્ડ રીસ્ટોર થયા!`,
        count: data.orders.length
      };
    } catch (e: any) {
      return { success: false, message: 'ફાઇલ વાંચવામાં ભૂલ આવી: ' + (e.message || 'અમાન્ય JSON') };
    }
  },

  // Firebase Firestore Security Rules for this specific app
  getFirestoreRules(): string {
    return `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Only Bharat K (Phone: 9624235014) can read and write all business diaries
    function isOwner() {
      return request.auth != null && 
        (request.auth.token.phone_number == '+919624235014' || 
         request.auth.token.firebase.sign_in_provider == 'phone');
    }

    // Orders collection: strictly private to Bharat K
    match /orders/{orderId} {
      allow read, write: if isOwner();
    }

    // Staff and Upad collection: strictly private to Bharat K
    match /staff/{staffId} {
      allow read, write: if isOwner();
    }

    // Business profile and metadata
    match /profile/{profileId} {
      allow read, write: if isOwner();
    }
    
    // Block all other unauthorized access
    match /{document=**} {
      allow read, write: if false;
    }
  }
}`;
  }
};
