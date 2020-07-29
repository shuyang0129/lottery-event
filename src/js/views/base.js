// DOM

// StartButton | 點擊抽獎按鈕
export const startButton = document.getElementById('startButton')
export const popupContainer = document.querySelector('#popupContainer')
export const popupMask = document.querySelector('#popupMask')
export const numberAwards = document.querySelector('#numberAwards')
export const memberId = document.querySelector('#memberId')

// Lottery Box | 對應的燈箱
export const lotteryBox = order => {
  return document.querySelector(`[data-order="${order}"]`)
}
