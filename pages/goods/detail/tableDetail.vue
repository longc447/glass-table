<!--
 * @Author: 楚 35090745+longc447@users.noreply.github.com
 * @Date: 2023-02-14 02:10:07
 * @LastEditors: 楚 35090745+longc447@users.noreply.github.com
 * @LastEditTime: 2023-02-20 15:41:07
 * @FilePath: /二维表下单/pages/goods/detail/tableDetail.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
	<view class="tableDetail">
		<view class="head" >
      <!-- v-for="(item,index) in JSON.parse(goodsSkuDetail.goods_spec_format)" -->
      <!-- {{ JSON.stringify(goodsSkuDetail.goods_spec_format) }} -->
			<view class="btn-box" v-for="(specItem,index) in goodsSkuDetail.goods_spec_format" :key="index">
				<view :class="['btn',index==specIndex?'active':'']" v-for="(item,index) in specItem.value" @click="specIndex = index">{{ item.spec_value_name }}</view>
			</view>
			<!-- <view class="btn-box">
				<view class="btn">近视</view>
				<view class="btn">老花</view>
			</view> -->
		</view>
    <diy-table />
		<view class="table">

    </view>
	</view>
</template>
<script>
import './tableDetail.scss';
import detail from '../public/js/detail.js';
import scroll from '@/common/js/scroll-view.js';
import globalConfig from '@/common/js/golbalConfig.js';
export default {
  mixins: [detail, scroll, globalConfig],
	data() {
    return {
      specIndex:0
    };
	},
	async onload(e) {
		let _this = this;
		uni.getSystemInfo({
			success(res) {
				console.log(res, '机型信息');
				if (res.model.substring(0, 9) == 'iPhone 12') {
					//12系列
					_this.isiPhone12 = true;
					console.log(res.model, '是iPhone12', _this.isiPhone12);
				}
			},
		});
		if (uni.getStorageSync('token')) {
			var ret = await this.$api.sendRequest({
				url: '/api/member/detail',
				async: false,
			});
			if (ret.code == 0) {
				console.log(ret);
				if (Config.is_wholesaler === 0) this.is_wholesaler = ret.is_wholesaler;
			}
		}
		console.log(ret);
	},
};
</script>
