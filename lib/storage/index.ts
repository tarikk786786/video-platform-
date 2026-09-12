import { StorageProvider } from './storage-provider';
import { TelegramStorage } from './telegram-storage';
import { LocalStorage } from './local-storage';

export * from './storage-provider';
export * from './telegram-storage';
export * from './local-storage';

let defaultProviderInstance: StorageProvider | null = null;

export function getStorageProvider(overrideType?: string): StorageProvider {
  if (defaultProviderInstance && !overrideType) {
    return defaultProviderInstance;
  }

  const providerType = overrideType || process.env.STORAGE_PROVIDER || (process.env.TELEGRAM_BOT_TOKEN ? 'telegram' : 'local');

  let provider: StorageProvider;
  switch (providerType.toLowerCase()) {
    case 'telegram':
      provider = new TelegramStorage();
      break;
    case 'local':
    default:
      provider = new LocalStorage();
      break;
  }

  if (!overrideType) {
    defaultProviderInstance = provider;
  }

  return provider;
}
