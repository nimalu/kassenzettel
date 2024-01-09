import screenshot from "../../../utils/screenshot"

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')
    if (!id) {
        throw new Error("Bad Request")
    }
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
})