import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.tfcpay.app',
  appName: 'TFC Pay',
  webDir: 'dist',
  server: {
    url: 'http://192.168.2.111:3000/tfc-pay-android-app/',
    cleartext: true
  }
};

export default config;
