const schedule = require('node-schedule');
const axios = require('axios');
const { DateTime } = require('luxon');

if (!process.env.TARGET_WALLET) {
	throw new Error("please set TARGET_WALLET env.")
}

const TARGET_WALLET = process.env.TARGET_WALLET;

async function requestHistoryHoldings(address, startAt) {
	const { data } = await axios.post(`https://api-sg.growingfi.com/v2/gql`, {
		query: `
			query($addresses: [ID!]!, $startAt: String) {
        holdingsHistory(address: $addresses, startAt: $startAt) {
          holdings
          time
        }
      }
		`,
		variables: {
      addresses: [address],
      startAt,
    }
	})
	// console.log({data})
	console.log(`requsted HistoryHoldings for wallet [${TARGET_WALLET}] at ${new Date().toLocaleString()}`)
}
async function requestHistoryPrices(address, startAt) {
	const { data } = await axios.post(`https://api-sg.growingfi.com/v2/gql`, {
    query: `
      query($tokens: [ID!]!, $startAt: String) {
        priceHistory(tokens: $tokens, startAt: $startAt) {
          price
          time
        }
      }
    `,
    variables: {
      tokens: [address],
      startAt,
    }
  })
	// console.log({data})
	console.log(`requsted HistoryPrices for wallet [${TARGET_WALLET}] at ${new Date().toLocaleString()}`)
}
async function requestHoldingsData(address) {
	const startAt = DateTime.local().plus({ hours: -2 }).startOf('hour').toJSDate()
	await Promise.all([
		requestHistoryHoldings(address, startAt),
		requestHistoryPrices(address, startAt),
	])
}

requestHoldingsData(TARGET_WALLET)
const job = schedule.scheduleJob('0 */10 * * * *', function() {
	requestHoldingsData(TARGET_WALLET)
});


