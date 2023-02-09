<template>
	<view class="imageLoader" v-show="isShow" @click="isShow=false">
		<image :src="url" mode="widthFix"></image>
	</view>
</template>

<script>
	export default {
		name: "image-loader",
		data() {
			return {
				isShow: false,
				url: ''
			};
		},
		methods: {
			show(url) {
				this.url = url;
				this.isShow = true;
			}
		}
	}
</script>

<style lang="scss">
	.imageLoader {
		position: fixed;
		width: 100%;
		height: 100%;
		background-color: #000000;
		top: 0;
		left: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: 1s;

		image {
			width: 100%;
		}
	}
</style>
