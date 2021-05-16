const schedule = require('node-schedule');
const puppeteer = require('puppeteer-core');

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
  // page.on('response', async (response) => {
  //   if (response.url().includes("growingfi")){
  //     console.log("response.status", response.status())
  //     console.log("response.url", response.url())
  //     if (response.status() == 200) {
  //       console.log(await response.json())
  //     }
  //   }
  // });
  await page.goto(`https://www.growing.fi/wallet/${TARGET_WALLET}`);
  setTimeout(() => {
    console.log(`[${time.valueOf()}] done. ${new Date().toLocaleString('en-US', { timeZone: "Asia/Shanghai" })}`)
    browser.close();
  }, 10 * 1000)
}

schedule.scheduleJob('0 */10 * * * *', function() {
  visitGrowingWebsite()
});
