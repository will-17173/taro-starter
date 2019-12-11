import Taro from '@tarojs/taro';
import auth from './auth';

function pageInit(opts = {}) {
  // 设置默认
  const defalutPath = '/pages/index/index?';
  const defalutTitle = '护士上门';
  const defaultImageUrl = '';

  return function(Component) {
    class PageInit extends Component {
      constructor(props) {
        super(props);
      }

      componentWillMount() {
        Taro.showShareMenu({
          withShareTicket: true,
        });

        if (super.componentWillMount) {
          super.componentWillMount();
        }
      }

      //阻塞 didMount ， 鉴权
      async componentDidMount() {
        const urlParams = this.$router.params;
        let result = await auth.appCheckAuth(urlParams);
        //授权成功
        if (result) {
          //调用父组件的函数
          if (super.componentDidMount) {
            super.componentDidMount();
          }
        } else {
          //授权失败
          Taro.showToast({
            title: '授权失败',
            icon: 'none',
            mask: true,
          });
        }
      }

      // 点击分享的那一刻会进行调用
      onShareAppMessage() {
        const Authorization = Taro.getStorageSync('Authorization');
        const uid = Authorization.payload.id;

        let { title, imageUrl, path = null } = opts;

        // 从继承的组件获取配置
        if (this.$setSharePath && typeof this.$setSharePath === 'function') {
          path = this.$setSharePath();
        }

        // 从继承的组件获取配置
        if (this.$setShareTitle && typeof this.$setShareTitle === 'function') {
          title = this.$setShareTitle();
        }

        // 从继承的组件获取配置
        if (this.$setShareImageUrl && typeof this.$setShareImageUrl === 'function') {
          imageUrl = this.$setShareImageUrl();
        }

        if (!path) {
          path = defalutPath;
        }

        // 每条分享都补充用户的分享id
        // 如果path不带参数，分享出去后解析的params里面会带一个{''： ''}
        let sharePath = path.indexOf('?') > -1 ? `${path}&shareFrom=${uid}` : `${path}?shareFrom=${uid}`;

        return {
          title: title || defalutTitle,
          path: sharePath,
          imageUrl: imageUrl || defaultImageUrl,
        };
      }

      //重新下拉刷新
      onPullDownRefresh() {
        if (super.onPullDownRefresh) {
          super.onPullDownRefresh();
          setTimeout(() => {
            Taro.stopPullDownRefresh();
          }, 1500);
        }
      }

      render() {
        return super.render();
      }
    }

    return PageInit;
  };
}

export default pageInit;
