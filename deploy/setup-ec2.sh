#!/bin/bash

# EC2 Ubuntu 초기 설정 스크립트
# 사용법: chmod +x setup-ec2.sh && sudo ./setup-ec2.sh

set -e

echo "=== 패키지 업데이트 ==="
apt update && apt upgrade -y

echo "=== Docker 설치 ==="
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
usermod -aG docker ubuntu
rm get-docker.sh

echo "=== Docker Compose 설치 ==="
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

echo "=== Nginx 설치 ==="
apt install -y nginx

echo "=== Certbot 설치 ==="
apt install -y certbot python3-certbot-nginx

echo "=== Git 설치 ==="
apt install -y git

echo "=== 방화벽 설정 ==="
ufw allow 22
ufw allow 80
ufw allow 443
ufw --force enable

echo "=== 디렉토리 생성 ==="
mkdir -p /home/ubuntu/blog
mkdir -p /var/www/certbot
chown -R ubuntu:ubuntu /home/ubuntu/blog

echo "=== 설정 완료 ==="
echo ""
echo "다음 단계:"
echo "1. /home/ubuntu/blog 에서 git clone"
echo "2. .env 파일 생성"
echo "3. SSL 인증서 발급: sudo certbot --nginx -d keepitblazing.kr -d api.keepitblazing.kr"
echo "4. nginx 설정 복사: sudo cp deploy/nginx.conf /etc/nginx/sites-available/blog"
echo "5. sudo ln -s /etc/nginx/sites-available/blog /etc/nginx/sites-enabled/"
echo "6. sudo nginx -t && sudo systemctl reload nginx"
echo "7. docker-compose up -d --build"
echo "8. crontab 등록: sudo crontab -e"
echo "   0 0 */15 * * /home/ubuntu/blog/deploy/renew-ssl.sh >> /var/log/certbot-renew.log 2>&1"
