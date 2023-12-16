import * as puppeteer from 'puppeteer-core'
import * as socketServer from './server/socket';
import * as assert from "assert";
import * as base64js from 'base64-js'

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
    console.log('Usage: command <webpage-url> <listen-port> <server-type> [<headless>]');
    console.log();
    console.log('\tServer type: socket|http|all');
    console.log('\tHeadless: yes|no (default: yes)')
    process.exit(1);
}
WEBPAGE_URL = argv[0];
LISTEN_PORT = parseInt(argv[1])
let serverType = argv[2];
let headless = argv[3];
if (headless == undefined || headless == 'yes') HEADLESS = true;

(async () => await main())();

async function main() {
    let browser = await launchBrowser();
    let page = await loadPage(browser, WEBPAGE_URL)

    socketServer.start(LISTEN_PORT, async text => {
        let data = await page.evaluate((text) => {
            let func = window['updateAndGetImage']
            console.log(func);
            return func(text) as string
        }, text)

        let lead = 'data:image/png;base64,';
        assert(data.startsWith(lead))
        let base64 = data.substring(lead.length);
        return base64js.toByteArray(base64)
    })
}
