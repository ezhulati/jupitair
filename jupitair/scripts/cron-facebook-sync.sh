#!/bin/bash

# Jupitair HVAC - Facebook Reviews & Images Sync Cron Job
# This script runs automatically to keep Facebook content synchronized
# with the website's review and image data.

# Set working directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Log file for cron execution
LOG_FILE="$PROJECT_DIR/logs/facebook-sync.log"

# Create logs directory if it doesn't exist
mkdir -p "$PROJECT_DIR/logs"

# Function to log with timestamp
log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> "$LOG_FILE"
}

# Start sync process
log_message "Starting Facebook sync process"

# Change to project directory
cd "$PROJECT_DIR" || {
    log_message "ERROR: Could not change to project directory $PROJECT_DIR"
    exit 1
}

# Run the Facebook reviews fetcher
log_message "Fetching Facebook reviews and images..."

if node scripts/fetch-facebook-reviews.js >> "$LOG_FILE" 2>&1; then
    log_message "Facebook sync completed successfully"
    
    # Check if we're in a git repository and auto-commit new reviews
    if [ -d ".git" ]; then
        log_message "Checking for changes to commit..."
        
        # Add any new/updated review files
        git add src/data/reviews.json src/data/facebook-images.json public/images/facebook/ 2>/dev/null
        
        # Check if there are changes to commit
        if ! git diff --staged --quiet; then
            git commit -m "chore: automated Facebook reviews sync

- Updated Facebook reviews and images
- Automated sync at $(date '+%Y-%m-%d %H:%M:%S')

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>" >> "$LOG_FILE" 2>&1
            
            log_message "Changes committed to git"
        else
            log_message "No new changes to commit"
        fi
    fi
    
    # Optional: Trigger rebuild/deployment if using CI/CD
    # Uncomment the line below if you want automatic deployment
    # curl -X POST "$DEPLOY_WEBHOOK_URL" >> "$LOG_FILE" 2>&1
    
else
    log_message "ERROR: Facebook sync failed"
    exit 1
fi

log_message "Facebook sync process completed"

# Clean up old log entries (keep last 30 days)
find "$PROJECT_DIR/logs" -name "facebook-sync.log" -mtime +30 -delete 2>/dev/null

exit 0