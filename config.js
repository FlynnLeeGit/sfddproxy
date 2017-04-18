const isFront = pathname =>
  !(pathname.match('/_fapi') ||
    pathname.match('/_common') ||
    pathname.match('/_bapi') ||
    pathname.match('/superman'))

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

const frontFilter = (pathname, req) => {
  console.log('请求Path', pathname, isFront(pathname))
  return isFront(pathname)
}
module.exports = {
  proxyList: [
    { from: '/_fapi', target: 'http://develop.sfdd.lab' },
    { from: '/_bapi', target: 'http://develop.sfdd.lab' },
    { from: '/_common', target: 'http://develop.sfdd.lab' },
    { from: '/superman', target: 'http://localhost:3000' },
    { from: backendHmrFilter, target: 'http://localhost:3000' },
    { from: frontHmrFilter, target: 'http://localhost:8080' },
    // 此条规则一定要放在最后来匹配前台路径代理
    { from: frontFilter, target: 'http://localhost:8080' }
  ],
  proxyListLocal: [
    { from: '/_fapi', target: 'http://192.168.1.157:8000' },
    { from: '/_bapi', target: 'http://192.168.1.157:8000' },
    { from: '/_common', target: 'http://192.168.1.157:8000' },
    { from: '/superman', target: 'http://192.168.1.157:5188' },
    { from: backendHmrFilter, target: 'http://192.168.1.157:5188' },
    { from: frontHmrFilter, target: 'http://192.168.1.157:8080' },
    // 此条规则一定要放在最后来匹配前台路径代理
    { from: frontFilter, target: 'http://192.168.1.157:8080' }
  ]
}
