<!--
 * @Author: 楚 35090745+longc447@users.noreply.github.com
 * @Date: 2023-02-20 15:40:20
 * @LastEditors: 楚 35090745+longc447@users.noreply.github.com
 * @LastEditTime: 2023-02-20 15:44:42
 * @FilePath: /二维表下单/components/diy-table/diy-table.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <view>
    table
  </view>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      default:()=> []
    }
  },
  filters: {
    
  },
  data() {
    return {
      list: [],
      headLine:[]
    }
  },
  mounted() { 

  }
}
</script>