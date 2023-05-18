import http from '@/tour/request/index'
// import share from '@/tour/share';

const state = {
	shop: {}, // 商城信息
	wechat: {}, // 微信配置
	share: {}, // 分享配置
	payment: {}, // 支付配置
	addons: [], // 插件配置
	chat: uni.getStorageSync("chat") || {}, // 客服配置
	store: {}, // 商城信息
	tabbarData: [], //自定义底部导航数据
	recharge: uni.getStorageSync("recharge") || {}, //充值配置

	homeTemplate: [], // 首页模板数据
	userTemplate: [], // 个人中心模板数据
	floatData: {}, // 悬浮按钮数据
	popupData: {}, // 弹窗数据
	hasTemplate: true, //是否有模板数据
	shareInfo: {}, // 默认分享数据
	ThemeType: uni.getStorageSync("ThemeType") || 'light' //主题类型
}
const getters = {
	initShop: state => state.shop,
	initStore: state => state.store,
	initShare: state => state.share,
	initPayment: state => state.payment,
	initAddons: state => state.addons,
	initChat: state => state.chat,
	initWechat: state => state.wechat,
	initRecharge: state => state.recharge,

	hasTemplate: state => state.hasTemplate,
	homeTemplate: state => state.homeTemplate,
	userTemplate: state => state.userTemplate,
	floatData: state => state.floatData,
	popupData: state => state.popupData,
	tabbarData: state => state.tabbarData,

	shareInfo: state => state.shareInfo,

	ThemeType: state => state.ThemeType,
}


const actions = {
	// 初始化数据 第三层初始化
	async appInit({
		commit,
		dispatch
	}, options) {
		// 发起http请求，获取初始化数据
		const result = await http('common.init');
		console.log('初始化数据', result)
		if (result.code === 200) {
			commit('CONFIG', result.data);
			// 是否登录，没有则提出登录页
			if (!options?.query?.token) {
				dispatch('autoLogin');
			}
			return result.data;
		}
		return false;
	},

	// 获取模板数据
	async getTemplate({
		commit
	}, options) {
		let shop_id = 0;
		// #ifdef H5
		if (options?.query.shop_id) {
			shop_id = options.query.shop_id;
		}
		// #endif

		// #ifdef MP
		if (options?.query.scene) {
			let scene = decodeURIComponent(options?.query.scene);
			let sceneObj = scene.split('=');
			if (sceneObj[0] === 'shop_id') {
				shop_id = sceneObj[1]
			}
		}
		// #endif
		const result = await http('common.template', shop_id ? {
			shop_id
		} : {});
		console.log('模板数据', result)
		if (result.code === 200) {
			commit("hasTemplate", true);
			commit('TEMPLATE', result.data);
			return result.data;
		} else {
			commit("hasTemplate", false);
			return false;
		}
	},

	// 同步路由到后端
	syncPages({
		commit
	}) {
		http('common.syncPages', {
			data: ROUTES,
		})
	},
}


const mutations = {
	// 将chat、recharge存入本地存储区,其他数据存入同名对象
	CONFIG(state, payload) {
		Object.keys(payload).forEach(k => {
			// state[shop]=payload[shop] 999
			state[k] = payload[k];
			if (k === 'chat') {
				// chat数据本地持久化
				uni.setStorageSync("chat", payload[k]);
			}
			if (k === 'recharge') {
				uni.setStorageSync("recharge", payload[k])
			}
		})
	},

	TEMPLATE(state, data) {
		state.template = data;
		state.homeTemplate = data.home
		state.userTemplate = data.user
		state.floatData = data['float-button']?. [0]?.content
		state.popupData = data?.popup?. [0]?.content
		state.tabbarData = data?.tabbar?. [0]?.content
	},

	hasTemplate(state, data) {
		state.hasTemplate = data
	},
	// 弹窗一次的话，关闭的时候删除数据。
	delPopup(state, index) {
		let popupData = state.popupData;
		popupData.list.splice(index, 1)
		state.template = popupData;

		// console.log('state.popupData', state.popupData) //888
		// 仅弹出一次
		state.popupData.list = null //888
		// console.log('state.popupData', state.popupData) //888
	},
	shareInfo(state, shareInfo) {
		state.shareInfo = shareInfo;
	},
	ThemeType(state, ThemeType) {
		uni.setStorageSync("ThemeType", ThemeType);
		state.ThemeType = ThemeType;
	}
}


export default {
	state,
	mutations,
	actions,
	getters
}
