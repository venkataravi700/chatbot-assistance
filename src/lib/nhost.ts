import { NhostClient } from '@nhost/nhost-js';

export const nhost = new NhostClient({
  subdomain: 'eeycmgofhlqmoqxlhwop',
  region: 'ap-south-1',
  clientStorageType: 'localStorage',
  autoSignIn: true,
  autoRefreshToken: true,
  start: true
});