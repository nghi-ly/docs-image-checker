// 1. Run through all files on doc
// 2. Check all image files (/static/img)
// 3. Compare image links found in static to the links found in every other file
// 4. Output any unused image files
// 5. Auto open PR which removes unused images

const glob = require('glob');
const path = require('path');
const fs = require('fs-extra');

const DOCS_DIR = '/Users/ly/docs.getdbt.com/website'

const getFiles = (pattern) => {

    console.log(pattern)
    console.log('In getFiles')
    return glob.sync(pattern) // match files that fit a pattern like all PNG files (*.png)

}

const getImageFiles = () => {
    console.log('In getImageFiles')
    return getFiles(`${DOCS_DIR}/static/**/*.{png,jpg,jpeg,gif,svg}`)

}

const getReferenceFiles = () => {
    console.log('In getReferenceFiles')

    const patterns = [
        //`${DOCS_DIR}/docs/guides/*.{md,mdx}`,
        `${DOCS_DIR}/docs/docs/**/*.{md,mdx}`,
    ]

    return patterns.flatMap(pattern => getFiles(pattern))
}
const imageChecker = async (baseImgFilename, fileList) => {
    let matched = 0
    //console.log('Image checker base filename:', baseImgFilename)
    for (let file of fileList) {
        //console.log('Ref file path: ', file)
        //fs.createReadStream(filePath)
        await fs.readFile(file, function (err, data) {
            if (err) throw err;
            if (data.includes(baseImgFilename)) {
                console.log('CHECKER MATCHED: ', baseImgFilename, 'in file', file)
                matched = 1
            }
        })

    }
    if (!matched) {
        console.log('NO MATCHES: ', baseImgFilename)
    }

}
const findUnusedImages = async () => {
    const imageFiles = getImageFiles()
    const referenceFiles = getReferenceFiles()
    const unusedImages = []
    const keepImages = ['/path/to/testExample.txt']

    //console.log('Image Files:' , imageFiles)
    //console.log('Reference Files:' , referenceFiles)
    console.log('In findUnusedImages')

    for (let imgFile of imageFiles) {
        const baseFilename = path.parse(imgFile).base;

        //console.log('Inside loop. Img file:' , imgFile)
        await imageChecker(baseFilename, referenceFiles);

        //break;

    }

    //console.log('Outside loop')
}

findUnusedImages()
