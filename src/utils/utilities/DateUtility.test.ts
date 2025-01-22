import { DateUtility } from "./DateUtility"

describe("DateUtility", () => {
  describe("convertJstKanjiYYYYMMDD", () => {
    test("2021-01-01", () => {
      const isoDateString = "2021-01-01T00:00:00Z"
      const result = DateUtility.convertJstKanjiYYYYMMDD(isoDateString)
      expect(result).toBe("2021年01月01日")
    })

    test("2021-12-31", () => {
      const isoDateString = "2021-12-31T00:00:00Z"
      const result = DateUtility.convertJstKanjiYYYYMMDD(isoDateString)
      expect(result).toBe("2021年12月31日")
    })
  })

  describe("convertJstHHMM", () => {
    test("00:00", () => {
      const isoDateString = "2021-01-01T00:00:00Z"
      const result = DateUtility.convertJstHHMM(isoDateString)
      expect(result).toBe("09:00")
    })

    test("12:00", () => {
      const isoDateString = "2021-01-01T12:00:00Z"
      const result = DateUtility.convertJstHHMM(isoDateString)
      expect(result).toBe("21:00")
    })

    test("23:59", () => {
      const isoDateString = "2021-01-01T23:59:00Z"
      const result = DateUtility.convertJstHHMM(isoDateString)
      expect(result).toBe("08:59")
    })
  })

  describe("convertJstYYYYMMDDHHMM", () => {
    test("2021-01-01T00:00:00Z", () => {
      const isoDateString = "2021-01-01T00:00:00Z"
      const result = DateUtility.convertJstYYYYMMDDHHMM(isoDateString)
      expect(result).toBe("2021年01月01日 09:00")
    })

    test("2021-12-31T23:59:00Z", () => {
      const isoDateString = "2021-12-31T23:59:00Z"
      const result = DateUtility.convertJstYYYYMMDDHHMM(isoDateString)
      expect(result).toBe("2022年01月01日 08:59")
    })

    test("2021-12-31T12:00:00Z", () => {
      const isoDateString = "2021-12-31T12:00:00Z"
      const result = DateUtility.convertJstYYYYMMDDHHMM(isoDateString)
      expect(result).toBe("2021年12月31日 21:00")
    })
  })
})
