const isFront = pathname =>
  !(pathname.match('/_fapi') ||
    pathname.match('/_common') ||
    pathname.match('/_bapi') ||
    pathname.match('/superman') ||
    pathname.match('/virtual_reality'))

const frontHmrFilter = (pathname, req) => {
  const isFrontHmr = pathname.match('/__webpack_hmr') &&
    isFront(req.headers.referer)
  isFrontHmr && console.log('前台hmr')
  return isFrontHmr
}

const backendHmrFilter = (pathname, req) => {
  const isBackendHmr = pathname.match('/__webpack_hmr') &&
    req.headers.referer.match('/superman')
  isBackendHmr && console.log('后台hmr')
  return isBackendHmr
}

const vrHmrFilter = (pathname, req) => {
  const isVrHmr = pathname.match('/__webpack_hmr') &&
    req.headers.referer.match('/virtual_reality')
  return isVrHmr
}

const frontFilter = (pathname, req) => {
  console.log('请求Path', pathname, isFront(pathname))
  console.log('请求referer',req.headers.referer)
  return isFront(pathname)
}

module.exports = {
  proxyList: [
    { from: '/_fapi', target: 'http://develop.sfdd.lab' },
    { from: '/_bapi', target: 'http://develop.sfdd.lab' },
    { from: '/_common', target: 'http://develop.sfdd.lab' },
    { from: '/superman', target: 'http://localhost:5188' },
    { from: '/virtual_reality', target: 'http://localhost:5000' },
    { from: backendHmrFilter, target: 'http://localhost:5188' },
    { from: vrHmrFilter, target: 'http://localhost:5000' },
    { from: frontHmrFilter, target: 'http://localhost:5180' },
    // 此条规则一定要放在最后来匹配前台路径代理
    { from: frontFilter, target: 'http://localhost:5180' }
  ],
  proxyListLocal: [
    { from: '/_fapi', target: 'http://localhost:8000' },
    { from: '/_bapi', target: 'http://localhost:8000' },
    { from: '/_common', target: 'http://localhost:8000' },
    { from: '/superman', target: 'http://localhost:5188' },
    { from: '/virtual_reality', target: 'http://localhost:5000' },
    { from: backendHmrFilter, target: 'http://localhost:5188' },
    { from: vrHmrFilter, target: 'http://localhost:5000' },
    { from: frontHmrFilter, target: 'http://localhost:5180' },
    // 此条规则一定要放在最后来匹配前台路径代理
    { from: frontFilter, target: 'http://localhost:5180' }
  ]
}
