const {
  local_fe,
  local_be,
  local_vr,
  local_m,
  remote_api,
  local_api
} = require('./config')

const isFrontend = path =>
  !(path.match('/_fapi') ||
    path.match('/_common') ||
    path.match('/_bapi') ||
    path.match('/superman') ||
    path.match('/virtual_reality') ||
    path.match('/mobile'))

const isHmr = path => path.match('/__webpack_hmr')
const isBackend = path => path.match('/superman')
const isVr = path => path.match('/virtual_reality')
const isM = path => path.match('/mobile')

const frontHmrFilter = (pathname, req) => {
  return isHmr(pathname) && isFrontend(req.headers.referer)
}

const backendHmrFilter = (pathname, req) => {
  return isHmr(pathname) && isBackend(req.headers.referer)
}

const vrHmrFilter = (pathname, req) => {
  return isHmr(pathname) && isVr(req.headers.referer)
}

const vrFilter = (pathname, req) => {
  return isVr(req.headers.referer)
}

const mHmrFilter = (pathname, req) => {
  return isHmr(pathname) && isM(req.headers.referer)
}

const proxyList = [
  {
    from: '/_fapi',
    target: remote_api
  },
  {
    from: '/_bapi',
    target: remote_api
  },
  {
    from: '/_common',
    target: remote_api
  },
  {
    from: '/superman',
    target: local_be
  },
  {
    from: '/virtual_reality',
    target: local_vr
  },
  {
    from: '/mobile',
    target: local_m
  },
  {
    from: backendHmrFilter,
    target: local_be
  },
  {
    from: vrHmrFilter,
    target: local_vr
  },
  {
    from: frontHmrFilter,
    target: local_fe
  },
  {
    from: mHmrFilter,
    target: local_m
  },
  // 此条规则一定要放在最后来匹配前台路径代理
  {
    from: '/',
    target: local_fe
  }
]

const proxyListLocal = proxyList.map(item => {
  // 带_都为api地址 换为本地调试
  if (typeof item.from === 'string' && item.from.match('/_')) {
    return Object.assign({}, item, { target: local_api })
  }
  return item
})

module.exports = {
  proxyList,
  proxyListLocal
}
