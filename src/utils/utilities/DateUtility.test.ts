import { DateUtility } from "./DateUtility"

describe("DateUtility", () => {
  describe("convertToLocalDateTime", () => {
    test("should convert UTC date string to local date string", () => {
      const isoDateString = "2022-01-01T00:00:00Z"
      const expected = "2022/1/1 9:00:00"
      const actual = DateUtility.convertToLocalDateTime(isoDateString)
      expect(actual).toBe(expected)
    })
  })
})
