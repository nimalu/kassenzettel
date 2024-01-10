import { z } from 'zod'
import { useRepo } from "../utils/repo"
import archiver from "archiver"

const receiptItemSchema = z.object({
    name: z.string(),
    price: z.number(),
    taxClass: z.optional(z.enum(["lidl", "real"])),
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

const receiptSchema = z.object({
    items: z.array(receiptItemSchema).default([]),
    layoutBase: z.enum(["lidl", "real"]).default("lidl"),
    layout: layoutSchema,
    card: z.optional(z.boolean()),
    address: z.optional(z.string()),
    date: z.optional(z.date()),
    detail1: z.optional(z.string())
})

const bodySchema = z.object({
    receipts: z.array(receiptSchema)
})

export default defineEventHandler(async (event) => {
    const body = await readValidatedBody(event, b => bodySchema.parse(b))
    const receipts = body.receipts

    const repo = await useRepo()

    const res = event.node.res
    const archive = archiver('zip')
    res.setHeader("Content-Type", "application/zip")
    archive.pipe(res)
    archive.directory("public/data", "data")
    archive.directory("public/images", "images")
    archive.directory("public/masks", "masks")

    await Promise.all(receipts.map(async receipt => {
        const id = await repo.createSample()
        const stringifiedReceipt = JSON.stringify(receipt)
        await repo.updateSample({ id: id.toString(), receipt: stringifiedReceipt })
        const image = await screenshot(
            `http://localhost:3000/receipt/${id}`,
            "#receipt"
        )
        archive.append(image, { name: `$images/${id}.png` })
        const mask = await screenshot(
            `http://localhost:3000/receipt/${id}?masks=1`,
            "#receipt",
        )
        archive.append(mask, { name: `/masks/${id}.png` })
        archive.append(stringifiedReceipt, { name: `/data/${id}.json` })
    }))
    await archive.finalize()
})