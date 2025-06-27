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
const projectName = process.env.CLOUDFLARE_PROJECT_NAME || "gemini-cli-landing";
const branch = process.env.DEPLOY_BRANCH || "main";
const landingPath = resolve("../landing");

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

// Check if landing directory exists
if (!existsSync(landingPath)) {
  console.error("❌ Landing directory not found at:", landingPath);
  process.exit(1);
}

async function deploy() {
  console.log("🚀 Deploying landing page to Cloudflare Pages");
  console.log(`📦 Project: ${projectName}`);
  console.log(`🌿 Branch: ${branch}`);

  // Build the landing page first
  console.log("🔨 Building landing page...");
  try {
    execSync("bun run build", {
      cwd: landingPath,
      stdio: "inherit"
    });
    console.log("✅ Build completed successfully");
  } catch (error) {
    console.error("❌ Build failed:", error);
    process.exit(1);
  }

  // Initialize Alchemy
  const app = await alchemy(`${projectName}-deployment`);

  // Define the Pages project
  const landingPages = await PagesProject("landing", {
    name: projectName,
    production_branch: branch,
    build_config: {
      build_command: "bun run build",
      destination_dir: "dist",
      root_dir: "landing"
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

  // Alternative: Direct upload deployment (if not using GitHub integration)
  if (!process.env.GITHUB_OWNER) {
    console.log("📤 Using direct upload deployment...");
    // Note: Alchemy's PagesProject primarily works with GitHub integration
    // For direct uploads, we'd typically use the Cloudflare API directly
    console.log("⚠️  Direct upload not fully supported by Alchemy yet");
    console.log("   Consider using GitHub integration or wrangler CLI");
  }

  // Finalize the deployment
  await app.finalize();

  console.log("✅ Deployment configuration created!");
  console.log(`🌐 Your site will be available at: https://${projectName}.pages.dev`);
  console.log("");
  console.log("📝 Note: If using GitHub integration, push your code to trigger deployment");
  console.log("   Otherwise, use 'wrangler pages deploy' for direct upload");
}

// Handle destroy flag
if (process.argv.includes("--destroy")) {
  console.log("🗑️  Destroying Cloudflare Pages project...");
  deploy().catch(console.error);
} else {
  deploy().catch(console.error);
}