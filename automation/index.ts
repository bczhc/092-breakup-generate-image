import * as puppeteer from 'puppeteer-core'
import * as server from './server'
import * as assert from "assert";
import * as base64js from 'base64-js'
import * as fs from 'fs'

let HEADLESS = false
let WEBPAGE_URL = 'http://localhost:8080'
let LISTEN_PORT = 0

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

let argv = process.argv.slice(2);
if (argv.length === 0) {
    console.log('Usage: command <webpage-url> <listen-port> [<headless-flag>]');
    process.exit(1);
}
WEBPAGE_URL = argv[0];
LISTEN_PORT = parseInt(argv[1])
if (argv[2] != undefined) HEADLESS = true;

(async () => await main())();

async function main() {
    let browser = await launchBrowser();
    let page = await loadPage(browser, WEBPAGE_URL)

    server.start(LISTEN_PORT, async c => {
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
