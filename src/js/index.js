import '../css/index.scss'
import Lottery from './models/Lottery'
import { renderPopup } from './views/popupView'
import { startButton } from './views/base'
import {
  renderNumberAwards,
  renderMemberId,
  renderPrizes,
} from './views/lotteryView'
import { popupTypes } from './views/popupView'

// 關於獎項的設定
const prizes = ['$100', '$200', '$300', '$400', '$500', '$600', '$700', '$800'] // 8個獎項
const targetedPrize = '$200' // 指定獎項
let numberAwards = 3 // 抽獎剩餘次數
// 九宮格的設定
const PRIZES_LENGTH = 8 // 一圈八格
const minSteps = PRIZES_LENGTH * 3 // 前半段步數(單位為圈)
let extraSteps = 0 // 後半段步數(單位為圈)，離目標剩餘多少步
let currentSteps = 0 // 目前步數
let speed = 80 // 燈箱亮起速度
let isRunning = false // 目前是否正在開獎
let lastTime // 抽獎時間
// 使用者的資訊
let memberId = 'member002' // 會員帳號
let isLogin = true // 使用者是否登入

const lottery = new Lottery(prizes)

// 畫面剛載入，渲染對應畫面
window.addEventListener('load', () => {
  renderNumberAwards(numberAwards) // 更新畫面 - 九宮格
  renderMemberId(memberId) // 更新畫面 - 會員帳號
  renderPrizes(prizes) // 更新畫面 - 抽獎機會

  // 如果載入時，沒有抽獎機會，顯示彈出視窗：「今日已無抽獎次數」
  if (numberAwards <= 0) renderPopup(popupTypes.NO_NUMBER_OF_AWARDS)
})

const lotteryRun = () => {
  // 抽獎開始
  isRunning = true

  // 到達全部步數(minSteps + extraSteps)，停止
  if (currentSteps >= minSteps + extraSteps) {
    lastTime = Date.now()
    return (isRunning = false)
  }

  // 控制燈箱亮起的速度控制
  if (currentSteps <= minSteps) {
    speed -= 2 // 前半段，加速
  } else {
    currentSteps === minSteps + extraSteps - 2
      ? (speed = 500) // 到達指定獎項前一格，頓一下
      : (speed += 10) // 後半段，減速
  }

  lottery.activeNextBox()

  setTimeout(() => {
    lotteryRun() // recursion，一直到滿足return條件
    currentSteps++
  }, speed)
}

const start = () => {
  // 如果九宮格正在跑，忽視此行為
  if (isRunning) return

  // 如果使用者沒有登入，顯示彈出視窗「請登入會員」
  if (!isLogin) return renderPopup(popupTypes.NOT_LOGIN)

  // 如果抽獎間隔小於十秒，顯示彈出視窗「操作过快，每次抽奖请间隔10秒后再操作」
  const now = Date.now()
  if (lastTime && now - lastTime < 10000) {
    return renderPopup(popupTypes.NOT_ENOUGH_DURATION)
  }

  // 如果抽獎次數沒了，顯示彈出視窗「抽獎次數不足，...」
  if (numberAwards <= 0) {
    return renderPopup(popupTypes.NOT_ENOUGH_NUMBER_OF_AWARDS)
  }

  // == 設定初始狀態(開始)
  currentSteps = 0
  extraSteps = 0
  speed = 80
  lottery.reset()
  // == 設定初始狀態(結束)

  // 開始前，計算後半段到獎項的步數
  calculateExtraSteps()

  // 執行開獎
  lotteryRun()
  numberAwards-- // 少一次抽獎次數，可以在這裡更新抽獎次數
  renderNumberAwards(numberAwards) // 更新畫面 - 抽獎次數
}

// 計算到指定獎項的額外步數
const calculateExtraSteps = () => {
  if (targetedPrize && prizes.includes(targetedPrize)) {
    return (extraSteps += prizes.indexOf(targetedPrize) + lottery.length) // lottery.length代表一圈
  }
  // 沒有指定獎項的話，隨機產生
  const randomSteps = generateRandomPrize()
  return (extraSteps += randomSteps + lottery.length)
}

const generateRandomPrize = () => {
  return Math.floor(Math.random() * lottery.length)
}

// 點擊「開始」按鈕的行為定義
startButton.addEventListener('click', start)
