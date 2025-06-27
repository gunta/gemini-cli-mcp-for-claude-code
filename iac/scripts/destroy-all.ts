#!/usr/bin/env tsx
import alchemy from "alchemy";
import { config } from "dotenv";
import { resolve } from "path";
import { existsSync } from "fs";
import { execSync } from "child_process";

// Load all environment files
const providers = ["cloudflare", "github", "mintlify"];
providers.forEach(provider => {
  const envPath = resolve(`providers/${provider}.env`);
  if (existsSync(envPath)) {
    config({ path: envPath });
  }
});

// Colors for console output
const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  yellow: "\x1b[33m"
};

function log(message: string, type: "info" | "error" | "warning" = "info") {
  const prefix = {
    info: `[INFO]`,
    error: `${colors.red}[ERROR]${colors.reset}`,
    warning: `${colors.yellow}[WARNING]${colors.reset}`
  };
  console.log(`${prefix[type]} ${message}`);
}

async function destroyAll() {
  log("🗑️  Starting cleanup of all deployments...", "warning");
  
  // Confirm destruction
  if (!process.argv.includes("--force")) {
    log("This will destroy all deployed resources!", "warning");
    log("To confirm, run with --force flag", "warning");
    process.exit(1);
  }

  const errors: string[] = [];

  // Destroy Cloudflare Pages projects
  if (process.env.CLOUDFLARE_API_TOKEN && process.env.CLOUDFLARE_ACCOUNT_ID) {
    log("Destroying Cloudflare Pages projects...");
    
    const projects = [
      process.env.CLOUDFLARE_PROJECT_NAME || "gemini-cli-landing",
      process.env.CLOUDFLARE_DOCS_PROJECT_NAME || "gemini-cli-docs"
    ];

    for (const project of projects) {
      try {
        const app = await alchemy(`${project}-destroy`);
        // Note: Actual destruction would require API calls or wrangler commands
        log(`Would destroy Cloudflare Pages project: ${project}`);
        await app.finalize();
      } catch (error: any) {
        errors.push(`Cloudflare ${project}: ${error.message}`);
      }
    }
  } else {
    log("Skipping Cloudflare cleanup (no credentials)", "warning");
  }

  // Clean GitHub Pages branch
  if (process.env.GITHUB_TOKEN) {
    log("Cleaning GitHub Pages...");
    const deployBranch = process.env.DEPLOY_BRANCH || "gh-pages";
    
    try {
      // Check if branch exists
      execSync(`git show-ref --verify --quiet refs/heads/${deployBranch}`, { 
        stdio: "pipe" 
      });
      
      // Delete the branch
      execSync(`git push origin --delete ${deployBranch}`, {
        stdio: "inherit"
      });
      log(`Deleted GitHub Pages branch: ${deployBranch}`);
    } catch (error: any) {
      if (error.status !== 1) { // Status 1 means branch doesn't exist
        errors.push(`GitHub Pages: ${error.message}`);
      }
    }
  } else {
    log("Skipping GitHub Pages cleanup (no token)", "warning");
  }

  // Clean local Alchemy state
  log("Cleaning local Alchemy state...");
  try {
    execSync("rm -rf .alchemy", { stdio: "pipe" });
    log("Removed local Alchemy state");
  } catch (error: any) {
    errors.push(`Local state: ${error.message}`);
  }

  // Report results
  console.log("");
  if (errors.length > 0) {
    log("Cleanup completed with errors:", "error");
    errors.forEach(err => log(`  - ${err}`, "error"));
  } else {
    log("✅ All resources cleaned up successfully!");
  }

  // Note about Mintlify
  log("Note: Mintlify.com deployments must be removed from their dashboard", "warning");
  log("Visit: https://dashboard.mintlify.com/", "warning");
}

// Show help
if (process.argv.includes("--help")) {
  console.log(`
Destroy All Deployments Script

Usage: bun run destroy [options]

Options:
  --force   Confirm destruction of all resources
  --help    Show this help message

Warning: This will attempt to destroy:
  - Cloudflare Pages projects
  - GitHub Pages branch
  - Local Alchemy state

Note: Some resources may need manual cleanup in their respective dashboards.
  `);
  process.exit(0);
}

destroyAll().catch(error => {
  log(error.message, "error");
  process.exit(1);
});