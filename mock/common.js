const Mock = require('mockjs');
const { Random } = Mock;

const nonPagedData = {
  timestamp: '2019-09-12 15:39:23',
  code: 200,
  message: '品类列表',
  path: '/api/u/category/list',
  data: [],
  errorDetail: '',
};

const pagedData = {
  timestamp: '请求时间',
  code: 200,
  message: '分页列表数据返回值',
  path: '访问路径',
  data: {
    pageSize: 20,
    pageIndex: 1,
    list: [],
    totalRecord: 1,
    asc: [],
    desc: [],
    totalPage: 1,
    searchCount: true,
    pages: 1,
  },
  errorDetail: '',
};

function cityList(req, res) {
  let data = Mock.mock({
    'data|10': [
      {
        'cityCode|+1': 0,
        city: () => Random.city(),
      },
    ],
  });

  let d = [
    {
      city: '韶关市',
      cityCode: '440200',
    },
    {
      city: '北京市',
      cityCode: '110000',
    },
    {
      city: '广州市',
      cityCode: '440100',
    },
    {
      city: '上海市',
      cityCode: '310000',
    },
  ];

  res.status(200).json({
    timestamp: '2019-09-12 15:39:23',
    code: 200,
    message: '品类列表',
    path: '/api/u/category/list',
    data: d,
    errorDetail: '',
  });
}

function bannerList(req, res) {
  let data = Mock.mock({
    'data|3': [
      {
        'id|+1': 0,
        imageUrl: Random.image('670x250', '#50B347', '#fff', 'IMAGE'),
        title: () => Random.cword(8, 20),
      },
    ],
  });
  res.status(200).json(Object.assign(nonPagedData, data));
}

module.exports = {
  'GET /api/common/city/list': cityList,
  'GET /api/common/banner/list': bannerList,
};
