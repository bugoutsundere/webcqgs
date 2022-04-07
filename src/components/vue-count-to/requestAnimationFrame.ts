let lastTime = 0
const prefixes = 'webkit moz ms o'.split(' ') // 各浏览器前缀

let requestAnimationFrame: any
let cancelAnimationFrame: any

const isServer = typeof window === 'undefined'
if (isServer) {
  requestAnimationFrame = () => {}
  cancelAnimationFrame = () => {}
} else {
  requestAnimationFrame = window.requestAnimationFrame
  cancelAnimationFrame = window.cancelAnimationFrame
  let prefix
  // 通过遍历各浏览器前缀，来得到requestAnimationFrame和cancelAnimationFrame在当前浏览器的实现形式
  for (let i = 0; i < prefixes.length; i++) {
    if (requestAnimationFrame && cancelAnimationFrame) {
      break
    }
    prefix = prefixes[i]
    requestAnimationFrame =
      requestAnimationFrame || window[(prefix + 'RequestAnimationFrame') as any]
    cancelAnimationFrame =
      cancelAnimationFrame ||
      window[(prefix + 'CancelAnimationFrame') as any] ||
      window[(prefix + 'CancelRequestAnimationFrame') as any]
  }

  // 如果当前浏览器不支持requestAnimationFrame和cancelAnimationFrame，则会退到setTimeout
  if (!requestAnimationFrame || !cancelAnimationFrame) {
    requestAnimationFrame = function (callback: Function) {
      const currTime = new Date().getTime()
      // 为了使setTimteout的尽可能的接近每秒60帧的效果
      const timeToCall = Math.max(0, 16 - (currTime - lastTime))
      const id = window.setTimeout(() => {
        const time = currTime + timeToCall
        callback(time)
      }, timeToCall)
      lastTime = currTime + timeToCall
      return id
    }

    cancelAnimationFrame = function (id: any) {
      window.clearTimeout(id)
    }
  }
}

export { requestAnimationFrame, cancelAnimationFrame }
