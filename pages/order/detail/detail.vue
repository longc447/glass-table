<template>
	<view class="detail-container" :class="{ 'safe-area': isIphoneX }" :data-theme="themeStyle">
		<!-- 订单状态 -->
		<view class="status-wrap color-base-bg"
			:style="{ backgroundImage: 'url(' + $util.img('upload/uniapp/order/status-wrap-bg.png') + ')' }">
			<view class="order-status-left">
				<image :src="$util.img(action.icon)"></image>
				<view class="status-name">
					<view>{{ orderData.order_status_name }}</view>
					<view class="time" v-if="orderData.order_status == 3">
						<text>还剩</text>
						<text
							v-if="orderData.take_delivery_execute_time.d > 0">{{orderData.take_delivery_execute_time.d}}天</text>
						<text
							v-if="orderData.take_delivery_execute_time.h > 0">{{orderData.take_delivery_execute_time.h}}时</text>
						<text
							v-if="orderData.take_delivery_execute_time.i > 0">{{orderData.take_delivery_execute_time.i}}分</text>
						<text
							v-if="orderData.take_delivery_execute_time.s > 0">{{orderData.take_delivery_execute_time.s}}秒</text>
						<text>自动收货</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 地址信息 -->
		<view class="address-wrap">
			<view class="icon">
				<view class="iconfont iconlocation"></view>
			</view>
			<view class="address-info">
				<view class="info">
					<text class="font-size-base">{{ orderData.name }}&nbsp;{{ orderData.mobile }}</text>
				</view>
				<view class="detail">
					<text class="font-size-base">收货地址：{{ orderData.full_address }} {{ orderData.address }}</text>
				</view>
			</view>
		</view>

		<!-- 店铺 -->
		<view class="site-wrap">
			<view class="site-header" @click="toShopDetail(orderData.site_id)">
				<view class="iconfont icondianpu"></view>
				<text class="site-name">{{ orderData.site_name }}</text>
				<view class="iconfont iconright"></view>
			</view>
			<view class="site-body">
				<view class="goods-wrap" v-for="(goodsItem, goodsIndex) in orderData.order_goods" :key="goodsIndex">
					<!-- <view class="goods-img" @click="goDetail(goodsItem.sku_id)">
						<image :src="$util.img(goodsItem.sku_image, { size: 'mid' })" @error="imgError(goodsIndex)" mode="aspectFill"></image>
					</view> -->
					<view class="goods-info">
						<view @click="goDetail(goodsItem.sku_id)" class="goods-name"
							style="font-size: 35rpx;font-weight: bold;">{{ goodsItem.sku_name }}</view>
						<view class="sku" v-if="orderData.is_photograph!=1">
							<view class="goods-spec" style="background: #f8f8f8;border-radius: 10rpx;"
								v-if="goodsItem.photometric!=0">
								<block v-for="(x, i) in goodsItem.sku_spec_format" :key="i">
									{{ x.spec_value_name }} {{ i < goodsItem.sku_spec_format.length - 1 ? '; ' : '' }}
								</block>
								<!-- 	<text style="font-size: 3vw;color: rgb(160,160,160);margin-right: 1vw;">球镜：{{goodsItem.ball_mirror}}</text>
								<text style="font-size: 3vw;color: rgb(160,160,160);margin-right: 1vw;">柱镜：{{goodsItem.cylinder_mirror}}</text>
								<text style="font-size: 3vw;color: rgb(160,160,160);">轴位：{{goodsItem.axis}}</text>
								 -->

								<sku-list :goodsItem="goodsItem"></sku-list>

							</view>
							<view class="goods-spec" style="background: #f8f8f8;border-radius: 10rpx;" v-else>
								<text style="font-size: 3vw;color: rgb(160,160,160);margin-right: 1vw;">左右眼：{{goodsItem.eye == '左眼' ? 'L' : 'R'}}</text>
								<text style="font-size: 3vw;color: rgb(160,160,160);margin-right: 1vw;">球镜：{{goodsItem.ball_mirror}}</text>
								<text style="font-size: 3vw;color: rgb(160,160,160);margin-right: 1vw;">柱镜：{{goodsItem.cylinder_mirror}}</text>
								<text style="font-size: 3vw;color: rgb(160,160,160);">轴位：{{goodsItem.axis}}</text>
								<text style="font-size: 3vw;color: rgb(160,160,160);" v-if="goodsItem.a_dd">ADD：{{goodsItem.a_dd}}</text>
								<text style="font-size: 3vw;color: rgb(160,160,160);" v-if="goodsItem.passage">通道：{{goodsItem.passage}}</text>
							</view>
						</view>
						<view class="goods-sub-section" v-if="orderData.is_photograph!=1">
							<view>
								<text class="goods-price color-base-text">
									<text class="unit">{{ $lang('common.currencySymbol') }}</text>
									<text class="font-size-base">{{ goodsItem.price }}</text>
								</text>
							</view>
							<view>
								<text class="font-size-base">
									<text class="iconfont iconclose"></text>
									{{ goodsItem.num }}
								</text>
							</view>
						</view>
						<view class="rate_price" v-if="goodsItem.rate_price > 0">
							<view class="box color-base-text">
								<text class="operator">来架加工费：</text>
								<text class="unit">{{ $lang('common.currencySymbol') }}</text>
								<text class="money">{{ goodsItem.rate_price }}</text>
							</view>
						</view>
						<view class="" v-if="orderData.is_photograph==1">
						</view>

						<view class="imageBox" v-if="orderData.images">
							<view class="imgItem" v-for="(item,index) in orderData.images" :key="index"
								@click="$refs.imageBox.show(item)">
								<image :src="item" mode="widthFix"></image>
							</view>
						</view>
						<text class="tip" v-if="goodsItem.is_present">赠品</text>
						<view class="goods-action" v-if="orderData.is_enable_refund">
							<view @click="goRefund(goodsItem.order_goods_id)"
								v-if="goodsItem.refund_status == 0 || goodsItem.refund_status == -1">
								<view class="order-box-btn" v-if="!goodsItem.is_present">退款</view>
							</view>
							<view @click="goRefundDetail(goodsItem.order_goods_id)" v-else>
								<view class="order-box-btn">查看退款</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 订单概况 -->
		<view class="order-summary">
			<view class="order-cell">
				<text class="tit">订单编号：</text>
				<view class="box">
					<text class="color-title">{{ orderData.order_no }}</text>
					<view class="copy" @click="$util.copy(orderData.order_no)">复制</view>
				</view>
			</view>
			<view class="order-cell">
				<text class="tit">订单交易号：</text>
				<view class="box">
					<text class="color-title">{{ orderData.out_trade_no }}</text>
				</view>
			</view>
			<view class="order-cell">
				<text class="tit">创建时间：</text>
				<view class="box">
					<text class="color-title">{{ $util.timeStampTurnTime(orderData.create_time) }}</text>
				</view>
			</view>
			<view class="order-cell" v-if="orderData.close_time > 0">
				<text class="tit">关闭时间：</text>
				<view class="box">
					<text class="color-title">{{ $util.timeStampTurnTime(orderData.close_time) }}</text>
				</view>
			</view>
			<block v-if="orderData.pay_status > 0">
				<view class="hr"></view>
				<view class="order-cell">
					<text class="tit">支付方式：</text>
					<view class="box">
						<text class="color-title">{{ orderData.pay_type_name }}</text>
					</view>
				</view>
				<view class="order-cell">
					<text class="tit">支付时间：</text>
					<view class="box">
						<text class="color-title">{{ $util.timeStampTurnTime(orderData.pay_time) }}</text>
					</view>
				</view>
			</block>
			<view class="order-cell" v-if="orderData.delivery_type_name">
				<text class="tit">配送方式：</text>
				<view class="box">
					<text class="color-title">{{ orderData.delivery_type_name }}</text>
				</view>
			</view>
			<view class="order-cell" v-if="orderData.buyer_message != ''">
				<text class="tit">买家留言：</text>
				<view class="box">
					<text class="color-title">{{ orderData.buyer_message }}</text>
				</view>
			</view>
			<view class="order-cell" v-if="orderData.promotion_type_name != ''">
				<text class="tit">活动优惠：</text>
				<view class="box">
					<text class="color-title">{{ orderData.promotion_type_name }}</text>
				</view>
			</view>
			<!-- 联系客服 -->
			<view class="kefu">
				<view v-if="kefuConfig.type == 'system'" @click="goConnect">
					<text class="iconfont iconziyuan"></text>
					<text>联系客服</text>
				</view>
			</view>
		</view>

		<!-- 订单金额 -->
		<view class="order-money">
			<view class="order-cell">
				<text class="tit">商品金额</text>
				<view class="box align-right">
					<text class="color-title">
						<text class="font-size-goods-tag">{{ $lang('common.currencySymbol') }}</text>
						{{ orderData.goods_money }}
					</text>
				</view>
			</view>
			<view class="order-cell" v-if="orderData.rate_price > 0">
				<text class="tit">来架加工费</text>
				<view class="box align-right">
					<text class="color-base-text">
						<!-- <text class="operator">+</text> -->
						<text class="font-size-goods-tag">{{ $lang('common.currencySymbol') }}</text>
						<text>{{ orderData.rate_price }}</text>
					</text>
				</view>
			</view>
			<view class="order-cell">
				<text class="tit">运费</text>
				<view class="box align-right">
					<text class="color-base-text">
						<!-- <text class="operator">+</text> -->
						<text class="font-size-goods-tag">{{ $lang('common.currencySymbol') }}</text>
						<text>{{ orderData.delivery_money }}</text>
					</text>
				</view>
			</view>
			<view class="order-cell" v-if="orderData.invoice_money > 0">
				<text class="tit">
					税费
					<text class="color-base-text">({{ orderData.invoice_rate }}%)</text>
				</text>
				<view class="box align-right">
					<text class="color-base-text">
						<text class="operator">+</text>
						<text class="font-size-goods-tag">{{ $lang('common.currencySymbol') }}</text>
						<text>{{ orderData.invoice_money }}</text>
					</text>
				</view>
			</view>
			<view class="order-cell" v-if="orderData.invoice_delivery_money > 0">
				<text class="tit">发票邮寄费</text>
				<view class="box align-right">
					<text class="color-base-text">
						<text class="operator">+</text>
						<text class="font-size-goods-tag">{{ $lang('common.currencySymbol') }}</text>
						<text>{{ orderData.invoice_delivery_money }}</text>
					</text>
				</view>
			</view>
			<view class="order-cell" v-if="orderData.adjust_money != 0">
				<text class="tit">订单调整</text>
				<view class="box align-right">
					<text class="color-base-text">
						<text class="operator" v-if="orderData.adjust_money < 0">-</text>
						<text class="operator" v-else>+</text>
						<text class="font-size-goods-tag">{{ $lang('common.currencySymbol') }}</text>
						<text>{{ orderData.adjust_money | abs }}</text>
					</text>
				</view>
			</view>
			<view class="order-cell" v-if="orderData.promotion_money > 0">
				<text class="tit">优惠</text>
				<view class="box align-right">
					<text class="color-base-text">
						<text class="operator">-</text>
						<text class="font-size-goods-tag">{{ $lang('common.currencySymbol') }}</text>
						<text>{{ orderData.promotion_money }}</text>
					</text>
				</view>
			</view>
			<view class="order-cell" v-if="orderData.coupon_money > 0">
				<text class="tit">店铺优惠券</text>
				<view class="box align-right">
					<text class="color-base-text">
						<text class="operator">-</text>
						<text class="font-size-goods-tag">{{ $lang('common.currencySymbol') }}</text>
						<text>{{ orderData.coupon_money }}</text>
					</text>
				</view>
			</view>
			<view class="order-cell" v-if="orderData.platform_coupon_total_money > 0">
				<text class="tit">平台优惠券</text>
				<view class="box align-right">
					<text class="color-base-text">
						<text class="operator">-</text>
						<text class="font-size-goods-tag">{{ $lang('common.currencySymbol') }}</text>
						<text>{{ orderData.platform_coupon_total_money }}</text>
					</text>
				</view>
			</view>
			<view class="order-cell" v-if="orderData.balance_money > 0">
				<text class="tit">使用余额</text>
				<view class="box align-right">
					<text class="color-base-text">
						<text class="operator">-</text>
						<text class="font-size-goods-tag">{{ $lang('common.currencySymbol') }}</text>
						<text>{{ orderData.balance_money }}</text>
					</text>
				</view>
			</view>
			<view class="order-cell">
				<view class="box align-right">
					<text>实付金额：</text>
					<text class="color-base-text">
						<text class="font-size-goods-tag">{{ $lang('common.currencySymbol') }}</text>
						<text class="font-size-base">{{ orderData.pay_money }}</text>
					</text>
				</view>
			</view>

			<view class="order-action" :class="{ 'bottom-safe-area': isIphoneX }" v-if="orderData.action.length > 0">
				<view class="order-box-btn white"
					v-if="evaluateConfig.evaluate_status == 1 && orderData.is_evaluate == 1"
					@click="operation('memberOrderEvaluation')">
					<text v-if="orderData.evaluate_status == 0">评价</text>
					<text v-else-if="orderData.evaluate_status == 1">追评</text>
				</view>
				<view class="order-box-btn"
					:class="operationItem.action == 'orderPay' ? 'color-base-bg color-base-border' : 'white'"
					v-for="(operationItem, operationIndex) in orderData.action" :key="operationIndex"
					@click="operation(operationItem.action)">
					{{ operationItem.title }}
				</view>
			</view>
			<view class="order-action" :class="{ 'bottom-safe-area': isIphoneX }"
				v-else-if="orderData.action.length == 0 && orderData.is_evaluate == 1 && evaluateConfig.evaluate_status == 1">
				<view class="order-box-btn white" @click="operation('memberOrderEvaluation')">
					<text v-if="orderData.evaluate_status == 0">评价</text>
					<text v-else-if="orderData.evaluate_status == 1">追评</text>
				</view>
			</view>
		</view>

		<!-- 选择支付方式弹窗 -->
		<ns-payment ref="choosePaymentPopup" :payMoney="orderData.pay_money" @confirm="pay"></ns-payment>
		<loading-cover ref="loadingCover"></loading-cover>
		<ImageBox ref="imageBox" />
	</view>
</template>

<script>
	import globalConfig from '@/common/js/golbalConfig.js';
	import orderMethod from '../public/js/orderMethod.js';
	import nsPayment from '@/components/payment/payment.vue';
	import tools from '../public/js/tool.js'
	import ImageBox from '@/components/imageloader/imageloader.vue';
	export default {
		components: {

			nsPayment,
			ImageBox
		},
		data() {
			return {
				isIphoneX: false,
				orderId: 0,
				orderData: {
					action: []
				},
				action: {
					icon: ''
				},
				kefuConfig: {
					weapp: '',
					system: '',
					open: '',
					open_url: ''
				},
				evaluateConfig: {
					evaluate_audit: 1,
					evaluate_show: 0,
					evaluate_status: 1
				}
			};
		},
		mixins: [globalConfig, orderMethod, tools],
		onLoad(option) {
			if (option.order_id) this.orderId = option.order_id;
		},
		onShow() {
			// 刷新多语言
			this.$langConfig.refresh();

			this.isIphoneX = this.$util.uniappIsIPhoneX();

			if (uni.getStorageSync('token')) {
				this.getEvaluateConfig();
				this.getOrderData();
			} else {
				this.$util.redirectTo('/pages/login/login/login', {
					back: '/pages/order/detail/detail?order_id=' + this.orderId
				});
			}
			this.getKekuConfig();
		},
		methods: {
			//联系客服
			goConnect() {
				if (uni.getStorageSync('token')) {
					let data = {
						order_id: this.orderId,
						site_id: this.orderData.site_id
					};
					this.$util.redirectTo('/otherpages/chat/room/room', data)
					return false;
				} else {
					this.$refs.login.open('/pages/goods/detail/detail?sku_id=' + this.orderData.sku_id);
					return;
				}
			},
			getKekuConfig() {
				this.$api.sendRequest({
					url: '/api/config/servicer',
					success: res => {
						if (res.code == 0) {
							this.kefuConfig = res.data;
							if (this.kefuConfig.system && !this.addonIsExit.servicer) this.kefuConfig.system =
								0;
						}
					}
				});
			},
			goDetail(id) {
				this.$util.redirectTo('/pages/goods/detail/detail', {
					sku_id: id
				});
			},
			goRefund(id) {
				this.$util.redirectTo('/otherpages/order/refund/refund', {
					order_goods_id: id
				});
			},
			goRefundDetail(id) {
				this.$util.redirectTo('/otherpages/order/refund_detail/refund_detail', {
					order_goods_id: id
				});
			},
			getOrderData() {
				this.$api.sendRequest({
					url: '/api/order/detail',
					data: {
						order_id: this.orderId
					},
					success: res => {
						uni.stopPullDownRefresh();
						if (res.code >= 0) {
							this.orderData = res.data;
							// this.orderData.images=[...this.orderData.images,...this.orderData.images]
							if (this.orderData.images !== "") this.orderData.images = JSON.parse(this.orderData
								.images)

							if (this.orderData && this.orderData.order_goods) this.orderData.order_goods
								.forEach(v => {
									// if (v.sku_spec_format) {
									// 	console.log(v.sku_spec_format)
									// 	debugger
									// 	if(v.sku_spec_format!=="")v.sku_spec_format = JSON.parse(v.sku_spec_format);
									// } else {
									// 	v.sku_spec_format = [];
									// }
								});
							if (res.data.order_status == 3) res.data.take_delivery_execute_time = this.$util
								.countDown(res.data.take_delivery_execute_time -
									res.timestamp);
							this.action = JSON.parse(res.data.order_status_action);
							if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
						} else {
							this.$util.showToast({
								title: '未获取到订单信息！'
							});
							setTimeout(() => {
								this.$util.redirectTo('/pages/order/list/list');
							}, 1000);
						}
					},
					fail: res => {
						uni.stopPullDownRefresh();
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					}
				});
			},
			/**
			 * 下拉刷新
			 */
			onPullDownRefresh() {
				this.getOrderData();
			},
			operation(action) {
				switch (action) {
					case 'orderPay': // 支付
						this.orderPay(this.orderData);
						break;
					case 'orderClose': //关闭
						this.orderClose(this.orderData.order_id, () => {
							this.getOrderData();
						});
						break;
					case 'memberTakeDelivery': //收货
						//拉起确认收货组件
						if (this.orderData.pay_type == 'wechatpay') {
							if (this.orderData.is_takedelivery == 1){
								if (wx.openBusinessView) {
									wx.openBusinessView({
										businessType: 'weappOrderConfirm',
										extraData: {
											merchant_id: this.orderData.merchant_id,
											merchant_trade_no: this.orderData.out_trade_no,
											transaction_id: this.orderData.transaction_id
										},
										complete: e => {
											if (e.extraData.status === 'success') {
												// 用户确认收货成功，再执行自己的代码
												this.$api.sendRequest({
													url: '/api/order/takedelivery',
													data: {
														order_id: this.orderData.order_id
													},
													success: res => {
														this.$util.showToast({
															title: res.message
														})
														this.getOrderData();
													}
												})
											} else if (e.extraData.status === 'fail') {
												// 用户确认收货失败
												this.$util.showToast({
													title: '确认收货失败!'
												})
											} else if (e.extraData.status === 'cancel') {
												// 用户取消
												this.$util.showToast({
													title: '取消确认收货!'
												})
											}
										}
									});
								} else {
									//引导用户升级微信版本
									this.$util.showToast({
										title: '请升级微信版本'
									})
								}
							} else {
								this.orderDelivery(this.orderData.order_id, () => {
									this.getOrderData();
								});
							}
						} else {
							this.orderDelivery(this.orderData.order_id, () => {
								this.getOrderData();
							});
						}
						
						
						break;
					case 'trace': //查看物流
						this.$util.redirectTo('/pages/order/logistics/logistics', {
							order_id: this.orderData.order_id
						});
						break;
					case 'memberOrderEvaluation': //评价
						this.$util.redirectTo('/otherpages/order/evaluate/evaluate', {
							order_id: this.orderData.order_id
						});
						break;
					case 'extendTakeDelivery': //延长收回
						this.orderExtendTakeDelivery(this.orderData.order_id, () => {
							this.getOrderData();
						});
						break;
				}
			},
			imgError(index) {
				this.orderData.order_goods[index].sku_image = this.$util.getDefaultImage().default_goods_img;
				this.$forceUpdate();
			},
			getEvaluateConfig() {
				this.$api.sendRequest({
					url: '/api/goodsevaluate/config',
					success: res => {
						if (res.code == 0) {
							var data = res.data;
							this.evaluateConfig = data;
						}
					}
				});
			},
			// 显示选择支付方式弹框
			openChoosePayment() {
				this.$refs.choosePaymentPopup.open();
			},
			toShopDetail(e) {
				this.$util.redirectTo('/otherpages/shop/index/index', {
					site_id: e
				});
			}
		},
		filters: {
			abs(value) {
				return Math.abs(parseFloat(value)).toFixed(2);
			}
		}
	};
</script>

<style lang="scss">
	@import '../public/css/detail.scss';

	.imageBox {
		margin: 30rpx 0;
		display: flex;
		flex-wrap: wrap;
		// background: #000000;

		.imgItem {
			position: relative;
			width: 100%;
			max-width: calc((100% - 25rpx) / 3);
			border: 5rpx solid #FFFFFF;
			display: flex;
			align-items: center;
			justify-content: center;
			max-height: 250rpx;
			overflow: hidden;

			image {
				// margin: 9rpx;
				width: 100%;
				height: 100%;
			}

			text {
				// line-height: 25rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				padding: 10rpx;
				font-size: 40rpx;
				z-index: 1;
				text-align: center;
				font-weight: bold;
				// border-radius: 30rpx;
				color: #FFFFFF;
				width: 30rpx;
				height: 30rpx;
				background-color: red;
				position: absolute;
				top: 10rpx;
				right: 10rpx;
			}
		}
	}
	.rate_price{
		width: 100%;
		justify-content: flex-end;
		display: flex;
		padding-top: .5rem;
	}
</style>