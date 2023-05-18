// 对Request的单独封装
import Request from './request'
import apiList from './apis.js'
// import store from '@/shopro/store/index.js'

//继承并实现class Request（对uni.request的二次封装）
const shoproRequest = new Request();
// 向外暴露封装过的http请求函数
export default function http(
	url,
	data = {},
	toastBefore = '', // 请求前加载提示
	toastAfter = true, // 请求后错误提示
) {
	// 拼接完整api
	let api = getApiPath(url);
	// let api = {
	// 	url: '/login',
	// 	auth: false,
	// 	method: "POST",
	// };
	/* 重构请求拦截器 */
	shoproRequest.interceptor.request((config, cancel) => {
		let token = uni.getStorageSync('token');
		if (api.auth && !token) {
			// 暂未登录或登录过期，弹出登录页
			// store.dispatch('showAuthModal');
			uni.hideLoading()
			throw (`暂未登录,已阻止此次API请求: '${api.url}'`);
		}
		// 配置请求头
		token && shoproRequest.setConfig(config => {
			config.header.token = token
		})
		// 加载提示不为空
		if (toastBefore !== '') {
			uni.showLoading({
				title: toastBefore,
				mask: true
			});
		}
		return config
	});

	/* 重构请求之后(响应)拦截器 */
	shoproRequest.interceptor.response((response) => {
		uni.hideLoading();
		// response.code=0的错误提示
		if (response.code === 0) {
			if (toastAfter) {
				uni.showToast({
					title: response.msg || '请求出错,稍后重试',
					icon: 'none',
					duration: 1000,
					mask: true
				});
			}

		}

		// token过期注销，自动退出登录+弹出登录页
		if (response.code === 401) {
			// store.dispatch('logout');
			// store.dispatch('showAuthModal');
			throw (`登录已过期或注销,已阻止此次API请求: '${api.url}'`);
		}
		return response
	})

	return shoproRequest.request({
		url: api.url,
		data,
		method: api.method
	})

}

// 组装（拼接）接口路径
function getApiPath(url) {
	let apiArray = url.split(".");
	let api = apiList;
	apiArray.forEach(v => {
		api = api[v];
	});
	return api;
}
