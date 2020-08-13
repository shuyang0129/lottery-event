import { popupContainer, popupMask, popupButton } from './base'

const closePopup = () => {
  const pop = document.querySelector('.popup')
  if (pop) pop.parentElement.removeChild(pop)
  popupContainer.classList.remove('is-active')
}

const popupTypes = {
  API_ERROR: {
    markup: `
    <div class="popup">
      <p class="popup__content">%PLACE_HOLDER%</p>
      <button id="popupButton" class="popup__button">确定</button>
    </div>
    `,
    callback: closePopup,
  },
}

export const renderErrorPopup = errorMessage => {
  let { markup, callback } = popupTypes.API_ERROR

  markup = markup.replace(/%PLACE_HOLDER%/, errorMessage)

  popupContainer.insertAdjacentHTML('afterbegin', markup)
  popupContainer.classList.add('is-active')

  document.querySelector('#popupButton').addEventListener('click', callback)
  popupMask.addEventListener('click', closePopup)
}
