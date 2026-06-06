# Getting the Twenty CRM Source Code

This fork requires the Twenty CRM source code to build a custom Docker image. The source is **not included** in this repository.

## Option 1: Request from Twenty (Recommended)

- Contact Twenty support or your account manager
- Request access to the Twenty CRM source repository
- They provide access to `twentycrm/twenty` (private repo)
- Clone and push to this repo

## Option 2: Extract from Docker Image (Advanced)

```bash
# Create a container from the image
docker create --name twenty-extract twentycrm/twenty:latest

# Copy the source (if present in image layers)
docker cp twenty-extract:/app ./twenty-source

# Clean up
docker rm twenty-extract
```

Note: The production image may only contain compiled output, not source.

## Option 3: Use create-twenty-app as Base

```bash
npx create-twenty-app@latest my-twenty-app
cd my-twenty-app
# This creates a Twenty *application*, not the core CRM
# Not suitable for building the core CRM image
```

## Once You Have the Source

```bash
# 1. Copy Twenty source to this repo
cp -r /path/to/twenty-source/* /path/to/twenty-bookd/

# 2. Ensure our custom files are in place (they already are)
# src/agents/bookd-managed-agents.ts
# src/skills/bookd-crm-skills.ts
# src/logic-functions/run-bookd-ai.ts
# src/roles/default-role.ts

# 3. Commit and push
git add .
git commit -m "feat: add Twenty CRM source code"
git push origin main

# 4. GitHub Actions will build and push the image
```

## Verification

After pushing with source:
1. Check GitHub Actions: https://github.com/Kingvelazquez013/twenty-bookd/actions
2. Verify image published: ghcr.io/kingvelazquez013/twenty-bookd
3. Update book'd VPS docker-compose.yml to use the new image