const isFrontend = path =>
  !(path.match('/_fapi') ||
    path.match('/_common') ||
    path.match('/_bapi') ||
    path.match('/superman') ||
    path.match('/virtual_reality'))

const isHmr = path => path.match('/__webpack_hmr')
const isBackend = path => path.match('/superman')
const isVr = path => path.match('/virtual_reality')

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
const vrRewrite = (path, req) => path.replace('/virtual_reality', '/')

const {
  local_fe,
  local_be,
  local_vr,
  remote_api,
  local_api
} = require('./config')

const proxyConfig = {
  proxyList: [
    { from: '/_fapi', target: remote_api },
    { from: '/_bapi', target: remote_api },
    { from: '/_common', target: remote_api },
    { from: '/superman', target: local_be },
    { from: '/virtual_reality', target: local_vr },
    { from: backendHmrFilter, target: local_be },
    { from: vrHmrFilter, target: local_vr },
    { from: frontHmrFilter, target: local_fe },
    // 此条规则一定要放在最后来匹配前台路径代理
    { from: '/', target: local_fe }
  ],
  proxyListLocal: [
    { from: '/_fapi', target: local_api },
    { from: '/_bapi', target: local_api },
    { from: '/_common', target: local_api },
    { from: '/superman', target: local_be },
    { from: '/virtual_reality', target: local_vr },
    { from: backendHmrFilter, target: local_be },
    { from: vrHmrFilter, target: local_vr },
    { from: frontHmrFilter, target: local_fe },
    // 此条规则一定要放在最后来匹配前台路径代理
    { from: '/', target: local_fe }
  ]
}

module.exports = proxyConfig
