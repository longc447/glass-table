<!--
 * @Author: 楚 35090745+longc447@users.noreply.github.com
 * @Date: 2023-02-14 02:13:28
 * @LastEditors: 楚 35090745+longc447@users.noreply.github.com
 * @LastEditTime: 2023-04-06 17:41:56
 * @FilePath: /二维表下单/components/diy-modal-choose/diy-modal-choose.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <view>
    <uni-popup ref="popup" type="center">
      <view class="select-detail">
        <view class="item" @click="choose(0)">普通下单</view>
        <view class="line"></view>
        <view class="item" @click="choose(1)">二维表下单</view>
      </view>
    </uni-popup>
  </view>
</template>
<script>
export default {
  name: 'diy-modal-choose',
  methods: {
    open() {
      // 通过组件定义的ref调用uni-popup方法 ,如果传入参数 ，type 属性将失效 ，仅支持 ['top','left','bottom','right','center']
      this.$refs.popup.open('top');
    },
    choose(i) {
      this.$emit('choose', i);
    },
  },
};
</script>
<style lang="scss">
.select-detail {
  width: 600rpx;
  // padding: 20rpx 0;
  .line {
    border-bottom: 1rpx solid #d9dfdf;
  }
  .item {
    padding: 10rpx 0;
    text-align: center;
    line-height: 80rpx;
    height: 80rpx;
    // border: 1px solid;
  }
}
</style>
