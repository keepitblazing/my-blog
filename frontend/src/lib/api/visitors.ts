import { api } from './client';

export interface VisitorLogData {
  visitorHash: string;
  sessionId: string;
  cookieId: string;
  ipAddress: string;
  userAgent: string;
  pagePath: string;
}

export async function logVisitor(data: VisitorLogData): Promise<void> {
  await api.post('/visitors/log', data);
}

export async function getDailyVisitorCount(date?: string): Promise<number> {
  const query = date ? `?date=${date}` : '';
  const result = await api.get<{ count: number }>(`/visitors/count${query}`);
  return result.count;
}

export async function getVisitorStats(days: number = 30) {
  return api.get(`/visitors/stats?days=${days}`);
}
