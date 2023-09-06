<template>
  <view class="category-level" :style="mainHeight">
    <view class="category-level-box" v-if="cateList.length && isLoadingCate">
      <nsSearch :siteId="siteId"></nsSearch>
      <view class="category-goods">
        <scroll-view scroll-y="true" class="oneScroll">
          <view
            class="oneScroll-item using-hidden"
            v-for="(item, index) in cateList"
            :key="index"
            :class="{ 'active color-base-text color-base-bg-before': item.category_id_1 == oneCategoryId }"
            @click="selectOneCategory(item.category_id_1, index, true)"
          >
            {{ item.short_name ? item.short_name : item.category_name }}
          </view>
        </scroll-view>
        <view class="twoScroll">
          <view class="category-cate-top"></view>
          <scroll-view scroll-y="true" :style="{ height: 'calc(100% - ' + height + ' )' }">
            <image class="cate-adv" v-if="categoryAdvImage" :src="$util.img(categoryAdvImage)" @error="categoryAdvImage = $util.img('/upload/uniapp/default_ad.png')" mode="widthFix"></image>
            <view class="twoScroll-list" v-if="twoCateList.length">
              <view class="twoScroll-item" v-for="(item, index) in twoCateList" :key="index">
                <view v-if="item.child_list" @click="toListDetail(item)">
                  <image v-if="item.image" class="twoScroll-item-image" :src="$util.img(item.image)" @error="cateImgError(index)" mode="aspectFit"></image>
                  <image v-else class="twoScroll-item-image" :src="$util.getDefaultImage().default_category_img" mode="aspectFit"></image>
                  <text class="using-hidden twoScroll-item-text">{{ item.short_name ? item.short_name : item.category_name }}</text>
                </view>
                <view v-else @click="toDetail(item)">
                  <image v-if="item.image" class="twoScroll-item-image" :src="$util.img(item.image)" @error="cateImgError(index)" mode="aspectFit"></image>
                  <image v-else class="twoScroll-item-image" :src="$util.getDefaultImage().default_category_img" mode="aspectFit"></image>
                  <text class="using-hidden twoScroll-item-text">{{ item.short_name ? item.short_name : item.category_name }}</text>
                </view>
              </view>
            </view>
            <ns-empty v-else :isIndex="!1" :fixed="!1" text="暂无商品分类"></ns-empty>
          </scroll-view>
        </view>
      </view>
    </view>

    <ns-empty v-else :isIndex="!1"></ns-empty>
    <uni-drawer :visible="showScreen" mode="right" @close="showScreen = false" class="screen-wrap" style="z-index: 100">
      <view class="title color-tip" @click="cancelDrawer">取消</view>
      <scroll-view scroll-y>
        <view class="category-list-wrap">
          <text class="first"></text>
          <view>
            <!-- {{twoCateList[0]['child_list']}} -->
            <view v-for="(item, index) in child_list" class="class-box" style="width: calc((100% - 30px) / 1)">
              <view style="width: calc((100% - 30px) / 1); background: #e7e7e7" @click="showCate(index)" v-if="item.child_list">
                {{ item.category_name }}
                <span :class="[current.includes(index) ? 'iconfont iconiconangledown' : 'iconfont iconiconangledown-copy']" style="font-size: 40rpx">　</span>
              </view>
              <view style="width: calc((100% - 30px) / 1); background: #e7e7e7" @click="toDetail(item)" v-else>
                {{ item.category_name }}
              </view>
              <!--四级分类-->
              <view v-for="(item2, index2) in item.child_list" style="width: calc((100% - 30px) / 1); background: #fafafa" @click="toDetail(item2)" v-show="current.includes(index)">
                {{ item2.category_name }}
              </view>
            </view>
          </view>
        </view>
      </scroll-view>
      <!-- <view class="footer" :class="{ 'safe-area': isIphoneX }">
				<button type="default" class="footer-box" @click="resetData">重置</button>
				<button type="primary" class="footer-box1" @click="screenData">确定</button>
			</view> -->
    </uni-drawer>
  </view>
</template>

<script>
import nsSearch from '@/components/ns-search/ns-search.vue';
import globalConfig from '@/common/js/golbalConfig.js';
import list from '@/pages/goods/public/js/list.js';
import eventBus from '@/common/js/b.js';
export default {
  data() {
    return {
      isLoadingCate: false,
      categoryAdvImage: '', //广告位
      cateList: [], //所有分类
      twoCateList: [], //二级分类
      height: 0,
      oneCategoryId: 0,
      TwoCategoryId: 0,
      //showScreen:true,
      child_list: {},
      current: [],
    };
  },
  components: {
    nsSearch,
  },
  mixins: [globalConfig, list],
  props: {
    value: {
      type: Object,
    },
    categoryHeight: {
      type: [Number, String],
      default: 0,
    },
    siteId: {
      type: [Number, String],
      default: 0,
    },
  },
  created() {
    this.getCategoryList();

    eventBus.$on('open', () => {
      this.toListDetail(this.$store.state.list_second_id);
      this.$$nextTick(() => {
        this.showCate(this.$store.state.list_third_id);
      });
      console.warn('open 了咯');
    });
  },
  computed: {
    mainHeight() {
      var height = this.categoryHeight ? this.categoryHeight + 'px' : '100%';
      height = 'height:' + height;
      return height;
    },
  },
  methods: {
    open() {},
    showCate(index) {
      console.log(index, '6');
      this.$store.commit('setThirdId', index);
      if (this.current.includes(index)) {
        this.current.splice(this.current.indexOf(index), 1);
      } else {
        this.current.push(index);
      }
    },
    getCategoryList() {
      let url = '/api/goodscategory/tree',
        data = {
          level: 3, //this.value.level
          template: this.value.template,
        };
      if (this.siteId) {
        data.site_id = this.siteId;
        url = '/api/shopgoodscategory/tree';
      }
      this.isLoadingCate = false;
      this.$api.sendRequest({
        url: url,
        data: data,
        success: res => {
          this.isLoadingCate = true;
          if (res.code != 0) {
            this.$util.showToast({
              title: res.message,
            });
            return false;
          }
          if (res.code == 0 && res.data.length) {
            this.cateList = res.data;
            this.categoryAdvImage = this.cateList[0].image_adv;
            this.oneCategoryId = this.cateList[0].category_id_1;

            if (res.data[0].child_list) {
              this.twoCateList = res.data[0].child_list;
              console.log(this.twoCateList, '7');
              if (res.data[0].child_list[0]) this.TwoCategoryId = res.data[0].child_list[0].category_id_2;
            }

            this.$nextTick(function () {
              const query = uni.createSelectorQuery().in(this);
              query
                .select('.category-cate-top')
                .boundingClientRect(data => {
                  this.height = data.height + 'px';
                })
                .exec();
            });
          }

          this.$emit('netFinish', true);
        },
      });
    },
    cancelDrawer() {
      this.showScreen = false;
    },
    toListDetail(id) {
      console.log(id, '777');
      this.$store.commit('setListSecondId', id);
      this.child_list = null;
      if (id.child_list) {
        this.child_list = id.child_list;
      }
      this.showScreen = true;
      // let data = {
      // 	category_id: id
      // };
      // let url = '/pages/goods/list/list';
      // if (this.siteId) {
      // 	url = '/otherpages/shop/list/list';
      // 	data.site_id = this.siteId;
      // }

      // this.$util.redirectTo(url, data);
    },
    toDetail(id) {
      console.log(id);

      this.showScreen = false;
      let data = {
        category_id: id.category_id,
        category_id_1: id.category_id_1,
      };
      let url = '/pages/goods/list/list';
      if (this.siteId) {
        url = '/otherpages/shop/list/list';
        data.site_id = this.siteId;
      }

      this.$util.redirectTo(url, data);
    },
    selectOneCategory(onecateId, index) {
      this.oneCategoryId = onecateId;
      this.categoryAdvImage = this.cateList[index].image_adv;

      this.twoCateList = this.cateList[index].child_list ? this.cateList[index].child_list : [];
      if (this.twoCateList.length) {
        this.TwoCategoryId = this.twoCateList[0].category_id_2;
        this.TwoCategoryIndex = 0;
      } else {
        this.TwoCategoryId = 0;
      }

      this.$nextTick(function () {
        const query = uni.createSelectorQuery().in(this);
        query
          .select('.category-cate-top')
          .boundingClientRect(data => {
            this.height = data.height + 'px';
          })
          .exec();
      });
    },
    cateImgError(index) {
      this.twoCateList[index].image = this.$util.getDefaultImage().default_category_img;
      this.$forceUpdate();
    },
  },
};
</script>
<style lang="scss">
@import '@/pages/goods/public/css/list.scss';
@import '@/components/diy-goods-level-category/diy-goods-level-category.scss';

//三列默认布局
.twoScroll-list {
    // padding: 0 34rpx;
    overflow: hidden;

    .twoScroll-item {
      // margin: 0 60rpx 40rpx 0;
      width: 156rpx;
      display: inline-block;
      text-align: center;
      line-height: 1;

      .twoScroll-item-image {
        width: 114rpx;
        height: 114rpx;
        margin-bottom: 20rpx;
      }

      .twoScroll-item-text {
        font-size: $font-size-sub;
        color: $color-title;
      }

      &:nth-child(3n + 3) {
        margin-right: 0;
      }
    }
  }

  // 两列图标放大

// .twoScroll-list {
//   padding: 0 34rpx;
//   overflow: hidden;
//   display: flex;
//   flex-wrap: wrap;

//   .twoScroll-item {
//     // margin: 0 60rpx 40rpx 0;
//     // width: 114rpx;
//     width: 50%;
//     display: inline-block;
//     text-align: center;
//     line-height: 1;
//     margin-bottom: 40rpx;

//     .twoScroll-item-image {
//       width: 204rpx;
//       height: 204rpx;
//       margin-bottom: 20rpx;
//     }

//     .twoScroll-item-text {
//       // font-size: $font-size-sub;
//       color: $color-title;
//       font-size: 50rpx;
//     }

//     &:nth-child(3n + 3) {
//       margin-right: 0;
//     }
//   }
// }
</style>
