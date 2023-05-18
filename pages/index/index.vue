<template>
	<view class="home-wrap u-m-b-20 dark-bg">
		<!-- 空白页 -->
		<!-- #ifdef APP-PLUS -->
		<!-- retry重试 用户点击页面的"重试"按钮时触发init -->
		<u-no-network @retry="init"></u-no-network>
		<!-- #endif -->
		<shopro-empty v-if="!hasTemplate" :image="$IMG_URL + '/imgs/empty/template_empty.png'" tipText="暂未找到模板，请前往装修~">
		</shopro-empty>
		<view v-else-if="isConnected && isRefresh" class="content-box">
			<!-- 导航栏 -->
			<home-head v-if="headSwiperList && headSwiperList.length" :scrollTop="scrollTop" borderRadius="0"
				:navTitle="initShop.name" :list="headSwiperList"></home-head>
			<!-- 自定义模块  选择性显示-->
			<view class="template-box">
				<block v-for="(item, index) in homeTemplate" :key="item.id">
					<!-- 轮播(静态轮播图) -->
					<sh-banner v-if="item.type === 'banner' && index !== 0" :Px="item.content.x" :Py="item.content.y"
						:borderRadius="item.content.radius" :height="item.content.height" :list="item.content.list">
					</sh-banner>
					<!-- 滑动宫格(静态轮播图) -->
					<sh-grid-swiper v-if="item.type === 'menu'" :list="item.content.list"
						:oneRowNum="item.content.style"></sh-grid-swiper>
				</block>
			</view>
			<!-- 分类选项卡(在商品之上) -->
			<sh-category-tabs
				v-if="categoryTabsData && categoryTabsData.category_arr && categoryTabsData.category_arr.length"
				:enable="enable" :styleType="categoryTabsData.style" :tabsList="categoryTabsData.category_arr">
			</sh-category-tabs>
		</view>
	</view>
</template>

<script>
	import shBanner from './components/sh-banner.vue';
	import shGridSwiper from './components/sh-grid-swiper.vue';
	import shCategoryTabs from './components/sh-category-tabs.vue';
	import homeHead from './index/home-head.vue';

	import {
		mapMutations,
		mapActions,
		mapState,
		mapGetters
	} from 'vuex';
	export default {
		components: {
			shBanner,
			shGridSwiper,
			shCategoryTabs,
			homeHead
		},
		data() {
			return {
				isRefresh: true,

				enable: false, //是否开启吸顶。
				isConnected: true, //是否有网
				showPrivacy: false, //展示隐私协议
				scrollTop: 0
			}
		},
		// 下拉刷新
		onPullDownRefresh() {
			this.init();
		},
		// 页面滚动
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		onShow() {
			let that = this;
			this.enable = true;
			this.isLogin && this.getCartList();
			// 网络变化检测
			uni.onNetworkStatusChange(res => {
				this.isConnected = res.isConnected;
				res.isConnected && this.init();
			});
		},
		onHide() {
			this.enable = false;
		},
		onLoad() {
			// #ifdef APP-VUE
			// plus.runtime.disagreePrivacy();
			console.log(plus.runtime.isAgreePrivacy(), 1111111111);
			// app隐私协议弹窗
			// 未同意，则进入
			if (!plus.runtime.isAgreePrivacy()) {
				// 隐私协议和弹窗互斥
				this.showPrivacy = true;
				this.showNoticeModal = false;
			}
			// #endif
		},
		computed: {
			...mapGetters(['initShop', 'homeTemplate', 'hasTemplate', 'isLogin']),
			// 头部模块数据
			headSwiperList() {
				if (this.homeTemplate?.length) {
					// 数据填充
					let TuliList = this.homeTemplate[0]?.content?.list
					if (!TuliList[0].path) {
						TuliList[0].path = '/pages/goods/list?keywords=美'
						TuliList[1].path = '/pages/goods/list?keywords=鲜'
					}
					return TuliList

					// return this.homeTemplate[0]?.content?.list;
				}
			},
			// 分类选项卡数据
			categoryTabsData() {
				if (this.homeTemplate?.length) {
					return this.homeTemplate[this.homeTemplate.length - 1]?.content;
				}
			}
		},
		methods: {
			...mapActions(['appInit', 'getTemplate', 'getCartList']),
			// 初始化（下拉刷新专用）
			init() {
				this.isRefresh = false;
				return Promise.all([this.getTemplate()]).then(() => {
					uni.stopPullDownRefresh();
					this.isRefresh = true;
				});
			},
		}
	}
</script>

<style>
</style>
