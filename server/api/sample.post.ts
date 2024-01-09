import { useRepo } from "../utils/repo"

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    const repo = await useRepo()
    const id = (await repo.createSample()).toString()

    await repo.updateSample({ id, receipt: JSON.stringify(body.receipt) })
    return {
        id
    }
})