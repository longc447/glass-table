<template>
	<view class="parameter_box" style="background:#f8f8f8;border-radius:5px;">
		<view class="parameter_detail" v-if="item&&(item.photometric!=0 || item.luminosity_status==1)"
			style="font-size: 3vw;font-weight: bold;line-height: 10rpx;margin-bottom: 20rpx;">
			list-item
			<view class="parameter_box" style="background: #f8f8f8;border-radius: 10rpx;">
				<view class="" v-for="(it,itindex) in item.remarks" :key="itindex" v-if="item.remarks.length">
					<text v-if="it.eye" style="margin-right: 15rpx;">
						{{it.eye=="左眼"?" L":" R"}}</text>
					<text style="color: rgb(160,160,160);" v-if="it.ball_mirror">{{" S：" }}</text>
					<text v-if="it.ball_mirror">{{it.ball_mirror | moneyFormat}}</text>

					<text style="color: rgb(160,160,160);" v-if="it.cylinder_mirror">{{" C："}}</text>
					<text v-if="it.cylinder_mirror">{{it.cylinder_mirror | moneyFormat}}</text>

					<text style="color: rgb(160,160,160);" v-if="it.axis">
						{{" 轴位："}}</text>
					<text v-if="it.axis">
						{{it.axis}}</text>

					<text style="color: rgb(160,160,160);" v-if="it.passage">
						{{" 通道："}}</text>
					<text v-if="it.passage">
						{{it.passage}}</text>
					<text style="color: rgb(160,160,160);" v-if="it.a_dd">
						{{" ADD："}}</text>
					<text v-if="it.a_dd">
						{{it.a_dd}}</text>
				</view>
				<view class="" style="font-weight: bold;">
					<text style="font-weight:500;margin-right: 15rpx;" v-if="item.eye">
						{{item.eye=="左眼"?" L":" R"}}</text>
					<text style="color: rgb(160,160,160);"
						v-if="item.ball_mirror&&!item.remarks.length">{{" S："}}</text>
					<text v-if="item.ball_mirror&&!item.remarks.length">{{item.ball_mirror | moneyFormat}}</text>

					<text style="color: rgb(160,160,160);"
						v-if="item.cylinder_mirror&&!item.remarks.length">{{" C："}}</text>
					<text
						v-if="item.cylinder_mirror&&!item.remarks.length">{{item.cylinder_mirror | moneyFormat}}</text>

					<text style="color: rgb(160,160,160);" v-if="item.axis">
						{{" 轴位："}}</text>
					<text v-if="item.axis">
						{{item.axis}}</text>

					<text style="color: rgb(160,160,160);" v-if="item.passage&&!item.remarks.length"> {{" 通道："}}</text>
					<text v-if="item.passage&&!item.remarks.length">
						{{item.passage}}</text>

					<text style="color: rgb(160,160,160);" v-if="item.a_dd&&!item.remarks.length">{{" ADD："}}</text>
					<text v-if="item.a_dd&&!item.remarks.length">
						{{item.a_dd}}</text>

				</view>

			</view>
		</view>
		<view v-if="goodsItem.photometric!=0 || goodsItem.luminosity_status == 1">
			<view v-if="goodsItem.rimless!=0 || goodsItem.luminosity_status == 1">
				<view class="" v-for="(it,itindex) in goodsItem.remarks" :key="itindex">
					<text v-if="it.eye" style="margin-right: 15rpx;">
						{{it.eye=="左眼"?" L":" R"}}</text>
					<text style="color: rgb(160,160,160);" v-if="it.ball_mirror">{{" S：" }}</text>
					<text v-if="it.ball_mirror">{{it.ball_mirror}}</text>

					<text style="color: rgb(160,160,160);" v-if="it.cylinder_mirror">{{" C："}}</text>
					<text v-if="it.cylinder_mirror">{{it.cylinder_mirror}}</text>

					<text style="color: rgb(160,160,160);" v-if="it.axis">
						{{" 轴位："}}</text>
					<text v-if="it.axis">
						{{it.axis}}</text>

					<text style="color: rgb(160,160,160);" v-if="it.passage">
						{{" 通道："}}</text>
					<text v-if="it.passage">
						{{it.passage}}</text>
					<text style="color: rgb(160,160,160);" v-if="it.a_dd">
						{{" ADD："}}</text>
					<text v-if="it.a_dd">
						{{it.a_dd}}</text>
				</view>

			</view>
			<view v-if="goodsItem.rimless==0">
				<text
					style="font-size: 3vw;color: rgb(160,160,160);font-weight: bold;color:#000000;margin-right: 15rpx;"
					v-if="goodsItem.eye">
					{{goodsItem.eye == '右眼'? 'R ' : goodsItem.eye == '左眼' ? 'L ' : ''}}</text>
				<text style="font-size: 3vw;color: rgb(160,160,160);margin-right: 1vw;">S：<text
						style="font-weight: bold;color:#000000;">{{goodsItem.ball_mirror | moneyFormat }}</text></text>
				<text style="font-size: 3vw;color: rgb(160,160,160);margin-right: 1vw;">C：<text
						style="font-weight: bold;color:#000000;">{{goodsItem.cylinder_mirror | moneyFormat }}</text></text>
				<text style="font-size: 3vw;color: rgb(160,160,160);">
					{{" 轴位："}}<text style="font-weight: bold;color:#000000;">{{goodsItem.axis}}</text></text>
				<text style="font-size: 3vw;color: rgb(160,160,160);" v-if="goodsItem.passage">
					{{" 通道："}}<text style="font-weight: bold;color:#000000;">{{goodsItem.passage}}</text></text>
				<text style="font-size: 3vw;color: rgb(160,160,160);" v-if="goodsItem.a_dd">
					{{" ADD："}}<text style="font-weight: bold;color:#000000;">{{goodsItem.a_dd}}</text></text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "sku-list",
		props: {
			item: {},
			goodsItem: {}
		},
		filters: {
			/**
			 * 金额格式化输出
			 * @param {Object} money
			 */
			moneyFormat(money) {
				console.log(money, "=======>", parseFloat(money).toFixed(2))
				return parseFloat(money).toFixed(2);
			}
		},
		updated() {
			console.log("sku---->", item)
		}
	}
</script>

<style lang="scss">

</style>
