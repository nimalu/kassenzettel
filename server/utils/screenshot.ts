import puppeteer, { Browser } from "puppeteer"


async function screenshot(url: string, selector: string, path: string) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto(url, { waitUntil: 'networkidle2' })

    await page.waitForSelector(selector)
    const element = await page.$(selector)
    if (!element) {
        throw new Error("Couldn't find selector")
    }
    await element.screenshot({ path })
    await page.close()
    await browser.close()
}
export default screenshot;