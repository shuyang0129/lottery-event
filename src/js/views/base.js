// DOM

// StartButton | 點擊抽獎按鈕
export const startButton = document.getElementById('startButton')
export const popupContainer = document.querySelector('#popupContainer')
export const popupMask = document.querySelector('#popupMask')
export const numberAwards = document.querySelector('#numberAwards')
export const memberId = document.querySelector('#memberId')
export const eventPage = document.querySelector('#event')
export const eventTime = document.querySelector('#eventTime')
export const eventTarget = document.querySelector('#eventTarget')
export const eventPlatform = document.querySelector('#eventPlatform')
const loader = document.querySelector('#loader')

// Lottery Box | 對應的燈箱
export const lotteryBox = order => {
  return document.querySelector(`[data-order="${order}"]`)
}

// 顯示主畫面
export const renderPage = () => eventPage.classList.add('is-active')

// 顯示Loading畫面
export const renderLoader = () => loader.classList.add('is-active')

// 隱藏Loading畫面
export const clearLoader = () => loader.classList.remove('is-active')
