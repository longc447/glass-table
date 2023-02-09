<template>
  <view class="viewphoto box">
    <template>
      <view class="address-box" @click="selectAddress">
        <view class="info-wrap" v-if="is_virtual == 0">
          <view class="icon-wrap"><text class="iconfont icondizhi"></text></view>
          <view class="content">
            <text class="name font-size-base">{{ addressInfo.name ? addressInfo.name : '' }}</text>
            <text class="font-size-base">{{ addressInfo.mobile ? addressInfo.mobile : '' }}</text>
            <text class="cell-more iconfont iconright"></text>
            <view class="desc-wrap">
              {{ addressInfo.full_address ? addressInfo.full_address : '' }}
              {{ addressInfo.address ? addressInfo.address : '' }}
            </view>
          </view>
        </view>
        <view class="empty-wrap" v-else>
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

    <view class="add" @click="addimg" v-show="imgList.length<9">
      <text class="addicon">+</text>
      <text>添加订单照片（多张）</text>
    </view>
    <view class="remark box">
      <input type="text" v-model="remark" placeholder="备注" />
    </view>
    <view class="imageBox">
      <view class="imgItem" v-for="(item,index) in imgList" :key="index" @click="remove(index)">
        <image :src="item" mode="widthFix"></image>
        <text>×</text>
      </view>
    </view>

    <view class="btnBox">
      <view class="btn" @click="createOrder">
        下&nbsp;单
      </view>
    </view>

    <diy-bottom-nav type="shop"></diy-bottom-nav>
    <ns-login ref="login"></ns-login>
  </view>
</template>

<script>
  import Config from '../../common/js/config.js'
  export default {
    data() {
      return {
        addressInfo: {},
        is_virtual: -1,
        remark: '',
        imgList: [],
        fileList: [],
        orderCreateData: '',
        token: uni.getStorageSync('token')
      }
    },
    onShow() {
      this.getAddressInfomation()
    },
    methods: {
      getAddressInfomation() {

        this.$api.sendRequest({
          url: '/api/memberaddress/defaultInfo',
          success: res => {
            console.log(res, "数据");
            this.is_virtual = res.code
            if (res.code >= 0) {
              let {
                name,
                mobile,
                full_address,
                address,
                city_id,
                id
              } = res.data
              this.addressInfo = {
                name,
                mobile,
                full_address,
                address,
                city_id,
                id
              };
              console.log(this.addressInfo, "info");
            }
          }
        })
      },
      async createOrder() {

        const {
          id,
          city_id
        } = this.addressInfo
        if (!id) return uni.showToast({
          title: "请选择地址",
          icon: "none"
        })
        if (this.fileList.length == 0) return uni.showToast({
          title: "请上传图片",
          icon: "none"
        })
        // if (this.remark === "") return uni.showToast({
        // 	title: "请填写备注",
        // 	icon: "none"
        // })
        let param = {
          address_id: id,
          city_id,
          remarks: this.remark,
          images: []
        }
        if (this.fileList.length > 0) {

          uni.showLoading({
            title: "正在上传图片",
            mask: true
          })
          console.log(this.fileList, "文件列表");
          // const res = await Promise.all(this.imgList.map(e => this.upload(e)))
          // res.map(e => e.data.pic_path)
          param.images = this.imgList
          uni.hideLoading()
        }

        uni.showLoading({
          title: "正在提交订单",
          mask: true
        })
        this.$api.sendRequest({
          url: '/api/ordercreate/createPhotoOrder',
          data: param,
          success: res => {
            uni.hideLoading()
            uni.showToast({
              title: res.message,
              icon: "none"
            })
            setTimeout(() => {
              this.$util.redirectTo('/promotionpages/photo/tips');
            }, 2000)
          },
          fail: err => {
            uni.hideLoading()
            uni.showToast({
              title: "下单失败，请联系管理员",
              icon: "none"
            })
          }
        })
        console.log("下单提交", param);
      },
      selectAddress() {
        if (this.token === '') return this.$refs.login.open();
        var params = {
          back: '/pages/photo/photo',
          local: 0,
          type: 1
        }
        this.$util.redirectTo('/otherpages/member/address/address', params);
      },
      upload(file) {
        // #ifdef MP-WEIXIN
        // file = file.path
        console.log(file, "上传的东西");
        // #endif
        return new Promise((resolve, reject) => {
          uni.uploadFile({
            url: Config.baseUrl + "/api/upload/headimg",
            file,
            fileType: "image",
            success: res => {
              if (res.statusCode != 200) reject(res.errMsg)
              resolve(JSON.parse(res.data))
            },
            fail: err => {
              console.log(err, "上传图片有问题")
              reject(err)
            }

          })
        })
      },
      addimg() {
        let _this = this;
        console.log('现在：', this.imgList.length, "还可以选：", 9 - _this.imgList.length);

        _this.$util.upload(
          9 - _this.imgList.length, {
            path: 'headimg'
          },
          res => {
            _this.imgList = [..._this.imgList, ...res];
            _this.fileList = [..._this.fileList, ...res];
            console.log(res, "选择的图片");
          }
        );
        // uni.chooseImage({
        // 	count: 9 - _this.imgList.length, 
        // 	success(res) {
        // 		_this.imgList = [..._this.imgList, ...res.tempFilePaths];
        // 		_this.fileList = [..._this.fileList, ...res.tempFiles];
        // 		console.log(res, "选择的图片");
        // 	}
        // })
      },
      remove(index) {
        uni.showModal({
          title: "提示：",
          content: "确定删除吗？",
          success: (res) => {
            // if(res.cancel)uni.showToast({title:.stringify(res)})
            if (res.confirm) {
              this.imgList.splice(index, 1)
              this.fileList.splice(index, 1)
            }
          }
        })
      }

    }
  }
</script>

<style lang="scss">
  @import '../../common/css/order_parment.scss';

  .viewphoto {
    $bordercolor: #e1e1e1;

    .btnBox {
      position: fixed;
      bottom: 120rpx;
      left: 0;
      width: 100%;
      height: 120rpx;
      display: flex;
      justify-content: center;
      margin-bottom: constant(safe-area-inset-bottom);
      margin-bottom: env(safe-area-inset-bottom);

      .btn {
        width: 100%;
        margin: 15rpx;
        border-radius: 10rpx;
        background-color: rgb(255, 0, 55);
        color: #FFFFFF;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }

    // background-color: #000000;
    .add {
      display: flex;
      flex-direction: column;
      color: #787878;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 300rpx;
      margin: 30rpx;
      border: 5rpx solid $bordercolor;

      .addicon {
        font-size: 150rpx;
        line-height: 150rpx;
      }
    }

    .box {
      margin: 30rpx;
      border: 5rpx solid $bordercolor;
    }

    .remark {
      input {
        margin: 15rpx;
      }
    }

    .imageBox {
      margin: 30rpx;
      display: flex;
      flex-wrap: wrap;
      // background: #000000;

      .imgItem {
        position: relative;
        width: 100%;
        max-width: calc((100% - 25rpx) / 3);
        border: 5rpx solid #FFFFFF;
        display: flex;
        align-items: center;
        justify-content: center;
        max-height: 250rpx;
        overflow: hidden;

        image {
          // margin: 9rpx;
          width: 100%;
          height: 100%;
        }

        text {
          // line-height: 25rpx;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 10rpx;
          font-size: 40rpx;
          z-index: 1;
          text-align: center;
          font-weight: bold;
          // border-radius: 30rpx;
          color: #FFFFFF;
          width: 30rpx;
          height: 30rpx;
          background-color: red;
          position: absolute;
          top: 10rpx;
          right: 10rpx;
        }
      }
    }
  }
</style>
