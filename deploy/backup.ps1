# PowerShell 数据库备份脚本 / Database Backup Script

# 配置 / Configuration
$DB_NAME = "campus_memory"
$DB_USER = "postgres"
$BACKUP_DIR = "D:\Backups\campus-memory"
$DATE = Get-Date -Format "yyyyMMdd_HHmmss"

# 创建备份目录 / Create backup directory
if (!(Test-Path $BACKUP_DIR)) {
    New-Item -ItemType Directory -Path $BACKUP_DIR
}

# 执行备份 / Execute backup
pg_dump -U $DB_USER $DB_NAME > "$BACKUP_DIR\backup_$DATE.sql"

# 保留最近7天备份 / Keep last 7 days
Get-ChildItem $BACKUP_DIR -Filter "*.sql" |
    Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-7) } |
    Remove-Item

Write-Host "Backup completed: backup_$DATE.sql"
