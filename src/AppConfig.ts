export class AppConfig {
  baseUrl: string;
  wallets: string[];

  constructor(file: string) {
    let _config
    try {
      _config = require(file);
    } catch (error) {
      console.error("Error: config not found")
      process.exit()
    }
    if (!_config.wallets || !Array.isArray(_config.wallets)) {
      console.error("Error: config.wallets not found")
      process.exit()
    }

    this.baseUrl = _config.baseUrl
    this.wallets = _config.wallets
  }
}