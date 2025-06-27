#!/usr/bin/env tsx
import { config } from "dotenv";
import { resolve } from "path";
import { execSync } from "child_process";
import { existsSync, readFileSync } from "fs";

// Load environment variables
config({ path: resolve("providers/mintlify.env") });

// Configuration
const docsPath = resolve("../docs");
const apiKey = process.env.MINTLIFY_API_KEY;
const subdomain = process.env.MINTLIFY_SUBDOMAIN;
const customDomain = process.env.CUSTOM_DOMAIN;

// Colors for console output
const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m"
};

function log(message: string, type: "info" | "error" | "warning" | "success" = "info") {
  const prefix = {
    info: `${colors.blue}[INFO]${colors.reset}`,
    error: `${colors.red}[ERROR]${colors.reset}`,
    warning: `${colors.yellow}[WARNING]${colors.reset}`,
    success: `${colors.green}[SUCCESS]${colors.reset}`
  };
  console.log(`${prefix[type]} ${message}`);
}

async function checkAuth() {
  if (!apiKey) {
    log("MINTLIFY_API_KEY not set, checking for existing authentication...", "warning");
    
    try {
      execSync("bunx mintlify whoami", { stdio: "pipe" });
      log("Already authenticated with Mintlify", "success");
      return true;
    } catch {
      log("Not authenticated with Mintlify", "error");
      log("Please run: bunx mintlify login", "info");
      log("Or set MINTLIFY_API_KEY in providers/mintlify.env", "info");
      return false;
    }
  }
  
  log("Using MINTLIFY_API_KEY for authentication", "info");
  return true;
}

function getSubdomain(): string | null {
  // First priority: environment variable
  if (subdomain) {
    return subdomain;
  }

  // Second priority: extract from mint.json
  const mintJsonPath = resolve(docsPath, "mint.json");
  if (existsSync(mintJsonPath)) {
    try {
      const mintConfig = JSON.parse(readFileSync(mintJsonPath, "utf-8"));
      if (mintConfig.subdomain) {
        log(`Found subdomain in mint.json: ${mintConfig.subdomain}`, "info");
        return mintConfig.subdomain;
      }
    } catch (error) {
      log("Could not parse mint.json", "warning");
    }
  }

  return null;
}

async function deploy() {
  log("Deploying documentation to Mintlify.com", "info");
  log(`Docs directory: ${docsPath}`, "info");

  // Check if docs directory exists
  if (!existsSync(docsPath)) {
    log(`Docs directory not found at: ${docsPath}`, "error");
    process.exit(1);
  }

  // Check if mint.json exists
  if (!existsSync(resolve(docsPath, "mint.json"))) {
    log("mint.json not found in docs directory", "error");
    process.exit(1);
  }

  // Check authentication
  const isAuthenticated = await checkAuth();
  if (!isAuthenticated) {
    process.exit(1);
  }

  // Get subdomain
  const deploySubdomain = getSubdomain();
  if (!deploySubdomain) {
    log("No subdomain specified", "error");
    log("Set MINTLIFY_SUBDOMAIN in providers/mintlify.env or add it to mint.json", "info");
    process.exit(1);
  }

  // Validate Mintlify configuration
  log("Validating Mintlify configuration...", "info");
  try {
    execSync("bunx mintlify validate", {
      cwd: docsPath,
      stdio: "inherit"
    });
    log("Mintlify configuration is valid", "success");
  } catch (error) {
    log("Mintlify validation failed", "error");
    process.exit(1);
  }

  // Deploy to Mintlify.com
  log(`Deploying to ${deploySubdomain}.mintlify.app...`, "info");
  
  try {
    const deployCommand = apiKey 
      ? `MINTLIFY_API_KEY="${apiKey}" bunx mintlify deploy`
      : "bunx mintlify deploy";

    execSync(deployCommand, {
      cwd: docsPath,
      stdio: "inherit",
      shell: true
    });

    log("Deployment completed successfully!", "success");
    log(`Your documentation is available at: https://${deploySubdomain}.mintlify.app`, "info");

    // Check deployment status
    try {
      log("Checking deployment status...", "info");
      execSync("bunx mintlify status", {
        cwd: docsPath,
        stdio: "inherit"
      });
    } catch {
      log("Could not retrieve deployment status", "warning");
    }

    // Custom domain instructions
    if (customDomain) {
      console.log("");
      log(`To set up custom domain (${customDomain}):`, "info");
      log(`1. Add a CNAME record pointing to: ${deploySubdomain}.mintlify.app`, "info");
      log("2. Update your mint.json with the custom domain", "info");
      log("3. Redeploy with this script", "info");
    }

  } catch (error) {
    log("Deployment failed", "error");
    console.error(error);
    process.exit(1);
  }
}

// Parse command line arguments
if (process.argv.includes("--help")) {
  console.log(`
Mintlify.com Deployment Script

Usage: bun run deploy:docs:mintlify [options]

Options:
  --help    Show this help message

Environment Variables:
  MINTLIFY_API_KEY      API key for authentication (optional if logged in)
  MINTLIFY_SUBDOMAIN    Your Mintlify subdomain (required)
  CUSTOM_DOMAIN         Custom domain for reference (optional)

Configuration:
  1. Copy providers/mintlify.env.example to providers/mintlify.env
  2. Fill in your Mintlify credentials
  3. Run this script

Note: You must either be logged in via 'bunx mintlify login' or
      provide MINTLIFY_API_KEY in the environment
  `);
  process.exit(0);
}

deploy().catch(error => {
  log(error.message, "error");
  process.exit(1);
});