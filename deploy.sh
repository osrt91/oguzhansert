#!/bin/bash
set -e

APP_NAME="oguzhansert"
APP_DIR="/opt/oguzhansert"
REPO="https://github.com/osrt91/oguzhansert.git"
BRANCH="main"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

log() { echo -e "${GREEN}[DEPLOY]${NC} $1"; }
err() { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

# Rollback mode
if [ "$1" == "--rollback" ]; then
  log "Rolling back to previous version..."
  cd $APP_DIR
  if [ -d ".next.backup" ]; then
    rm -rf .next
    mv .next.backup .next
    pm2 restart $APP_NAME
    log "Rollback complete!"
  else
    err "No backup found!"
  fi
  exit 0
fi

log "Deploying $APP_NAME..."

# Navigate to app directory
cd $APP_DIR

# Backup current build
if [ -d ".next" ]; then
  log "Backing up current build..."
  rm -rf .next.backup
  cp -r .next .next.backup
fi

# Pull latest code
log "Pulling latest code..."
git pull origin $BRANCH

# Install dependencies
log "Installing dependencies..."
pnpm install --frozen-lockfile

# Build
log "Building application..."
pnpm build

# Restart PM2
log "Restarting PM2 process..."
pm2 restart $APP_NAME || pm2 start ecosystem.config.cjs

log "Deploy complete!"
log "Commit: $(git log --oneline -1)"
