<template>
	<!-- 产品分类导航 -->
	<view class="wrap">
		<view class="menu-category-box u-m-b-10" :style="list.length <= oneRowNum ? `height:180rpx` : `height:300rpx`">
			<swiper class="menu-swiper-box" @change="onSwiper"
				:style="list.length <= oneRowNum ? `height:160rpx` : `height:300rpx`" circular :autoplay="false"
				:interval="3000" :duration="1000">
				<swiper-item class="menu-swiper-item" v-for="(itemList, index) in newList" :key="index">
					<view class="menu-tab-box u-flex u-flex-wrap">
						<view class="tab-list u-flex-col u-col-center u-row-center"
							:style="{ width: 100 / oneRowNum + '%',backgroundColor:item.bgc }"
							v-for="(item, index) in itemList" :key="index" @tap="$tools.routerTo(item.path)">
							<view class="img-box">
								<image class="tab-img" :src="item.image"></image>
							</view>
							<text class="text-style">{{ item.name }}</text>
						</view>
					</view>
				</swiper-item>
			</swiper>
			<!-- 指示点 newList=[[]] newList.length = 1-->
			<!-- <view id="test">{{newList}}</view> -->
			<view class="menu-category-dots" v-if="newList.length > 1">
				<text :class="categoryCurrent === index ? 'category-dot-active' : 'category-dot'"
					v-for="(dot, index) in newList" :key="index"></text>
			</view>
		</view>
	</view>
	</view>
</template>

<script>
	/**
	 * shGridSwiper-滑动宫格列表
	 * @property {Array} list - 列表数据
	 * @property {Number|String} oneRowNum - 单行数量
	 */
	export default {
		components: {},
		data() {
			return {
				categoryCurrent: 0, //分类轮播下标
			};
		},
		props: {
			list: {
				type: Array,
				default: () => {
					return [];
				}
			},
			oneRowNum: {
				type: [Number, String],
				default: 5
			}
		},
		computed: {
			newList() {
				if (this.list.length) {
					let data = this.$tools.splitData(this.list, this.oneRowNum * 2);
					return data;
				}
			}
		},
		methods: {
			// 轮播
			onSwiper(e) {
				this.categoryCurrent = e.detail.current;
			},
			jump(path, query) {
				this.$Router.push({
					path: path,
					query: query
				});
			}
		}
	};
</script>

<style lang="scss">
	.menu-category-box{
		padding: 0 10rpx;
		border-radius: 40rpx;
		overflow: hidden;
	}
	// 产品分类
	.menu-category-box,
	.menu-swiper-box {
		position: relative;
		background: #fff;

		.menu-swiper-item {
			background: #fff;
			height: 100%;
			width: 100%;
		}

		.menu-tab-box {
			.tab-list {
				font-size: 26rpx;
				font-weight: 500;
				color: rgba(51, 51, 51, 1);
				margin: 2rpx 0;
				border-left: 1rpx solid #fff;
				border-right: 1rpx solid #fff;

				.img-box {
					width: 98rpx;
					height: 98rpx;
					margin-bottom: 5rpx;

					.tab-img {
						width: 68rpx;
						height: 68rpx;
						margin: 20rpx auto;
						display: block;
					}
				}

				.text-style {
					color: #fff;
					padding-bottom: 10rpx;
				}
			}
		}

		.menu-category-dots {
			display: flex;
			position: absolute;
			left: 50%;
			transform: translateX(-50%);
			bottom: 10rpx;

			.category-dot {
				width: 12rpx;
				height: 12rpx;
				background: #eeeeee;
				border-radius: 50%;
				margin-right: 10rpx;
			}

			.category-dot-active {
				width: 12rpx;
				height: 12rpx;
				background: #e9b461;
				border-radius: 50%;
				margin-right: 10rpx;
			}
		}
	}

	.dark-view {
		background-color: #e9b461;
	}
</style>
