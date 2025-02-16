import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"

dayjs.extend(utc)
dayjs.extend(timezone)

export class DateUtility {
  /**
   * ISO8601形式の日付文字列を YYYY年MM月DD日 に変換する
   * @param isoDateString ISO8601形式の日付文字列
   * @returns
   */
  public static convertJstKanjiYYYYMMDD(isoDateString: string) {
    const date = dayjs(isoDateString).tz("Asia/Tokyo")
    return date.format("YYYY年MM月DD日")
  }

  /**
   * ISO8601形式の日付文字列を HH:mm に変換する
   * @param isoDateString ISO8601形式の日付文字列
   * @returns
   */
  public static convertJstHHMM(isoDateString: string) {
    const date = dayjs(isoDateString).tz("Asia/Tokyo")
    return date.format("HH:mm")
  }

  /**
   * ISO8601形式の日付文字列を YYYY年MM月DD日 HH:mm に変換する
   * @param isoDateString ISO8601形式の日付文字列
   * @returns
   */
  public static convertJstYYYYMMDDHHMM(isoDateString: string) {
    const date = dayjs(isoDateString).tz("Asia/Tokyo")
    return date.format("YYYY年MM月DD日 HH:mm")
  }
}
