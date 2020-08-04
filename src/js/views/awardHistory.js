import { closeButton, awardHistory, awardHistoryContent } from './base'

const contentType = {
  NO_CONTENT: {
    markup: `<p class="no-awards">目前尚无获得奖品</p>`,
  },
  WITH_CONTENT: {
    markup: `
    <table class="award-history__table" cellspacing="20">
      <tr>
        <th>奖品</th>
        <th>数量</th>
      </tr>
      %PLACE_HOLDER%
    </table>
    `,
  },
}

// 渲染「我的獎項」彈出視窗
export const renderShowAwardHistory = (awards = undefined) => {
  let markup

  if (awards && awards.length > 0) {
    // 如果有獎項
    // 1) 組出table需要使用的html內容
    const replacement = awards
      .map(
        award => `
      <tr>
        <td>${award.prizeName}</td>
        <td>${award.count}</td>
      </tr>
      `
      )
      .join('')

    // 2) 取得template
    markup = contentType.WITH_CONTENT.markup
    // 3) 將內容置入
    markup = markup.replace(/%PLACE_HOLDER%/, replacement)
  } else {
    // 如果沒有獎項，取得「目前尚无获得奖品」template
    markup = contentType.NO_CONTENT.markup
  }

  // 渲染，並顯示彈出視窗
  awardHistoryContent.insertAdjacentHTML('afterbegin', markup)
  awardHistory.classList.add('is-active')
}

// 關閉「我的獎項」彈出視窗
closeButton.addEventListener('click', () => {
  awardHistoryContent.innerHTML = ''
  awardHistory.classList.remove('is-active')
})
