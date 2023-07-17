import * as puppeteer from 'puppeteer-core'
import * as server from './server'
import * as assert from "assert";
import * as base64js from 'base64-js'
import * as fs from 'fs'

const HEADLESS = false
const URL = 'http://localhost:8080'

async function launchBrowser() {
    return await puppeteer.launch({
        executablePath: '/usr/bin/chromium',
        headless: HEADLESS,
        args: ['--no-proxy-server', '--disable-gpu', '--no-sandbox']
    });
}

async function loadPage(browser, url): Promise<puppeteer.Page> {
    let page = (await browser.pages())[0];
    await page.goto(url);
    return page;
}

(async () => await main())();

async function main() {
    let browser = await launchBrowser();
    let page = await loadPage(browser, URL)

    server.start(async c => {
        let data = await page.evaluate((text) => {
            let func = window['updateAndGetImage']
            console.log(func);
            return func(text) as string
        }, c.text)

        let lead = 'data:image/png;base64,';
        assert(data.startsWith(lead))
        let base64 = data.substring(lead.length);
        let raw = base64js.toByteArray(base64);
        console.log(`Write file: ${c.path}, length: ${raw.length}`)
        fs.writeFileSync(c.path, raw)
    })
}
