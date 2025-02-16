import { notExistAllItems } from "./notExistAllItems"

describe("notExistAllItems", () => {
  test("検索対象が空", () => {
    const result = notExistAllItems([], ["a", "b", "c"])
    expect(result).toBe(true)
  })

  test("検索対象と検索値が完全一致", () => {
    const result = notExistAllItems(["a", "b", "c"], ["a", "b", "c"])
    expect(result).toBe(false)
  })

  test("検索対象と検索値が部分一致(検索対象 > 検索値)", () => {
    const result = notExistAllItems(["a", "b", "c"], ["a", "b"])
    expect(result).toBe(false)
  })

  test("検索対象と検索値が部分一致(検索対象 < 検索値)", () => {
    const result = notExistAllItems(["a", "b"], ["a", "b", "c"])
    expect(result).toBe(false)
  })

  test("検索対象が空ではないが検索対象と検索値が完全不一致", () => {
    const result = notExistAllItems(["a", "b"], ["c", "d"])
    expect(result).toBe(true)
  })
})
