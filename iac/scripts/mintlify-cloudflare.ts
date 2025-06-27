#!/usr/bin/env tsx
import alchemy from "alchemy";
import { PagesProject } from "alchemy/cloudflare";
import { config } from "dotenv";
import { resolve } from "path";
import { execSync } from "child_process";
import { existsSync } from "fs";

// Load environment variables
config({ path: resolve("providers/cloudflare.env") });

// Configuration
const projectName = process.env.CLOUDFLARE_DOCS_PROJECT_NAME || "gemini-cli-docs";
const branch = process.env.DEPLOY_BRANCH || "main";
const docsPath = resolve("../docs");

// Validate environment
if (!process.env.CLOUDFLARE_ACCOUNT_ID) {
  console.error("❌ CLOUDFLARE_ACCOUNT_ID environment variable is not set");
  console.error("   Please set it in providers/cloudflare.env");
  process.exit(1);
}

if (!process.env.CLOUDFLARE_API_TOKEN) {
  console.error("❌ CLOUDFLARE_API_TOKEN environment variable is not set");
  console.error("   Please set it in providers/cloudflare.env");
  process.exit(1);
}

// Check if docs directory exists
if (!existsSync(docsPath)) {
  console.error("❌ Docs directory not found at:", docsPath);
  process.exit(1);
}

// Check if mint.json exists
if (!existsSync(resolve(docsPath, "mint.json"))) {
  console.error("❌ mint.json not found in docs directory");
  process.exit(1);
}

async function deploy() {
  console.log("🚀 Deploying Mintlify documentation to Cloudflare Pages");
  console.log(`📦 Project: ${projectName}`);
  console.log(`🌿 Branch: ${branch}`);
  console.log(`📂 Docs path: ${docsPath}`);

  // Validate Mintlify configuration
  console.log("🔍 Validating Mintlify configuration...");
  try {
    execSync("bunx mintlify validate", {
      cwd: docsPath,
      stdio: "inherit"
    });
    console.log("✅ Mintlify configuration is valid");
  } catch (error) {
    console.error("❌ Mintlify validation failed");
    process.exit(1);
  }

  // Build the documentation
  console.log("🔨 Building Mintlify documentation...");
  try {
    execSync("bunx mintlify build", {
      cwd: docsPath,
      stdio: "inherit"
    });
    console.log("✅ Build completed successfully");
  } catch (error) {
    console.error("❌ Build failed:", error);
    process.exit(1);
  }

  // Check if build output exists
  const buildPath = resolve(docsPath, ".mintlify/build");
  if (!existsSync(buildPath)) {
    console.error("❌ Build output not found at:", buildPath);
    process.exit(1);
  }

  // Initialize Alchemy
  const app = await alchemy(`${projectName}-deployment`);

  // Define the Pages project for documentation
  const docsPages = await PagesProject("docs", {
    name: projectName,
    production_branch: branch,
    build_config: {
      build_command: "bunx mintlify build",
      destination_dir: ".mintlify/build",
      root_dir: "docs"
    },
    deployment_configs: {
      preview: {
        environment_variables: {
          NODE_ENV: { value: "preview" }
        }
      },
      production: {
        environment_variables: {
          NODE_ENV: { value: "production" }
        }
      }
    },
    source: {
      type: "github",
      config: {
        owner: process.env.GITHUB_OWNER || "your-github-username",
        repo: process.env.GITHUB_REPO || "gemini-cli-mcp-for-claude-code",
        production_branch: branch,
        pr_comments_enabled: true,
        deployments_enabled: true
      }
    }
  });

  // Alternative deployment method using wrangler directly
  if (!process.env.GITHUB_OWNER) {
    console.log("📤 Using direct upload with wrangler...");
    try {
      execSync(
        `bunx wrangler pages deploy ${buildPath} --project-name="${projectName}" --branch="${branch}"`,
        {
          env: {
            ...process.env,
            CLOUDFLARE_ACCOUNT_ID: process.env.CLOUDFLARE_ACCOUNT_ID,
            CLOUDFLARE_API_TOKEN: process.env.CLOUDFLARE_API_TOKEN
          },
          stdio: "inherit"
        }
      );
      console.log("✅ Direct deployment completed!");
    } catch (error) {
      console.error("❌ Direct deployment failed:", error);
      console.log("   Consider using GitHub integration instead");
    }
  }

  // Finalize the deployment
  await app.finalize();

  console.log("✅ Deployment configuration created!");
  console.log(`🌐 Your documentation will be available at: https://${projectName}.pages.dev`);
  console.log("");
  console.log("📝 Note: If using GitHub integration, push your code to trigger deployment");

  // Clean up build artifacts unless --keep-build flag is used
  if (!process.argv.includes("--keep-build")) {
    console.log("🧹 Cleaning up build artifacts...");
    try {
      execSync(`rm -rf ${buildPath}`, { stdio: "inherit" });
    } catch (error) {
      console.warn("⚠️  Could not clean up build artifacts");
    }
  }
}

// Handle destroy flag
if (process.argv.includes("--destroy")) {
  console.log("🗑️  Destroying Cloudflare Pages project...");
  deploy().catch(console.error);
} else if (process.argv.includes("--help")) {
  console.log(`
Mintlify to Cloudflare Pages Deployment Script

Usage: bun run deploy:docs:cloudflare [options]

Options:
  --keep-build   Keep build artifacts after deployment
  --destroy      Destroy the deployment
  --help         Show this help message

Environment Variables:
  CLOUDFLARE_ACCOUNT_ID      Your Cloudflare Account ID (required)
  CLOUDFLARE_API_TOKEN       Cloudflare API Token with Pages permissions (required)
  CLOUDFLARE_DOCS_PROJECT_NAME  Project name (default: gemini-cli-docs)
  DEPLOY_BRANCH              Branch to deploy (default: main)
  GITHUB_OWNER               GitHub owner for integration (optional)
  GITHUB_REPO                GitHub repository name (optional)
  `);
  process.exit(0);
} else {
  deploy().catch(console.error);
}