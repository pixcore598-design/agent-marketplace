#!/bin/bash

# AgentMarket 部署脚本
# 使用方法: ./deploy.sh [选项]
#   --build     仅构建镜像
#   --start     启动服务
#   --stop      停止服务
#   --restart   重启服务
#   --logs      查看日志
#   --all       完整部署（默认）

set -e

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 项目目录
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"

# 打印函数
log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# 检查环境
check_env() {
    log_info "检查环境..."
    
    # 检查 Docker
    if ! command -v docker &> /dev/null; then
        log_error "Docker 未安装，请先安装 Docker"
        exit 1
    fi
    
    # 检查 Docker Compose
    if ! docker compose version &> /dev/null; then
        log_error "Docker Compose 未安装"
        exit 1
    fi
    
    # 检查 .env 文件
    if [ ! -f ".env" ]; then
        log_warn ".env 文件不存在，创建默认配置..."
        cat > .env << EOF
# 数据库密码
DB_PASSWORD=your_secure_password_here

# JWT 密钥（生产环境请更换）
JWT_SECRET=your_jwt_secret_here_please_change

# 环境
NODE_ENV=production
EOF
        log_warn "请编辑 .env 文件设置安全密码和密钥"
    fi
    
    log_success "环境检查通过"
}

# 构建镜像
build_images() {
    log_info "构建 Docker 镜像..."
    docker compose build --no-cache
    log_success "镜像构建完成"
}

# 启动服务
start_services() {
    log_info "启动服务..."
    docker compose up -d
    
    log_info "等待服务就绪..."
    sleep 5
    
    # 检查健康状态
    if curl -s http://localhost/health > /dev/null 2>&1; then
        log_success "服务启动成功！"
        echo ""
        echo "================================"
        echo "  🌐 前端: http://localhost"
        echo "  📊 后端: http://localhost:3001"
        echo "  🗄️  数据库: localhost:5432"
        echo "================================"
    else
        log_warn "服务可能还在启动中，请稍后检查"
    fi
}

# 停止服务
stop_services() {
    log_info "停止服务..."
    docker compose down
    log_success "服务已停止"
}

# 查看日志
view_logs() {
    log_info "查看日志 (Ctrl+C 退出)..."
    docker compose logs -f
}

# 重启服务
restart_services() {
    stop_services
    start_services
}

# 完整部署
full_deploy() {
    check_env
    build_images
    start_services
}

# 主入口
case "${1:---all}" in
    --build)
        build_images
        ;;
    --start)
        start_services
        ;;
    --stop)
        stop_services
        ;;
    --restart)
        restart_services
        ;;
    --logs)
        view_logs
        ;;
    --all|*)
        full_deploy
        ;;
esac