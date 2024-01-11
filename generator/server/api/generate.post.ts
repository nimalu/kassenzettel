import { z } from 'zod'
import { useRepo } from "../utils/repo"
import { useLogger } from '@nuxt/kit'

const receiptItemSchema = z.object({
    name: z.string(),
    price: z.number(),
    taxClass: z.optional(z.string()),
    detail: z.optional(z.string())
})

const layoutSchema = z.object({
    background: z.optional(z.string()),
    px: z.optional(z.string()),
    py: z.optional(z.string()),
    barcodeHeight: z.optional(z.string()),
    font: z.optional(z.enum(["Inconsolata", "DejaVuSansMono"])),
    barcode: z.optional(z.boolean()),
    qrcode: z.optional(z.boolean()),
})

export const receiptSchema = z.object({
    items: z.optional(z.array(receiptItemSchema).default([])),
    layoutBase: z.optional(z.enum(["lidl", "real"]).default("lidl")),
    layout: z.optional(layoutSchema),
    card: z.optional(z.boolean()),
    address: z.optional(z.string()),
    date: z.date().default(new Date()),
    detail1: z.optional(z.string())
})

const bodySchema = z.object({
    receipt: receiptSchema,
    masks: z.boolean().default(false)
})

const logger = useLogger("GenerateEndpoint")

export default defineEventHandler(async (event) => {
    const body = await readValidatedBody(event, b => bodySchema.parse(b))
    const receipt = body.receipt
    const masks = body.masks

    const repo = await useRepo()
    const id = await repo.createSample()
    const stringifiedReceipt = JSON.stringify(receipt)
    await repo.updateSample({ id: id.toString(), receipt: stringifiedReceipt })

    const res = event.node.res
    res.setHeader("Content-Type", "image/png")

    logger.info("Taking screenshot of ", id)
    if (masks) {
        return await screenshot(
            `http://localhost:3000/receipt/${id}?masks=1`,
            "#receipt",
        )
    } else {
        return await screenshot(
            `http://localhost:3000/receipt/${id}`,
            "#receipt"
        )
    }
})