export class DateUtility {
  public static convertToLocalDateTime(isoDateString: string) {
    // ISO 8601形式の日時をDateオブジェクトに変換
    const utcDate = new Date(isoDateString)

    // ローカルの日時を取得
    const localDate = utcDate.toLocaleString()

    return localDate
  }
}
