const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// Configuration - all paths relative to CDN repository
const CDN_DIR = path.join(__dirname, "../../mulberry-symbols-cdn");
const PNG_OUTPUT_DIR = path.join(CDN_DIR, "png");

// Create PNG output directory if it doesn't exist
if (!fs.existsSync(PNG_OUTPUT_DIR)) {
  fs.mkdirSync(PNG_OUTPUT_DIR, { recursive: true });
}

// Get all SVG files from CDN directory
const svgFiles = fs
  .readdirSync(CDN_DIR)
  .filter((file) => file.endsWith(".svg"));

console.log(`Found ${svgFiles.length} SVG files to convert`);

// Convert SVGs to PNGs
let convertedCount = 0;
let errorCount = 0;

svgFiles.forEach((svgFile, index) => {
  try {
    const svgPath = path.join(CDN_DIR, svgFile);
    const pngFile = svgFile.replace(".svg", ".png");
    const pngPath = path.join(PNG_OUTPUT_DIR, pngFile);

    // Convert SVG to PNG using ImageMagick
    // -density 300: Set DPI for better quality
    // -background transparent: Keep transparent background
    // -resize 128x128: Resize to a reasonable size for mobile
    execSync(
      `convert -density 300 -background transparent -resize 128x128 "${svgPath}" "${pngPath}"`
    );

    convertedCount++;

    if ((index + 1) % 100 === 0) {
      console.log(`Converted ${index + 1}/${svgFiles.length} files...`);
    }
  } catch (error) {
    console.error(`Error converting ${svgFile}:`, error.message);
    errorCount++;
  }
});

console.log(`\nConversion complete!`);
console.log(`✅ Successfully converted: ${convertedCount} files`);
console.log(`❌ Errors: ${errorCount} files`);
console.log(`\nPNG files saved to: ${PNG_OUTPUT_DIR}`);

// Create a summary file
const summary = {
  totalSvgFiles: svgFiles.length,
  convertedCount,
  errorCount,
  timestamp: new Date().toISOString(),
  pngSize: "128x128",
  dpi: 300,
};

fs.writeFileSync(
  path.join(PNG_OUTPUT_DIR, "conversion-summary.json"),
  JSON.stringify(summary, null, 2)
);

console.log(
  `\nSummary saved to: ${path.join(PNG_OUTPUT_DIR, "conversion-summary.json")}`
);
