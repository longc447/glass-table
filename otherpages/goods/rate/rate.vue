<template>
	<view :data-theme="themeStyle" class="allPage" :class="{ bottom: hasData }">
		<scroll-view class="container" :scroll-x="true" :show-scrollbar="false">
			<block v-if="hasData">
				<view class="cart-wrap" style="max-height: 80vh; overflow-y: scroll">
					<view class="cart-header">
						<view class="num-wrap">
							<text>请选择需要来架加工的镜片</text>
						</view>
					</view>
					<block v-for="(item, cartIndex) in cartData" :key="cartIndex">
						<view class="cart-goods" v-if="item.rate_price > 0">
							<view class="goods-wrap">
								<view class="iconfont "
									:class="item.checked ? 'iconyuan_checked color-base-text' : 'iconyuan_checkbox'"
									@click="singleElection(cartIndex)"></view>
								<view class="goods-img">
									<image :src="$util.img(item.sku_image, { size: 'mid' })"
										@error="imgError(cartIndex)" mode="aspectFill"></image>
								</view>
								<view class="goods-info">
									<view class="goods-name">
										<text style="font-size: 28rpx; font-weight: bold">{{ item.goods_name }}</text>
									</view>
									<sku-list :goodsItem="item"></sku-list>
									<view class="sku"></view>
									<view class="bottom-box">
										<text class="font-size-base">
											<text class="iconfont iconclose iconclose-x"></text>
											{{ item.num }}
										</text>
										<text class="goods-price color-base-text">
											<text class="unit">加工费：{{ $lang('common.currencySymbol') }}</text>
											<template>
												{{ item.rate_price }}
											</template>
										</text>
									</view>
								</view>
							</view>
						</view>
					</block>
				</view>
			</block>
		</scroll-view>
		<!-- 加载动画 -->
		<loading-cover ref="loadingCover"></loading-cover>
		<button type="primary" class="add-buy" @click="editCart()">
			确定
		</button>
	</view>
</template>

<script>
	import scroll from '@/common/js/scroll-view.js';
	import globalConfig from '@/common/js/golbalConfig.js';
	import Config from '@/common/js/config.js';
	export default {
		mixins: [scroll, globalConfig],
		data() {
			return {
				keyText: 'cart_id',
				cartData: [], // 购物车
				checkAll: true,
				modifyFlag: false,
				isSub: false,
				isIphoneX: false, //判断手机是否是iphoneX以上,
				cartBottom: '56px',
				is_wholesaler: Config.is_wholesaler,
				styleIPhone12: false,
				param:{},
				site_id:0,
			};
		},
		onLoad(option) {
			this.param = option;
			if(this.param.sku_id){
				this.keyText = 'sku_id';
			}
			this.site_id = this.param.site_id
		},
		async onShow() {
			this.$langConfig.refresh();
			this.getCartData();
			this.isIphoneX = this.$util.uniappIsIPhoneX();
		},
		computed: {
			hasData() {
				return this.cartData.length > 0;
			}
		},
		methods: {
			getCartData() {
				this.showEmpty = false;
				this.$api.sendRequest({
					url: '/api/cart/rateGoodsLists',
					data: this.param,
					success: res => {
						if (res.code >= 0) {
							this.handleCartData(res.data);
							if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
						} else {
							this.$util.showToast({
								title: '未获取到创建订单所需数据！'
							});
							setTimeout(() => {
								this.$util.redirectTo('/pages/index/index/index', {}, 'reLaunch');
							}, 1000);
						}
					},
					fail: res => {
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					},
				});
			},
			/**
			 * 处理购物车数据结构
			 */
			handleCartData(data) {
				let rate_ids = uni.getStorageSync('rate_ids');
				if(rate_ids){
					rate_ids     = rate_ids.replace(/"/g, '').split(',');
					rate_ids     = rate_ids.map(Number)
				} else {
					let rate_ids = [];
				}
				this.cartData = [];
				let goods_list = [];
				Object.keys(data.shop_goods_list).forEach((key, index) => {
					if(data.shop_goods_list[key].site_id == this.site_id){
						goods_list = data.shop_goods_list[key].goods_list;
					}
				})
				goods_list.forEach((item, index) => {
					item.checked = false;
					if(rate_ids && rate_ids.indexOf(item[this.keyText]) !== -1){
						item.checked = true;
					}
					if (typeof(item.sku_spec_format) == 'string') {
						if (item.sku_spec_format) {
							item.sku_spec_format = JSON.parse(item.sku_spec_format);
						} else {
							item.sku_spec_format = [];
						}
					}
				})
				this.cartData = goods_list;
			},
			imgError(cartIndex) {
				this.cartData[cartIndex].sku_image = this.$util.getDefaultImage().default_goods_img;
				this.$forceUpdate();
			},
			/**
			 * 单选
			 * @param {Object} index
			 */
			singleElection(index) {
				this.cartData[index].checked = !this.cartData[index].checked;
			},
			editCart() {
				let rate_ids = [];
				this.cartData.forEach((item,index) => {
					console.log(item.eye, 'item');
					if (item.checked) {
						rate_ids.push(item[this.keyText]);
					}
				});
				rate_ids   = rate_ids.join(',');
				uni.setStorageSync('rate_ids',rate_ids);
				this.$util.redirectTo('/pages/order/payment/payment');
			}
		}
	};
</script>
<style lang="scss">
	.allPage {
		height: calc(100vh - 110rpx);
		padding-bottom: 110rpx;
		overflow-y: auto;

		&.bottom {
			height: calc(100vh - 210rpx);
			padding-bottom: 210rpx;
		}
	}

	.cart-header {
		padding: 50rpx 30rpx;
		margin: 0 $margin-both;
		display: flex;
		align-items: center;
		justify-content: space-between;
		line-height: 40rpx;
		background-color: #fc5531;

		.num-wrap {
			flex: 1;
			line-height: inherit;

			text {
				padding: 0 4rpx;
				color: white;
			}
		}

		.cart-action {
			line-height: inherit;
		}

		&.invalid {
			margin-left: $margin-both;
			margin-top: $margin-updown;
			flex: 1;
			line-height: inherit;
		}

		.shop-info {
			line-height: inherit;
			margin-right: $margin-both;
		}

		.iconyuan_checkbox {
			font-size: 40rpx;
			color: $color-disabled;
			margin-right: 14rpx;
			line-height: 1;
		}

		.iconyuan_checked {
			font-size: 40rpx;
			margin-right: 14rpx;
			line-height: 1;
		}

		.icondianpu {
			display: inline-block;
			margin-right: 10rpx;
			line-height: inherit;
		}
	}

	.add-buy {
		margin-top: 60rpx;
	}

	.cart-wrap {
		margin-bottom: $margin-updown;

		&:first-child {
			margin-top: $margin-updown;
		}

		.fixed-wrap {
			height: 116rpx;
		}

		&.invalid {
			.cart-header {
				margin: 0 $margin-both;
			}
		}

		.cart-goods {
			margin: 10rpx $margin-both;
			background: #fff;
			box-sizing: border-box;
			position: relative;
			padding: 30rpx 30rpx 0;

			&:nth-of-type(2) {
				border-top-left-radius: $border-radius;
				border-top-right-radius: $border-radius;
			}

			&:last-child {
				border-bottom-left-radius: $border-radius;
				border-bottom-right-radius: $border-radius;
				padding-bottom: 30rpx;
			}

			.goods-wrap {
				display: flex;
				align-items: center;
				position: relative;
				padding-left: 64rpx;
				transition: all 0.1s;

				&>.iconfont {
					font-size: 40rpx;
					position: absolute;
					top: 50%;
					left: 0;
					transform: translateY(-50%);
					transition: all 0.2s;
				}

				&>.iconyuan_checkbox {
					color: $color-disabled;
				}

				&.edit {
					transform: translateX(-70rpx);

					>.iconfont {
						opacity: 0;
					}
				}

				.goods-img {
					width: 130rpx;
					height: 130rpx;
					margin-right: 20rpx;
					border-radius: $border-radius;

					image {
						width: 100%;
						height: 100%;
						border-radius: $border-radius;
					}
				}

				.goods-info {
					flex: 1;
					min-height: 180rpx;
					padding: 20rpx 0;
					position: relative;
					width: calc(100% - 220rpx);
					margin-top: -4rpx;

					.goods-name {
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
						overflow: hidden;
						font-size: 20rpx;
						line-height: 1.5;
						font-size: $font-size-base;
					}

					.sku {
						display: flex;
						line-height: 1;
						margin-top: 8rpx;

						.goods-spec {
							color: $color-tip;
							font-size: $font-size-tag;
							overflow: hidden;
							// text-overflow: ellipsis;
							// white-space: nowrap;
							flex-wrap: wrap;
							flex: 1;
							// text {
							// 	margin-right: 20rpx;
							// 	&:last-child {
							// 		margin-right: 0;
							// 	}
							// }
						}
					}

					.goods-sub-section {
						position: absolute;
						left: 0;
						bottom: 0;
						display: flex;
						justify-content: space-between;
						width: 100%;

						.unit {
							font-size: $font-size-tag;
							margin-right: 4rpx;
						}

						.uni-numbox {
							position: absolute;
							right: 0;
							bottom: 8rpx;
						}

						.goods-price {
							display: flex;
							flex-direction: row;
							font-weight: bold;

							.bottom-price {
								width: 100%;
								font-size: $font-size-toolbar;

								image {
									width: 56rpx;
									height: 22rpx;
									margin-left: 6rpx;
								}
							}
						}
					}
				}
			}

			.bottom-box {
				position: absolute;
				bottom: 8rpx;
				width: 100%;
			}

			.bottom-box .goods-price {
				position: absolute;
				right: 0;
			}

			.iconclose-x {
				font-size: 20rpx !important;
			}

			.item-del {
				position: absolute;
				width: 0;
				height: 90%;
				color: #fff;
				right: 0;
				top: 20rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				transition: all 0.3s;
				overflow: hidden;
				white-space: nowrap;
				font-size: $font-size-tag;

				&.show {
					width: 90rpx;
				}
			}
		}

		.invalid-goods {
			.invalid-mark {
				color: $color-tip;
				padding: 6rpx 16rpx;
				display: inline-block;
				font-size: $font-size-goods-tag;
			}
		}
	}

	.iphone12 {
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
	}

	.cart-bottom {
		// position: fixed;
		z-index: 5;
		width: 100vw;
		// height: 80rpx;
		background: #fff;
		// bottom: var(--window-bottom);
		overflow: hidden;
		display: flex;
		// bottom: 56rpx;
		z-index: 9;

		.all-election {
			height: 100rpx;
			position: relative;
			display: inline-block;

			&>.iconfont {
				font-size: 40rpx;
				position: absolute;
				top: 50%;
				left: 30rpx;
				transform: translateY(-50%);
			}

			&>.iconyuan_checkbox {
				color: $color-disabled;
			}

			&>text {
				margin-left: 56rpx;
				line-height: 100rpx;
				padding-left: 30rpx;
			}
		}

		.settlement-info {
			flex: 1;
			text-align: right;
			padding-right: 10rpx;
			line-height: 100rpx;

			text {
				font-weight: bold;
			}
		}

		.action-btn {
			width: 200rpx;
			height: 100rpx;
			line-height: 100rpx;
			border-radius: 0;
			margin: 0;
			display: flex;
			justify-content: center;
			align-items: center;
			margin-right: 20rpx;

			button {
				height: 70rpx;
				line-height: 70rpx;
				font-size: $font-size-base;

				&.delete {
					height: 50rpx;
					line-height: 46rpx;
				}
			}
		}
	}

	.cart-bottom.active {
		bottom: calc(constant(safe-area-inset-bottom) + 55px) !important;
		bottom: calc(env(safe-area-inset-bottom) + 55px) !important;
	}

	.cart-empty {
		text-align: center;
		padding: 140rpx $padding 80rpx $padding;

		image {
			width: 63%;
			height: 450rpx;
		}

		button {
			min-width: 300rpx;
			margin-top: 100rpx;
			height: 70rpx;
			line-height: 70rpx !important;
			font-size: $font-size-base;
		}
	}
</style>
<style scoped>
	/deep/ .reward-popup .uni-popup__wrapper-box {
		background: none !important;
		max-width: unset !important;
		max-height: unset !important;
	}
</style>