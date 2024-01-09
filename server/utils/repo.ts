
import sqlite3 from 'sqlite3'
import { Database, open } from 'sqlite'
import { useLogger } from '@nuxt/kit'
sqlite3.verbose()

interface SampleDB {
    id: string
    receipt: string
}

class Repo {
    db: Database<sqlite3.Database, sqlite3.Statement>
    constructor(db: Database<sqlite3.Database, sqlite3.Statement>) {
        this.db = db
    }

    async init() {
        await this.db.exec(`CREATE TABLE IF NOT EXISTS samples (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            receipt JSON
        )`)
    }

    async createSample() {
        const result = await this.db.run(
            "INSERT INTO samples (receipt) VALUES ('{}')"
        )
        if (!result.lastID) {
            throw new Error("Could not create new sample")
        }
        return result.lastID
    }

    async readSample(id: string) {
        const sample = await this.db.get<SampleDB>(`
            SELECT * FROM samples where id = ?
        `, id)
        if (!sample) {
            throw new Error(id + " not found")
        }
        return sample
    }

    async updateSample(sample: SampleDB) {
        const { id, receipt } = sample
        await this.db.run(`
            UPDATE samples
            SET receipt = ?
            WHERE id = ?
        `, receipt, id)
    }
}

let repo: Repo
export async function useRepo() {
    if (repo) {
        return repo
    }

    const logger = useLogger("Repo")
    logger.info("Setting up db")
    const db = await open({
        filename: 'database.db',
        driver: sqlite3.Database
    })
    repo = new Repo(db)
    await repo.init()
    return repo
}
