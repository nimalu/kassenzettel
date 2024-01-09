import archiver from 'archiver'

export default defineEventHandler(async (event) => {
    const archive = archiver('zip')
    const res = event.node.res
    res.setHeader("Content-Type", "application/zip")

    res.on('close', function () {
        console.log(archive.pointer() + ' total bytes');
        console.log('archiver has been finalized and the output file descriptor has closed.');
    });

    archive.pipe(res)
    archive.directory("public/data", "data")
    archive.directory("public/images", "images")
    archive.directory("public/masks", "masks")
    await archive.finalize()
})