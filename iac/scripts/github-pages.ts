#!/usr/bin/env tsx
import { Octokit } from "@octokit/rest";
import { config } from "dotenv";
import { resolve } from "path";
import { execSync } from "child_process";
import { existsSync, readFileSync, writeFileSync, mkdirSync, rmSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";

// Load environment variables
config({ path: resolve("providers/github.env") });

// Configuration
const owner = process.env.GITHUB_OWNER || "your-username";
const repo = process.env.GITHUB_REPO || "gemini-cli-mcp-for-claude-code";
const deployBranch = process.env.DEPLOY_BRANCH || "gh-pages";
const customDomain = process.env.CUSTOM_DOMAIN;
const landingPath = resolve("../landing");

// Validate GitHub token if provided
const githubToken = process.env.GITHUB_TOKEN;
const octokit = githubToken ? new Octokit({ auth: githubToken }) : null;

// Colors for console output
const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m"
};

function log(message: string, type: "info" | "error" | "warning" = "info") {
  const prefix = {
    info: `${colors.green}[INFO]${colors.reset}`,
    error: `${colors.red}[ERROR]${colors.reset}`,
    warning: `${colors.yellow}[WARNING]${colors.reset}`
  };
  console.log(`${prefix[type]} ${message}`);
}

async function checkGitHubPages() {
  if (!octokit) {
    log("No GitHub token provided, skipping Pages configuration", "warning");
    return;
  }

  try {
    const { data } = await octokit.repos.getPages({ owner, repo });
    log(`GitHub Pages is already enabled at: ${data.html_url}`);
    return data;
  } catch (error: any) {
    if (error.status === 404) {
      log("GitHub Pages not enabled, will enable after deployment", "warning");
      return null;
    }
    throw error;
  }
}

async function enableGitHubPages() {
  if (!octokit) {
    log("Cannot enable GitHub Pages without a token", "warning");
    log("Please enable it manually in repository settings", "warning");
    return;
  }

  try {
    log("Enabling GitHub Pages...");
    const response = await octokit.repos.createPagesSite({
      owner,
      repo,
      source: {
        branch: deployBranch,
        path: "/"
      },
      build_type: "legacy" // Use legacy for static sites
    });
    
    log(`GitHub Pages enabled at: ${response.data.html_url}`);
    return response.data;
  } catch (error: any) {
    log(`Failed to enable GitHub Pages: ${error.message}`, "error");
    log("Please enable it manually in repository settings", "warning");
  }
}

async function deploy() {
  log("Deploying landing page to GitHub Pages");
  log(`Repository: ${owner}/${repo}`);
  log(`Deploy branch: ${deployBranch}`);

  // Check if landing directory exists
  if (!existsSync(landingPath)) {
    log(`Landing directory not found at: ${landingPath}`, "error");
    process.exit(1);
  }

  // Build the landing page
  log("Building landing page...");
  try {
    execSync("bun run build", {
      cwd: landingPath,
      stdio: "inherit"
    });
    log("Build completed successfully");
  } catch (error) {
    log("Build failed", "error");
    process.exit(1);
  }

  // Create a temporary directory for deployment
  const tempDir = join(tmpdir(), `gh-pages-deploy-${Date.now()}`);
  mkdirSync(tempDir, { recursive: true });

  try {
    // Initialize git repo in temp directory
    log("Preparing deployment...");
    execSync("git init", { cwd: tempDir });
    execSync(`git remote add origin https://github.com/${owner}/${repo}.git`, { cwd: tempDir });

    // Try to fetch existing gh-pages branch
    try {
      execSync(`git fetch origin ${deployBranch}:${deployBranch}`, { cwd: tempDir });
      execSync(`git checkout ${deployBranch}`, { cwd: tempDir });
      log(`Checked out existing ${deployBranch} branch`);
    } catch {
      log(`Creating new ${deployBranch} branch`);
      execSync(`git checkout -b ${deployBranch}`, { cwd: tempDir });
    }

    // Copy build files
    log("Copying build files...");
    const distPath = join(landingPath, "dist");
    if (!existsSync(distPath)) {
      log("Build output directory not found", "error");
      process.exit(1);
    }

    // Copy all files from dist to temp directory
    execSync(`cp -r ${distPath}/* ${tempDir}/`, { stdio: "inherit" });

    // Add .nojekyll file to prevent Jekyll processing
    writeFileSync(join(tempDir, ".nojekyll"), "");

    // Add CNAME file if custom domain is specified
    if (customDomain) {
      log(`Adding CNAME file for custom domain: ${customDomain}`);
      writeFileSync(join(tempDir, "CNAME"), customDomain);
    }

    // Configure git
    if (process.env.GIT_USER_NAME) {
      execSync(`git config user.name "${process.env.GIT_USER_NAME}"`, { cwd: tempDir });
    }
    if (process.env.GIT_USER_EMAIL) {
      execSync(`git config user.email "${process.env.GIT_USER_EMAIL}"`, { cwd: tempDir });
    }

    // Stage and commit changes
    execSync("git add -A", { cwd: tempDir });
    
    try {
      execSync('git commit -m "Deploy to GitHub Pages via Alchemy"', { cwd: tempDir });
      log("Created deployment commit");
    } catch {
      log("No changes to deploy", "warning");
      return;
    }

    // Push to GitHub
    log("Pushing to GitHub...");
    const pushUrl = githubToken 
      ? `https://${githubToken}@github.com/${owner}/${repo}.git`
      : `https://github.com/${owner}/${repo}.git`;

    execSync(`git push ${pushUrl} ${deployBranch} --force`, { 
      cwd: tempDir,
      stdio: "inherit"
    });

    log("Deployment pushed successfully!");

    // Check/enable GitHub Pages
    const pagesInfo = await checkGitHubPages();
    if (!pagesInfo) {
      await enableGitHubPages();
    }

    log("Deployment completed successfully!");
    log(`Your site will be available at: https://${owner}.github.io/${repo}/`);
    
    if (customDomain) {
      log(`Custom domain: https://${customDomain}`);
      log("Make sure to configure DNS CNAME record pointing to:");
      log(`${owner}.github.io`);
    }

  } finally {
    // Clean up temp directory
    rmSync(tempDir, { recursive: true, force: true });
  }
}

// Run deployment
if (process.argv.includes("--help")) {
  console.log(`
GitHub Pages Deployment Script

Usage: bun run deploy:landing:github [options]

Options:
  --help    Show this help message

Environment Variables:
  GITHUB_TOKEN     GitHub personal access token (optional but recommended)
  GITHUB_OWNER     Repository owner (default: your-username)
  GITHUB_REPO      Repository name (default: gemini-cli-mcp-for-claude-code)
  DEPLOY_BRANCH    Branch to deploy to (default: gh-pages)
  CUSTOM_DOMAIN    Custom domain for GitHub Pages
  GIT_USER_NAME    Git user name for commits
  GIT_USER_EMAIL   Git user email for commits
  `);
  process.exit(0);
}

deploy().catch(error => {
  log(error.message, "error");
  process.exit(1);
});