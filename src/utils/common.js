import Taro from '@tarojs/taro';
import http from '@/utils/http';
import { urls } from '@/config/urls';
import services from '@/services';
import { storageKeys } from '@/config/constants';

export const formatNumber = (n) => {
  n = n.toString();
  return n[1] ? n : `0${n}`;
};

/**
 * 请求支付
 *
 * @param {Number} tradeId 订单ID
 * @param {Function} successCallback 支付成功回调函数
 * @param {Function} failCallback 支付失败回调函数
 */
export function pay(tradeId, successCallback, failCallback) {
  // const code = Taro.getStorageSync(storageKeys.CODE);
  Taro.showLoading({
    title: '加载中',
  });
  Taro.login()
    .then((res) => {
      services
        .tradePay({
          jsCode: res.code,
          tradeId,
        })
        .then((res1) => {
          Taro.hideLoading();
          Taro.requestPayment({
            timeStamp: res1.timeStamp,
            nonceStr: res1.nonceStr,
            package: res1.packageValue,
            signType: res1.signType,
            paySign: res1.sign,
          })
            .then((payRes) => {
              successCallback(payRes);
            })
            .catch((err) => {
              failCallback(err);
            });
        })
        .catch((err) => {
          Taro.hideLoading();
          showToast(err.message);
          console.log(err);
        });
    })
    .catch((err) => {});
}

export const formatTime = (ts, dateOnly = false) => {
  const date = new Date(ts);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  const d = [year, month, day].map(formatNumber).join('-');
  if (dateOnly) {
    return d;
  }
  return `${d} ${[hour, minute].map(formatNumber).join(':')}`;
};

/*获取当前页url*/
export const getCurrentPageUrl = () => {
  let pages = Taro.getCurrentPages();
  let currentPage = pages[pages.length - 1];
  let url = currentPage.route;
  return url;
};

/**
 * 返回授权状态
 * @param { string } name 取值：userInfo userLocation address invoiceTitle invoice werun record writePhotosAlbum camera
 * @returns { Boolean|null } 授权状态
 * https://developers.weixin.qq.com/miniprogram/dev/api/AuthSetting.html
 */
export function getAuthorize(name) {
  return new Promise((resolve, reject) => {
    Taro.getSetting({
      success: (res) => {
        if (res.errMsg === 'getSetting:ok') {
          resolve(res.authSetting['scope.' + name]);
        } else {
          reject(null);
        }
      },
    });
  });
}

function plainObject(obj) {
  let str = '';
  for (let key in obj) {
    if (str === '') {
      str = '?';
    } else {
      str += '&';
    }
    str += `${key}=${obj[key]}`;
  }
  return str;
}

export function navigateTo(url, params = {}) {
  url += plainObject(params);
  Taro.navigateTo({
    url,
  });
}

export function redirectTo(url, params = {}) {
  url += plainObject(params);
  Taro.redirectTo({
    url,
  });
}

export function switchTab(url) {
  Taro.switchTab({
    url,
  });
}

export function showToast(title, icon = 'none') {
  Taro.showToast({
    title,
    icon,
    mask: true,
  });
}

export function copy(text) {
  Taro.setClipboardData({
    data: text,
  }).then(() => {
    showToast('复制成功');
  });
}

function setProfile(data) {
  const { userInfo, encryptedData, iv } = data;
  Taro.setStorageSync('userInfo', userInfo);
  http
    .get(urls.setProfile, { encrypted_data: encryptedData, iv })
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
}

export function setUserInfoStorage(res) {
  const { userInfo } = res;
  const data = Taro.getStorageSync('userInfo');
  if (data) {
    for (var key in data) {
      if (data[key] !== userInfo[key]) {
        setProfile(res);
        break;
      }
    }
  } else {
    setProfile(res);
  }
}

export function makePhoneCall(phoneNumber) {
  Taro.makePhoneCall({
    phoneNumber,
  }).catch(() => {});
}

/**
 * 防抖和节流
 *
 * @param {Function} fn
 * @param {Number} delay
 * @param {Boolean} isDebounce
 */
export const throttle = function(fn, delay, isDebounce) {
  let timer;
  let lastCall = 0;
  return function(...args) {
    if (isDebounce) {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        fn(...args);
      }, delay);
    } else {
      const now = new Date().getTime();
      if (now - lastCall < delay) {
        return;
      }
      lastCall = now;
      fn(...args);
    }
  };
};
