import { useRepo } from "../../../utils/repo"
import screenshot from "../../../utils/screenshot"

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')
    if (!id) {
        throw new Error("Bad Request")
    }
    const repo = await useRepo()
    await screenshot(
        `http://localhost:3000/receipt/${id}`,
        "#receipt",
        `public/images/${id}.png`
    )
})