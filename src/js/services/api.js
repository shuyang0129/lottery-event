import axios from './axiosConfig'

const isDevelopment = process.env.NODE_ENV === 'development'

/**
 * @description
 * actId: 750 活動ID
 * drawBlockTick: 10 抽獎間隔
 * loginName: "b02test003" 登入帳號
 * numberAwards: 0 剩餘抽獎次數
 * numberAwardsDraw: 0 已抽獎次數
 */
export const getPlayerDrawInfo = async (actId = '', token = '') => {
  try {
    const res = await axios({
      url: '/act-temp/playerDrawInfo',
      headers: { token },
      data: { actId },
    })
    if (isDevelopment) console.log('getPlayerDrawInfo -> data', res.data)
    return res.data
  } catch (err) {
    if (isDevelopment) console.error('Catch Error: ', err)
  }
}

export const getSearchActivityPageInformation = async id => {
  try {
    const { data } = await axios({
      url: '/act-temp/searchActivityPageInformation',
      data: { id },
    })
    if (isDevelopment)
      console.log('getSearchActivityPageInformation -> data', data)
    return data
  } catch (err) {
    if (isDevelopment) console.error('Catch Error: ', err)
  }
}

export const draw = async (actId, time, token) => {
  try {
    const { data } = await axios({
      url: '/act-temp/draw',
      headers: { token },
      data: { actId, time },
    })
    if (isDevelopment) console.log('draw -> data', data)
    return data
  } catch (err) {
    if (isDevelopment) console.error('Catch Error: ', err)
  }
}

export const getPlayerDrawResult = async (actId, time, token) => {
  try {
    const { data } = await axios({
      url: '/act-temp/playerDrawResult',
      headers: { token },
      data: { actId, time },
    })
    if (isDevelopment) console.log('getPlayerDrawResult -> data', data)
    return data
  } catch (err) {
    if (isDevelopment) console.error('Catch Error: ', err)
  }
}
