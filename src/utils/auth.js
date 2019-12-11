import Taro from '@tarojs/taro';
import { urls } from '@/config/urls';
import { insertToken, changeAppOnLaunch } from '@/store/common/action';

export default class Auth {
  /**
   * 检查授权
   */
  static appCheckAuth(urlParams) {
    return new Promise(function(resolve) {
      const state = Taro.$store.getState();
      //如果有授权信息
      if (Auth.checkAuth() && !state.common.appOnLaunch) {
        //直接返回
        resolve(true);
      } else {
        //判断session_key是否过期
        Taro.checkSession()
          .then(async () => {
            //未过期检查token是否有效
            if (!Auth.checkAuth()) {
              //判断是否 token 请求成功
              let flag = await getAuthToken(urlParams);
              if (flag) {
                //更新app状态
                Taro.$store.dispatch(changeAppOnLaunch());
                resolve(true);
              } else {
                //提示
                Taro.showToast({
                  title: '获取授权信息失败11111',
                  icon: 'none',
                  mask: true,
                });
              }
            } else {
              //更新app状态
              Taro.$store.dispatch(changeAppOnLaunch());
              //token 没有过期，直接返回
              resolve(true);
            }
          })
          .catch(async (err) => {
            let flag = await getAuthToken(urlParams);
            //判断是否 token 请求成功
            if (flag) {
              //更新app状态
              Taro.$store.dispatch(changeAppOnLaunch());
              resolve(true);
            } else {
              //提示
              Taro.showToast({
                title: '获取授权信息失败22222',
                icon: 'none',
                mask: true,
              });
            }
          });
      }
    });
  }

  // 检查令牌是否有效 true--> 有效  false--> 无效
  static checkAuth() {
    const state = Taro.$store.getState();
    //从缓存读取授权信息
    let authorize = state.common.token || Taro.getStorageSync('Authorization') || {},
      expiryTime = 0,
      nowTime = ~~(Date.now() / 1000);
    if (authorize.payload && authorize.payload.exp) {
      expiryTime = authorize.payload.exp;
    }
    return expiryTime - nowTime > 300;
  }

  //获取token
  static getToken() {
    const state = Taro.$store.getState();
    let authorize = state.authorize || Taro.getStorageSync('Authorization');
    return authorize.token;
  }
}

//授权用户 token
async function getAuthToken(urlParams) {
  let res = await Taro.login();
  let response;
  try {
    response = await Taro.request({
      url: urls.login,
      data: {
        code: res.code,
        invited_by: urlParams.shareFrom || '',
      },
      method: 'GET',
    });
  } catch (err) {
    console.log(err);
  }

  // 已绑定
  if (response && response.accessToken) {
    saveAuthToken(response);
    return true;
  }
  return false;
}

//写入信息
function saveAuthToken(auth) {
  //写入状态管理
  Taro.$store.dispatch(insertToken(auth));
  //写入缓存
  Taro.setStorageSync('Authorization', auth);
}
