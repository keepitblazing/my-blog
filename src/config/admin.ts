// 관리자 IP 목록
export const ADMIN_IPS = process.env.ADMIN_IPS
  ? process.env.ADMIN_IPS.split(",")
  : ["127.0.0.1", "::1"]; // 기본값으로 localhost IP들 설정
