import '../css/index.scss'
import Lottery from './models/Lottery'
import { renderPopup } from './views/popupView'
import { renderShowAwardHistory } from './views/awardHistory'
import {
  startButton,
  renderPage,
  renderLoader,
  clearLoader,
  showAwardButton,
} from './views/base'
import {
  renderNumberAwards,
  renderMemberId,
  renderPrizes,
  renderEventInfo,
} from './views/lotteryView'
import { popupTypes } from './views/popupView'
import axios from 'axios'
import * as API from './services/api'

// 是否在測試環境
const isDevelopment = process.env.NODE_ENV === 'development'

// 會員帳號
let memberId = ''
// 使用者是否登入
let isLogin = true

// 活動資訊
let eventInfo = {
  time: '2020年', // 活動時間
  target: '全体用户', // 活動目標
  platform: '全平台<br/>(不含彩票平台)', // 活動平台
}

// 獎項列表
let prizes = []
// 指定獎項
let targetPrizeNum = undefined
// 最大可抽獎次數
let numberAwardsTotal = 0
// 抽獎剩餘次數
let numberAwardsLeft = 0
// 九宮格一圈的步數
const PRIZES_LENGTH = 8

// 總步數：前半段步數(minSteps) + 後半段步數(extraSteps)，前半段加速，後半段減速，倒數第一格會頓一下
// 前半段步數(單位為圈)
const minSteps = PRIZES_LENGTH * 3
// 後半段步數(單位為圈)，離目標剩餘多少步
let extraSteps = 0
// 目前步數
let currentSteps = 0
// 燈箱亮起速度
let speed = 80
// 目前是否正在開獎
let isRunning = false
// 上一次抽獎時間
let lastTime
// 抽獎間隔設定
let lotteryDuration = 5000

/**
 * @name Query String
 * @description
 * actId 活動ID
 * appKey 租戶appKey
 * accessMode 區別app端或web端，H5/app
 * token
 * preUrl api的baseUrl
 * devideId
 * referrer 上一頁路徑
 */
const query = {}

// 用來存放實體化Lottery物件的變數
let lottery

window.addEventListener('DOMContentLoaded', () => {
  // 取得Query String
  const urlParams = new URLSearchParams(window.location.search)
  for (const [key, value] of urlParams.entries()) {
    query[key] = value
  }

  axios.defaults.baseURL = query.preUrl + '/office-activity/api'
  axios.defaults.headers['appKey'] = query.appKey
  axios.defaults.headers['accessMode'] = query.accessMode
  axios.defaults.headers['Content-Type'] = 'application/json'
  axios.defaults.headers['If-Modified-Since'] = '0'
  axios.defaults.headers['Cache-Control'] = 'no-cache'

  if (isDevelopment) console.log('query', query)
})

// 畫面剛載入，渲染對應畫面
window.addEventListener('load', async () => {
  renderLoader() // 顯示 Loading...

  // 更新PageInfo | 將九宮格照api回傳的id補滿抽獎機會
  await updatePrizes(query.actId)
  // 更新PlayerDrawInfo | 抽獎次數、會員帳號
  await updatePlayerDrawInfo(query.actId, query.token)

  clearLoader() // 移除 Loading...
  renderPage() // 顯示畫面

  // 更新畫面
  renderEventInfo(eventInfo) // 活動資訊：活動日期、活動目標、活動平台
})

const lotteryRun = async () => {
  // 抽獎開始
  isRunning = true
  startButton.disabled = true

  // 到達全部步數(minSteps + extraSteps)，停止
  if (currentSteps >= minSteps + extraSteps) {
    lastTime = Date.now()

    // 更新PlayerDrawInfo(更新抽獎次數)
    await updatePlayerDrawInfo(query.actId, query.token)

    isRunning = false
    startButton.disabled = false
    return
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

// 點擊「點擊抽獎」執行的方法
const start = async () => {
  // 如果九宮格正在跑，忽視此行為
  if (isRunning) return

  // 如果使用者沒有登入，顯示彈出視窗「請登入會員」
  if (!isLogin) return renderPopup(popupTypes.NOT_LOGIN)

  // 如果沒有抽獎機會，顯示彈出視窗：「今日已無抽獎次數」
  if (numberAwardsTotal <= 0) {
    return renderPopup(popupTypes.NOT_ENOUGH_NUMBER_OF_AWARDS)
  }

  // 如果抽獎次數沒了，顯示彈出視窗「抽獎次數不足，...」
  if (numberAwardsLeft <= 0) {
    return renderPopup(popupTypes.NO_NUMBER_OF_AWARDS)
  }

  // 如果抽獎間隔小於五秒，顯示彈出視窗「操作过快，每次抽奖请间隔10秒后再操作」
  const now = Date.now()
  if (lastTime && now - lastTime < lotteryDuration) {
    return renderPopup(popupTypes.NOT_ENOUGH_DURATION)
  }

  // == 設定初始狀態(開始)
  currentSteps = 0
  extraSteps = 0
  speed = 80
  lottery.reset()
  // == 設定初始狀態(結束)

  const drawResponse = await API.draw(query.actId, Date.now(), query.token)

  if (drawResponse.code === 0) {
    // 取出指定獎項
    targetPrizeNum = drawResponse.data.prizeNum
    // 開始前，計算後半段到獎項的步數
    calculateExtraSteps(lottery.prizeNums, targetPrizeNum)

    // 執行開獎
    lotteryRun()
    renderNumberAwards(numberAwardsLeft) // 更新畫面 - 抽獎次數
  }
  if (drawResponse.code === 16110000) {
    resetToNotLogin()
    return renderPopup(popupTypes.NOT_LOGIN)
  }
}

// 計算到指定獎項的額外步數
const calculateExtraSteps = (prizeNums, targetPrizeNum) => {
  if (targetPrizeNum && prizeNums.includes(targetPrizeNum)) {
    return (extraSteps += prizeNums.indexOf(targetPrizeNum) + PRIZES_LENGTH * 1) // PRIZES_LENGTH代表一圈
  }
}

// 預設到為登入狀態
const resetToNotLogin = () => {
  isLogin = false
  memberId = ''
  numberAwardsLeft = 0
  numberAwardsTotal = 0
  renderMemberId(memberId, isLogin) // 會員帳號
  renderNumberAwards(numberAwardsLeft) // 抽獎次數
}

// 更新playerDrawInfo
const updatePlayerDrawInfo = async (actId, token) => {
  const playerDrawInfoResponse = await API.getPlayerDrawInfo(actId, token)
  // 更新會員資訊
  if (playerDrawInfoResponse.code === 0 && !!token) {
    const playerInfo = playerDrawInfoResponse.data
    // 更改登入狀態為：已登入
    isLogin = true
    // 更新抽獎剩餘次數(numberAwardsLeft)、最大抽獎次數(numberAwardsTotal)
    numberAwardsTotal = playerInfo.numberAwards
    numberAwardsLeft = playerInfo.numberAwards - playerInfo.numberAwardsDraw
    if (numberAwardsLeft < 0) numberAwardsLeft = 0 // 避免負數
    // 更新會員帳號
    memberId = playerInfo.loginName

    renderMemberId(memberId, isLogin) // DOM渲染，會員帳號
    renderNumberAwards(numberAwardsLeft) // DOM渲染，抽獎次數
  } else {
    // 如果沒有取得會員資訊，將畫面設為沒有登入狀態
    resetToNotLogin()
  }
}

// 更新九宮格
const updatePrizes = async actId => {
  const searchActivityPageInformationResponse = await API.getSearchActivityPageInformation(
    actId
  )

  if (searchActivityPageInformationResponse.code === 0) {
    const lotteryInfo = searchActivityPageInformationResponse.data
    // 取得獎項，過濾八個以外的獎項，避免錯誤
    prizes = lotteryInfo.actRuleDetailItemDTOList.slice(0, 8)

    // 建立Lottery物件
    lottery = new Lottery(prizes)
    renderPrizes(lottery.prizeNums) // 將九宮格照api回傳的id補滿抽獎機會
  }
}

// 點擊「開始」按鈕的行為定義
startButton.addEventListener('click', start)

// 點擊「我的獎品」按鈕的行為定義
showAwardButton.addEventListener('click', async () => {
  const res = await API.getPlayerDrawResult(query.actId, query.token)
  const awards = res.code === 0 ? res.data.resultArr : undefined

  if (res.code === 16110000) resetToNotLogin()

  renderShowAwardHistory(awards) // DOM渲染，我的獎品
})
