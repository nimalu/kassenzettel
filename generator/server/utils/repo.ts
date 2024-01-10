
import { useLogger } from '@nuxt/kit'

interface SampleDB {
    id: string
    receipt: string
}

class Repo {
    topId = 0
    samples: Record<string, SampleDB> = {}
    logger = useLogger("Repo")

    async createSample() {
        const id = ++this.topId
        this.logger.debug("Creating sample ", id)
        const sample: SampleDB = {
            id: id.toString(), receipt: ""
        }
        this.samples[id.toString()] = sample
        return id
    }

    async readSample(id: string) {
        return this.samples[id]
    }

    async updateSample(sample: SampleDB) {
        this.samples[sample.id] = sample
    }
}

let repo: Repo
export async function useRepo() {
    if (repo) {
        return repo
    }

    repo = new Repo()
    return repo
}
