<template>
	<!-- 分类选项卡 -->
	<view class="category-tabs-wrap">
		<!-- 吸顶 -->
		<view class="u-sticky-wrap" :class="[elClass]"
			:style="{ height: fixed ? height + 'px' : 'auto', backgroundColor: isSticky ? '#fff' : '#f6f6f6' }">
			<view class="u-sticky"
				:style="{ position: fixed ? 'fixed' : 'static', top: stickyTop + 'px', left: left + 'px', width: width == 'auto' ? 'auto' : width + 'px', zIndex: 1109 }">
				<view class="tabs-wrap u-p-y-20"
					:style="isSticky ? 'border-bottom:1px solid #eee;background-color:#fff' : ''">
					<scroll-view scroll-x class="tabs-content" scroll-with-animation :scroll-left="scrollLeft">
						<view class="u-flex u-row-cetner u-flex-1 u-col-center">
							<view class="tab-item u-flex-col u-col-center u-row-center"
								v-for="(item, index) in tabsList" :key="index" @tap="tabChange(index)">
								<view class="tab-title u-m-y-6" :class="{ 'title-active': tabCur == index }">
									{{ item.name }}
								</view>
								<view class="tab-des" :class="{ 'des-active': tabCur == index }">{{ item.description }}
								</view>
							</view>
						</view>
					</scroll-view>
				</view>
			</view>
		</view>

		<!-- 瀑布流 -->
		<view class="u-waterfall u-p-16" v-if="styleType == 1">
			<view id="u-left-column" class="u-column">
				<view class="goods-item u-m-b-16 u-flex u-row-center u-col-center" v-for="leftGoods in leftList"
					:key="leftGoods.homestay_id">
					<view v-if="getDataType(leftGoods)==1">
						<shopro-goods-card :detail="leftGoods" :type="leftGoods.activity_type || ''"
							:image="leftGoods.image_path" :title="leftGoods.homestay_name"
							:subtitle="leftGoods.merchant_name" :price="toFixed2(leftGoods.price*leftGoods.discount)"
							:originPrice="leftGoods.price" :tagTextList="leftGoods.activity_discounts_tags"
							@click="$Router.push({ path: '/pages/goods/detail', query: { id: leftGoods.homestay_id,dataType:getDataType(leftGoods) } })">
						</shopro-goods-card>
					</view>
					<view v-else-if="getDataType(leftGoods)==2">
						<shopro-goods-card :detail="leftGoods" :type="leftGoods.activity_type || ''"
							:image="leftGoods.image_path" :title="leftGoods.restaurant_name"
							:subtitle="leftGoods.merchant_name" :price="toFixed2(leftGoods.price*leftGoods.discount)"
							:originPrice="leftGoods.price" :tagTextList="leftGoods.activity_discounts_tags"
							@click="$Router.push({ path: '/pages/goods/detail', query: { id: leftGoods.restaurant_id,dataType:getDataType(leftGoods) } })">
						</shopro-goods-card>
					</view>
					<view v-else-if="getDataType(leftGoods)==3">
						<shopro-goods-card :detail="leftGoods" :type="leftGoods.activity_type || ''"
							:image="leftGoods.image_path" :title="leftGoods.scenic_name"
							:subtitle="leftGoods.merchant_name"
							@click="$Router.push({ path: '/pages/goods/detail', query: { id: leftGoods.scenic_id,dataType:getDataType(leftGoods) } })">
						</shopro-goods-card>
					</view>
					<view v-else-if="getDataType(leftGoods)==4">
						<shopro-goods-card :detail="leftGoods" :type="leftGoods.activity_type || ''"
							:image="leftGoods.image_path" :title="leftGoods.title" :subtitle="leftGoods.merchant_name"
							:price="toFixed2(leftGoods.price*leftGoods.discount)" :originPrice="leftGoods.price"
							:tagTextList="leftGoods.activity_discounts_tags"
							@click="$Router.push({ path: '/pages/goods/detail', query: { id: leftGoods.tour_group_id,dataType:getDataType(leftGoods) } })">
						</shopro-goods-card>
					</view>
				</view>
			</view>
			<view id="u-right-column" class="u-column">
				<view class="goods-item u-m-b-16 u-flex u-row-center u-col-center" v-for="rightGoods in rightList"
					:key="rightGoods.homestay_id">
					<view v-if="getDataType(rightGoods)==1">
						<shopro-goods-card :detail="rightGoods" :type="rightGoods.activity_type || ''"
							:image="rightGoods.image_path" :title="rightGoods.homestay_name"
							:subtitle="rightGoods.merchant_name" :price="toFixed2(rightGoods.price*rightGoods.discount)"
							:originPrice="rightGoods.price" :tagTextList="rightGoods.activity_discounts_tags"
							@click="$Router.push({ path: '/pages/goods/detail', query: { id: rightGoods.homestay_id,dataType:getDataType(rightGoods) } })">
						</shopro-goods-card>
					</view>
					<view v-if="getDataType(rightGoods)==2">
						<shopro-goods-card :detail="rightGoods" :type="rightGoods.activity_type || ''"
							:image="rightGoods.image_path" :title="rightGoods.restaurant_name"
							:subtitle="rightGoods.merchant_name" :price="toFixed2(rightGoods.price*rightGoods.discount)"
							:originPrice="rightGoods.price" :tagTextList="rightGoods.activity_discounts_tags"
							@click="$Router.push({ path: '/pages/goods/detail', query: { id: rightGoods.restaurant_id,dataType:getDataType(rightGoods) } })">
						</shopro-goods-card>
					</view>
					<view v-else-if="getDataType(rightGoods)==3">
						<shopro-goods-card :detail="rightGoods" :type="rightGoods.activity_type || ''"
							:image="rightGoods.image_path" :title="rightGoods.scenic_name"
							:subtitle="rightGoods.merchant_name"
							@click="$Router.push({ path: '/pages/goods/detail', query: { id: rightGoods.scenic_id,dataType:getDataType(rightGoods) } })">
						</shopro-goods-card>
					</view>
					<view v-else-if="getDataType(rightGoods)==4">
						<shopro-goods-card :detail="rightGoods" :type="rightGoods.activity_type || ''"
							:image="rightGoods.image_path" :title="rightGoods.title"
							:subtitle="rightGoods.merchant_name" :price="toFixed2(rightGoods.price*rightGoods.discount)"
							:originPrice="rightGoods.price" :tagTextList="rightGoods.activity_discounts_tags"
							@click="$Router.push({ path: '/pages/goods/detail', query: { id: rightGoods.tour_group_id,dataType:getDataType(rightGoods) } })">
						</shopro-goods-card>
					</view>
				</view>
			</view>
		</view>

		<!-- m -->
		<view class="big-card-wrap u-p-10" v-if="styleType == 2">
			<block v-for="item in goodsList" :key="item.id">
				<sh-goods-card :detail="item" :type="item.activity_type || ''" :image="item.image_path"
					:title="item.homestay_name" :subtitle="item.merchant_name" :price="item.price*item.discount"
					:originPrice="item.price" :sales="item.sales" :tagTextList="item.activity_discounts_tags"
					@click="$Router.push({ path: '/pages/goods/detail', query: { id: item.id } })"></sh-goods-card>
			</block>
		</view>

		<view class="x-c" style="width: 100%;">
			<!-- 缺省页 -->
			<shopro-empty v-if="isEmpty" marginTop="200rpx" :image="$IMG_URL + '/imgs/empty/empty_goods.png'"
				tipText="暂无该商品，还有更多好货等着你噢~"></shopro-empty>

			<!-- 更多 -->
			<u-loadmore v-show="!isEmpty" height="80rpx" :status="loadStatus" icon-type="flower" color="#ccc" />
		</view>
	</view>
</template>

<script>
	/**
	 * category-tabs
	 * @description 一个可以吸顶的分类列表
	 * @property {Boolean} enable = false - 是否吸顶,tabbar项中，组件不会自动销毁，需要自行开关
	 * @property {Array} tabsList  - 分类列表
	 * @property {Array | Number} styleType  - 卡片类型
	 */
	let systemInfo = uni.getSystemInfoSync();
	// #ifdef MP-WEIXIN || MP-BAIDU || MP-TOUTIAO || MP-QQ
	let menuButtonInfo = uni.getMenuButtonBoundingClientRect();
	// #endif
	import shGoodsCard from '../components/sh-goods-card.vue';
	export default {
		components: {
			shGoodsCard
		},
		data() {
			return {
				// 吸顶相关
				fixed: false,
				height: 'auto',
				elClass: this.$u.guid(),
				left: 0,
				width: 'auto',
				stickyTop: 0,
				isSticky: false, //是否吸顶

				// 瀑布流 350-330
				addTime: 100, //排序间隙时间
				leftHeight: 0,
				rightHeight: 0,
				leftList: [],
				rightList: [],
				tempList: [],

				tabCur: 0,
				scrollLeft: 0,
				isEmpty: true,
				categoryId: this.tabsList[0]?.id,
				goodsList: [],
				tabCurrent: 0,
				loadStatus: 'loadmore', //loadmore-加载前的状态，loading-加载中的状态，nomore-没有更多的状态
				currentPage: 1,
				lastPage: 1,

				dataType: 1
			};
		},
		watch: {
			enable(val) {
				if (val == false) {
					this.fixed = false;
					this.disconnectObserver('contentObserver');
				} else {
					this.initObserver();
				}
			}
		},
		props: {
			tabsList: {
				type: Array,
				default: () => []
			},
			styleType: {
				type: [String, Number],
				default: 1
			},
			enable: {
				type: Boolean,
				default: false
			}
		},
		created() {
			this.getGoodsList();
			// 触底监听
			uni.$on('uOnReachBottom', data => {
				if (this.currentPage < this.lastPage) {
					this.currentPage += 1;
					this.getGoodsList();
				}
			});
		},
		mounted() {
			this.initObserver();
		},
		beforeDestroy() {
			this.disconnectObserver('contentObserver');
		},
		methods: {
			// 价格保留两位小数
			toFixed2(num) {
				return num.toFixed(2);
			},
			// 拆分数据为左右表，瀑布流相关
			async splitData() {
				if (!this.tempList.length) return;
				let item = this.tempList[0];
				if (!item) return;

				// 分左右
				if (this.leftHeight < this.rightHeight) {
					// this.leftHeight += item?.activity_discounts_tags.length ? 350 : 330;
					this.leftHeight += 330;
					this.leftList.push(item);
					// console.log('sd-1');
				} else if (this.leftHeight > this.rightHeight) {
					// this.rightHeight += item?.activity_discounts_tags.length ? 350 : 330;
					this.rightHeight += 330;
					this.rightList.push(item);
					// console.log('sd-2');
				} else {
					// this.leftHeight += item?.activity_discounts_tags.length ? 350 : 330;
					this.leftHeight += 330;
					this.leftList.push(item);
					// console.log('sd-3');
				}
				// console.log(322);
				// 移除临时列表的第一项，如果临时数组还有数据，继续循环
				this.tempList.splice(0, 1);
				if (this.tempList.length) {
					setTimeout(() => {
						this.splitData();
					}, this.addTime);
				} else {
					console.log("this.rightList", this.rightList);
					console.log("this.leftList", this.leftList);
				}
			},
			clear() {
				this.leftList = [];
				this.rightList = [];
				this.leftHeight = 0;
				this.rightHeight = 0;
				this.tempList = [];
			},

			// 吸顶相关
			initObserver() {
				if (!this.enable) return;
				// #ifdef APP-PLUS || H5
				this.stickyTop = systemInfo.statusBarHeight + 44;
				// #endif
				// #ifdef MP
				let height = systemInfo.platform == 'ios' ? 44 : 48;
				let top = systemInfo.statusBarHeight + height;
				this.stickyTop = systemInfo.statusBarHeight + height;
				// #endif
				this.disconnectObserver('contentObserver');

				this.$uGetRect('.' + this.elClass).then(res => {
					this.height = res.height;
					this.left = res.left;
					this.width = res.width;
					this.$nextTick(() => {
						this.observeContent();
					});
				});
			},
			observeContent() {
				this.disconnectObserver('contentObserver');
				const contentObserver = this.createIntersectionObserver({
					thresholds: [0.95, 0.98, 1]
				});
				contentObserver.relativeToViewport({
					top: -this.stickyTop
				});
				contentObserver.observe('.' + this.elClass, res => {
					if (!this.enable) return;
					this.setFixed(res.boundingClientRect.top);
				});
				this.contentObserver = contentObserver;
			},
			setFixed(top) {
				const fixed = top < this.stickyTop;
				if (fixed) {
					this.isSticky = true;
				} else if (this.fixed) {
					this.isSticky = false;
				}
				this.fixed = fixed;
			},
			disconnectObserver(observerName) {
				const observer = this[observerName];
				observer && observer.disconnect();
			},
			// 获取数据类型
			getDataType(obj) {
				// console.log('obj', obj)
				let dataType = 1;
				// console.log('merchant_id', obj.hasOwnProperty('merchant_id'))
				// console.log('obj.merchant_id', obj.merchant_id)
				if (obj.hasOwnProperty('restaurant_id')) {
					dataType = 2
				} else if (obj.hasOwnProperty('scenic_id')) {
					dataType = 3
				} else if (obj.hasOwnProperty('tour_group_id')) {
					dataType = 4
				}
				// console.log('dataType', dataType)
				return dataType
			},

			// 获取商品列表
			getGoodsList() {
				let that = this;
				that.$http('goods.lists', {
					category_id: that.categoryId,
					page: that.currentPage
				}).then(res => {
					console.log('商品列表', res)
					if (res.code === 200) {
						that.goodsList = [...that.goodsList, ...res.data.data];
						that.tempList = res.data.data;
						this.dataType = that.getDataType(that.tempList[0]);
						that.isEmpty = !that.goodsList.length;
						that.lastPage = res.data.last_page;
						that.loadStatus = that.currentPage < res.data.last_page ? 'loadmore' : 'nomore';
						// console.log(321);
						that.splitData();
					} else {
						that.loadStatus = 'loadmore';
						that.isEmpty = true;
					}
				});
			},

			// 选择tab
			tabChange(index) {
				this.tabCur = index;
				this.scrollLeft = (index - 1) * 60;
				this.categoryId = this.tabsList[index].id;
				this.styleType === 1 && this.clear();
				this.goodsList = [];
				this.currentPage = 1;
				this.lastPage = 1;
				this.loadStatus = 'loadmore';
				this.getGoodsList();
			}
		}
	};
</script>

<style lang="scss" scoped>
	@mixin vue-flex($direction: row) {
		/* #ifndef APP-NVUE */
		display: flex;
		flex-direction: $direction;
		/* #endif */
	}

	.category-tabs-wrap {
		min-height: 1000rpx;
		padding-bottom: 140rpx;

		// 吸顶
		.u-sticky-wrap {
			background-color: #fff;
		}

		// 瀑布流
		.u-waterfall {
			@include vue-flex;
			flex-direction: row;
			align-items: flex-start;
		}

		.u-column {
			@include vue-flex;
			flex: 1;
			flex-direction: column;
			height: auto;
		}
	}

	// 滑动分类
	.tabs-content {
		white-space: nowrap;

		.tab-item {
			min-height: 90rpx;
			display: inline-block;
			margin: 0 10rpx;
			padding: 0 20rpx;

			.tab-title {
				font-size: 28rpx;
				font-weight: 600;
				color: #333333;
			}

			.title-active {
				color: #a8700d;
			}

			.tab-des {
				font-size: 22rpx;
				font-weight: 400;
				color: #999999;
				text-align: center;
			}

			.des-active {
				background: linear-gradient(90deg, #e9b461, #eecc89);
				border-radius: 15rpx;
				padding: 2rpx 10rpx;
				color: #ffffff;
			}
		}
	}
</style>
