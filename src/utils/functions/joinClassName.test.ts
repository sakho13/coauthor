import { joinClassName } from "./joinClassName"

describe("joinClassName", () => {
  test("複数を半角スペースで結合", () => {
    const className = joinClassName("a", "b", "c")
    expect(className).toBe("a b c")
  })

  test("単一テキスト", () => {
    const className = joinClassName("a")
    expect(className).toBe("a")
  })
})
