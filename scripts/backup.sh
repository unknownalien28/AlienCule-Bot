#!/data/data/com.termux/files/usr/bin/bash

timestamp=$(date +"%Y-%m-%d_%H-%M-%S")
backup_dir="$HOME/Easy-Bot/bot_backups"
mkdir -p "$backup_dir"

tar -czf "$backup_dir/backup_$timestamp.tar.gz" auth_info saved_status commands database .env

echo "✅ Backup completed: $backup_dir/backup_$timestamp.tar.gz"
