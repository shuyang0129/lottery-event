import {
  numberAwards,
  memberId,
  lotteryBox,
  eventTime,
  eventTarget,
  eventPlatform,
} from './base'

// 渲染抽獎次數
export const renderNumberAwards = num => {
  numberAwards.textContent = num
}

// 渲染會員帳號
export const renderMemberId = (id, isLogin = false) => {
  memberId.textContent = isLogin ? `会员帐号：${id}` : '请登入会员'
}

// 渲染九宮格
export const renderPrizes = prizesIds => {
  prizesIds.forEach(
    (id, order) => (lotteryBox(order).src = `./img/lottery-box-${id}.png`)
  )
}

// 渲染活動資訊 | 活動日期、活動目標、活動平台
export const renderEventInfo = ({ time, target, platform }) => {
  eventTime.innerHTML = time
  eventTarget.innerHTML = target
  eventPlatform.innerHTML = platform
}
