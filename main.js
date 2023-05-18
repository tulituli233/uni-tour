import App from './App'

// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false

import {
	router,
	RouterMount
} from "@/tour/router";

import store from "@/tour/store";

// 加载tour
import tour from "@/tour";
Vue.use(tour);
// Vue.prototype.$BASE_URL = 'BASE_URL';

// 引入全局uView
import uView from "uview-ui";
Vue.use(uView);

//引入路由
Vue.use(router);

App.mpType = 'app'

try {
	function isPromise(obj) {
		return (
			!!obj &&
			(typeof obj === "object" || typeof obj === "function") &&
			typeof obj.then === "function"
		);
	}

	// 统一 vue2 API Promise 化返回格式与 vue3 保持一致
	uni.addInterceptor({
		returnValue(res) {
			if (!isPromise(res)) {
				return res;
			}
			return new Promise((resolve, reject) => {
				res.then((res) => {
					if (res[0]) {
						reject(res[0]);
					} else {
						resolve(res[1]);
					}
				});
			});
		},
	});
} catch (error) {}

const app = new Vue({
	store,
	...App
})

// #ifdef H5
RouterMount(app, router, "#app");
// #endif

app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
export function createApp() {
	const app = createSSRApp(App)
	return {
		app
	}
}
// #endif

// import Vue from "vue";
// import App from "./App";
// // import {
// // 	router,
// // 	RouterMount
// // } from "@/shopro/router";
// // import store from "@/shopro/store";
// // import uView from "uview-ui";
// // import shopro from "@/shopro";

// // import mixin from '@/common/js/setTheme.js'
// // Vue.use(mixin);
// // import {getTheme} from '@/common/js/setTheme.js';
// // Vue.prototype.$theme = getTheme;


// async function bootstrap() {
// 	App.mpType = "app";
// 	//引入路由
// 	// Vue.use(router);
// 	// 引入全局uView
// 	// Vue.use(uView);
// 	// 加载shopro
// 	// Vue.use(shopro);

// 	// setTheme
// 	// Vue.use(mixin);

// 	const app = new Vue({
// 		// store,
// 		...App
// 	});
// 	// #ifdef H5
// 	// RouterMount(app, router, "#app");
// 	// RouterMount(app, "#app");
// 	// #endif
// 	// #ifndef H5
// 	app.$mount();
// 	// #endif
// }

// bootstrap();
