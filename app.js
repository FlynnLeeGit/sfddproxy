const express = require('express')
const proxy = require('http-proxy-middleware')
const args = require('node-args')

const { proxyList, proxyListLocal } = require('./proxyConfig')

const isRemote = !args.local
const isLocal = args.local

const app = express()

if (isRemote) {
  proxyList.forEach(item => {
    const options = {
      target: item.target,
      changeOrigin: true
    }
    if (item.pathRewrite) {
      options.pathRewrite = item.pathRewrite
    }
    app.use(proxy(item.from, options))
  })
}

if (isLocal) {
  proxyListLocal.forEach(item => {
    const options = {
      target: item.target,
      changeOrigin: true
    }
    if (item.pathRewrite) {
      options.pathRewrite = item.pathRewrite
    }
    app.use(proxy(item.from, options))
  })
}

console.log('请注意使用sudo 执行在linux下的80端口权限！')
app.listen(80, '0.0.0.0', () => {
  console.log('proxy server is running on 80!')
})
