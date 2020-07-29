/**
 * @name Lottery
 * @description
 * 提供九宮格基本的操作：
 * 亮燈、熄燈、點亮下一個燈、Reset、增加index、判斷是否在有效index範圍
 */

export default class Lottery {
  constructor() {
    this.length = 8
    this.currentOrder = -1
  }

  activeNextBox() {
    this.inActiveBox(this.currentOrder)
    this.increaseOrder()
    this.activeBox(this.currentOrder)
  }

  activeBox(order) {
    if (this.isValidOrder) this.box(order).classList.add('is-active')
  }

  inActiveBox(order) {
    if (this.isValidOrder) this.box(order).classList.remove('is-active')
  }

  reset() {
    this.inActiveBox(this.currentOrder)
    this.currentOrder = -1
  }

  increaseOrder() {
    this.currentOrder = (this.currentOrder + 1) % this.length
  }

  box(order) {
    return document.querySelector(`[data-order="${order}"]`)
  }

  get isValidOrder() {
    return this.currentOrder >= 0 && this.currentOrder < this.length
  }
}
