import http from '@/utils/http'
import { urls } from '@/config/urls'

export default {
  getShopConfigs: () => http.get(`https://wp.swallowtail.cn/shop.json?${Date.now()}`),
  getCategories: () => http.get(urls.categories),
  getProducts: data => http.get(urls.products, data),
  getProduct: data => http.get(`${urls.products}/${data.id}`)
}
