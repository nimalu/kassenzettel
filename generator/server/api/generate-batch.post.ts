import { z } from 'zod'
import { useRepo } from "../utils/repo"
import archiver from "archiver"
import { useLogger } from '@nuxt/kit'
import { receiptSchema } from './generate.post'


const bodySchema = z.object({
    receipts: z.array(receiptSchema)
})

const logger = useLogger("GenerateEndpoint")

export default defineEventHandler(async (event) => {
    const body = await readValidatedBody(event, b => bodySchema.parse(b))
    const receipts = body.receipts
    console.log("Starting generation of ", receipts.length, "receipts")

    const repo = await useRepo()

    const res = event.node.res
    const archive = archiver('zip')
    res.setHeader("Content-Type", "application/zip")
    archive.pipe(res)

    for (let receipt of receipts) {
        const id = await repo.createSample()
        logger.info("Taking screenshot of ", id)
        const stringifiedReceipt = JSON.stringify(receipt)
        await repo.updateSample({ id: id.toString(), receipt: stringifiedReceipt })
        const image = await screenshot(
            `http://localhost:3000/receipt/${id}`,
            "#receipt"
        )
        archive.append(image, { name: `kassenzettel/images/${id}.png` })
        const mask = await screenshot(
            `http://localhost:3000/receipt/${id}?masks=1`,
            "#receipt",
        )
        archive.append(mask, { name: `kassenzettel/masks/${id}.png` })
        archive.append(stringifiedReceipt, { name: `kassenzettel/data/${id}.json` })
    }
    await archive.finalize()
})