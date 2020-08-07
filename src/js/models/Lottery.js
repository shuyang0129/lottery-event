/**
 * @name Lottery
 * @description
 * 提供九宮格基本的操作：
 * 亮燈、熄燈、點亮下一個燈、Reset、增加index、判斷是否在有效index範圍
 */

export default class Lottery {
  constructor(prizes) {
    this.prizes = prizes
    this.length = 8
    this.currentOrder = -1
  }

  // 點亮下一個Box
  activeNextBox() {
    this.inActiveBox(this.currentOrder)
    this.increaseOrder()
    this.activeBox(this.currentOrder)
  }

  // 點亮指定Box
  activeBox(order) {
    if (this.isValidOrder) this.box(order).classList.add('is-active')
  }

  // 熄滅指定Box
  inActiveBox(order) {
    if (this.isValidOrder) this.box(order).classList.remove('is-active')
  }

  // 回到預設狀態
  reset() {
    this.inActiveBox(this.currentOrder)
    this.currentOrder = -1
  }

  // 增加Index，超過8即回到0
  increaseOrder() {
    this.currentOrder = (this.currentOrder + 1) % this.length
  }

  // 取得指定box的DOM
  box(order) {
    return document.querySelector(`[data-order="${order}"]`)
  }

  // Getter | 是否為有效Index
  get isValidOrder() {
    return this.currentOrder >= 0 && this.currentOrder < this.length
  }

  // Getter | 依據prizeNum，排序後的獎項
  get sortedPrizes() {
    const sortByPrizeNum = (a, b) => a.prizeNum - b.prizeNum
    return this.prizes.sort(sortByPrizeNum)
    // return this.prizes
  }

  // Getter | 依據prizeNum，排序後的獎項IDs(後來沒有id，用prizeNum)
  get sortedIds() {
    const sortByPrizeNum = (a, b) => a.prizeNum - b.prizeNum
    const onlyIds = ({ prizeNum }) => prizeNum

    if (this.prizes) return this.prizes.sort(sortByPrizeNum).map(onlyIds)
  }
}
