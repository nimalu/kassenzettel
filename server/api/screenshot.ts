import puppeteer from "puppeteer"

export default defineEventHandler(async (event) => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto("http://localhost:3000/", { waitUntil: 'networkidle2' })

    await page.waitForSelector("#receipt")
    const element = await page.$("#receipt")
    if (!element) {
        throw new Error("Couldn't find receipt element")
    }
    const image = await element.screenshot()
    return {
        image: image.toString("base64")
    }
})  