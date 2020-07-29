import { numberAwards, memberId, lotteryBox } from './base'

// 渲染抽獎次數
export const renderNumberAwards = num => {
  numberAwards.textContent = num
}

// 渲染會員帳號
export const renderMemberId = id => {
  memberId.textContent = id
}

// 渲染九宮格
export const renderPrizes = prizes => {
  for (let order = 0; order < prizes.length; order++) {
    lotteryBox(order).src = `./img/lottery-box-${order}.png`
  }
}
