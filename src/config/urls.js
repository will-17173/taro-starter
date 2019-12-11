const baseUrl = 'http://wp.swallowtail.cn/wp-json/wp/v2/'

const _urls = {
  categories: 'categories?parent=2',
  products: 'posts',
}

const urls = {}

Object.keys(_urls).forEach(key => {
  urls[key] = `${baseUrl}${_urls[key]}`
})

export { urls }
