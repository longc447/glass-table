<template>
  <view class="goods-list" :class="value.style == 1 ? 'single-column' : 'double-column'" :data-theme="themeStyle" :style="{ backgroundColor: value.backgroundColor, marginTop: value.marginTop * 2 + 'rpx' }">
    <view class="goods-item" v-for="(item, index) in goodsList" :key="index" @click="openChoose(item)">
      <view class="goods-img">
        <image :src="goodsImg(item.goods_image)" mode="widthFix" @error="imgError(index)"></image>
        <view class="color-base-bg goods-tag" v-if="value.goodsTag == 'default' && goodsTag(item) != ''">{{ goodsTag(item) }}</view>
        <view class="goods-tag-img" v-if="value.goodsTag == 'diy'"><image :src="$util.img(value.tagImg.imageUrl)" mode=""></image></view>
      </view>
      <view class="info-wrap">
        <view class="name-wrap">
          <view class="goods-name">{{ item.goods_name }}</view>
        </view>
        <view class="pro-info">
          <!-- <view class="delete-price font-size-activity-tag color-tip">
						<block>
							<text class="unit">{{ $lang('common.currencySymbol') }}</text>
							{{ item.market_price > 0 ? item.market_price : item.price }}
						</block>
					</view> -->
          <!-- <view class="sale font-size-activity-tag color-tip">已售{{ item.sale_num }}{{ item.unit ? item.unit : '件' }}</view> -->
        </view>
        <view class="lineheight-clear">
          <view class="discount-price">
            <text class="unit color-base-text font-size-tag">{{ $lang('common.currencySymbol') }}</text>
            <text v-if="is_wholesaler != 3" class="price color-base-text font-size-toolbar">请先认证</text>
            <text v-if="is_wholesaler == 3" class="price color-base-text font-size-toolbar">{{ item.price_pf }}</text>
          </view>
          <view class="member-price-tag" v-if="item.member_price && item.member_price == showPrice(item)"><image :src="$util.img('upload/uniapp/index/VIP.png')" mode="widthFix"></image></view>
          <view class="member-price-tag" v-else-if="item.promotion_type == 1"><image :src="$util.img('upload/uniapp/index/discount.png')" mode="widthFix"></image></view>
        </view>
      </view>
    </view>
    <diy-modal-choose ref="chooseDetail" @choose="toDetail" />
  </view>
</template>

<script>
import globalConfig from '@/common/js/golbalConfig.js';
import Config from '../../common/js/config.js';
export default {
  name: 'diy-goods-list',
  props: {
    value: {
      type: Object,
      default: () => {
        return {};
      },
    },
    siteId: {
      type: [Number, String],
      default: 0,
    },
    name: {
      type: String,
      default() {
        return '';
      },
    },
  },
  mixins: [globalConfig],
  data() {
    return {
      goodsList: [],
      is_wholesaler: Config.is_wholesaler,
      chooseId: '',
    };
  },
  created() {
    // console.log('=========');
    // console.log(uni.getStorageSync('is_wholesaler'));
    if (uni.getStorageSync('is_wholesaler')) this.is_wholesaler = uni.getStorageSync('is_wholesaler');
    this.getGoodsList();
  },
  onLoad() {
    //this.is_wholesaler =
  },
  methods: {
    async getGoodsList() {
      if (uni.getStorageSync('token')) {
        var ret = await this.$api.sendRequest({
          url: '/api/member/detail',
          async: false,
        });
        if (ret.code == 0) {
          // console.log(ret);
          //this.is_wholesaler = ret.is_wholesaler
        }
      }
      var data = {
        page: 1,
        page_size: this.value.goodsCount,
      };
      if (this.name == 'DIY_VIEW_CITY_INDEX' && this.siteId) data.website_id = this.siteId;
      else data.site_id = this.siteId;

      if (this.value.sources == 'category') {
        data.category_id = this.value.categoryId;
        data.category_level = 1;
      } else if (this.value.sources == 'diy') {
        data.page_size = 0;
        data.goods_id_arr = this.value.goodsId.toString();
      }
      this.$api.sendRequest({
        url: '/api/goodssku/page',
        data: data,
        success: res => {
          if (res.code == 0 && res.data) {
            let data = res.data;
            this.goodsList = data.list;
          }
        },
      });
    },
    //打开进入下单页面的选择框
    openChoose(item) {
      //备份给跳转事件使用
      this.chooseId = item.sku_id;
      //是否是现片
      // const isXp = item.rimless == 0;
      // if (isXp) return this.$refs.chooseDetail.open();
      this.toDetail(0); //0 普通下单 1 表格下单
    },
    toDetail(e) {
      this.$util.redirectTo(`/pages/goods/detail/detail`, {
        sku_id: this.chooseId,
        isXp: e,
      });
    },
    goodsImg(imgStr) {
      let imgs = imgStr.split(',');
      return imgs[0] ? this.$util.img(imgs[0], { size: 'mid' }) : this.$util.getDefaultImage().default_goods_img;
    },
    imgError(index) {
      this.goodsList[index].goods_image = this.$util.getDefaultImage().default_goods_img;
    },
    showPrice(data) {
      let price = data.discount_price;
      if (data.member_price && parseFloat(data.member_price) < parseFloat(price)) price = data.member_price;
      return price;
    },
    goodsTag(data) {
      switch (data.recommend_way) {
        case 1:
          return '新品';
          break;
        case 2:
          return '精品';
          break;
        case 3:
          return '推荐';
          break;
        default:
          return '';
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.lineheight-clear {
  line-height: 1 !important;
}
// 商品列表单列样式
.goods-list.single-column {
  .goods-item {
    padding: 26rpx;
    background: #fff;
    border-radius: $border-radius;
    display: flex;
    position: relative;
    margin-top: 10rpx;

    &.first-child {
      margin-top: 0;
    }

    .goods-img {
      width: 200rpx;
      height: 200rpx;
      overflow: hidden;
      border-radius: $border-radius;
      margin-right: 20rpx;

      image {
        width: 100%;
        height: 100%;
      }
    }

    .goods-tag {
      color: #fff;
      line-height: 1;
      padding: 8rpx 12rpx;
      position: absolute;
      border-top-left-radius: $border-radius;
      border-bottom-right-radius: $border-radius;
      top: 26rpx;
      left: 26rpx;
      font-size: $font-size-goods-tag;
    }

    .goods-tag-img {
      position: absolute;
      border-top-left-radius: $border-radius;
      width: 80rpx;
      height: 80rpx;
      top: 26rpx;
      left: 26rpx;
      z-index: 5;
      overflow: hidden;

      image {
        width: 100%;
        height: 100%;
      }
    }

    .info-wrap {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .name-wrap {
      flex: 1;
    }

    .goods-name {
      font-size: $font-size-base;
      line-height: 1.3;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      height: 68rpx;
    }

    .introduction {
      line-height: 1;
      margin-top: 10rpx;
    }

    .discount-price {
      display: inline-block;
      font-weight: bold;
      line-height: 1;
      margin-top: 16rpx;

      .unit {
        margin-right: 6rpx;
      }
    }

    .pro-info {
      display: flex;
      margin-top: 16rpx;

      .delete-price {
        text-decoration: line-through;
        flex: 1;

        .unit {
          margin-right: 6rpx;
        }
      }

      & > view {
        line-height: 1;

        &:nth-child(2) {
          text-align: right;
        }
      }
    }

    .member-price-tag {
      display: inline-block;
      width: 60rpx;
      line-height: 1;
      margin-left: 6rpx;

      image {
        width: 100%;
      }
    }
  }
}
// 商品列表双列样式
.goods-list.double-column {
  display: flex;
  flex-wrap: wrap;
  // margin: 0 $margin-both;

  .goods-item {
    flex: 1;
    position: relative;
    background-color: #fff;
    flex-basis: 48%;
    max-width: calc((100% - 30rpx) / 2);
    margin-right: $margin-both;
    margin-bottom: $margin-updown;
    border-radius: $border-radius;

    &:nth-child(2n) {
      margin-right: 0;
    }

    .goods-img {
      position: relative;
      overflow: hidden;
      padding-top: 100%;
      border-top-left-radius: $border-radius;
      border-top-right-radius: $border-radius;

      image {
        width: 100%;
        position: absolute;
        top: 50%;
        left: 0;
        transform: translateY(-50%);
      }
    }

    .goods-tag {
      color: #fff;
      line-height: 1;
      padding: 8rpx 16rpx;
      position: absolute;
      border-bottom-right-radius: $border-radius;
      top: 0;
      left: 0;
      font-size: $font-size-goods-tag;
    }

    .goods-tag-img {
      position: absolute;
      border-top-left-radius: $border-radius;
      width: 80rpx;
      height: 80rpx;
      top: 0;
      left: 0;
      z-index: 5;
      overflow: hidden;

      image {
        width: 100%;
        height: 100%;
      }
    }

    .info-wrap {
      padding: 0 26rpx 26rpx 26rpx;
    }

    .goods-name {
      font-size: $font-size-base;
      line-height: 1.3;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      margin-top: 20rpx;
      height: 68rpx;
    }

    .discount-price {
      display: inline-block;
      font-weight: bold;
      line-height: 1;
      margin-top: 16rpx;

      .unit {
        margin-right: 6rpx;
      }
    }

    .pro-info {
      display: flex;
      margin-top: 16rpx;

      .delete-price {
        text-decoration: line-through;
        flex: 1;

        .unit {
          margin-right: 6rpx;
        }
      }

      & > view {
        line-height: 1;

        &:nth-child(2) {
          text-align: right;
        }
      }
    }

    .member-price-tag {
      display: inline-block;
      width: 60rpx;
      line-height: 1;
      margin-left: 6rpx;

      image {
        width: 100%;
      }
    }
  }
}
</style>
