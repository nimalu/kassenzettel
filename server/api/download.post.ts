import archiver from 'archiver'

export default defineEventHandler(async (event) => {
    const archive = archiver('zip')
    const res = event.node.res
    res.setHeader("Content-Type", "application/zip")

    archive.pipe(res)
    archive.directory("public/data", "data")
    archive.directory("public/images", "images")
    archive.directory("public/masks", "masks")
    await archive.finalize()
})