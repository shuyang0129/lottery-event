import { popupContainer, popupMask, popupButton } from './base'

const goLogin = () => {
  console.log('Go to Login')
}

const closePopup = e => {
  e.preventDefault()
  popupContainer.innerHTML = '<div id="popupMask"></div>'
  popupContainer.classList.remove('is-active')
}

export const popupTypes = {
  NOT_LOGIN: {
    markup: `
    <div class="popup">
      <h3 class="popup__title">登入</h3>
      <p class="popup__content">请先登入会员</p>
      <button id="popupButton" class="popup__button">确定</button>
    </div>
    `,
    callback: goLogin,
  },
  NOT_ENOUGH_NUMBER_OF_AWARDS: {
    markup: `
    <div class="popup">
      <p class="popup__content">抽奖次数不足，累计单日有效投注5888元，可获得抽奖次数。</p>
      <button id="popupButton" class="popup__button">确定</button>
    </div>
    `,
    callback: closePopup,
  },
  NO_NUMBER_OF_AWARDS: {
    markup: `
    <div class="popup">
      <p class="popup__content">今日已无抽奖次数</p>
      <button id="popupButton" class="popup__button">确定</button>
    </div>
    `,
    callback: closePopup,
  },
}

export const renderPopup = ({ markup, callback }) => {
  popupContainer.insertAdjacentHTML('afterbegin', markup)
  popupContainer.classList.add('is-active')

  document.querySelector('#popupButton').addEventListener('click', callback)
  popupMask.addEventListener('click', closePopup)
}

window.addEventListener('beforeunload', goLogin)
window.addEventListener('beforeunload', closePopup)
