import { z } from "zod"

export class ValidateUtility {
  public static isEmptyString(value: string): boolean {
    return value === ""
  }

  public static isInt(value: unknown): value is number {
    return Number.isInteger(value)
  }

  public static isIntString(value: string): value is string {
    return Number.isInteger(Number(value))
  }

  public static isGreaterThanEqualLen(value: string, length: number): boolean {
    return value.length >= length
  }

  public static isLessThanEqualLen(value: string, length: number): boolean {
    return value.length <= length
  }

  public static isEmail(value: string): boolean {
    const { success } = z.string().email().safeParse(value)
    return success
  }
}
