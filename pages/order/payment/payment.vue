<template>
	<view class="order-container" :class="{ 'safe-area': isIphoneX }" :data-theme="themeStyle">
		<!-- 选择地址 -->
		<template v-if="orderPaymentData.is_virtual == 0">
			<view class="address-box">
				<view class="info-wrap" v-if="orderPaymentData.member_address" @click="selectAddress">
					<view class="icon-wrap"><text class="iconfont icondizhi"></text></view>
					<view class="content">
						<text
							class="name font-size-base">{{ orderPaymentData.member_address.name ? orderPaymentData.member_address.name : '' }}</text>
						<text
							class="font-size-base">{{ orderPaymentData.member_address.mobile ? orderPaymentData.member_address.mobile : '' }}</text>
						<text class="cell-more iconfont iconright"></text>
						<view class="desc-wrap">
							{{ orderPaymentData.member_address.full_address ? orderPaymentData.member_address.full_address : '' }}
							{{ orderPaymentData.member_address.address ? orderPaymentData.member_address.address : '' }}
						</view>
					</view>
				</view>
				<view class="empty-wrap" v-else @click="selectAddress">
					<view class="icon-wrap">
						<view class="iconfont icondizhi empty"></view>
					</view>
					<view class="info">请设置收货地址</view>
					<view class="cell-more">
						<view class="iconfont iconright"></view>
					</view>
				</view>
			</view>
		</template>

		<!-- 虚拟商品展示手机号 -->
		<view class="mobile-wrap" v-if="orderPaymentData.is_virtual == 1 && orderCreateData.member_address">
			<view class="tips color-base-text">购买虚拟类商品需填写手机号，方便商家与您联系</view>
			<view class="form-group">
				<text class="iconfont icondianhua2"></text>
				<text class="text">手机号码</text>
				<input type="number" maxlength="11" placeholder="请输入您的手机号码" placeholder-class="color-tip placeholder"
					class="input" v-model="orderCreateData.member_address.mobile" />
			</view>
		</view>

		<!-- 店铺 -->
		<view class="site-wrap" v-for="(siteItem, siteIndex) in orderPaymentData.shop_goods_list" :key="siteIndex">
			<view class="site-header" @click="toShopDetail(siteItem.site_id)">
				<view class="iconfont icondianpu"></view>
				<text class="site-name">{{ siteItem.site_name }}</text>
			</view>
			<view class="site-body">
				<!-- 商品 -->
				<view class="goods-wrap" v-for="(goodsItem, goodsIndex) in siteItem.goods_list" :key="goodsIndex"
					style="border-bottom: 2rpx solid #F1F1F1;">
					<!-- <view class="goods-img" @click="navigateTo(goodsItem.sku_id)">
						<image :src="$util.img(goodsItem.sku_image, { size: 'mid' })"
							@error="imgError(siteIndex, goodsIndex)" mode="aspectFill"></image>
					</view> -->
					<view class="goods-info">
						<view @click="navigateTo(goodsItem.sku_id)" class="goods-name"
							style="font-size: 35rpx;font-weight: bold;" v-if="goodsItem.luminosity_status != 1">
							{{ goodsItem.sku_name }}</view>
						<sku-list :goodsItem="goodsItem"></sku-list>
						<view class="sku" v-if="goodsItem.sku_spec_format">
							<view class="goods-spec">
								<!-- 		<block v-for="(x, i) in goodsItem.sku_spec_format" :key="i">
									{{ x.spec_value_name }} {{ i < goodsItem.sku_spec_format.length - 1 ? '; ' : '' }}
								</block> -->
								<!-- <text style="font-size: 3vw;color: rgb(160,160,160);margin-right: 1vw;">球镜：{{goodsItem.ball_mirror}}</text>
								<text style="font-size: 3vw;color: rgb(160,160,160);margin-right: 1vw;">柱镜：{{goodsItem.cylinder_mirror}}</text>
								<text style="font-size: 3vw;color: rgb(160,160,160);">轴位：{{goodsItem.axis}}</text> -->
							</view>
						</view>
						<view class="goods-sub-section">
							<view class="color-base-text">
								<text class="unit">{{ $lang('common.currencySymbol') }}</text>
								<text class="goods-price">{{ goodsItem.price }}</text>
							</view>
							<view>
								<text class="font-size-tag">x</text>
								<text class="font-size-base">{{ goodsItem.num }}</text>
							</view>
						</view>
						<text class="tip" v-if="goodsItem.is_present == 1">赠品</text>
					</view>
				</view>
				<!-- 赠送优惠券 -->
				<block v-if="siteItem.present_list.coupon_list">
					<view class="order-cell" v-for="(coupon_item, coupon_index) in siteItem.present_list.coupon_list"
						:key="coupon_index">
						<text class="tit">赠品</text>
						<view class="box text-overflow" @click="openCouponPopup(siteItem.present_list.coupon_list)">
							<text>{{ coupon_item.coupon_name }}</text>
						</view>
						<text class="iconfont iconright"></text>
					</view>
				</block>
			</view>
			<view class="site-footer">
				<block>
					<view class="order-cell">
						<text class="tit">来架加工</text>
						<block v-if="siteItem.goods_list.length">
							<view class="box" @click="selectSiteRat(siteItem.site_id)">
								<text v-if="orderPaymentData.rate_price">{{orderPaymentData.rate_price}}</text>
								<text v-else>来架加工</text>
							</view>
							<text class="iconfont iconright"></text>
						</block>
						<block v-else>
							<view class="box"><text class="color-base-text"></text></view>
						</block>
					</view>
				</block>
				<block v-if="orderPaymentData.is_virtual == 0">
					<view class="order-cell">
						<text class="tit">配送方式</text>
						<block v-if="siteItem.express_type.length">
							<view class="box" @click="openSiteDelivery(siteItem.site_id, siteItem.express_type)">
								<text>{{ orderPaymentData.delivery[siteItem.site_id].delivery_type_name }}</text>
							</view>
							<text class="iconfont iconright"></text>
						</block>
						<block v-else-if="!orderPaymentData.member_address">
							<view class="box"><text class="color-base-text">请先填写收货地址</text></view>
						</block>
						<block v-else>
							<view class="box"><text class="color-base-text">商家未配置配送方式</text></view>
						</block>
					</view>
				</block>
				<view class="order-cell coupon" v-if="siteItem.coupon_list.length">
					<text class="tit">优惠券</text>
					<view class="box text-overflow shop-item"
						@click="openSiteCoupon(siteItem.site_id, siteItem.coupon_list)">
						<template v-if="orderPaymentData.coupon[siteItem.site_id].coupon_id">
							<text>已使用优惠券，优惠</text>
							<text class="color-base-text unit">{{ $lang('common.currencySymbol') }}</text>
							<text class="color-base-text money">{{ siteItem.coupon_money | moneyFormat }}</text>
						</template>
						<text v-else>不使用优惠券</text>
					</view>
					<text class="iconfont iconright"></text>
				</view>
				<view class="order-cell" v-if="siteItem.promotionExits">
					<text class="tit">店铺优惠</text>
					<view class="box text-overflow" @click="openSitePromotion(siteItem.promotion)">
						<text>{{ siteItem.promotion | promotion }}</text>
					</view>
					<text class="iconfont iconright"></text>
				</view>
				<view class="order-cell order-invoice-cell"
					v-if="!Array.isArray(siteItem.invoice_config) && siteItem.invoice_config.invoice_status == 1">
					<text class="tit">发票</text>
					<view class="box text-overflow" @click="openInvoicePopup(siteItem)">
						<text
							v-if="siteItem.is_invoice == 1">{{ siteItem.invoice_type == 1 ? '纸质' : '电子' }}发票({{ siteItem.invoice_content }})</text>
						<text v-else>无需发票</text>
					</view>
					<text class="iconfont iconright"></text>
				</view>
				<view class="order-cell liuyanBox" v-if="orderCreateData.buyer_message">
					<text class="tit">买家留言</text>
					<view class="liuyan">
						<textarea class="myliuyan" type="text" placeholder="留言前建议先与商家协调一致" placeholder-class="color-tip"
							v-model="orderCreateData.buyer_message[siteItem.site_id]" />
					</view>
				</view>
				<view class="order-cell"
					v-if="siteItem.invoice_money > 0 && siteItem.invoice_config.invoice_status == 1">
					<text class="tit">
						<text>税费</text>
						<text
							class="color-base-text font-bold">({{ siteItem.invoice_config.invoice_rate | moneyFormat }}%)</text>
					</text>
					<view class="box color-base-text shop-item">
						<text class="operator">+</text>
						<text class="unit">{{ $lang('common.currencySymbol') }}</text>
						<text class="money">{{ siteItem.invoice_money | moneyFormat }}</text>
					</view>
				</view>
				<view class="order-cell"
					v-if="siteItem.invoice_delivery_money > 0 && siteItem.invoice_config.invoice_status == 1">
					<text class="tit">发票邮寄费</text>
					<view class="box color-base-text shop-item">
						<text class="operator">+</text>
						<text class="unit">{{ $lang('common.currencySymbol') }}</text>
						<text class="money">{{ siteItem.invoice_delivery_money | moneyFormat }}</text>
					</view>
				</view>
				<view class="order-cell" v-if="siteItem.promotion_money > 0">
					<text class="tit">优惠</text>
					<view class="box color-base-text shop-item">
						<text class="operator">-</text>
						<text class="unit">{{ $lang('common.currencySymbol') }}</text>
						<text class="money">{{ siteItem.promotion_money | moneyFormat }}</text>
					</view>
				</view>
				<view class="order-cell">
					<view class="box shop-item">
						<text class="color-tip goods-num">共{{ siteItem.goods_num }}件</text>
						<text class="font-size-base">小计：</text>
						<text class="color-base-text unit">{{ $lang('common.currencySymbol') }}</text>
						<text class="color-base-text money">{{ siteItem.order_money | moneyFormat }}</text>
					</view>
				</view>
			</view>
		</view>

		<view class="order-money"
			v-if="orderPaymentData && orderPaymentData.platform_coupon_list && orderPaymentData.platform_coupon_list.length > 0">
			<view class="order-cell coupon">
				<text class="tit">平台优惠券</text>
				<view class="box text-overflow" @click="openPopup('PlatcouponPopup')">
					<template v-if="orderPaymentData.platform_coupon_money > 0">
						<text>已使用优惠券，优惠</text>
						<text class="color-base-text unit">{{ $lang('common.currencySymbol') }}</text>
						<text
							class="color-base-text money">{{ orderPaymentData.platform_coupon_money | moneyFormat }}</text>
					</template>
					<text v-else>不使用优惠券</text>
				</view>
				<text class="iconfont iconright"></text>
			</view>
		</view>

		<!-- 订单金额 -->
		<view class="order-money">
			<view class="order-cell">
				<text class="tit">商品金额</text>
				<view class="box color-title">
					<text class="unit">{{ $lang('common.currencySymbol') }}</text>
					<text class="money">{{ orderPaymentData.goods_money | moneyFormat }}</text>
				</view>
			</view>
			<view class="order-cell" v-if="orderPaymentData.is_virtual == 0 && orderPaymentData.delivery_money > 0">
				<text class="tit">运费</text>
				<view class="box color-base-text">
					<text class="operator">+</text>
					<text class="unit">{{ $lang('common.currencySymbol') }}</text>
					<text class="money">{{ orderPaymentData.delivery_money | moneyFormat }}</text>
				</view>
			</view>
			<view class="order-cell" v-if="orderPaymentData.invoice_money > 0">
				<text class="tit">税费</text>
				<view class="box color-base-text">
					<text class="operator">+</text>
					<text class="unit">{{ $lang('common.currencySymbol') }}</text>
					<text class="money">{{ orderPaymentData.invoice_money | moneyFormat }}</text>
				</view>
			</view>
			<view class="order-cell" v-if="orderPaymentData.invoice_delivery_money > 0">
				<text class="tit">发票邮寄费</text>
				<view class="box color-base-text">
					<text class="operator">+</text>
					<text class="unit">{{ $lang('common.currencySymbol') }}</text>
					<text class="money">{{ orderPaymentData.invoice_delivery_money | moneyFormat }}</text>
				</view>
			</view>
			<view class="order-cell" v-if="orderPaymentData.promotion_money > 0">
				<text class="tit">优惠</text>
				<view class="box color-base-text">
					<text class="operator">-</text>
					<text class="unit">{{ $lang('common.currencySymbol') }}</text>
					<text class="money">{{ orderPaymentData.promotion_money | moneyFormat }}</text>
				</view>
			</view>
			<view class="order-cell" v-if="orderPaymentData.coupon_money > 0">
				<text class="tit">店铺优惠券</text>
				<view class="box color-base-text">
					<text class="operator">-</text>
					<text class="unit">{{ $lang('common.currencySymbol') }}</text>
					<text class="money">{{ orderPaymentData.coupon_money | moneyFormat }}</text>
				</view>
			</view>
			<view class="order-cell" v-if="orderPaymentData.platform_coupon_money > 0">
				<text class="tit">平台优惠券</text>
				<view class="box color-base-text">
					<text class="operator">-</text>
					<text class="unit">{{ $lang('common.currencySymbol') }}</text>
					<text class="money">{{ orderPaymentData.platform_coupon_money | moneyFormat }}</text>
				</view>
			</view>
			<!-- <view class="order-cell" v-if="orderPaymentData.balance_money > 0">
				<text class="tit">使用余额</text>
				<view class="box color-base-text">
					<text class="operator">-</text>
					<text class="unit">{{ $lang('common.currencySymbol') }}</text>
					<text class="money">{{ orderPaymentData.balance_money | moneyFormat }}</text>
				</view>
			</view> -->
		</view>

		<view class="order-submit" :class="{ 'bottom-safe-area': isIphoneX }">
			<view class="order-settlement-info">
				<text class="font-size-base color-tip margin-right">共{{ orderPaymentData.goods_num }}件</text>
				<text class="font-size-base">合计：</text>
				<text class="color-base-text unit">{{ $lang('common.currencySymbol') }}</text>
				<text class="color-base-text money">{{ orderPaymentData.pay_money | moneyFormat }}</text>
			</view>
			<view class="submit-btn"><button type="primary" size="mini" @click="openChoosePayment()">提交订单</button>
			</view>
		</view>

		<!-- 发票弹窗 -->
		<uni-popup ref="invoicePopup" type="bottom">
			<view :style="orderInvoice.is_invoice == 1 ? 'height: 83vh;' : 'height: 48vh;'" class="invoice-popup popup"
				@touchmove.prevent.stop>
				<view class="popup-header">
					<text class="tit">发票</text>
					<text class="iconfont iconclose" @click="closeInvoicePopup()"></text>
				</view>
				<scroll-view scroll-y="true" class="popup-body" :class="{ 'safe-area': isIphoneX }">
					<view>
						<view class="invoice-cell">
							<text class="tit">需要发票</text>
							<view class="option-grpup">
								<view class="option-item"
									:class="{ 'color-base-bg active': orderInvoice.is_invoice == 0 }"
									@click="changeIsInvoice">不需要</view>
								<view class="option-item "
									:class="{ 'color-base-bg active': orderInvoice.is_invoice == 1 }"
									@click="changeIsInvoice">需要</view>
							</view>
						</view>
						<block v-if="orderInvoice.is_invoice == 1">
							<view class="invoice-cell">
								<text class="tit">发票类型</text>
								<view class="option-grpup">
									<view v-for="(item_type, index_type) in orderInvoice.invoice_config.type"
										:key="index_type" class="option-item"
										:class="{ 'color-base-bg active': orderInvoice.invoice_type == 1 }"
										@click="changeInvoiceType(item_type)" v-if="item_type == 1">
										纸质
									</view>
									<view v-for="(item_type, index_type) in orderInvoice.invoice_config.type"
										:key="index_type" class="option-item"
										:class="{ 'color-base-bg active': orderInvoice.invoice_type == 2 }"
										@click="changeInvoiceType(item_type)" v-if="item_type == 2">
										电子
									</view>
								</view>
							</view>
							<view class="invoice-cell">
								<text class="tit">抬头类型</text>
								<view class="option-grpup">
									<view class="option-item"
										:class="{ 'color-base-bg active': orderInvoice.invoice_title_type == 1 }"
										@click="changeInvoiceTitleType(1)">
										个人
									</view>
									<view class="option-item"
										:class="{ 'color-base-bg active': orderInvoice.invoice_title_type == 2 }"
										@click="changeInvoiceTitleType(2)">
										企业
									</view>
								</view>
							</view>
							<view class="invoice-cell">
								<text class="tit">发票信息</text>
								<view class="invoice-form-group">
									<input type="text" placeholder="请填写抬头名称"
										v-model.trim="orderInvoice.invoice_title" />
									<input v-if="orderInvoice.invoice_title_type == 2" type="text"
										placeholder="请填写纳税人识别号" v-model.trim="orderInvoice.taxpayer_number" />
									<input type="text" placeholder="请填写邮寄地址"
										v-model.trim="orderInvoice.invoice_full_address"
										v-if="orderInvoice.invoice_type == 1" />
									<input type="text" placeholder="请填写邮箱" v-model.trim="orderInvoice.invoice_email"
										v-if="orderInvoice.invoice_type == 2" />
								</view>
							</view>
							<view class="invoice-cell">
								<text class="tit">发票内容</text>
								<view class="option-grpup">
									<view :key="index"
										v-for="(item, index) in orderInvoice.invoice_config.invoice_content"
										:class="{ 'color-base-bg active': item == orderInvoice.invoice_content }"
										@click="changeInvoiceContent(item)" class="option-item content">
										{{ item }}
									</view>
								</view>
							</view>
						</block>
						<view class="invoice-tips">发票内容将以根据税法调整，具体请以展示为准，发票内容显示详细商品名 称及价格信息</view>
					</view>
				</scroll-view>
				<view class="popup-footer" @click="saveInvoice" :class="{ 'bottom-safe-area': isIphoneX }">
					<view class="confirm-btn color-base-bg">确定</view>
				</view>
			</view>
		</uni-popup>

		<!-- 赠送的优惠券 -->
		<uni-popup ref="presentCouponPopup" type="bottom">
			<view class="coupon-popup popup" @touchmove.prevent.stop>
				<view class="popup-header">
					<text class="tit">赠品</text>
					<text class="iconfont iconclose" @click="closePopup('presentCouponPopup')"></text>
				</view>
				<scroll-view scroll-y="true" class="popup-body" :class="{ 'safe-area': isIphoneX }">
					<view class="coupon-item" v-for="(couponItem, couponIndex) in presentCoupon" :key="couponIndex">
						<view class="coupon-info">
							<view class="info-wrap"
								:style="{ backgroundImage: 'url(' + $util.img('/upload/uniapp/coupon/bg_lingqu.png') + ')' }">
								<view class="coupon-money">
									<template v-if="couponItem.type == 'reward'">
										<text class="unit">{{ $lang('common.currencySymbol') }}</text>
										<text class="money">{{ parseFloat(couponItem.money) }}</text>
									</template>
									<template v-else-if="couponItem.type == 'discount'">
										<text class="money">{{ parseFloat(couponItem.discount) }}</text>
										<text class="unit">折</text>
									</template>
									<view class="at-least">
										<template v-if="couponItem.at_least > 0">
											满{{ couponItem.at_least }}可用
										</template>
										<template v-else>
											无门槛
										</template>
									</view>
								</view>
							</view>
							<view class="desc-wrap">
								<view class="coupon-name">{{ couponItem.coupon_name }}</view>
								<view v-if="couponItem.type == 'discount' && couponItem.at_least > 0" class="limit">
									最多可抵￥{{ couponItem.at_least }}</view>
								<view class="time font-size-goods-tag">
									有效期：{{ $util.timeStampTurnTime(couponItem.end_time) }}</view>
							</view>
							<!-- <view class="iconfont" :class="selectCouponId == couponItem.coupon_id ? 'iconyuan_checked color-base-text' : 'iconyuan_checkbox'"></view> -->
						</view>
					</view>
				</scroll-view>
				<view class="popup-footer" :class="{ 'bottom-safe-area': isIphoneX }">
					<view class="confirm-btn color-base-bg" @click="closePopup('presentCouponPopup')">确定</view>
				</view>
			</view>
		</uni-popup>

		<!-- 优惠券弹窗 -->
		<uni-popup ref="couponPopup" type="bottom">
			<view class="coupon-popup popup" @touchmove.prevent.stop>
				<view class="popup-header">
					<text class="tit">优惠券</text>
					<text class="iconfont iconclose" @click="closePopup('couponPopup')"></text>
				</view>
				<scroll-view scroll-y="true" class="popup-body" :class="{ 'safe-area': isIphoneX }">
					<view class="coupon-item" v-for="(couponItem, couponIndex) in siteCoupon.data" :key="couponIndex"
						@click="selectCoupon(couponItem)">
						<view class="coupon-info">
							<view class="info-wrap"
								:style="{ backgroundImage: 'url(' + $util.img('/upload/uniapp/coupon/bg_lingqu.png') + ')' }">
								<view class="coupon-money">
									<template v-if="couponItem.type == 'reward'">
										<text class="unit">{{ $lang('common.currencySymbol') }}</text>
										<text class="money">{{ parseFloat(couponItem.money) }}</text>
									</template>
									<template v-else-if="couponItem.type == 'discount'">
										<text class="money">{{ parseFloat(couponItem.discount) }}</text>
										<text class="unit">折</text>
									</template>
									<view class="at-least">
										<template v-if="couponItem.at_least > 0">
											满{{ couponItem.at_least }}可用
										</template>
										<template v-else>
											无门槛
										</template>
									</view>
								</view>
							</view>
							<view class="desc-wrap">
								<view class="coupon-name">{{ couponItem.coupon_name }}</view>
								<view v-if="couponItem.type == 'discount' && couponItem.at_least > 0" class="limit">
									最多可抵￥{{ couponItem.at_least }}</view>
								<view class="time font-size-goods-tag">
									有效期：{{ $util.timeStampTurnTime(couponItem.end_time) }}</view>
							</view>
							<view class="iconfont"
								:class="selectCouponId == couponItem.coupon_id ? 'iconyuan_checked color-base-text' : 'iconyuan_checkbox'">
							</view>
						</view>
					</view>
				</scroll-view>
				<view class="popup-footer" :class="{ 'bottom-safe-area': isIphoneX }">
					<view class="confirm-btn color-base-bg" @click="popupConfirm('couponPopup', siteCoupon.site_id)">确定
					</view>
				</view>
			</view>
		</uni-popup>

		<!-- 平台优惠券弹窗 -->
		<uni-popup ref="PlatcouponPopup" type="bottom">
			<view class="coupon-popup popup" @touchmove.prevent.stop>
				<view class="popup-header">
					<text class="tit">平台优惠券</text>
					<text class="iconfont iconclose" @click="closePopup('PlatcouponPopup')"></text>
				</view>
				<scroll-view scroll-y="true" class="popup-body" :class="{ 'safe-area': isIphoneX }">
					<view class="coupon-item" v-for="(couponItem, couponIndex) in orderPaymentData.platform_coupon_list"
						v-if="orderPaymentData && orderPaymentData.platform_coupon_list" :key="couponIndex"
						@click="selectPlatCoupon(couponItem)">
						<view class="coupon-info">
							<view class="info-wrap"
								:style="{ backgroundImage: 'url(' + $util.img('/upload/uniapp/coupon/bg_lingqu.png') + ')' }">
								<view class="coupon-money">
									<text class="unit">{{ $lang('common.currencySymbol') }}</text>
									<text class="money">{{ parseFloat(couponItem.money) }}</text>
									<view class="at-least">
										<template v-if="couponItem.at_least > 0">
											满{{ couponItem.at_least }}可用
										</template>
										<template v-else>
											无门槛
										</template>
									</view>
								</view>
							</view>
							<view class="desc-wrap">
								<view class="coupon-name">{{ couponItem.platformcoupon_name }}</view>
								<view v-if="couponItem.type == 'discount' && couponItem.at_least > 0" class="limit">
									最多可抵￥{{ couponItem.at_least }}</view>
								<view class="time font-size-goods-tag">
									有效期：{{ $util.timeStampTurnTime(couponItem.end_time) }}</view>
							</view>
							<view class="iconfont"
								:class="selectPlatCouponId == couponItem.platformcoupon_id ? 'iconyuan_checked color-base-text' : 'iconyuan_checkbox'">
							</view>
						</view>
					</view>
				</scroll-view>
				<view class="popup-footer" :class="{ 'bottom-safe-area': isIphoneX }">
					<view class="confirm-btn color-base-bg" @click="popupConfirm('PlatcouponPopup')">确定</view>
				</view>
			</view>
		</uni-popup>

		<!-- 店铺优惠弹窗 -->
		<uni-popup ref="sitePromotionPopup" type="bottom">
			<view class="promotion-popup popup">
				<view class="popup-header">
					<text class="tit">店铺优惠</text>
					<text class="iconfont iconclose" @click="closePopup('sitePromotionPopup')"></text>
				</view>
				<scroll-view scroll-y="true" class="popup-body" :class="{ 'safe-area': isIphoneX }">
					<view>
						<view class="order-cell" v-for="(promotionItem, promotionIndex) in sitePromotion"
							:key="promotionIndex">
							<template v-if="promotionIndex == 'manjian'">
								<text class="tit"><text
										class="promotion-mark ns-gradient-promotionpages-payment">优惠</text></text>
								<view class="box">
									<view v-for="(item, index) in promotionItem" :key="index"
										v-if="item.discount_array">
										{{item.discount_array.rule.free_shipping?'包邮':'' }}
										{{item.discount_array.rule.coupon>0?'满'+item.discount_array.rule.money+'元送'+item.discount_array.rule.coupon+'元优惠券':'' }}
										{{item.discount_array.rule.discount_money>0?'满'+item.discount_array.rule.money+'元减'+item.discount_array.rule.discount_money+'元':'' }}
										{{item.discount_array.rule.present?'有赠品':'' }}

									</view>
								</view>
							</template>
							<template v-if="promotionIndex == 'freeshipping'">
								<text class="tit">
									<text class="promotion-mark ns-gradient-promotionpages-payment">满额包邮</text>
									满{{ promotionItem.price }}元包邮
								</text>
							</template>
						</view>
					</view>
				</scroll-view>
				<view class="popup-footer" :class="{ 'bottom-safe-area': isIphoneX }">
					<view class="confirm-btn color-base-bg" @click="closePopup('sitePromotionPopup')">确定</view>
				</view>
			</view>
		</uni-popup>
		<!-- 配送弹窗 -->
		<uni-popup ref="deliveryPopup" type="bottom">
			<view class="delivery-popup popup" @touchmove.prevent.stop>
				<view class="popup-header">
					<text class="tit">配送方式</text>
					<text class="iconfont iconclose" @click="closePopup('deliveryPopup')"></text>
				</view>
				<view class="popup-body" :class="{ 'safe-area': isIphoneX }">
					<view class="delivery-mode">
						<view class="action">
							<button v-for="(deliveryItem, deliveryIndex) in siteDelivery.data" :key="deliveryIndex"
								:type="deliveryItem.name == orderPaymentData.delivery[siteDelivery.site_id].delivery_type ? 'primary' : 'default'"
								@click="selectDeliveryType(deliveryItem)" size="mini">
								{{ deliveryItem.title }}
							</button>
						</view>
					</view>

					<block v-for="(deliveryItem, deliveryIndex) in siteDelivery.data" :key="deliveryIndex"
						v-if="orderPaymentData.delivery[siteDelivery.site_id].delivery_type == deliveryItem.name">
						
						<scroll-view scroll-y="true" class="express-popup"
							v-if="orderPaymentData.delivery[siteDelivery.site_id].delivery_type == 'express'">
							<view class="delivery-cell delivery-cont">
								<block v-if="deliveryItem.express_list">
									<view class="delivery-content">
										<view class="item-wrap template_box" v-for="(item, index) in deliveryItem.express_list"
											:key="index" @click="selectTemplate(item.template_id)">
											<view class="detail">
												<view :class="item.template_id == orderPaymentData.delivery[siteDelivery.site_id].template_id ? 'color-base-text' : ''">
													<text class="template_name">{{ item.template_name }}</text>
													<text class="template_price">{{ $lang('common.currencySymbol') }}{{ parseFloat(item.price) }}</text>
												</view>
											</view>
											<view class="icon"
												v-if="item.template_id == orderPaymentData.delivery[siteDelivery.site_id].template_id">
												<text class="iconfont iconyuan_checked color-base-text"></text>
											</view>
										</view>
										<view v-if="!deliveryItem.express_list" class="empty">所选择收货地址附近没有可以自提的门店</view>
									</view>
								</block>
							</view>
						</scroll-view>
						
						<scroll-view scroll-y="true" class="store-popup"
							v-if="orderPaymentData.delivery[siteDelivery.site_id].delivery_type == 'store'">
							<view class="delivery-cell delivery-cont">
								<block v-if="deliveryItem.store_list.length">
									<view class="delivery-content">
										<view class="item-wrap" v-for="(item, index) in deliveryItem.store_list"
											:key="index" @click="selectPickupPoint(item.store_id)">
											<view class="detail">
												<view class="name"
													:class="item.store_id == orderPaymentData.delivery[siteDelivery.site_id].store_id ? 'color-base-text' : ''">
													<text>{{ item.store_name }}</text>
													<text v-if="item.distance">({{ item.distance }}km)</text>
												</view>
												<view class="info">
													<view
														:class="item.store_id == orderPaymentData.delivery[siteDelivery.site_id].store_id ? 'color-base-text' : ''"
														class="font-size-goods-tag">
														营业时间：{{ item.open_date }}
													</view>
													<view
														:class="item.store_id == orderPaymentData.delivery[siteDelivery.site_id].store_id ? 'color-base-text' : ''"
														class="font-size-goods-tag">
														地址：{{ item.full_address }}{{ item.address }}
													</view>
												</view>
											</view>
											<view class="icon"
												v-if="item.store_id == orderPaymentData.delivery[siteDelivery.site_id].store_id">
												<text class="iconfont iconyuan_checked color-base-text"></text>
											</view>
										</view>
										<view v-if="!deliveryItem.store_list" class="empty">所选择收货地址附近没有可以自提的门店</view>
									</view>
								</block>
							</view>
						</scroll-view>
						<view class="local-box"
							v-show="orderPaymentData.delivery[siteDelivery.site_id].delivery_type == 'local' && orderPaymentData.delivery[siteDelivery.site_id].showTimeBar">
							<view class="order-cell">
								<text class="tit">配送时间</text>
								<view class="box">
									<text v-if="orderPaymentData.delivery[siteDelivery.site_id].showTime">
										{{ orderPaymentData.delivery[siteDelivery.site_id].start_time + '-' + orderPaymentData.delivery[siteDelivery.site_id].end_time }}
									</text>
									<text v-if="orderPaymentData.delivery[siteDelivery.site_id].deliveryWeek">
										<template v-if="orderPaymentData.delivery[siteDelivery.site_id].showTime">
											（
										</template>
										{{ orderPaymentData.delivery[siteDelivery.site_id].deliveryWeek }}
										<template v-if="orderPaymentData.delivery[siteDelivery.site_id].showTime">
											）
										</template>
									</text>
									<text
										v-if="!orderPaymentData.delivery[siteDelivery.site_id].canLocalDelicery">（休息中）</text>
								</view>
							</view>
							<picker v-if="
									orderPaymentData.delivery[siteDelivery.site_id].showTimeBar &&
										orderPaymentData.member_address &&
										orderPaymentData.delivery[siteDelivery.site_id].canLocalDelicery
								" :value="orderPaymentData.delivery[siteDelivery.site_id].buyer_ask_delivery_time"
								:data-siteId="siteDelivery.site_id" mode="time" @change="bindTimeChange">
								<view class="pick-block">
									<view class="font-size-base">送达时间</view>
									<view class="time-picker">
										<text>{{ orderPaymentData.delivery[siteDelivery.site_id].buyer_ask_delivery_time }}</text>
										<text class="iconfont iconright cell-more"></text>
									</view>
								</view>
							</picker>
						</view>
					</block>
				</view>
				<view class="popup-footer" :class="{ 'bottom-safe-area': isIphoneX }">
					<view class="confirm-btn color-base-bg" @click="closePopup('deliveryPopup')">确定</view>
				</view>
			</view>
		</uni-popup>

		<!-- 选择支付方式弹窗 -->
		<ns-payment ref="choosePaymentPopup" :isBalance="orderCreateData.is_balance" @useBalance="useBalance"
			:isPayPassWord="orderPaymentData.member_account.is_pay_password"
			:balanceDeduct="orderPaymentData.order_money > 0 && orderPaymentData.member_account.balance_total > 0 ? balanceDeduct : '0'"
			:payMoney="orderPaymentData.pay_money" @confirm="orderCreate"></ns-payment>

		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
	import payment from '../public/js/payment.js';
	import uniPopup from '@/components/uni-popup/uni-popup.vue';
	import globalConfig from '@/common/js/golbalConfig.js';
	import nsPayment from '@/components/payment/payment.vue';
	import tools from '@/pages/order/public/js/tool.js'

	export default {
		components: {
			uniPopup,
			nsPayment
		},
		mixins: [payment, globalConfig, tools]
	};
</script>

<style lang="scss">
	@import './../../../common/css/order_parment.scss';
</style>
<style lang="scss" scoped>
	
	.template_box:first-child{
		padding-top: 20rpx!important;
	}
	
	.template_box{
		background-color: #f8f8f8;
		margin: 20rpx 30rpx !important;
		padding: 10rpx!important;
	}
	
	.template_name{
		padding-left: 15rpx;
		color:rgb(160,160,160)!important;
		font-size: 28rpx!important;
	}
	
	.template_price{
		float: right;
		color:rgb(160,160,160)!important;
		font-size: 28rpx!important;
	}
	
	// /deep/
	.uni-popup__wrapper.uni-custom .uni-popup__wrapper-box {
		background: none;
		max-height: unset !important;
		overflow-y: hidden !important;
	}

	// >>>
	.uni-popup__wrapper {
		border-radius: 20rpx 20rpx 0 0;
	}

	// >>>
	.uni-popup {
		z-index: 8;
	}

	.liuyanBox {
		display: flex;
		align-items: flex-start;

		.liuyan {
			width: 100%;
			flex: 1;

			textarea.myliuyan {
				height: 180rpx;
				font-size: 26rpx;
				padding: 10rpx;
				width: calc(100% - 20rpx);
				border: 1rpx solid #DBDBDB;
			}
		}
	}
</style>
