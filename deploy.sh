#!/bin/bash

set -e

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 로그 함수
log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# 프로젝트 루트 디렉토리
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# 헬스체크 함수
wait_for_healthy() {
    local service=$1
    local url=$2
    local max_attempts=${3:-30}
    local attempt=1

    log_info "$service 헬스체크 중..."

    while [ $attempt -le $max_attempts ]; do
        if curl -sf "$url" > /dev/null 2>&1; then
            log_success "$service 정상 작동 확인!"
            return 0
        fi
        echo -n "."
        sleep 2
        ((attempt++))
    done

    log_error "$service 헬스체크 실패 (${max_attempts}회 시도)"
    return 1
}

# 메인 배포 로직
main() {
    log_info "========== 배포 시작 =========="

    # 1. 최신 코드 pull
    log_info "Git pull 중..."
    git pull origin main

    # 2. 새 이미지 빌드
    log_info "Docker 이미지 빌드 중..."
    docker compose build --no-cache frontend backend

    # 3. Backend 먼저 업데이트 (Frontend가 의존하므로)
    log_info "Backend 배포 중..."

    # 기존 backend 컨테이너 이름 변경 (백업)
    if docker ps -q -f name=blog-backend > /dev/null 2>&1; then
        docker rename blog-backend blog-backend-old 2>/dev/null || true
    fi

    # 새 backend 시작
    docker compose up -d --no-deps --force-recreate backend

    # Backend 헬스체크
    if wait_for_healthy "Backend" "http://localhost:4000/health" 30; then
        # 이전 컨테이너 제거
        docker rm -f blog-backend-old 2>/dev/null || true
    else
        log_error "Backend 배포 실패, 롤백 중..."
        docker rm -f blog-backend 2>/dev/null || true
        docker rename blog-backend-old blog-backend 2>/dev/null || true
        docker start blog-backend
        exit 1
    fi

    # 4. Frontend 업데이트
    log_info "Frontend 배포 중..."

    # 기존 frontend 컨테이너 이름 변경 (백업)
    if docker ps -q -f name=blog-frontend > /dev/null 2>&1; then
        docker rename blog-frontend blog-frontend-old 2>/dev/null || true
    fi

    # 새 frontend 시작
    docker compose up -d --no-deps --force-recreate frontend

    # Frontend 헬스체크
    if wait_for_healthy "Frontend" "http://localhost:3000" 30; then
        # 이전 컨테이너 제거
        docker rm -f blog-frontend-old 2>/dev/null || true
    else
        log_error "Frontend 배포 실패, 롤백 중..."
        docker rm -f blog-frontend 2>/dev/null || true
        docker rename blog-frontend-old blog-frontend 2>/dev/null || true
        docker start blog-frontend
        exit 1
    fi

    # 5. 사용하지 않는 이미지 정리
    log_info "사용하지 않는 이미지 정리 중..."
    docker image prune -f

    log_success "========== 배포 완료! =========="

    # 상태 확인
    echo ""
    log_info "현재 컨테이너 상태:"
    docker compose ps
}

# 롤백 함수
rollback() {
    log_warn "롤백 실행 중..."

    # 이전 이미지로 롤백
    docker compose down
    docker compose up -d

    log_success "롤백 완료"
}

# 스크립트 실행
case "${1:-deploy}" in
    deploy)
        main
        ;;
    rollback)
        rollback
        ;;
    *)
        echo "사용법: $0 {deploy|rollback}"
        exit 1
        ;;
esac
