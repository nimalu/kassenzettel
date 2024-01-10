import puppeteer, { Browser, Page } from "puppeteer"

let browser: Browser
let page: Page

async function screenshot(url: string, selector: string) {
    if (!page) {
        browser = await puppeteer.launch()
        page = await browser.newPage()
    }
    await page.goto(url, { waitUntil: 'networkidle2' })

    await page.waitForSelector(selector)
    const element = await page.$(selector)
    if (!element) {
        throw new Error("Couldn't find selector")
    }
    return await element.screenshot()
}
export default screenshot;