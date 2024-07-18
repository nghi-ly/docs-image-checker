// 1. Run through all files on doc
// 2. Check all image files (/static/img)
// 3. Compare image links found in static to the links found in every other file
// 4. Output any unsued image files
// 5. Auto open PR whcih removes unused images

const glob = require('glob');

const DOCS_DIR = '/Users/jrock/dev/docs.getdbt.com/website'

// const sayHello = () => {
//     console.log(glob)
//     console.log(DOCS_DIR)
// }

const getFiles = (pattern) => {
    console.log('Getting files')
    return glob.sync(pattern)
}

const getImageFiles = () => {
    console.log('Getting image files')
    return getFiles(`${DOCS_DIR}/static/**/*.{png,jpg,jpeg,gif,svg}`)
}

const getReferenceFiles = () => {
    console.log('Getting reference files')

    const patterns = [
        `${DOCS_DIR}/docs/docs/**/*.{md,mdx}`,
        `${DOCS_DIR}/blog/**/*.{md,mdx}`,
    ]
    
    return patterns.flatMap(pattern => getFiles(pattern))
}

const findUnusedImages = async () => {
    const imageFiles = getImageFiles()
    const referenceFiles = getReferenceFiles()

    const unusedImages = []
}

findUnusedImages()
