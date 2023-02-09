<template>
	<view class="viewTips">
		<text class="tipText">
		下单成功，审核后可支付
		</text>
		
		<text class="btn return" @click="$util.redirectTo('/pages/index/index/index')">
			返回首页
		</text>
		<text class="btn" @click="to('/pages/order/list/list?status=waitpays')">
			查看订单
		</text>
	</view>
</template>

<script>
	export default {
		methods:{
			to(url){
				console.log(url);
				
				// this.$util.redirectTo(url);
				uni.navigateTo({
					url
				})
			}
		}
	}
</script>

<style lang="scss">
.viewTips{
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	.tipText{
		height: 500rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.btn{
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 20rpx;
		height: 80rpx;
		border-radius: 20rpx;
		color: #FFFFFF;
		background: #ff0000;
		width: calc(100% - 40rpx);
	}
	.btn.return{
		background-color: #FFFFFF;
		border: #F1F1F1;
		color: #333333;
	}
}
</style>
