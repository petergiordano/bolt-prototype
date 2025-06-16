import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface WorkshopData {
  version: string;
  createdAt: string;
  lastUpdated: string;
  workshop1: {
    activity1?: {
      momentOfRealization: string;
      whoExperienced: string;
      whyMatters: string;
      whatSurprised: string;
      howRealProblem: string;
      completedAt?: string;
    };
  };
  workshop2?: Record<string, unknown>;
  workshop3?: Record<string, unknown>;
  workshop4?: Record<string, unknown>;
}

export interface UserRecord {
  key: string;
  email?: string;
  data: WorkshopData;
  created_at: string;
  updated_at: string;
}

// Generate a unique 10-12 character key
export const generateUserKey = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 12; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Get or create user key from localStorage
export const getUserKey = (): string => {
  let key = localStorage.getItem('workshop_user_key');
  if (!key) {
    key = generateUserKey();
    localStorage.setItem('workshop_user_key', key);
  }
  return key;
};

// Load user data from Supabase
export const loadUserData = async (key: string): Promise<WorkshopData | null> => {
  try {
    const { data, error } = await supabase
      .from('workshop_users')
      .select('data')
      .eq('key', key)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No data found, return null
        return null;
      }
      throw error;
    }

    return data?.data || null;
  } catch (error) {
    console.error('Error loading user data:', error);
    return null;
  }
};

// Save user data to Supabase
export const saveUserData = async (key: string, data: WorkshopData, email?: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('workshop_users')
      .upsert({
        key,
        data,
        email,
        updated_at: new Date().toISOString()
      });

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error saving user data:', error);
    return false;
  }
};