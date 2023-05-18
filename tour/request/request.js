/**
 * Request:请求封装
 * @property {Object} config = 私有属性，默认值
 * @property {Function} isUrl = 私有方法，url是否完整
 * @property {Function} requestBefore = 私有方法，请求前
 * @property {Function} requestAfter = 私有方法，请求后
 */
// 接口路径：https://demo.shopro.top/addons/shopro/
import {
	API_URL
} from '@/env'
// 获取当前运行平台信息
// import platform from '@/shopro/platform/index';
export default class Request {
	// 构造函数：默认配置+拦截器
	constructor() {
		// 默认配置
		this.config = {
			baseUrl: API_URL,
			header: {
				'content-type': 'application/json',
				// 'platform': platform.get() //获取平台信息
			},
			url: '',
			data: {},
			params: {},
			method: 'GET',
			dataType: 'json',
			// #ifndef MP-ALIPAY || APP-PLUS
			responseType: 'text',
			// #endif
			custom: {},
			//ssl（加密网络通信安全协议）核验
			// #ifdef APP-PLUS
			sslVerify: false
			// #endif
		}

		/* 拦截器 */
		this.interceptor = {
			request: cb => {
				if (cb) {
					this.requestBefore = cb
				} else {
					// a->{a}
					this.requestBefore = request => request
				}
			},
			response: (cb) => {
				if (cb) {
					this.requestAfter = cb
				} else {
					this.requestAfter = response => response
				}
			}
		}
	}

	/* 判断url是否完整 */
	static isUrl(url) {
		return /(http|https):\/\/([\w.]+\/?)\S*/.test(url)
	}

	// 创建查询字符、创建请求参数
	static addQueryString(params) {
		let paramsData = ''
		Object.keys(params).forEach(key => {
			paramsData += key + '=' + encodeURIComponent(params[key]) + '&'
		})
		return paramsData.substring(0, paramsData.length - 1)
	}

	/* 类似拦截器，请求前回调函数，返回请求配置 */
	static requestBefore(config) {
		return config
	}

	/* 请求后回调函数，返回请求结果 */
	static requestAfter(response) {
		return response
	}

	/*设置全局配置*/
	setConfig(func) {
		return func(this.config)
	}

	/**
	 * @Function
	 * @param {Object} options - 请求配置项
	 * @prop {String} options.url - 请求路径
	 * @prop {Object} options.data - 请求参数
	 * @prop {Object} [options.responseType = config.responseType] [text|arraybuffer] - 响应的数据类型
	 * @prop {Object} [options.dataType = config.dataType] - 如果设为 json，会尝试对返回的数据做一次 JSON.parse
	 * @prop {Object} [options.header = config.header] - 请求header
	 * @prop {Object} [options.method = config.method] - 请求方法
	 * @returns {Promise<unknown>}
	 */
	// 核心（封装uni.request）
	async request(options = {}) {
		options = {
			...options,
			...this.config,
			...this.requestBefore(options)
		}
		return new Promise((resolve, reject) => {
			// 判断url是否完整，即合并url
			let mergeUrl = Request.isUrl(options.url) ? options.url : (options.baseUrl + options.url)
			if (JSON.stringify(options.params) !== '{}') {
				// 请求参数格式化
				let query = Request.addQueryString(options.params);
				// 在url中插入请求参数
				mergeUrl += mergeUrl.indexOf('?') === -1 ? `?${query}` : `&${query}`
			}
			options.url = mergeUrl
			// 设置成功和失败回调
			options.success = res => {
				resolve(this.requestAfter(res.data))
			}
			options.fail = err => {
				reject(this.requestAfter(err))
			}
			// 发起请求
			uni.request(options)
		})
	}

	get(url, options = {}) {
		return this.request({
			url,
			method: 'GET',
			...options
		})
	}

	post(url, data, options = {}) {
		return this.request({
			url,
			data,
			method: 'POST',
			...options
		})
	}

}
