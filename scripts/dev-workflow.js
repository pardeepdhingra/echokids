#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// Colors for console output
const colors = {
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
  reset: "\x1b[0m",
  bold: "\x1b[1m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  console.log(`\n${colors.bold}${colors.blue}=== ${title} ===${colors.reset}`);
}

function runCommand(command, description, options = {}) {
  try {
    log(`Running: ${description}`, "yellow");
    const result = execSync(command, {
      encoding: "utf8",
      stdio: options.silent ? "pipe" : "inherit",
      cwd: process.cwd(),
    });
    log(`✅ ${description} - COMPLETED`, "green");
    return { success: true, output: result };
  } catch (error) {
    log(`❌ ${description} - FAILED`, "red");
    if (!options.silent) {
      log(`Error: ${error.message}`, "red");
    }
    return { success: false, output: error.stdout || error.message };
  }
}

function showUsage() {
  console.log(`
${colors.bold}${colors.cyan}AAC App Development Workflow${colors.reset}

Usage: npm run dev:workflow [command]

Commands:
  ${colors.green}setup${colors.reset}     - Initial project setup and dependency installation
  ${colors.green}verify${colors.reset}    - Run full verification suite
  ${colors.green}test${colors.reset}      - Run tests with coverage
  ${colors.green}fix${colors.reset}       - Auto-fix linting and formatting issues
  ${colors.green}build${colors.reset}     - Test build for production
  ${colors.green}clean${colors.reset}     - Clean node_modules and reinstall
  ${colors.green}doctor${colors.reset}    - Diagnose common issues
  ${colors.green}pre-push${colors.reset}  - Run all checks before pushing to repository

Examples:
  npm run dev:workflow setup
  npm run dev:workflow verify
  npm run dev:workflow test
`);
}

async function setup() {
  logSection("Project Setup");

  const steps = [
    { cmd: "npm install --legacy-peer-deps", desc: "Installing dependencies" },
    { cmd: "npx husky install", desc: "Setting up Git hooks" },
    { cmd: "npm run verify:quick", desc: "Running initial verification" },
  ];

  for (const step of steps) {
    const result = runCommand(step.cmd, step.desc);
    if (!result.success) {
      log("Setup failed. Please fix the issues and try again.", "red");
      process.exit(1);
    }
  }

  log("\n🎉 Setup completed successfully!", "green");
  log("You can now run: npm start", "cyan");
}

async function verify() {
  logSection("Full Verification Suite");

  const checks = [
    { cmd: "npm run verify:quick", desc: "Quick verification checks" },
    { cmd: "npx tsc --noEmit --skipLibCheck", desc: "TypeScript compilation" },
    { cmd: "npm run lint", desc: "Code quality checks" },
    {
      cmd: "npm test -- --passWithNoTests --coverage",
      desc: "Test suite with coverage",
    },
  ];

  let allPassed = true;
  const results = [];

  for (const check of checks) {
    const result = runCommand(check.cmd, check.desc, { silent: true });
    results.push({ ...check, success: result.success });
    if (!result.success) {
      allPassed = false;
    }
  }

  // Summary
  logSection("Verification Results");
  results.forEach((result) => {
    const status = result.success ? "✅" : "❌";
    const color = result.success ? "green" : "red";
    log(`${status} ${result.desc}`, color);
  });

  if (allPassed) {
    log("\n🎉 All verifications passed!", "green");
    log("Your code is ready for commit/push!", "cyan");
  } else {
    log("\n⚠️ Some verifications failed.", "yellow");
    log("Please fix the issues before committing.", "yellow");
    process.exit(1);
  }
}

async function test() {
  logSection("Running Tests");

  const result = runCommand(
    "npm test -- --coverage --watchAll=false",
    "Running test suite with coverage"
  );

  if (result.success) {
    log("\n✅ All tests passed!", "green");
    log("Coverage report generated in coverage/ directory", "cyan");
  } else {
    log("\n❌ Some tests failed.", "red");
    process.exit(1);
  }
}

async function fix() {
  logSection("Auto-fixing Issues");

  const fixes = [
    { cmd: "npm run lint:fix", desc: "Fixing linting issues" },
    {
      cmd: "npx prettier --write 'src/**/*.{ts,tsx,js,jsx}'",
      desc: "Formatting code",
    },
  ];

  for (const fix of fixes) {
    runCommand(fix.cmd, fix.desc);
  }

  log("\n✅ Auto-fix completed!", "green");
  log(
    "Run 'npm run dev:workflow verify' to check if issues are resolved.",
    "cyan"
  );
}

async function build() {
  logSection("Testing Production Build");

  const result = runCommand(
    "npx expo export --platform web --output-dir dist",
    "Building for production"
  );

  if (result.success) {
    log("\n✅ Build successful!", "green");

    // Check bundle size
    try {
      const stats = fs.statSync("dist");
      if (stats.isDirectory()) {
        const { execSync } = require("child_process");
        const size = execSync("du -sh dist", { encoding: "utf8" });
        log(`Bundle size: ${size.trim()}`, "cyan");
      }
    } catch (error) {
      log("Could not determine bundle size", "yellow");
    }
  } else {
    log("\n❌ Build failed!", "red");
    process.exit(1);
  }
}

async function clean() {
  logSection("Cleaning Project");

  const cleanSteps = [
    { cmd: "rm -rf node_modules", desc: "Removing node_modules" },
    { cmd: "rm -f package-lock.json", desc: "Removing package-lock.json" },
    {
      cmd: "npm install --legacy-peer-deps",
      desc: "Reinstalling dependencies",
    },
  ];

  for (const step of cleanSteps) {
    runCommand(step.cmd, step.desc);
  }

  log("\n✅ Project cleaned and dependencies reinstalled!", "green");
}

async function doctor() {
  logSection("Diagnosing Project Health");

  const diagnostics = [
    {
      name: "Node.js version",
      check: () => {
        const version = process.version;
        const major = parseInt(version.slice(1).split(".")[0]);
        return major >= 18
          ? { success: true, message: version }
          : { success: false, message: `${version} (requires Node 18+)` };
      },
    },
    {
      name: "npm version",
      check: () => {
        try {
          const version = execSync("npm --version", {
            encoding: "utf8",
          }).trim();
          return { success: true, message: version };
        } catch (error) {
          return { success: false, message: "npm not found" };
        }
      },
    },
    {
      name: "Expo CLI",
      check: () => {
        try {
          const version = execSync("npx expo --version", {
            encoding: "utf8",
          }).trim();
          return { success: true, message: version };
        } catch (error) {
          return { success: false, message: "Expo CLI not available" };
        }
      },
    },
    {
      name: "TypeScript",
      check: () => {
        try {
          const version = execSync("npx tsc --version", {
            encoding: "utf8",
          }).trim();
          return { success: true, message: version };
        } catch (error) {
          return { success: false, message: "TypeScript not found" };
        }
      },
    },
    {
      name: "Git hooks",
      check: () => {
        const hookPath = ".husky/pre-commit";
        return fs.existsSync(hookPath)
          ? { success: true, message: "Configured" }
          : { success: false, message: "Not configured" };
      },
    },
  ];

  diagnostics.forEach((diagnostic) => {
    const result = diagnostic.check();
    const status = result.success ? "✅" : "❌";
    const color = result.success ? "green" : "red";
    log(`${status} ${diagnostic.name}: ${result.message}`, color);
  });

  log("\n💡 If any checks failed, run 'npm run dev:workflow setup'", "cyan");
}

async function prePush() {
  logSection("Pre-push Verification");

  log("Running comprehensive checks before push...", "cyan");

  await verify();
  await build();

  log("\n🚀 All checks passed! Ready to push to repository.", "green");
}

// Main execution
const command = process.argv[2];

switch (command) {
  case "setup":
    setup();
    break;
  case "verify":
    verify();
    break;
  case "test":
    test();
    break;
  case "fix":
    fix();
    break;
  case "build":
    build();
    break;
  case "clean":
    clean();
    break;
  case "doctor":
    doctor();
    break;
  case "pre-push":
    prePush();
    break;
  default:
    showUsage();
    break;
}
