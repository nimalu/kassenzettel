import screenshot from "../../../utils/screenshot"
import fs from "fs"

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')
    if (!id) {
        throw new Error("Bad Request")
    }
    const repo = await useRepo()
    const sample = await repo.readSample(id)
    await screenshot(
        `http://localhost:3000/receipt/${id}`,
        "#receipt",
        `public/images/${id}.png`
    )
    await screenshot(
        `http://localhost:3000/receipt/${id}?masks=1`,
        "#receipt",
        `public/masks/${id}.png`
    )
    fs.writeFileSync(`public/data/${id}.json`, sample.receipt)
})