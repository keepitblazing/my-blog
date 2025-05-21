import dayjs from "dayjs";
import "dayjs/locale/ko";

dayjs.locale("ko");

export function formatDateMobile(dateString: string): string {
  return dayjs(dateString).format("YY.MM.DD");
}

export function formatDateDesktop(dateString: string): string {
  return dayjs(dateString).format("YYYY년 MM월 DD일");
}
