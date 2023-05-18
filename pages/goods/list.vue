<!-- 商品列表 -->
<template>
	<view class="list-box">
		<view class="head-box">
			<!-- 标题栏 -->
			<shopro-navbar>
				<view class="u-flex-1 u-flex u-col-center u-m-x-20" slot="content">
					<u-search placeholder="请输入关键字" @change="onSearch" @search="onSearch" @clear="clearSearch"
						v-model="searchVal" :showAction="false" height="60"></u-search>
				</view>
			</shopro-navbar>
			<!-- 筛选栏 -->
			<sh-filter @change="onFilter"></sh-filter>
		</view>

		<!-- 瀑布流 -->
		<view class="u-waterfall u-p-16">
			<view id="u-left-column" class="u-column">
				<view class="goods-item u-m-b-16 u-flex u-row-center u-col-center" v-for="(leftGoods,index) in leftList"
					:key="index">
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
				<view class="goods-item u-m-b-16 u-flex u-row-center u-col-center"
					v-for="(rightGoods,index) in rightList" :key="index">
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

		<!-- 缺省页 -->
		<shopro-empty v-if="isEmpty" :image="$IMG_URL + '/imgs/empty/empty_goods.png'" tipText="暂无该商品，还有更多好货等着你噢~">
		</shopro-empty>
		<!-- 加载更多 -->
		<u-loadmore v-show="!isEmpty" height="80rpx" :status="loadStatus" icon-type="flower" color="#ccc" />
		<!-- 登录弹窗 -->
		<tour-auth-modal></tour-auth-modal>
	</view>
</template>

<script>
	import shFilter from './components/sh-filter.vue';
	import {
		mapMutations,
		mapActions,
		mapState
	} from 'vuex';
	let systemInfo = uni.getSystemInfoSync();
	let historyTag = uni.getStorageSync('searchHistoryArr') ? JSON.parse(uni.getStorageSync('searchHistoryArr')) : [];
	export default {
		components: {
			shFilter
		},
		data() {
			return {
				isEmpty: false,
				goodsList: [],
				searchVal: '',
				listParams: {
					category_id: 0,
					keywords: '',
					page: 1
				},
				loadStatus: 'loadmore', //loadmore-加载前的状态，loading-加载中的状态，nomore-没有更多的状态
				lastPage: 1,

				// 瀑布流 350-330
				addTime: 100, //排序间隙时间
				leftHeight: 0,
				rightHeight: 0,
				leftList: [],
				rightList: [],
				tempList: [],

				dataType: 1
			};
		},
		// 触底加载更多
		onReachBottom() {
			if (this.listParams.page < this.lastPage) {
				this.listParams.page += 1;
				this.getGoodsList();
			}
		},
		onLoad() {
			if (this.$Route.query.id) {
				this.listParams.category_id = this.$Route.query.id;
				this.getGoodsList();
			} else if (this.$Route.query.hasOwnProperty('keywords')) {
				this.listParams.keywords = this.$Route.query.keywords;
				this.searchVal = this.$Route.query.keywords;
				!this.$Route.query.keywords && this.getGoodsList();
			} else {
				this.getGoodsList();
			}
		},
		methods: {
			// 价格保留两位小数
			toFixed2(num) {
				return num.toFixed(2);
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
			// 瀑布流相关
			async splitData() {
				if (!this.tempList.length) return;
				let item = this.tempList[0];
				if (!item) return;

				// 分左右
				if (this.leftHeight < this.rightHeight) {
					// this.leftHeight += item?.activity_discounts_tags.length ? 350 : 330;
					this.leftHeight += 330;
					this.leftList.push(item);
				} else if (this.leftHeight > this.rightHeight) {
					// this.rightHeight += item?.activity_discounts_tags.length ? 350 : 330;
					this.rightHeight += 330;
					this.rightList.push(item);
					// console.log('c2');
				} else {
					// this.leftHeight += item?.activity_discounts_tags.length ? 350 : 330;
					this.leftHeight += 330;
					this.leftList.push(item);
					// console.log('c1');
				}

				// 移除临时列表的第一项，如果临时数组还有数据，继续循环
				this.tempList.splice(0, 1);
				// console.log('this.tempList.length', this.tempList.length);
				if (this.tempList.length) {
					setTimeout(() => {
						this.splitData();
					}, this.addTime);
				}
			},
			clear() {
				this.leftList = [];
				this.rightList = [];
				this.leftHeight = 0;
				this.rightHeight = 0;
				this.tempList = [];
			},

			onFilter(gt) {
				this.listParams.category_id = gt;
				this.dataType = gt;
				this.goodsList = [];
				this.listParams.page = 1;
				this.lastPage = 1;
				this.clear();
				//debounce防抖
				this.$u.debounce(this.getGoodsList);
			},
			// 键盘搜索,输入搜索
			onSearch() {
				this.goodsList = [];
				this.listParams.page = 1;
				this.lastPage = 1;
				this.listParams.keywords = this.searchVal;
				this.clear();
				this.$u.debounce(this.getGoodsList);
			},

			// 队列
			getArr(list, item) {
				let arr = list;
				let length = 10; //队列长度
				arr.length < length ? arr.unshift(item) : arr.pop();
				return arr;
			},

			// 清除搜索框
			clearSearch() {
				this.searchVal = '';
				this.clear();
			},
			// 商品列表
			getGoodsList() {
				let that = this;
				that.loadStatus = 'loading';
				that.$http('goods.lists', that.listParams, '加载中...').then(res => {
					console.log('search.goods.lists', res);
					if (this.searchVal && !historyTag.includes(this.searchVal)) {
						let searchHistoryArr = JSON.stringify(this.getArr(historyTag, this.searchVal));
						uni.setStorageSync('searchHistoryArr', searchHistoryArr);
					}
					if (res.code === 200) {
						that.goodsList = [...that.goodsList, ...res.data.data];
						console.log('that.goodsList', that.goodsList);
						that.isEmpty = !that.goodsList.length;
						that.lastPage = res.data.last_page;
						that.loadStatus = that.listParams.page < res.data.last_page ? 'loadmore' : 'nomore';
						that.tempList = res.data.data;
						that.splitData();
					} else {
						that.loadStatus = 'loadmore';
						that.isEmpty = true;
					}
				});
			}
		}
	};
</script>

<style lang="scss">
	@mixin vue-flex($direction: row) {
		/* #ifndef APP-NVUE */
		display: flex;
		flex-direction: $direction;
		/* #endif */
	}

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

	.head-box {
		position: -webkit-sticky;
		position: sticky;
		top: 0;
		z-index: 998;
		background: #fff;
	}
</style>
