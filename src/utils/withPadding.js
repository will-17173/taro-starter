import Taro from '@tarojs/taro';
import { getGlobalData } from '@/utils/globalData';

export default function withPadding() {
  return function(Component) {
    class WithPadding extends Component {
      constructor(props) {
        super(props);
      }

      componentWillMount() {
        const navigationHeight = getGlobalData('navigationHeight');
        this.setState({
          navigationHeight,
        });

        if (super.componentWillMount) {
          super.componentWillMount();
        }
      }
    }
    return WithPadding;
  };
}
