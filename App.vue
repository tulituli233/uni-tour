<script>
	import {
		init
	} from "@/tour";
	export default {
		onLaunch: function(options) {
			// console.log('App Launch')
			// 第一层初始化
			init(options);
		},
		onShow: function() {
			// console.log('App Show')
		},
		onHide: function() {
			// console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
</style>
