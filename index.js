const schedule = require('node-schedule');
const puppeteer = require('puppeteer-core');

if (!process.env.TARGET_WALLET) {
	throw new Error("please set TARGET_WALLET env.")
}
const TARGET_WALLET = process.env.TARGET_WALLET;


async function visitGrowingWebsite(browser) {
  const page = await browser.newPage();
  await page.goto(`https://www.growing.fi/wallet/${TARGET_WALLET}`);
  console.log(`visited growing.fi for wallet [${TARGET_WALLET}] at ${new Date().toLocaleString()}`)
  setTimeout(() => {
    page.close();
  }, 30 * 1000)
}

async function run() {
  const browser = await puppeteer.launch({
    userDataDir: '/user_data',
    executablePath: process.env.CHROMIUM_PATH,
    args: ['--no-sandbox'],
  });
  schedule.scheduleJob('0 */10 * * * *', function() {
    visitGrowingWebsite(browser)
  });
}


run()
