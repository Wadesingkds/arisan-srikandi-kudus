import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.680e509917924a7d8f61dbec9cd039c4',
  appName: 'arisan-srikandi-kudus',
  webDir: 'dist',
  server: {
    url: 'https://680e5099-1792-4a7d-8f61-dbec9cd039c4.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#1a1a2e',
      showSpinner: true,
      spinnerColor: '#ffffff'
    }
  }
};

export default config;