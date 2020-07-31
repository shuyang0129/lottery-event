import axios from './axiosConfig'

const isDevelopment = process.env.NODE_ENV === 'development'

export const getPlayerDrawInfo = async (actId = '', token = '') => {
  try {
    const res = await axios({
      url: '/act-temp/playerDrawInfo',
      headers: { token },
      data: { actId },
    })
    console.log('getPlayerDrawInfo -> res', res)
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
    console.log('draw -> data', data)
    return data
  } catch (err) {
    if (isDevelopment) console.error('Catch Error: ', err)
  }
}
