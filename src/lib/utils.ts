import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns"
import { id } from "date-fns/locale"

// Type definitions for better type safety
export type ArisanStatus = 'aktif' | 'selesai' | 'pending' | 'dibatalkan' | 'draft'

export interface ValidationResult {
  isValid: boolean
  error?: string
}

export interface SetoranItem {
  jumlah: number
  tanggal?: string | Date
  status?: string
}

export interface ErrorWithMessage {
  message: string
}

export type DateInput = string | Date | number

// Existing utility functions
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
}

// Date formatting utilities with error handling
export function formatDateIndonesia(date: DateInput): string {
  try {
    const parsedDate = parseDate(date);
    if (!isValidDate(parsedDate)) {
      throw new Error('Invalid date provided');
    }
    return format(parsedDate, "dd MMMM yyyy", { locale: id });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Tanggal tidak valid';
  }
}

export function formatDateShort(date: DateInput): string {
  try {
    const parsedDate = parseDate(date);
    if (!isValidDate(parsedDate)) {
      throw new Error('Invalid date provided');
    }
    return format(parsedDate, "dd/MM/yyyy", { locale: id });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Tanggal tidak valid';
  }
}

export function formatDateTime(date: DateInput): string {
  try {
    const parsedDate = parseDate(date);
    if (!isValidDate(parsedDate)) {
      throw new Error('Invalid date provided');
    }
    return format(parsedDate, "dd MMMM yyyy, HH:mm", { locale: id });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Tanggal tidak valid';
  }
}

// Helper function to parse different date formats
function parseDate(date: DateInput): Date {
  if (date instanceof Date) return date;
  if (typeof date === 'string') return new Date(date);
  if (typeof date === 'number') return new Date(date);
  throw new Error('Invalid date format');
}

// Validation utilities with detailed error messages
export function validatePhoneNumber(phone: string): ValidationResult {
  if (!phone || phone.trim() === '') {
    return { isValid: false, error: 'Nomor telepon tidak boleh kosong' };
  }
  
  const cleanPhone = phone.replace(/[\s-]/g, '');
  const phoneRegex = /^(\+62|62|0)[8-9][0-9]{7,11}$/;
  
  if (!phoneRegex.test(cleanPhone)) {
    return { isValid: false, error: 'Format nomor telepon tidak valid (contoh: 081234567890)' };
  }
  
  return { isValid: true };
}

export function validateEmail(email: string): ValidationResult {
  if (!email || email.trim() === '') {
    return { isValid: false, error: 'Email tidak boleh kosong' };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return { isValid: false, error: 'Format email tidak valid' };
  }
  
  return { isValid: true };
}

export function validateName(name: string): ValidationResult {
  if (!name || name.trim() === '') {
    return { isValid: false, error: 'Nama tidak boleh kosong' };
  }
  
  const trimmedName = name.trim();
  if (trimmedName.length < 2) {
    return { isValid: false, error: 'Nama minimal 2 karakter' };
  }
  
  if (trimmedName.length > 100) {
    return { isValid: false, error: 'Nama terlalu panjang (maksimal 100 karakter)' };
  }
  
  return { isValid: true };
}

export function validateSetoran(amount: number, minAmount = 0): ValidationResult {
  if (!Number.isFinite(amount)) {
    return { isValid: false, error: 'Jumlah setoran harus berupa angka' };
  }
  
  if (amount <= 0) {
    return { isValid: false, error: 'Jumlah setoran harus lebih dari 0' };
  }
  
  if (amount < minAmount) {
    return { isValid: false, error: `Jumlah setoran minimal ${formatCurrency(minAmount)}` };
  }
  
  if (amount > 100000000) {
    return { isValid: false, error: 'Jumlah setoran terlalu besar (maksimal Rp100.000.000)' };
  }
  
  return { isValid: true };
}

// Arisan calculation utilities with error handling
export function calculateTotalSetoran(setoran: SetoranItem[]): number {
  if (!Array.isArray(setoran)) {
    console.error('Invalid input: setoran must be an array');
    return 0;
  }
  
  return setoran.reduce((total, item) => {
    if (!item || typeof item.jumlah !== 'number' || !Number.isFinite(item.jumlah)) {
      console.warn('Invalid setoran item:', item);
      return total;
    }
    return total + Math.max(0, item.jumlah);
  }, 0);
}

export function calculateSisaSetoran(targetTotal: number, currentTotal: number): number {
  const target = Number(targetTotal);
  const current = Number(currentTotal);
  
  if (!Number.isFinite(target) || !Number.isFinite(current)) {
    console.error('Invalid input: targetTotal and currentTotal must be numbers');
    return 0;
  }
  
  return Math.max(0, target - current);
}

export function calculatePersentaseSetoran(currentTotal: number, targetTotal: number): number {
  const target = Number(targetTotal);
  const current = Number(currentTotal);
  
  if (!Number.isFinite(target) || !Number.isFinite(current)) {
    console.error('Invalid input: targetTotal and currentTotal must be numbers');
    return 0;
  }
  
  if (target <= 0) return 0;
  
  const percentage = (current / target) * 100;
  return Math.max(0, Math.min(100, Math.round(percentage)));
}

// Arisan number generation with validation
export function generateArisanNumber(): string {
  try {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `ARS${timestamp.slice(-6)}${random}`;
  } catch (error) {
    console.error('Error generating arisan number:', error);
    return `ARS${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }
}

export function generatePesertaId(): string {
  try {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
    return `PST${timestamp.slice(-6)}${random}`;
  } catch (error) {
    console.error('Error generating peserta ID:', error);
    return `PST${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
  }
}

// Status formatting with type safety
export function formatArisanStatus(status: string): string {
  const statusMap: Record<ArisanStatus, string> = {
    'aktif': 'Aktif',
    'selesai': 'Selesai',
    'pending': 'Menunggu',
    'dibatalkan': 'Dibatalkan',
    'draft': 'Draft'
  };
  
  const normalizedStatus = status.toLowerCase() as ArisanStatus;
  return statusMap[normalizedStatus] || status;
}

export function getStatusColor(status: string): string {
  const colorMap: Record<ArisanStatus, string> = {
    'aktif': 'text-green-600 bg-green-100',
    'selesai': 'text-blue-600 bg-blue-100',
    'pending': 'text-yellow-600 bg-yellow-100',
    'dibatalkan': 'text-red-600 bg-red-100',
    'draft': 'text-gray-600 bg-gray-100'
  };
  
  const normalizedStatus = status.toLowerCase() as ArisanStatus;
  return colorMap[normalizedStatus] || 'text-gray-600 bg-gray-100';
}

// Number formatting utilities
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('id-ID').format(num);
}

export function formatPercentage(num: number): string {
  return `${num.toFixed(1)}%`;
}

// String utilities
export function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function formatName(name: string): string {
  return name
    .split(' ')
    .map(word => capitalizeFirst(word))
    .join(' ');
}

// Array utilities with improved type safety
export function sortByDate<T extends { created_at?: string | Date }>(items: T[], ascending = false): T[] {
  if (!Array.isArray(items)) {
    console.error('Invalid input: items must be an array');
    return [];
  }
  
  return [...items].sort((a, b) => {
    try {
      const dateA = new Date(a?.created_at || 0).getTime();
      const dateB = new Date(b?.created_at || 0).getTime();
      
      if (isNaN(dateA) || isNaN(dateB)) {
        return 0;
      }
      
      return ascending ? dateA - dateB : dateB - dateA;
    } catch (error) {
      console.error('Error sorting dates:', error);
      return 0;
    }
  });
}

export function groupByMonth<T extends { created_at?: string | Date }>(items: T[]): Record<string, T[]> {
  if (!Array.isArray(items)) {
    console.error('Invalid input: items must be an array');
    return {};
  }
  
  return items.reduce((groups, item, index) => {
    try {
      if (!item || !item.created_at) {
        console.warn(`Item at index ${index} has no created_at field`);
        return groups;
      }
      
      const date = new Date(item.created_at);
      if (!isValidDate(date)) {
        console.warn(`Invalid date at index ${index}:`, item.created_at);
        return groups;
      }
      
      const monthKey = format(date, "yyyy-MM");
      if (!groups[monthKey]) {
        groups[monthKey] = [];
      }
      groups[monthKey].push(item);
    } catch (error) {
      console.error('Error grouping by month:', error);
    }
    return groups;
  }, {} as Record<string, T[]>);
}

// Error handling utilities with better type safety
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message);
  }
  return 'Terjadi kesalahan yang tidak diketahui';
}

export function createError(message: string, code?: string): ErrorWithMessage {
  const error = new Error(message);
  if (code) {
    (error as any).code = code;
  }
  return error;
}

export function isValidDate(date: any): date is Date {
  return date instanceof Date && !isNaN(date.getTime());
}
