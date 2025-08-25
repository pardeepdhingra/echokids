const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// Configuration
const CDN_DIR = path.join(__dirname, "../../mulberry-symbols-cdn");
const PNG_DIR = path.join(CDN_DIR, "png");
const COMPRESSED_DIR = path.join(CDN_DIR, "png-compressed");

// Create compressed directory if it doesn't exist
if (!fs.existsSync(COMPRESSED_DIR)) {
  fs.mkdirSync(COMPRESSED_DIR, { recursive: true });
}

// Get all PNG files
const pngFiles = fs
  .readdirSync(PNG_DIR)
  .filter((file) => file.endsWith(".png"));

console.log(`Found ${pngFiles.length} PNG files to compress`);

let compressedCount = 0;
let errorCount = 0;

pngFiles.forEach((pngFile, index) => {
  try {
    const inputPath = path.join(PNG_DIR, pngFile);
    const outputPath = path.join(COMPRESSED_DIR, pngFile);

    // Compress PNG using ImageMagick with quality optimization
    // -quality 85: Good balance between size and quality
    // -strip: Remove metadata to reduce size
    execSync(`convert "${inputPath}" -quality 85 -strip "${outputPath}"`);

    compressedCount++;

    if ((index + 1) % 100 === 0) {
      console.log(`Compressed ${index + 1}/${pngFiles.length} files...`);
    }
  } catch (error) {
    console.error(`Error compressing ${pngFile}:`, error.message);
    errorCount++;
  }
});

console.log(`\nCompression complete!`);
console.log(`✅ Successfully compressed: ${compressedCount} files`);
console.log(`❌ Errors: ${errorCount} files`);
console.log(`\nCompressed files saved to: ${COMPRESSED_DIR}`);

// Show size comparison
const originalSize = fs
  .readdirSync(PNG_DIR)
  .filter((file) => file.endsWith(".png"))
  .reduce((total, file) => {
    const stats = fs.statSync(path.join(PNG_DIR, file));
    return total + stats.size;
  }, 0);

const compressedSize = fs
  .readdirSync(COMPRESSED_DIR)
  .filter((file) => file.endsWith(".png"))
  .reduce((total, file) => {
    const stats = fs.statSync(path.join(COMPRESSED_DIR, file));
    return total + stats.size;
  }, 0);

const savings = (
  ((originalSize - compressedSize) / originalSize) *
  100
).toFixed(1);

console.log(`\nSize comparison:`);
console.log(`Original size: ${(originalSize / 1024 / 1024).toFixed(1)} MB`);
console.log(`Compressed size: ${(compressedSize / 1024 / 1024).toFixed(1)} MB`);
console.log(`Space saved: ${savings}%`);
