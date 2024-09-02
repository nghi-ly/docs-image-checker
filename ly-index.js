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

// Get all reference files
const getReferenceFiles = () => {
    console.log('In getReferenceFiles')

    const patterns = [
        `${DOCS_DIR}/docs/**/*.{md,mdx}`, // Include docs files
        `${DOCS_DIR}/blog/**/*.{md,mdx}`, // Include blog posts
    ];

    return patterns.flatMap(pattern => getFiles(pattern));
}

// Check if an image is used in reference files
const isImageUsed = async (baseImgFilename, fileList) => {
    // Generate various paths and patterns for checking
    const relativeImagePath = path.relative(DOCS_DIR, baseImgFilename).replace(/\\/g, '/'); // Convert backslashes to forward slashes
    const imagePathInSrc = `/static/${relativeImagePath.replace(/^static\//, '')}`; // Handle images in src folder
    const imageName = path.basename(baseImgFilename); // Image name with extension
    const imageBaseName = path.basename(baseImgFilename, path.extname(baseImgFilename)); // Image name without extension

    // Define regex patterns to match various ways an image might be referenced
    const patterns = [
        relativeImagePath, // Relative path to image
        imagePathInSrc, // Relative path to image in src folder
        imageName, // Image name with extension
        imageBaseName, // Image name without extension
        `url\\(['"]?${relativeImagePath}['"]?\\)`, // URL with relative path to image
        `src=['"]?${relativeImagePath}['"]?`, // src attribute with relative path to image
        `icon=['"]?${imageBaseName}['"]?` // icon attribute with image name
    ];

    // Combine patterns into a single regex
    const regex = new RegExp(patterns.join('|'), 'g');

    // Initialize a variable to track if the image is found
    let isUsed = false;

    // Check each reference file for the image
    for (const file of fileList) {
        try {
            // Read the file content asynchronously
            const data = await fs.promises.readFile(file, 'utf8');

            // Test the content against the regex patterns
            if (regex.test(data)) {
                isUsed = true; // Image is used
                break; // Exit the loop early if the image is found
            }
        } catch (err) {
            console.error('Error reading file:', file, err);
        }
    }

    return isUsed; // Return whether the image is used
};

// Main function to find unused images
const findUnusedImages = async () => {
    const imageFiles = getImageFiles();
    const referenceFiles = getReferenceFiles();
    const unusedImages = [];

    console.log('Scanning in progress...');

    // For each image file, check if it is used in reference files
    for (const imgFile of imageFiles) {
        const used = await isImageUsed(imgFile, referenceFiles);
        
        if (!used) {
            unusedImages.push(imgFile); // Collect unused images
        }
    }

    // Output unused images
    if (unusedImages.length > 0) {
        console.log('Unused Images:');
        unusedImages.forEach((image) => console.log(image));
    } else {
        console.log('No unused images found.');
    }
}

findUnusedImages().catch((err) => {
    console.error(err);
});
