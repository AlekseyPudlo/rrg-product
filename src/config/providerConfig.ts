import { config } from './index';
import { MarketDataProvider } from '../providers/ProviderInterface';

// Import implemented providers
import { YahooProvider } from '../providers/YahooProvider';
// TODO: add more providers
// import { EuronextProvider } from '../providers/EuronextProvider';

export function getProvider(): MarketDataProvider {
  const { marketDataProvider, dataProviderUrl, apiKey } = config;
  
  // Switch or if-else based on marketDataProvider
  switch (marketDataProvider) {
    case 'yahoo':
      return new YahooProvider(dataProviderUrl, apiKey);
    // case 'euronext':
    //   return new EuronextProvider(dataProviderUrl, apiKey);

    default:
      throw new Error(`Unknown provider: ${marketDataProvider}`);
  }
}