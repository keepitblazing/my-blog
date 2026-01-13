#!/bin/bash

# SSL 인증서 갱신 스크립트
# crontab에 추가: 0 0 */15 * * /home/ubuntu/blog/deploy/renew-ssl.sh >> /var/log/certbot-renew.log 2>&1

certbot renew --quiet --nginx

# nginx 재시작
systemctl reload nginx

echo "[$(date)] SSL certificate renewal completed"
