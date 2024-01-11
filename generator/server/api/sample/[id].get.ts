import { useRepo } from "../../utils/repo"

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')
    if (!id) {
        throw createError({
            statusCode: 404,
            statusMessage: "ID not found"
        })
    }
    const repo = await useRepo()
    const sample = await repo.readSample(id)
    if (!sample) {
        throw createError({
            statusCode: 404,
            statusMessage: "ID not found"
        })
    }
    return {
        sample: {
            id: sample.id,
            receipt: JSON.parse(sample.receipt) as Record<any, any>
        }
    }
})