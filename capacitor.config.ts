import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.visualnovel',
  appName: 'Visual Novel Game',
  webDir: 'build',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    App: {
      launchAutoHide: true
    }
  }
};

export default config;