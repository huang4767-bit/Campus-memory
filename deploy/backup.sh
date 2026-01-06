#!/bin/bash
# PostgreSQL 数据库备份脚本 / Database Backup Script

# 配置 / Configuration
DB_NAME="campus_memory"
DB_USER="postgres"
BACKUP_DIR="/var/backups/campus-memory"
DATE=$(date +%Y%m%d_%H%M%S)

# 创建备份目录 / Create backup directory
mkdir -p $BACKUP_DIR

# 执行备份 / Execute backup
pg_dump -U $DB_USER $DB_NAME > "$BACKUP_DIR/backup_$DATE.sql"

# 保留最近7天备份 / Keep last 7 days
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete

echo "Backup completed: backup_$DATE.sql"
