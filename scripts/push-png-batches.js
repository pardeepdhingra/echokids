const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// Configuration
const CDN_DIR = path.join(__dirname, "../../mulberry-symbols-cdn");
const PNG_DIR = path.join(CDN_DIR, "png");
const BATCH_SIZE = 50; // Push 50 files at a time

// Change to CDN directory
process.chdir(CDN_DIR);

// Get all PNG files
const pngFiles = fs
  .readdirSync(PNG_DIR)
  .filter((file) => file.endsWith(".png"));

console.log(
  `Found ${pngFiles.length} PNG files to push in batches of ${BATCH_SIZE}`
);

// Push files in batches
for (let i = 0; i < pngFiles.length; i += BATCH_SIZE) {
  const batch = pngFiles.slice(i, i + BATCH_SIZE);
  const batchNumber = Math.floor(i / BATCH_SIZE) + 1;
  const totalBatches = Math.ceil(pngFiles.length / BATCH_SIZE);

  console.log(
    `\n--- Pushing batch ${batchNumber}/${totalBatches} (${batch.length} files) ---`
  );

  try {
    // Add files in this batch
    batch.forEach((file) => {
      execSync(`git add png/${file}`);
    });

    // Commit this batch
    execSync(
      `git commit -m "Add PNG symbols batch ${batchNumber}/${totalBatches} (${batch.length} files)"`
    );

    // Push this batch
    execSync("git push origin main");

    console.log(`✅ Successfully pushed batch ${batchNumber}`);

    // Small delay between batches
    if (i + BATCH_SIZE < pngFiles.length) {
      console.log("Waiting 2 seconds before next batch...");
      setTimeout(() => {}, 2000);
    }
  } catch (error) {
    console.error(`❌ Error pushing batch ${batchNumber}:`, error.message);
    console.log("Stopping batch process due to error");
    break;
  }
}

console.log("\n--- PNG upload process complete ---");
