import schedule from 'node-schedule';
import _ from 'lodash';
import { AppConfig } from './AppConfig';
import { GrowingVisitor } from './GrowingVisitor';

const config = new AppConfig('../config.js')

const visitor = new GrowingVisitor({ baseUrl: config.baseUrl })

async function visitGrowingWebsite(wallets: string[]) {
  return await Promise.all(wallets.map((wallet) => {
    return visitor.visit(wallet)
  }))
}

async function runVisitSchedule() {
  return _.chain(config.wallets as string[])
    .chunk(Math.ceil(config.wallets.length / 10))
    .map((wallets, index, chunked) => {
      const rule = `0 ${Math.floor(10 / chunked.length) * index}/10 * * * *`
      return schedule.scheduleJob(rule, () => {
        visitGrowingWebsite(wallets)
      });
    })
    .value()
}


async function run() {
  await visitor.launch()
  await runVisitSchedule()
}
run()