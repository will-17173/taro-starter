import Taro, { useEffect } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.scss'

function Index() {
  useEffect(() => {
    console.log('HI')
  }, [])

  return (
    <View className="index">
      <View>
        <Text>Hello, World</Text>
      </View>
    </View>
  )
}

Index.config = {
  navigationBarTitleText: '首页'
}

export default Index
