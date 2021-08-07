import puppeteer from 'puppeteer-core';

export interface GrowingVisitorOptions {
  baseUrl: string;
}
export interface GrowingVisitorVisitOptions {
  waitTime?: number;
}
export class GrowingVisitor {
  private browser?: puppeteer.Browser | null;
  private baseUrl: string;

  constructor(options: GrowingVisitorOptions) {
    this.browser = null
    this.baseUrl = options.baseUrl
  }

  get isLaunched() {
    return !!this.browser
  }

  async launch() {
    this.browser = await puppeteer.launch({
      userDataDir: '/auto-visit-growing/user_data',
      executablePath: process.env.CHROMIUM_PATH,
      args: ['--no-sandbox'],
    });
  }

  async visit(address: string, options?: GrowingVisitorVisitOptions) {
    const waitTime = options?.waitTime || 30 * 1000
    return new Promise<void>((resolve, reject) => {
      return (async () => {
        if (!this.browser) {
          return reject(new Error('no_browser_created'))
        }
        const visitId = (new Date()).valueOf()
        console.log(`[${visitId}] <${address}> visiting growing.fi...`)
        const page = await this.browser.newPage();
        const url = new URL(`/wallet/${address}`, this.baseUrl)
        await page.goto(url.toString());
        setTimeout(() => {
          console.log(`[${visitId}] <${address}> done. ${new Date().toLocaleString('en-US', { timeZone: "Asia/Shanghai" })}`)
          page.close();
          resolve()
        }, waitTime)
      })()
    })

  }
}