// 用户数据模块
import http from '@/tour/request/index'
// import store from '@/tour/store'
// import tools from '@/tour/utils/tools'
// import wechat from '@/tour/wechat/wechat'
// import share from '@/tour/share'

const state = {
	token: uni.getStorageSync("token") || "",
	isLogin: uni.getStorageSync("isLogin") || false, // 是否登陆
	userInfo: uni.getStorageSync("userInfo") || {}, // 用户信息
	userData: {}, //用户其他相关信息
	authType: '' // smsLogin:手机号登录注册, accountLogin:密码登录, forgotPwd:忘记密码, changePwd:修改密码, bindMobile:绑定手机号
}

const getters = {
	token: state => state.token,
	isLogin: state => state.isLogin,
	userInfo: state => state.userInfo,
	userOtherData: state => state.userData,
	authType: state => state.authType,
}

const actions = {
	// 获取用户信息
	getUserInfo({
		commit,
		dispatch,
		getters,
		state
	}, pars = {
		token: '',
		id: 0
	}) {
		return new Promise((resolve, reject) => {
			//保存token
			pars.token && uni.setStorageSync('token', pars.token);
			console.log('pars.id', pars.id);
			http('user.info', {
					id: pars.id
				}).then(res => {
					console.log('user.info.res',res);
					if (res.code === 200) {
						let lastLoginStatus = getters.isLogin;
						commit('userInfo', res.data);
						commit('isLogin', true);
						dispatch('showAuthModal', '');
						// !lastLoginStatus && share.setShareInfo();
						// 存在分享信息 添加分享记录
						// let spm = uni.getStorageSync('spm');
						// if (spm) {
						// 	http('common.shareAdd', {
						// 		spm: spm
						// 	});
						// 	uni.removeStorageSync('spm');
						// }
						resolve(res.data)
					}
				}).then(() => {
					// 只有在登录的时候请求购物车信息，订单信息，获取登录信息之后。
					// token && dispatch('getCartList');
					// token && dispatch('getUserData');
				})
				.catch(e => {
					reject(e)
				})
		})
	},
	// 用户其他相关信息
	getUserData({
		commit
	}) {
		return new Promise((resolve, reject) => {
			http('user.userData').then(res => {
				commit('USER_DATA', res.data);
				resolve(res)
			}).catch(e => {
				reject(e)
			})
		})
	},

	// 获取分销商身份信息
	getAgent({
		commit
	}) {
		return new Promise((resolve, reject) => {
			http('commission.auth').then(res => {
				if (res.code === 1) {
					commit('AGENT_INFO', res.data.data);
				}
				resolve(res)
			}).catch(e => {
				reject(e)
			});
		})
	},


	// 自动登录
	async autoLogin({
		getters,
		dispatch
	}) {
		if (getters.initWechat?.autologin && !getters.isLogin) { // 微信开启自动登录 并且当前未登录，进入自动登录流程
			let token = '';

			// #ifdef H5
			wechat.login();
			// #endif

			// #ifdef MP-WEIXIN
			token = await wechat.getWxMiniProgramSessionKey(true)
			// #endif

			token && await dispatch('getUserInfo', token);
		} else if (getters.isLogin) { // 已经登录，直接获取用户信息
			await dispatch('getUserInfo');
		}
		// share.setShareInfo();
		// 初始化小程序session_key
		// #ifdef MP-WEIXIN
		if (!getters.initWechat?.autologin) {
			await wechat.getWxMiniProgramSessionKey(false);
		}
		// #endif
	},

	// 登录弹窗控制
	showAuthModal({
		commit
	}, type = 'accountLogin') {
		commit('AUTH_TYPE', type);
	},

	// 退出登录
	logout({
		commit,
		dispatch
	}) {
		uni.getStorageSync('token') && http('user.logout');
		commit('token', "");
		uni.removeStorageSync('chatSessionId');
		commit('isLogin', false);
		commit('userInfo', {});
		// commit('CART_LIST', []);
		commit('USER_DATA', {});
		// 重置全局分享信息
		// share.setShareInfo();
	},

	// 获取订阅消息模板ids;
	getMessageIds({
		commit,
		state
	}) {
		http('user.messageIds').then(res => {
			commit('formatMessage', res.data)
			Promise.resolve(res.data)
		}).catch(e => {
			Promise.reject(e)
		})

	},
}

const mutations = {
	token(state, payload) {
		state.token = payload;
		uni.setStorageSync("token", payload);
	},
	// 登录态
	isLogin(state, data) {
		state.isLogin = data;
		uni.setStorageSync('isLogin', data);
	},
	// 用户信息
	userInfo(state, data) {
		state.userInfo = data;
		uni.setStorageSync("userInfo", data);
	},
	// 其他用户数据
	USER_DATA(state, data) {
		state.userData = data;
	},
	// 账号类型
	AUTH_TYPE(state, data) {
		// 通过判断是否有账号类型，来决定tabBar的显隐
		data ? uni.hideTabBar() : uni.showTabBar();
		state.authType = data;
	},
}

export default {
	state,
	mutations,
	actions,
	getters
}
