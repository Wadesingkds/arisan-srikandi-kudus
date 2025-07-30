import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns"
import { id } from "date-fns/locale"

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

// Date formatting utilities
export function formatDateIndonesia(date: Date): string {
  return format(date, "dd MMMM yyyy", { locale: id });
}

export function formatDateShort(date: Date): string {
  return format(date, "dd/MM/yyyy", { locale: id });
}

export function formatDateTime(date: Date): string {
  return format(date, "dd MMMM yyyy, HH:mm", { locale: id });
}

// Validation utilities
export function validatePhoneNumber(phone: string): boolean {
  // Format nomor HP Indonesia: 08xx-xxxx-xxxx atau +62xxx-xxxx-xxxx
  // Lebih fleksibel untuk aplikasi arisan
  if (!phone || phone.trim() === '') return false;
  const cleanPhone = phone.replace(/[\s-]/g, '');
  const phoneRegex = /^(\+62|62|0)[8-9][0-9]{7,11}$/;
  return phoneRegex.test(cleanPhone);
}

export function validateEmail(email: string): boolean {
  if (!email || email.trim() === '') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

export function validateName(name: string): boolean {
  // Validasi nama untuk peserta arisan - minimal 2 karakter, tidak boleh kosong
  if (!name || name.trim() === '') return false;
  return name.trim().length >= 2;
}

export function validateSetoran(amount: number, minAmount = 0): boolean {
  // Validasi jumlah setoran - harus positif dan di atas minimum
  return amount > 0 && amount >= minAmount;
}

// Arisan calculation utilities
export function calculateTotalSetoran(setoran: Array<{ jumlah: number }>): number {
  return setoran.reduce((total, item) => total + item.jumlah, 0);
}

export function calculateSisaSetoran(targetTotal: number, currentTotal: number): number {
  return Math.max(0, targetTotal - currentTotal);
}

export function calculatePersentaseSetoran(currentTotal: number, targetTotal: number): number {
  if (targetTotal === 0) return 0;
  return Math.round((currentTotal / targetTotal) * 100);
}

// Arisan number generation
export function generateArisanNumber(): string {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `ARS${timestamp.slice(-6)}${random}`;
}

export function generatePesertaId(): string {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
  return `PST${timestamp.slice(-6)}${random}`;
}

// Status formatting
export function formatArisanStatus(status: string): string {
  const statusMap: Record<string, string> = {
    'aktif': 'Aktif',
    'selesai': 'Selesai',
    'pending': 'Menunggu',
    'dibatalkan': 'Dibatalkan',
    'draft': 'Draft'
  };
  return statusMap[status.toLowerCase()] || status;
}

export function getStatusColor(status: string): string {
  const colorMap: Record<string, string> = {
    'aktif': 'text-green-600 bg-green-100',
    'selesai': 'text-blue-600 bg-blue-100',
    'pending': 'text-yellow-600 bg-yellow-100',
    'dibatalkan': 'text-red-600 bg-red-100',
    'draft': 'text-gray-600 bg-gray-100'
  };
  return colorMap[status.toLowerCase()] || 'text-gray-600 bg-gray-100';
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

// Array utilities
export function sortByDate<T extends { created_at?: string | Date }>(items: T[], ascending = false): T[] {
  return [...items].sort((a, b) => {
    const dateA = new Date(a.created_at || 0).getTime();
    const dateB = new Date(b.created_at || 0).getTime();
    return ascending ? dateA - dateB : dateB - dateA;
  });
}

export function groupByMonth<T extends { created_at?: string | Date }>(items: T[]): Record<string, T[]> {
  return items.reduce((groups, item) => {
    const date = new Date(item.created_at || 0);
    const monthKey = format(date, "yyyy-MM");
    if (!groups[monthKey]) {
      groups[monthKey] = [];
    }
    groups[monthKey].push(item);
    return groups;
  }, {} as Record<string, T[]>);
}

// Error handling utilities
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'Terjadi kesalahan yang tidak diketahui';
}

export function isValidDate(date: any): boolean {
  return date instanceof Date && !isNaN(date.getTime());
}
