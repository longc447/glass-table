<template>
  <!-- 客服 -->
  <button v-show="globalConfig.isChooseKf" class="vkefu" open-type="contact" bindcontact="handleContact" session-from="sessionFrom">
    <text>客服</text>
  </button>
</template>

<script>
    import globalConfig from '@/common/js/config'
  export default {
    name: 'icon-kf',
    data() {
      return {
        globalConfig:globalConfig
      };
    },
  };
</script>

<style>
  .vkefu {
    z-index: 10;
    position: fixed;
    width: 80rpx;
    height: 80rpx;
    border-radius: 80rpx;
    color: #fff;
    background: rgba(0, 0, 0, 0.5);
    bottom: 200rpx;
    right: 20rpx;
    white-space: nowrap;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24rpx;
  }
</style>
