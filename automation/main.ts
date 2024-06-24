import * as puppeteer from 'puppeteer-core'
import * as socketServer from './server/socket';
import * as httpServer from './server/http'
import * as assert from "assert";
import * as base64js from 'base64-js'
import {Callback} from "./server/common";

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

async function loadPage(browser: puppeteer.Browser, url: string): Promise<puppeteer.Page> {
    let page = (await browser.pages())[0];
    await page.goto(url);
    return page;
}

let argv = process.argv.slice(2);
if (argv.length === 0) {
    console.log('Usage: command <webpage-url> <listen-port> <server-type> [<headless>]');
    console.log();
    console.log('\tServer type: socket|http');
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

    let requestData: Callback = async (name, params) => {
        let data = await page.evaluate(async (name, params) => {
            let paramsObject = JSON.parse(params);
            let imageSaveManager = window['imageSaveManager'];
            let instance = imageSaveManager['get'](name);
            await instance['updateData'](paramsObject);
            return await instance['generateImageBase64'](paramsObject);
        }, name, params);

        let lead = 'data:image/png;base64,';
        assert(data.startsWith(lead))
        let base64 = data.substring(lead.length);
        return base64js.toByteArray(base64);
    };


    switch (serverType) {
        case "socket":
            socketServer.start(LISTEN_PORT, requestData)
            break
        case "http":
            httpServer.start(LISTEN_PORT, requestData);
            break;
        default:
    }
}
