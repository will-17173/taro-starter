import Taro from '@tarojs/taro';
import { HTTP_STATUS, storageKeys, pages } from '@/config/constants';
import { getCurrentPageUrl } from '@/utils/common';

const customInterceptor = function(chain) {
  const Authorization = Taro.getStorageSync(storageKeys.TOKEN);
  const token = Authorization ? Authorization : '';
  const requestParams = chain.requestParams;
  requestParams.header = requestParams.header ? requestParams.header : {};
  requestParams.header.Authorization = `Bearer ${token}`;

  // TODO: 接口逻辑不一样，需要在statusCode=200状态下区分各种状态
  return chain.proceed(requestParams).then((res) => {
    if (res.statusCode === HTTP_STATUS.NOT_FOUND) {
      return Promise.reject('请求资源不存在');
    } else if (res.statusCode === HTTP_STATUS.BAD_GATEWAY) {
      return Promise.reject('服务端出现了问题');
    } else if (res.statusCode === HTTP_STATUS.FORBIDDEN) {
      // TODO 根据自身业务修改
      // Taro.setStorageSync('Authorization', '')
      // let path = getCurrentPageUrl()
      // if (path !== 'pages/login/login') {
      //   Taro.navigateTo({
      //     url: '/pages/login/login'
      //   })
      // }
      return Promise.reject(res.data);
    } else if (res.statusCode === HTTP_STATUS.AUTHENTICATE) {
      Taro.setStorageSync(storageKeys.TOKEN, '');
      let path = getCurrentPageUrl();
      if (path !== pages.PAGE_LOGIN) {
        Taro.navigateTo({
          url: pages.PAGE_LOGIN,
        });
      }
      return Promise.reject(res.data);
    } else if (res.statusCode === HTTP_STATUS.SUCCESS) {
      if (res.data.code === 'Unauthorized') {
        Taro.setStorageSync(storageKeys.TOKEN, '');
        let path = getCurrentPageUrl();
        if (path !== pages.PAGE_LOGIN) {
          Taro.navigateTo({
            url: pages.PAGE_LOGIN,
          });
        }
        return Promise.reject(res.data);
      }
      if (res.data.code !== 'OK') {
        return Promise.reject(res.data);
      }
      return res.data.data;
    } else {
      return Promise.reject(res.data);
    }
  });
};

const interceptors = [customInterceptor];
// const interceptors = [customInterceptor, Taro.interceptors.logInterceptor]

export default interceptors;
