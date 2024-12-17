import { MarketDataProvider } from './ProviderInterface';

export class YahooProvider implements MarketDataProvider {
    constructor(private readonly url: string, private readonly apiKey: string) {
        // Initialize Yahoo provider
    }
}