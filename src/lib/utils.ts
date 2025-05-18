import dayjs from "dayjs";
import "dayjs/locale/ko";

dayjs.locale("ko");

export function formatDate(dateString: string): string {
  return dayjs(dateString).format("YYYY년 MM월 DD일");
}
