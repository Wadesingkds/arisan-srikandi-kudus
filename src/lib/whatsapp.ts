import { formatDateIndonesia } from './utils';

export interface WhatsAppMessage {
  to: string;
  message: string;
  template?: boolean;
}

export interface WhatsAppConfig {
  apiKey: string;
  apiUrl: string;
  sender: string;
}

class WhatsAppService {
  private config: WhatsAppConfig;

  constructor() {
    // Gunakan environment variables untuk security
    this.config = {
      apiKey: import.meta.env.VITE_WHATSAPP_API_KEY || '',
      apiUrl: import.meta.env.VITE_WHATSAPP_API_URL || 'https://api.watzap.id/v1',
      sender: import.meta.env.VITE_WHATSAPP_SENDER || '6281234567890'
    };
  }

  private async sendRequest(endpoint: string, data: any): Promise<any> {
    // Handle different API formats
    let url = this.config.apiUrl;
    let requestData: any;
    let headers: Record<string, string> = {};
    let method = 'POST';
    
    console.log('WhatsApp API Request:', {
      url: url.replace(this.config.apiKey, '***'),
      data: data
    });

    // Zapin.my.id format (JSON with api_key in body)
    if (this.config.apiUrl.includes('zapin.my.id')) {
      url = `${this.config.apiUrl}${endpoint}`;
      requestData = {
        api_key: this.config.apiKey,
        sender: data.sender || this.config.sender,
        number: data.number,
        message: data.message
      };
      headers = {
        'Content-Type': 'application/json'
      };
      method = 'POST';
    }
    // Query parameter format
    else if (this.config.apiUrl.includes('?')) {
      url = `${this.config.apiUrl}?api_key=${this.config.apiKey}&sender=${this.config.sender}&number=${data.number}&message=${encodeURIComponent(data.message)}`;
      method = 'GET';
      requestData = null;
    }
    // JSON format with Bearer token (Watzap, Fonnte, etc.)
    else {
      url = `${this.config.apiUrl}${endpoint}`;
      const sender = this.config.sender?.trim();
      if (!sender) {
        throw new Error('Sender number is required for WhatsApp API');
      }
      requestData = {
        number: data.number,
        message: data.message,
        sender: sender
      };
      headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`
      };
    }

    const requestOptions: RequestInit = {
      method: method,
    };

    if (method === 'POST' && requestData) {
      requestOptions.body = JSON.stringify(requestData);
    }

    const response = await fetch(url, requestOptions);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async sendTextMessage(to: string, message: string): Promise<boolean> {
    if (!this.config.apiKey) {
      console.warn('WhatsApp API key not configured');
      return false;
    }

    const cleanNumber = to.replace(/[^0-9]/g, '');
    const formattedNumber = cleanNumber.startsWith('62') ? cleanNumber : `62${cleanNumber}`;

    try {
      const data = {
        number: formattedNumber,
        message: message,
        sender: this.config.sender
      };

      await this.sendRequest('/messages', data);
      
      // Log pengiriman (tanpa menyimpan API key)
      this.logMessage(formattedNumber, message);
      
      return true;
    } catch (error) {
      console.error('Failed to send WhatsApp message:', error);
      return false;
    }
  }

  async sendTemplateMessage(to: string, templateName: string, variables: string[]): Promise<boolean> {
    if (!this.config.apiKey) {
      console.warn('WhatsApp API key not configured');
      return false;
    }

    const cleanNumber = to.replace(/[^0-9]/g, '');
    const formattedNumber = cleanNumber.startsWith('62') ? cleanNumber : `62${cleanNumber}`;

    try {
      const data = {
        api_key: this.config.apiKey,
        sender: this.config.sender,
        number: formattedNumber,
        template: templateName,
        variables: variables,
      };

      await this.sendRequest('/template', data);
      return true;
    } catch (error) {
      console.error('Failed to send template message:', error);
      return false;
    }
  }

  private logMessage(to: string, message: string) {
    const logEntry = {
      to: to.replace(/\d(?=\d{4})/g, '*'), // Mask nomor untuk privacy
      message: message.substring(0, 50) + '...',
      timestamp: new Date().toISOString(),
    };

    const logs = JSON.parse(localStorage.getItem('whatsapp_logs') || '[]');
    logs.push(logEntry);
    
    // Batasi log maksimal 100 entries
    if (logs.length > 100) {
      logs.splice(0, logs.length - 100);
    }
    
    localStorage.setItem('whatsapp_logs', JSON.stringify(logs));
  }

  generateReminderMessage(name: string, debt: string, amount: string): string {
    return `Assalamualaikum ${name},

Pengingat pembayaran arisan RT 04 RW 01:
📋 Tunggakan: ${debt}
💰 Jumlah: ${amount}
📅 Tanggal: ${formatDateIndonesia(new Date())}

Mohon segera diselesaikan. Terima kasih.

Salam,
Ketua Arisan RT 04 RW 01`;
  }

  isConfigured(): boolean {
    const hasApiKey = this.config.apiKey && this.config.apiKey.trim().length > 0;
    const hasApiUrl = this.config.apiUrl && this.config.apiUrl.trim().length > 0;
    const hasSender = this.config.sender && this.config.sender.trim().length > 0;
    
    const isValid = hasApiKey && hasApiUrl && hasSender;
    
    console.log('WhatsApp configuration check:', {
      apiKey: hasApiKey ? '***' + this.config.apiKey.slice(-4) : 'empty',
      apiUrl: this.config.apiUrl,
      sender: this.config.sender,
      hasApiKey,
      hasApiUrl,
      hasSender,
      isValid
    });
    
    return isValid;
  }

  updateConfig(config: { apiKey: string; apiUrl: string; sender: string }) {
    this.config = {
      apiKey: config.apiKey,
      apiUrl: config.apiUrl,
      sender: config.sender
    };
  }
}

export const whatsappService = new WhatsAppService();
