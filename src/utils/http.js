import Taro from '@tarojs/taro'
import interceptors from './interceptors'

interceptors.forEach(i => Taro.addInterceptor(i))

export default {
  request(params, method = 'GET') {
    let { url, data } = params
    let contentType = 'application/json'
    contentType = params.contentType || contentType
    const option = {
      url,
      data,
      method,
      header: {
        'content-type': contentType
        // Authorization: Taro.getStorageSync("Authorization")
      }
    }
    return Taro.request(option)
  },
  get(url, data = '') {
    let option = { url, data }
    return this.request(option)
  },
  post: function(url, data, contentType) {
    let params = { url, data, contentType }
    return this.request(params, 'POST')
  },
  put(url, data = '') {
    let option = { url, data }
    return this.request(option, 'PUT')
  },
  delete(url, data = '') {
    let option = { url, data }
    return this.request(option, 'DELETE')
  }
}
