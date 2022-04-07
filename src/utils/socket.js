const noop = function () {}
class Socket {
	ws = null
	constructor({
		url = '',
		onOpen = noop,
		onMsg = noop,
		onError = noop,
		onClose = noop,
		onReload = noop,
	}) {
		this.SocketTask = {
			nsend: noop,
			nclose: noop,
			nrconnect: noop,
			isconnect: false,
			uniColse: false,
			InterValCount: 0,
			eventPatch: null,
			url,
			onOpen,
			onMsg,
			onClose,
			onError,
			onReload
		}
        this._EventDispath(this.SocketTask);
		this.initSocket(this.SocketTask)
		return this.SocketTask
	}
    _EventDispath({
		onReload
	} = {}) {
		let SocketTask = this.SocketTask;
		let events = {
			onOpen: [],
			onMsg: [],
			onClose: [],
			onError: [],
			onReload: [],
			onRdFinsh: [],
		}
		SocketTask.nsend = text => {
			this._chunkConnect(() => {
				uni.sendSocketMessage({
					data: text
				})
			})
		}
		SocketTask.nclose = t => {
			this._chunkConnect(() => {
				SocketTask.uniColse = true;
				uni.closeSocket();
			})
		}

		function EventDispatcher() {
			this.events = events;
		}
		for (let key in events) {
			EventDispatcher.prototype[key] = function(handler) {
				if (typeof handler != 'function') return;
				this.events[key].push(handler)
			}
		}
		SocketTask.eventPatch = new EventDispatcher();
	}

	initSocket({ url, onOpen, onMsg, onClose, onError } = {}) {
		console.log(window.WebSocket)
		if (!window.WebSocket) {
			console.error('浏览器暂不支持websocket, 请切换浏览器重试')
			return
		}
		this.ws = new WebSocket(url)
		console.log('this.ws', this.ws)
		this.ws.onopen = function () {
			console.log('连接成功')
			onOpen('连接成功')
		}
		this.ws.onmessage = function (res) {
			console.log('收到消息')
			onMsg(res)
		}
		this.ws.onerror = function (res) {
			console.log('连接错误')
			onError('连接错误')
		}
		this.ws.onclose = function (res) {
			console.log('关闭连接')
			onClose('关闭连接')
		}
	}
}

export default Socket
