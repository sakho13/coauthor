/**
 * `target` にあるすべての要素が `items` に存在しない場合 `true` を返す
 * @param items 検索対象
 * @param target 検索値
 * @returns
 */
export function notExistAllItems(items: string[], target: string[]) {
  return target.every((t) => !items.includes(t))
}
