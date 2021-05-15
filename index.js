const schedule = require('node-schedule');
const puppeteer = require('puppeteer-core');
const { PendingXHR } = require('pending-xhr-puppeteer');

if (!process.env.TARGET_WALLET) {
	throw new Error("please set TARGET_WALLET env.")
}
const TARGET_WALLET = process.env.TARGET_WALLET;

async function visitGrowingWebsite() {
  const time = new Date()
  console.log(`[${time.valueOf()}] <${TARGET_WALLET}> visiting growing.fi...`)
  const browser = await puppeteer.launch({
    userDataDir: '/user_data',
    executablePath: process.env.CHROMIUM_PATH,
    args: ['--no-sandbox'],
  });
  const page = await browser.newPage();
  const pendingXHR = new PendingXHR(page);
  await page.goto(`https://www.growing.fi/wallet/${TARGET_WALLET}`);
  await pendingXHR.waitForAllXhrFinished()
  console.log(`[${time.valueOf()}] done. ${new Date().toLocaleString('en-US', { timeZone: "Asia/Shanghai" })}`)
  await browser.close();
}

schedule.scheduleJob('0 */10 * * * *', function() {
  visitGrowingWebsite()
});
