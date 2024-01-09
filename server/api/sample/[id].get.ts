import { useRepo } from "../../utils/repo"

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')
    if (!id) {
        throw new Error("Bad Request")
    }
    const repo = await useRepo()
    const sample = await repo.readSample(id)
    return {
        sample: {
            id: sample.id,
            receipt: JSON.parse(sample.receipt) as Record<any, any>
        }
    }
})