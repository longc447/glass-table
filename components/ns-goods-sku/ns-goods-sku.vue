<template>
	<view class="goods-sku" @touchmove.prevent.stop>
		<uni-popup ref="skuPopup" type="bottom" class="sku-layer">
			<view class="sku-info" :style="{ height: systemInfo.windowHeight * 1 + 'px' }">
				<view class="header">
					<block v-if="type == 'point' && goodsDetail.type && goodsDetail.type != 1">
						<view class="img-wrap" v-if="goodsDetail.type == 2">
							<image
								:src="goodsDetail.image ? $util.img(goodsDetail.image) : $util.img('upload/uniapp/point/coupon.png')"
								mode="aspectFit" />
						</view>
						<view class="img-wrap" v-if="goodsDetail.type == 3">
							<image
								:src="goodsDetail.image ? $util.img(goodsDetail.image) : $util.img('upload/uniapp/point/hongbao.png')"
								mode="aspectFit" />
						</view>
					</block>

					<view v-else class="img-wrap">
						<image :src="$util.img(goodsDetail.sku_image, { size: 'mid' })" @error="imgError()"
							mode="aspectFit" />
					</view>

					<view class="main">
						<block v-if="type == 'point'">
							<block v-if="goodsDetail.type == 1">
								<view class="price-wrap">
									<text
										class="price color-base-text font-size-toolbar">{{ goodsDetail.point }}积分</text>
									<block v-if="goodsDetail.exchange_price != '0.00' && goodsDetail.pay_type > 0">
										<text class="unit color-base-text font-size-tag">+</text>
										<text
											class="price color-base-text font-size-toolbar">{{ $lang('common.currencySymbol') }}{{is_wholesaler==3?goodsDetail.price_pf:goodsDetail.exchange_price }}</text>
									</block>
								</view>
								<view class="stock">库存{{ goodsDetail.stock }}{{ goodsDetail.unit }}</view>
							</block>
							<block v-else>
								<view class="price-wrap">
									<view class="price font-size-toolbar">{{ goodsDetail.name }}</view>
								</view>
								<view class="stock" style="height: auto;">
									积分：
									<text class="color-base-text">{{ goodsDetail.point }}</text>
								</view>
								<view class="stock">
									库存：
									<text class="color-base-text">{{ goodsDetail.stock }}{{ goodsDetail.unit }}</text>
								</view>
							</block>
						</block>
						<block v-else-if="type == 'wholesale_join_cart' || type == 'wholesale_buy_now'">
							<view class="wholesale-item" v-for="(priceItem, index) in goodsDetail.price_array"
								:key="index">
								<view class="price-wrap">
									<text class="unit color-base-text font-size-tag">￥</text>
									<text
										class="price color-base-text font-size-toolbar margin-right">{{ priceItem.price }}</text>
									<text class="start-number">{{ priceItem.num }}{{ goodsDetail.unit }}起批</text>
								</view>
							</view>
							<view class="stock">库存{{ goodsDetail.stock }}{{ goodsDetail.unit }}</view>
						</block>
						<block v-else>
							<view class="price-wrap">
								<text class="price color-base-text font-size-toolbar"
									v-if="goodsDetail.luminosity_status == 1">{{goodsDetail.luminosity_status == 1?'共计：':''}}</text>
								<text class="unit color-base-text font-size-tag">￥</text>
								<text class="price color-base-text font-size-toolbar"
									v-if="goodsDetail.luminosity_status == 1">{{sumPrice || 0}}</text>
								<text class="price color-base-text font-size-toolbar"
									v-else>{{ is_wholesaler==3?goodsDetail.price_pf:goodsDetail.price  }}</text>
							</view>
							<view class="stock">库存{{ goodsDetail.stock }}{{ goodsDetail.unit }}</view>
						</block>

						<view class="sku-name font-size-tag"
							v-if="goodsDetail.sku_spec_format && goodsDetail.luminosity_status != 1">
							<text class="color-tip" v-if="false">已选规格：</text>
							<text v-for="(item, index) in goodsDetail.sku_spec_format" :key="index" v-if="false"
								class="spec-value">{{ item.spec_value_name }}</text>
						</view>
					</view>

					<view class="sku-close iconfont iconclose" @click="closeSkuPopup()"></view>
				</view>
				<view class="body-item">
					<!--  class="wrap" -->
					<scroll-view :scroll-y="true" style="max-height: 920rpx;" :scroll-into-view="scrollto">
						<view class="sku-list-wrap" v-for="(item, index) in goodsDetail.goods_spec_format" :key="index"
							v-if="goodsDetail.luminosity_status != 1">
							<text class="title font-size-base">{{ item.spec_name }}</text>
							<view v-for="(item_value, index_value) in item.value" :key="index_value" :class="{
									selected: item_value['selected'] || skuId == item_value.sku_id,
									disabled: item_value['disabled'] || (!item_value['selected'] && disabled)
								}" class="items" @click="change(item_value.sku_id, item_value.spec_id)">

								<image v-if="item_value.image" :src="$util.img(item_value.image, { size: 'small' })"
									@error="valueImgError(index, index_value)" />
								<text>{{ item_value.spec_value_name }}</text>
							</view>
						</view>
						<!-- <view class="sku-list-wre" v-if=" goodsDetail.photometric!=0">
						球镜值+柱镜<=联合光度值{{photometric}}
					</view> -->
						<view class="wrap-transverse" v-for="(item,index) in myValue"
							style="display: flex;flex-direction: column;" :key="index">
							<view class="wrap-sph">
								<view class="sku-list-wrap"
									v-if="(goodsDetail.photometric!=0|| goodsDetail.luminosity_status==1 ) && goodsDetail.eye == 1  ">
									<view class="title font-size-base" style="text-align: center;">右左眼</view>

									<view class="picker-item" @click="setMyPopup(index,'eyepopup',leftArray)">
										<text style="font-size: 35rpx;color: rgb(120,120,120);"
											v-if="leftIndex == null"></text>
										<view style="font-size: 3.5vw;color: rgb(120,120,120);" v-else
											class="uni-input">{{leftArray[item.leftIndex] || ''}}</view>
									</view>
									<!-- 	<picker @change="bindPickerChangeF" :value="item.leftIndex" :range="leftArray"
										class="picker-item">
										<text style="font-size: 35rpx;color: rgb(120,120,120);"
											v-if="leftIndex == null"></text>
										<view style="font-size: 3.5vw;color: rgb(120,120,120);" v-else
											class="uni-input">{{leftArray[item.leftIndex]}}</view>
									</picker> -->
								</view>
								<view class="sku-list-wrap"
									v-if="goodsDetail.photometric!=0|| goodsDetail.luminosity_status==1 ">
									<view class="title font-size-base" style="text-align: center;">球镜</view>
									<view class="picker-item" style="width: 80rpx;"
										@click="setMyPopup(index,'ball',item.ball_mirrorArray)">
										<text style="font-size: 3.5vw;color: rgb(120,120,120);"
											v-if="ball_mirrorIndex == null"></text>
										<view style="font-size: 3.5vw;color: rgb(120,120,120);" v-else
											class="uni-input">{{item.ball_mirrorArray[item.ball_mirrorIndex] || ''}}
										</view>
									</view>
									<!-- <picker @change="bindPickerChangeA" :value="item.ball_mirrorIndex"
										:range="item.ball_mirrorArray" class="picker-item" style="width: 80rpx;">
										<text style="font-size: 3.5vw;color: rgb(120,120,120);"
											v-if="ball_mirrorIndex == null"></text>
										<view style="font-size: 3.5vw;color: rgb(120,120,120);" v-else
											class="uni-input">{{item.ball_mirrorArray[item.ball_mirrorIndex]}}</view>
									</picker> -->
								</view>
								<view class="sku-list-wrap"
									v-if=" goodsDetail.photometric!=0|| goodsDetail.luminosity_status==1 ">
									<text class="title font-size-base" style="text-align: center;">柱镜</text>

									<view class="picker-item" style="width: 80rpx;"
										@click="setMyPopup(index,'cylinder',item.cylinder_mirrorArray,item,index)">
										<text style="font-size: 3.5vw;color: rgb(120,120,120);"
											v-if="cylinder_mirrorIndex == null"></text>
										<view style="font-size: 3.5vw;color: rgb(120,120,120);" v-else
											class="uni-input">
											{{item.cylinder_mirrorArray[item.cylinder_mirrorIndex] || ''}}
										</view>
									</view>
									<!-- 	<picker @change="bindPickerChangeB" :value="item.cylinder_mirrorIndex"
										style="width: 80rpx;" :range="item.cylinder_mirrorArray" class="picker-item">
										<text style="font-size: 3.5vw;color: rgb(120,120,120);"
											v-if="cylinder_mirrorIndex == null"></text>
										<view style="font-size: 3.5vw;color: rgb(120,120,120);" v-else
											class="uni-input">{{item.cylinder_mirrorArray[item.cylinder_mirrorIndex]}}
										</view>
									</picker> -->
								</view>
								<view class="sku-list-wrap"
									v-if=" goodsDetail.photometric!=0|| goodsDetail.luminosity_status==1 ">
									<text class="title font-size-base" style="text-align: center;">轴位</text>
									<view class="picker-item" style="font-size: 3.5vw;color: rgb(120, 120, 120);">
										<input type="number" v-model="item.axisValue"
											style="font-size: 3.5vw;color: rgb(120, 120, 120);" />
									</view>
									<!-- 	<picker @change="bindPickerChangeC" :value="item.axisIndex" :range="axisArray"
										class="picker-item">
										<text style="font-size: 3.5vw;color: rgb(120,120,120);"
											v-if="axisIndex == null"></text>
										<view style="font-size: 3.5vw;color: rgb(120,120,120);" v-else
											class="uni-input">{{axisArray[item.axisIndex]}}</view>
									</picker> -->
								</view>
								<view class="sku-list-wrap"
									v-if="(goodsDetail.photometric!=0|| goodsDetail.luminosity_status==1) && goodsDetail.a_dd == 1">
									<text class="title font-size-base" style="text-align: center;">ADD</text>
									<view class="picker-item" @click="setMyPopup(index,'add',sumArray)">

										<text style="font-size: 3.5vw;color: rgb(120,120,120);"
											v-if="sumIndex == null"></text>
										<view style="font-size: 3.5vw;color: rgb(120,120,120);" v-else
											class="uni-input">{{sumArray[item.sumIndex] || ''}}</view>
									</view>
									<!-- <picker @change="bindPickerChangeD" :value="item.sumIndex" :range="sumArray"
										class="picker-item">
										<text style="font-size: 3.5vw;color: rgb(120,120,120);"
											v-if="sumIndex == null"></text>
										<view style="font-size: 3.5vw;color: rgb(120,120,120);" v-else
											class="uni-input">{{sumArray[item.sumIndex]}}</view>
									</picker> -->
								</view>
								<view class="sku-list-wrap"
									v-if="(goodsDetail.photometric!=0|| goodsDetail.luminosity_status==1) && goodsDetail.passage == 1 ">
									<text class="title font-size-base" style="text-align: center;">通道</text>
									<view class="picker-item" @click="setMyPopup(index,'tongdao',objArray)">
										<text style="font-size: 3.5vw;color: rgb(120,120,120);"
											v-if="objIndex == null"></text>
										<view style="font-size: 3.5vw;color: rgb(120,120,120);" v-else
											class="uni-input">{{objArray[item.objIndex] || ''}}</view>
									</view>
									<!-- <picker @change="bindPickerChangeE" :value="item.objIndex" :range="objArray"
										class="picker-item">
										<text style="font-size: 3.5vw;color: rgb(120,120,120);"
											v-if="objIndex == null"></text>
										<view style="font-size: 3.5vw;color: rgb(120,120,120);" v-else
											class="uni-input">{{objArray[item.objIndex]}}</view>
									</picker> -->
								</view>
								<view class="sku-list-wrap"
									v-if="goodsDetail.photometric!=0|| goodsDetail.luminosity_status==1 ">
									<text class="title font-size-base" style="text-align: center;">数量(片)</text>
									<view class="picker-item">
										<input type="number" v-model="item.product_num" @input="getSumPrice()"
											style="font-size: 3.5vw;color: rgb(120,120,120);height: 45rpx;"></input>
									</view>
								</view>
								<view class="remove-sku" @click="removeTap(index)"
									v-if="goodsDetail.rimless!=1&&(goodsDetail.photometric!=0|| goodsDetail.luminosity_status==1)">
									-

								</view>
							</view>
							<view style="align-self: flex-end;margin-right: 80rpx;color:#ff4544;"
								v-if="goodsDetail.luminosity_status == 1">
								单片价：￥{{item.discount_price || 0}}
							</view>
						</view>

						<view class="number-wrap"
							v-if="goodsDetail.photometric==0 && goodsDetail.luminosity_status!=1 ">
							<view class="number-line">
								<text class="title font-size-base" v-if="type == 'point'">兑换数量</text>
								<text class="title font-size-base" v-else>购买数量</text>
								<text class="limit-txt color-base-text"
									v-if="limitNumber > 0">(每人限购{{ limitNumber }}{{ goodsDetail.unit }})</text>
								<text class="limit-txt color-base-text" v-if="minNumber > 0">({{ minNumber }}件起购)</text>
								<text v-if="maxBuy > 0 && minBuy > 1" class="limit-txt color-base-text">
									({{ minBuy }}{{ goodsDetail.unit }}起售，限购{{ maxBuy }}{{ goodsDetail.unit }})
								</text>
								<text v-else-if="maxBuy > 0"
									class="limit-txt color-base-text">(限购{{ maxBuy }}{{ goodsDetail.unit }})</text>
								<text v-else-if="minBuy > 1"
									class="limit-txt color-base-text">({{ minBuy }}{{ goodsDetail.unit }}起售)</text>
								<view class="number">
									<button type="default" class="decrease color-line-border"
										@click="changeNum('-')">-</button>
									<input type="number" class="uni-input color-line-border font-size-goods-tag"
										@blur="blur" v-model="number" placeholder="0" @input="keyInput(false)" />
									<button type="default" class="increase color-line-border"
										@click="changeNum('+')">+</button>
								</view>
							</view>
						</view>


						<view class="add-sku" @click="getClickGoodsAdd()" :id="scrollto"
							v-if="goodsDetail.rimless!=1&&(goodsDetail.photometric!=0|| goodsDetail.luminosity_status==1) ">
							<text>新增</text>
							<!-- #ifndef MP-->
							<text v-show="false">{{rimless=goodsDetail.rimless}}</text>
							<!-- #endif -->
						</view>
					</scroll-view>
					<!-- <textarea placeholder="备注留言" class="remarkBox" v-model="buyer_message"></textarea> -->


				</view>
				<block v-if="type == 'wholesale_buy_now' || type == 'wholesale_join_cart'">
					<view class="footer" @click="confirm()">
						<!-- <button type="primary" v-if="type == 'wholesale_join_cart' && goodsDetail.stock >= number && number >= minNumber">加入进货单</button> -->
						<button type="primary">确定</button>
						<!-- <button type="primary" v-else disabled="true">库存不足</button> -->
					</view>
				</block>
				<block v-else>
					<view class="footer" @click="confirm()">
						<!-- <button type="primary" v-if="type == 'wholesale_join_cart' && goodsDetail.stock >= number && number >= minNumber">加入进货单</button> -->
						<button type="primary">确定</button>
						<!-- <button type="primary" v-else disabled="true">库存不足</button> -->
					</view>
				</block>
			</view>
		</uni-popup>
		<ns-login ref="login"></ns-login>
		<!-- 左右眼 -->
		<my-popup-select ref="eyepopup" @change="bindPickerChangeF" title="左右眼" />
		<!-- 球镜 -->
		<my-popup-select title="球镜" ref="ball" @change="bindPickerChangeA" />
		<!-- 柱镜 -->
		<my-popup-select title="柱镜" ref="cylinder" @change="bindPickerChangeB" />
		<!-- ADD -->
		<my-popup-select title="ADD" ref="add" @change="bindPickerChangeD" />
		<!-- 通道 -->
		<my-popup-select title="通道" ref="tongdao" @change="bindPickerChangeE" />

	</view>
</template>

<script>
	import uniPopup from '@/components/uni-popup/uni-popup-sku.vue';
	import htmlParser from '@/common/js/html-parser';
	import Config from '../../common/js/config.js'
	// 商品SKU
	export default {
		name: 'ns-goods-sku',
		components: {
			uniPopup
		},
		props: {
			goodsDetail: {
				type: Object,
				default: null
			},
			disabled: {
				type: Boolean,
				default: false
			},
			pointLimit: {
				type: [Number, String]
			},
			maxBuy: {
				type: Number,
				default: 0
			},
			minBuy: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {
				rimless: '',
				scrollto: 'addbtn0',
				isIphoneX: false,
				systemInfo: {}, //系统信息
				number: 1,
				btnSwitch: false, //提交按钮防止重复提交
				type: '', //join_cart：加入购物车，buy_now：立即购买
				callback: null, //回调
				skuId: 0,
				pintuanId: 0, // 拼团id
				limitNumber: 0, // 限购
				minNumber: 0,
				//是否开启预览，0：不开启，1：开启
				preview: 0,
				cartNumber: 0, // 购物车中商品存在的数量,

				leftIndex: 0, //眼球index
				ball_mirrorIndex: 0, //球镜index
				cylinder_mirrorIndex: 0, //柱镜index
				axisIndex: 0, //轴位index
				sumIndex: 0, //ADDindex
				objIndex: 0, //通道index

				leftArray: ['R', 'L'], //眼球数组
				ball_mirrorArray: [], //球镜数组
				cylinder_mirrorArray: [], //柱镜数组
				ball_mirrorArray_bk: [],
				cylinder_mirrorArray_bk: [],
				axisArray: [], //轴位数组

				sumArray: [], //add数组
				objArray: [], //通道数组

				photometric: 0, //联合光度
				is_wholesaler: Config.is_wholesaler, //3 批发商
				//商品数量变量
				myValue: [], //循环总存放数组
				nowIndex: 0, //正在操作的总数组下标
				lastIndex: 0, //当前数组下标
				quantity: 0,
				mirrolist: [],
				sumPrice: 0,
				newballlist: [],
				buyer_message: ''
			};
		},
		mounted() {
			console.log(this.goodsDetail.sku_spec_format,"多规格")
			this.isIphoneX = this.$util.uniappIsIPhoneX();
			this.systemInfo = uni.getSystemInfoSync();
			this.getWholesale(this.goodsDetail);
			if (this.goodsDetail.goods_id == 0) this.$emit("error")
			// let t = setInterval(() => {
			// 	if (this.cylinder_mirrorArray_bk.length > 0) {
			// 		clearInterval(t);
			// 		this.getClickGoodsAdd();
			// 	}
			// }, 100)
		},
		watch: {
			// rimless(nval,oval){
			// 	//console.error(nval,oval,"rimless")
			// },
			pointLimit(newNum, oldNum) {
				this.limitNumber = Number(newNum);
			},
			goodsDetail(newData, oldData) {
					// this.getWholesale(newData);
				this.goodsDetailChange(newData)
				// if (newData.rimless == 1) {
					console.error(this.goodsDetail,"更新了一次");
				// }
				
				if (this.goodsDetail.rimless == 1) {
					this.rimless = this.goodsDetail.rimless
					this.getClickGoodsAdd({}, 1)
				}
			},
			minBuy(newData, oldData) {
				if (this.minBuy > 1) {
					this.number = Number(this.minBuy);
				}
			}
		},
		methods: {
			goodsDetailChange(newData, oldData) {
				//console.log(this.goodsDetail, "goodsDetailgoodsDetailgoodsDetailgoodsDetail");
				//console.log(newData.photometric)
				this.skuId = newData.sku_id;
				console.error(this.goodsDetail.luminosity_status,"luminosity_status");
				if (this.goodsDetail.luminosity_status != 1) this.setBalllist()
				if (newData.photometric != 0 || newData.luminosity_status == 1) { //联合光度
					//球镜范围
					let ball_mirrorArray = [],
						bstep = 0.25
					for (let i = newData.ball_min; i <= newData.ball_max; i += bstep) {
						bstep = i < this.goodsDetail.step && this.goodsDetail.step != 0 ? 0.5 : 0.25
						ball_mirrorArray.push((i.toFixed(2) > 0 ? "+" : "") + i.toFixed(2))
					}
					//柱镜范围
					let cylinder_mirrorArray = [],
						cstep = 0.25
					for (let i = newData.cylinder_min; i <= newData.cylinder_max; i += cstep) {
						cstep = i < this.goodsDetail.step && this.goodsDetail.step != 0 ? 0.5 : 0.25
						cylinder_mirrorArray.push((i.toFixed(2) > 0 ? "+" : "") + i.toFixed(2))
					}
					//轴位
					let axisArray = []
					for (let i = 0; i <= 180; i += 1) {
						axisArray.push(i)
					}
					//ADD
					let sumArray = []
					if (this.goodsDetail.a_dd == 1) {
						sumArray = this.goodsDetail.a_dd_data
					} else {
						for (let i = 0; i <= 180; i += 1) {
							sumArray.push(i)
						}
					}
					//通道
					let objArray = []
					if (this.goodsDetail.passage == 1) {
						objArray = this.goodsDetail.passage_data
					} else {
						for (let i = 0; i <= 180; i += 1) {
							objArray.push(i)
						}
					}
					this.photometric = newData.photometric
					this.ball_mirrorArray = ball_mirrorArray
					this.cylinder_mirrorArray = cylinder_mirrorArray
					this.ball_mirrorArray_bk = ball_mirrorArray
					this.cylinder_mirrorArray_bk = cylinder_mirrorArray
					this.myValue = []
					this.getClickGoodsAdd();
					// //console.log("柱镜", this.cylinder_mirrorArray_bk, "球镜", this.ball_mirrorArray_bk);
					this.axisArray = axisArray
					this.sumArray = sumArray
					this.objArray = objArray
				}
			},
			setBalllist() {
				let max = 0,
					min = 0,
					arr = []
				const {ball_min,ball_max} = this.goodsDetail
				if(this.mirrolist.length==0){
					arr=this.getList(ball_min,ball_max)
				}
				this.mirrolist.forEach(v => {
					min = v.ball_min
					max = v.ball_max
					let a = this.getList(min, max)
					arr = arr.concat(a)
				})
				arr = Array.from(new Set(arr))
				arr.sort((a, b) => {
					return a - b
				})
				
				this.newballlist = arr
				// //console.log(this.newballlist, "球镜数据")
			},
			getSumPrice() {
				let sum = 0
				// //console.log(this.myValue,
				// 	"this.goodsDetail.goods_spec_formatthis.goodsDetail.goods_spec_formatthis.goodsDetail.goods_spec_format"
				// )
				this.myValue.forEach(e => {
					sum += parseFloat(e.discount_price || 0) * e.product_num
				})
				this.sumPrice = sum
			},
			nomove(e) {
				// //console.log(e);
			},
			/**
			 * @param {min}
			 * @param {max}    
			 */
			getList(min = 0, max = 0) {
				let arr = [],
					s = 0.25
				for (let i = min; i <= max; i += s) {
					s = i < this.goodsDetail.step && this.goodsDetail.step != 0 ? 0.5 : 0.25
					//console.log(`min=${min},max=${max},s=${s},step=${this.goodsDetail.step},i=${i}`)
					let num = i > 0 ? '+' + i : i < 0 ? i : i
					num = parseFloat(num).toFixed(2)
					if (num > 0) num = `+${num}`
					arr.push(num)
				}
				if (arr.length == 0) arr.push(0)
				return arr;
			},
			setMyPopup(i, name, list, dataitem = null, index) {
				
				this.doIndex(i)
				dataitem = this.myValue[this.nowIndex]
				let item = dataitem
				if (this.goodsDetail.luminosity_status == 1) {

					// if (name == 'ball') item.cylinder_mirrorIndex = -1
					if (!(item.ball_mirrorIndex >= 0) && name === 'cylinder') return this.$util.showToast({
						title: '先选球镜'
					})

					if (name == 'ball') list = this.newballlist

					if (name == 'cylinder' && dataitem != null) {
						let val = dataitem.ball_mirrorArray[dataitem.ball_mirrorIndex],
							max = 0,
							min = 0,
							arr = []
						this.mirrolist.forEach(v => {
							min = v.cylinder_min
							max = v.cylinder_max
							
							if (parseFloat(val) >= parseFloat(v.ball_min) && parseFloat(val) <= parseFloat(v
									.ball_max)) {
								// dataitem.discount_price = v.discount_price
								item.sku_id = v.sku_id
								let a = this.getList(min, max)
								arr = arr.concat(a)
							}
						})
						arr = Array.from(new Set(arr))
						arr.sort((a, b) => {
							return a - b
						})
						dataitem.cylinder_mirrorArray = arr
						console.log(arr,name,"0----------")
						this.$refs[name].list = arr
						this.$refs[name].open()
						return
					}
				}
						console.log(list,name,"1----------")
				this.$refs[name].list = list
				if(name=='ball'&&this.$refs[name].list.length===0)this.$refs[name].list=this.ball_mirrorArray_bk
				if(name=='cylinder'&&this.$refs[name].list.length===0)this.$refs[name].list=this.cylinder_mirrorArray_bk
				
				this.$refs[name].open()

			},
			doIndex(index) {
				// //切换数组操作下标
				// if(this.nowIndex != index){
				// 	//修改球镜柱镜
				// 	this.ball_mirrorArray = this.ball_mirrorArray_bk;
				// 	this.cylinder_mirrorArray = this.cylinder_mirrorArray_bk;
				// }

				this.nowIndex = index;
			},
			async getWholesale(newData) {
				var res = await this.$api.sendRequest({
					url: '/api/member/detail',
					async: false
				});
				
				if (res.code == 0) {
					////console.log(res)
					this.is_wholesaler = res.is_wholesaler
				}
				////console.log(this.goodsDetail.luminosity_status, "状态码新产品", this.goodsDetail);
				// if (this.goodsDetail.luminosity_status != 1) return
				////console.log("开始插球镜柱镜");
				var mirro = await this.$api.sendRequest({
					url: '/api/goodssku/luminosity_sku',
					data: {
						goods_id: this.goodsDetail.goods_id
					},
					async: false
				})
				delete mirro.timestamp
				this.mirrolist = Object.values(mirro)
				// if (this.mirrolist.length == 0) uni.showToast({
				// 	title: "没有拉取到柱镜信息,让管理员检查goodssku/luminosity_sku接口",
				// 	icon: "none"
				// })
				this.setBalllist()
			},
			reset() {
				this.ball_mirrorIndex = null
				this.cylinder_mirrorIndex = null
				this.ball_mirrorArray = this.ball_mirrorArray_bk
				this.cylinder_mirrorArray = this.cylinder_mirrorArray_bk
			},
			bindPickerChangeF(e) {
				////console.log('picker发送选择改变，左右眼球携带值为', e.target.value)
				this.myValue[this.nowIndex].leftIndex = e.target.value
				//this.myValue[this.lastIndex].leftIndex = e.target.value
				//修改球镜选择范围
				//const cylinderValue = this.leftArray[this.leftIndex]
				//if(this.ball_mirrorIndex!=null) return;//判定首次选择才删改互补镜值，以免造成重复删改导致数据缺失		
			},
			//球镜的值+柱镜的值 <= this.photometric
			bindPickerChangeA(e) {
				let item = this.myValue[this.nowIndex]
				////console.log('picker发送选择改变，球镜携带值为', e.target.value)
				item.ball_mirrorIndex = e.target.value
				if (this.goodsDetail.luminosity_status == 1) {
					item.ball_mirrorArray = this.newballlist
					item.cylinder_mirrorIndex = null
					this.getSumPrice()
					return
				}

				//this.myValue[this.lastIndex].ball_mirrorIndex = e.target.value
				//修改柱镜选择范围
				const ballValue = item.ball_mirrorArray[item.ball_mirrorIndex]
				//if(this.cylinder_mirrorIndex!=null) return;//判定首次选择才删改互补镜值，以免造成重复删改导致数据缺失。
				let arr = []
				////console.log(this.ball_mirrorArray)
				this.cylinder_mirrorArray_bk.forEach(num => {
					if (parseFloat(num) + parseFloat(ballValue) >= parseFloat(this.photometric)) {
						arr.push(num)
					}
				})
				//如果有值的时候
				////console.log(item.cylinder_mirrorIndex, "cylinder")
				if (item.cylinder_mirrorIndex != null) {
					//目前的值
					////console.log('目前的值' + item.cylinder_mirrorIndex)
					const cylinderValue = item.cylinder_mirrorArray[item.cylinder_mirrorIndex]
					var cylinderindex = arr.indexOf(cylinderValue)
					////console.log(cylinderindex)
					if (cylinderindex == -1) {
						item.cylinder_mirrorIndex = 0
					} else {
						item.cylinder_mirrorIndex = cylinderindex
					}
				}
				item.cylinder_mirrorArray = arr;
				////console.log(item.cylinder_mirrorArray); //柱镜
			},
			bindPickerChangeB(e) {
				let item = this.myValue[this.nowIndex]
				const val = item.cylinder_mirrorArray[e.target.value]
				const v1 = this.myValue[this.nowIndex].ball_mirrorArray[this.myValue[this.nowIndex].ball_mirrorIndex]
				////console.log(this.goodsDetail.luminosity_status, "this.goodsDetail.luminosity_status")
				if (this.goodsDetail.luminosity_status == 1) {
					this.mirrolist.forEach((ei, index) => {
						if (ei.cylinder_max >= val && val >= ei.cylinder_min && v1 >= ei.ball_min && v1 <= ei
							.ball_max) {
							item.discount_price = ei.discount_price
							item.sku_id = ei.sku_id
						}
						////console.log(ei, ei.cylinder_max >= val && val >= ei.cylinder_min,
							// '222222222222222222222222222222222222222', ei.cylinder_max >= val && val >= ei
							// .cylinder_min ? "1" : "2", ei.sku_id)
					})
					this.myValue[this.nowIndex].cylinder_mirrorIndex = e.target.value
					item.cylinder_mirrorIndex = e.target.value
					this.getSumPrice()
					return
				}
				//console.log('picker发送选择改变，柱镜携带值为', e.target.value)
				this.myValue[this.nowIndex].cylinder_mirrorIndex = e.target.value
				item.cylinder_mirrorIndex = e.target.value
				//修改球镜选择范围
				const cylinderValue = item.cylinder_mirrorArray[item.cylinder_mirrorIndex]
				//if(this.ball_mirrorIndex!=null) return;//判定首次选择才删改互补镜值，以免造成重复删改导致数据缺失。
				let arr = []
				this.ball_mirrorArray_bk.forEach(num => { //-10
					////console.log(num)
					if (parseFloat(num) + parseFloat(cylinderValue) >= parseFloat(this.photometric)) {
						arr.push(num)
					}
				})
				if (item.ball_mirrorIndex) {
					//目前的值
					const ballValue = item.ball_mirrorArray[item.ball_mirrorIndex]
					var ballindex = arr.indexOf(ballValue)
					if (ballindex == -1) {
						item.ball_mirrorIndex = 0
					} else {
						item.ball_mirrorIndex = ballindex
					}
				}
				item.ball_mirrorArray = arr
				//console.log(item.ball_mirrorIndex)
				//console.log(item.ball_mirroCrArray); //球镜
			},
			bindPickerChangeC(e) {
				//console.log('picker发送选择改变，轴位携带值为', e.target.value)
				this.myValue[this.nowIndex].axisIndex = e.target.value
				this.axisIndex = e.target.value
			},
			bindPickerChangeD(e) {
				//console.log('picker发送选择改变，ADD携带值为', e.target.value)
				this.myValue[this.nowIndex].sumIndex = e.target.value
				this.sumIndex = e.target.value
			},
			bindPickerChangeE(e) {
				//console.log('picker发送选择改变，通道携带值为', e.target.value)
				this.myValue[this.nowIndex].objIndex = e.target.value
				this.objIndex = e.target.value
			},
			show(type, callback) {
				this.callback = callback;
				this.$refs.skuPopup.open(callback);
				this.type = type;
				this.skuId = this.goodsDetail.sku_id;
				this.preview = this.goodsDetail.preview || 0;
				if (this.type == 'pintuan' && this.goodsDetail.pintuan_id) {
					this.limitNumber = this.goodsDetail.buy_num;
				} else if (this.type == 'groupbuy' && this.goodsDetail.groupbuy_id) {
					this.number = this.goodsDetail.buy_num;
					this.minNumber = this.goodsDetail.buy_num;
				} else if (this.type == 'bargain' && this.goodsDetail.bargain_id) {
					this.number = 1;
					this.minNumber = 1;
				} else if ((this.type == 'wholesale_join_cart' || this.type == 'wholesale_buy_now') && this.goodsDetail
					.wholesale_sku_id) {
					this.number = this.goodsDetail.min_num;
					this.minNumber = this.goodsDetail.min_num;
				}
				if (this.type == 'join_cart') {
					this.getCartData();
					this.$forceUpdate();
				}
			},
			hide() {
				this.$refs.skuPopup.close();
			},
			change(skuId, spec_id) {
				//console.log("选择膜层", skuId, spec_id, this.goodsDetail)
				if (this.disabled) return;
				this.btnSwitch = false;
				this.skuId = skuId;
				// 清空选择
				for (var i = 0; i < this.goodsDetail.goods_spec_format.length; i++) {
					var sku = this.goodsDetail.goods_spec_format[i];
					for (var j = 0; j < sku.value.length; j++) {
						// 排除当前点击的规格值
						if (spec_id == this.goodsDetail.goods_spec_format[i].value[j].spec_id) {
							this.goodsDetail.goods_spec_format[i].value[j].selected = false;
						}
					}
				}
				if (this.goodsDetail.pintuan_id) {
					this.getPintuanGoodsSkuInfo();
				} else if (this.goodsDetail.groupbuy_id) {
					this.getGroupbuyGoodsSkuInfo();
				} else if (this.goodsDetail.bargain_id) {
					this.getBargainGoodsSkuInfo();
				} else if (this.goodsDetail.seckill_id) {
					this.getSeckillGoodsSkuInfo();
				} else if (this.goodsDetail.topic_id) {
					this.getTopicsGoodsSkuInfo();
				} else if (this.goodsDetail.exchange_id) {
					this.getPointGoodsSkuInfo();
				} else if (this.goodsDetail.wholesale_sku_id) {
					this.getWholeSaleGoodsSkuInfo();
				} else {
					this.getGoodsSkuInfo();
				}
			},
			// 获取普通商品详情
			getGoodsSkuInfo() {
				let _this = this
				let res = this.$api.sendRequest({
					url: '/api/goodssku/info',
					data: {
						sku_id: this.skuId
					},
					success: res => {
						console.log(res.sku_images,"goodsSkuDetail.sku_images图片");
						let data = res.data;
						if (data != null) {
							data.unit = data.unit || '件';
							let goodsSkuDetail = data;
							// this.dealData();

							if (goodsSkuDetail.sku_spec_format) goodsSkuDetail.sku_spec_format = JSON.parse(
								data.sku_spec_format);
							// 限时折扣
							if (goodsSkuDetail.promotion_type == 1) {
								goodsSkuDetail.discountTimeMachine = _this.$util.countDown(
									goodsSkuDetail.end_time - res.timestamp);
							}

							if (goodsSkuDetail.promotion_type == 1 && goodsSkuDetail
								.discountTimeMachine) {
								goodsSkuDetail.show_price = goodsSkuDetail.discount_price;
							} else {
								goodsSkuDetail.show_price = goodsSkuDetail.price;
							}
							if (goodsSkuDetail.goods_spec_format) goodsSkuDetail.goods_spec_format = JSON
								.parse(goodsSkuDetail.goods_spec_format)
							_this.btnSwitch = false;
							_this.$emit('refresh', goodsSkuDetail);
						} else {
							this.$util.redirectTo('/pages/index/index/index', {}, 'reLaunch');
						}
					},
					fail: res => {
						this.btnSwitch = false;
						this.$util.redirectTo('/pages/index/index/index', {}, 'reLaunch');
					}
				});
			},
			// 获取拼团商品详情
			getPintuanGoodsSkuInfo() {
				let res = this.$api.sendRequest({
					url: '/pintuan/api/goods/info',
					data: {
						sku_id: this.skuId,
						pintuan_id: this.goodsDetail.pintuan_id
					},
					success: res => {
						let data = res.data;
						if (data != null) {
							if (data.type == 'again') {
								this.skuId = data.sku_id;
								this.getPintuanGoodsSkuInfo();
								return;
							}
							data.unit = data.unit || '件';
							this.goodsSkuDetail = data;
							this.dealData();
							//每次请求重新渲染sku
							// this.goodsDetail.goods_spec_format = this.goodsSkuDetail.sku_spec_format;

							this.goodsSkuDetail.show_price = this.goodsDetail.group_id == 0 ? this
								.goodsSkuDetail.promotion_price : this.goodsSkuDetail.pintuan_price;
							this.goodsSkuDetail.save_price =
								this.goodsSkuDetail.price - this.goodsSkuDetail.show_price > 0 ? (this
									.goodsSkuDetail.price - this.goodsSkuDetail.show_price).toFixed(2) : 0;

							//拼团倒计时
							if (this.goodsSkuDetail.end_time - res.timestamp > 0) {
								this.goodsSkuDetail.timeMachine = this.$util.countDown(this.goodsSkuDetail
									.end_time - res.timestamp);
							} else {
								this.$util.showToast({
									title: '活动已结束'
								});
								setTimeout(() => {
									this.$util.redirectTo(
										'/pages/goods/detail/detail', {
											sku_id: this.goodsSkuDetail.sku_id
										},
										'redirectTo'
									);
								}, 1000);
							}
							this.btnSwitch = false;
							this.$emit('refresh', this.goodsSkuDetail);
						} else {
							this.$util.redirectTo('/pages/index/index/index', {}, 'reLaunch');
						}
					},
					fail: res => {
						this.btnSwitch = false;
						this.$util.redirectTo('/pages/index/index/index', {}, 'reLaunch');
					}
				});
			},
			// 获取砍价商品详情
			getBargainGoodsSkuInfo() {
				let res = this.$api.sendRequest({
					url: '/bargain/api/goods/info',
					data: {
						sku_id: this.skuId,
						bargain_id: this.goodsDetail.bargain_id
					},
					success: res => {
						let data = res.data;
						if (data != null) {
							if (data.type == 'again') {
								this.skuId = data.sku_id;
								this.getBargainGoodsSkuInfo();
								return;
							}
							data.unit = data.unit || '件';
							this.goodsSkuDetail = data;
							this.dealData();
							this.goodsSkuDetail.show_price = this.goodsDetail.bargain_id > 0 ? this
								.goodsSkuDetail.floor_price : this.goodsSkuDetail.price;
							this.goodsSkuDetail.stock = this.goodsSkuDetail.bargain_stock; //砍价库存
							this.goodsSkuDetail.save_price =
								this.goodsSkuDetail.price - this.goodsSkuDetail.show_price > 0 ? (this
									.goodsSkuDetail.price - this.goodsSkuDetail.show_price).toFixed(2) : 0;

							//团购倒计时
							if (this.goodsSkuDetail.end_time - res.timestamp > 0) {
								this.goodsSkuDetail.timeMachine = this.$util.countDown(this.goodsSkuDetail
									.end_time - res.timestamp);
							} else {
								this.$util.showToast({
									title: '活动已结束'
								});
								setTimeout(() => {
									this.$util.redirectTo(
										'/pages/goods/detail/detail', {
											sku_id: this.goodsSkuDetail.sku_id
										},
										'redirectTo'
									);
								}, 1000);
							}
							this.btnSwitch = false;
							this.$emit('refresh', this.goodsSkuDetail);
						} else {
							this.$util.redirectTo('/pages/index/index/index', {}, 'reLaunch');
						}
					},
					fail: res => {
						this.btnSwitch = false;
						this.$util.redirectTo('/pages/index/index/index', {}, 'reLaunch');
					}
				});
			},
			// 获取专题商品详情
			getTopicsGoodsSkuInfo() {
				let res = this.$api.sendRequest({
					url: '/topic/api/topicgoods/info',
					data: {
						sku_id: this.skuId,
						topic_id: this.goodsDetail.topic_id
					},
					success: res => {
						let data = res.data;
						if (data != null) {
							if (data.type == 'again') {
								this.skuId = data.sku_id;
								this.getTopicsGoodsSkuInfo();
								return;
							}
							data.unit = data.unit || '件';
							this.goodsSkuDetail = data.goods_sku_detail;
							this.dealData();
							this.goodsSkuDetail.show_price = this.goodsDetail.topic_id > 0 ? this
								.goodsSkuDetail.topic_price : this.goodsSkuDetail.price;
							this.goodsSkuDetail.save_price =
								this.goodsSkuDetail.price - this.goodsSkuDetail.show_price > 0 ? (this
									.goodsSkuDetail.price - this.goodsSkuDetail.show_price).toFixed(2) : 0;

							//团购倒计时
							if (this.goodsSkuDetail.end_time - res.timestamp > 0) {
								this.goodsSkuDetail.timeMachine = this.$util.countDown(this.goodsSkuDetail
									.end_time - res.timestamp);
							} else {
								this.$util.showToast({
									title: '活动已结束'
								});
								setTimeout(() => {
									this.$util.redirectTo(
										'/pages/goods/detail/detail', {
											sku_id: this.goodsSkuDetail.sku_id
										},
										'redirectTo'
									);
								}, 1000);
							}
							this.btnSwitch = false;
							this.$emit('refresh', this.goodsSkuDetail);
						} else {
							this.$util.redirectTo('/pages/index/index/index', {}, 'reLaunch');
						}
					},
					fail: res => {
						this.btnSwitch = false;
						this.$util.redirectTo('/pages/index/index/index', {}, 'reLaunch');
					}
				});
			},
			// 获取团购商品详情
			getGroupbuyGoodsSkuInfo() {
				let res = this.$api.sendRequest({
					url: '/groupbuy/api/goods/info',
					data: {
						sku_id: this.skuId,
						groupbuy_id: this.goodsDetail.groupbuy_id
					},
					success: res => {
						let data = res.data;
						if (data != null) {
							data.unit = data.unit || '件';
							this.goodsSkuDetail = data;
							this.dealData();
							this.goodsSkuDetail.show_price = this.goodsDetail.groupbuy_price;
							this.goodsSkuDetail.save_price =
								this.goodsSkuDetail.price - this.goodsSkuDetail.show_price > 0 ? (this
									.goodsSkuDetail.price - this.goodsSkuDetail.show_price).toFixed(2) : 0;

							//团购倒计时
							if (this.goodsSkuDetail.end_time - res.timestamp > 0) {
								this.goodsSkuDetail.timeMachine = this.$util.countDown(this.goodsSkuDetail
									.end_time - res.timestamp);
							} else {
								this.$util.showToast({
									title: '活动已结束'
								});
								setTimeout(() => {
									this.$util.redirectTo(
										'/pages/goods/detail/detail', {
											sku_id: this.goodsSkuDetail.sku_id
										},
										'redirectTo'
									);
								}, 1000);
							}

							this.btnSwitch = false;
							this.$emit('refresh', this.goodsSkuDetail);
						} else {
							this.$util.redirectTo('/pages/index/index/index', {}, 'reLaunch');
						}
					},
					fail: res => {
						this.btnSwitch = false;
						this.$util.redirectTo('/pages/index/index/index', {}, 'reLaunch');
					}
				});
			},
			// 获取秒杀商品详情
			getSeckillGoodsSkuInfo() {
				let res = this.$api.sendRequest({
					url: '/seckill/api/seckillgoods/info',
					data: {
						sku_id: this.skuId,
						seckill_id: this.goodsDetail.seckill_id
					},
					success: res => {
						let data = res.data;
						if (data != null) {
							if (data.type == 'again') {
								this.skuId = data.sku_id;
								this.getSeckillGoodsSkuInfo();
								return;
							}
							data.unit = data.unit || '件';
							this.goodsSkuDetail = data.goods_sku_detail;
							this.dealData();

							this.goodsSkuDetail.show_price = this.goodsSkuDetail.seckill_price;

							this.goodsSkuDetail.price - this.goodsSkuDetail.show_price > 0 ? (this
								.goodsSkuDetail.price - this.goodsSkuDetail.show_price).toFixed(2) : 0;

							//秒杀倒计时
							if (this.goodsSkuDetail.end_time - res.timestamp > 0) {
								this.goodsSkuDetail.timeMachine = this.$util.countDown(this.goodsSkuDetail
									.end_time - res.timestamp);
							} else {
								this.$util.showToast({
									title: '活动已结束'
								});
								setTimeout(() => {
									this.$util.redirectTo(
										'/pages/goods/detail/detail', {
											sku_id: this.goodsSkuDetail.sku_id
										},
										'redirectTo'
									);
								}, 1000);
							}

							this.btnSwitch = false;
							this.$emit('refresh', this.goodsSkuDetail);
						} else {
							this.$util.redirectTo('/pages/index/index/index', {}, 'reLaunch');
						}
					},
					fail: res => {
						this.btnSwitch = false;
						this.$util.redirectTo('/pages/index/index/index', {}, 'reLaunch');
					}
				});
			},
			// 获取积分商城详情
			getPointGoodsSkuInfo() {
				let res = this.$api.sendRequest({
					url: '/pointexchange/api/goods/info',
					data: {
						sku_id: this.skuId,
						exchange_id: this.goodsDetail.exchange_id
					},
					success: res => {
						let data = res.data;
						if (data != null) {
							if (data.type == 'again') {
								this.skuId = data.sku_id;
								this.getPointGoodsSkuInfo();
								return;
							}
							data.unit = data.unit || '件';
							this.goodsSkuDetail = data;
							this.dealData();
							this.btnSwitch = false;
							this.$emit('refresh', this.goodsSkuDetail);
						} else {
							this.$util.redirectTo('/promotionpages/point/list/list', {}, 'redirectTo');
						}
					},
					fail: res => {
						this.btnSwitch = false;
						this.$util.redirectTo('/pages/index/index/index', {}, 'reLaunch');
					}
				});
			},
			// 获取批发商品详情
			getWholeSaleGoodsSkuInfo() {
				let res = this.$api.sendRequest({
					url: '/wholesale/api/goods/info',
					data: {
						sku_id: this.skuId
					},
					success: res => {
						let data = res.data;
						if (data != null) {
							data.unit = data.unit || '件';
							this.goodsSkuDetail = data;
							this.number = this.goodsSkuDetail.min_num;
							this.minNumber = this.goodsSkuDetail.min_num;
							this.dealData();
							this.btnSwitch = false;
							this.$emit('refresh', this.goodsSkuDetail);
						} else {
							this.$util.redirectTo('/pages/index/index/index', {}, 'reLaunch');
						}
					},
					fail: res => {
						this.btnSwitch = false;
						this.$util.redirectTo('/pages/index/index/index', {}, 'reLaunch');
					}
				});
			},
			//点击增加单笔数量
			getClickGoodsAdd(obj, eyeIndex) {
				//console.log(this.cylinder_mirrorArray_bk, "sssssssssss");
				this.myValue.push({
					objIndex: undefined,
					product_num: 1,
					sumIndex: undefined,
					axisIndex: undefined,
					cylinder_mirrorIndex: undefined,
					ball_mirrorIndex: undefined,
					leftIndex: eyeIndex || 0,
					axisValue: 0,
					cylinder_mirrorArray: this.cylinder_mirrorArray_bk,
					ball_mirrorArray: this.ball_mirrorArray_bk
				})
				//console.log(this.photometric, "myvalue", this.myValue);
				// //console.log(this.myValue)
				// let gets = this.myValue.slice()
				this.scrollto = `addbtn${this.myValue.length}`
				//console.log(this.scrollto, "到哪去")
			},
			//删除选中订单
			removeTap(index) {
				this.myValue.splice(index, 1)
			},
			dealData(item = this.goodsSkuDetail) {
				if (item.sku_images) item.sku_images = item.sku_images.split(',');
				else item.sku_images = [];

				// 多规格时合并主图
				if (item.goods_spec_format && item.goods_image) {
					item.goods_image = item.goods_image.split(',');
					item.sku_images = item.sku_images.concat(item.goods_image);
				}

				// 当前商品SKU规格
				if (item.sku_spec_format) item.sku_spec_format = JSON.parse(item.sku_spec_format);

				// 商品属性
				if (item.goods_attr_format) {
					let goods_attr_format = JSON.parse(item.goods_attr_format);
					item.goods_attr_format = this.$util.unique(goods_attr_format, 'attr_id');
					for (var i = 0; i < item.goods_attr_format.length; i++) {
						for (var j = 0; j < goods_attr_format.length; j++) {
							if (item.goods_attr_format[i].attr_id == goods_attr_format[j].attr_id && item
								.goods_attr_format[i].attr_value_id != goods_attr_format[j].attr_value_id) {
								item.goods_attr_format[i].attr_value_name += '、' + goods_attr_format[j].attr_value_name;
							}
						}
					}
				}

				// 商品SKU格式
				if (item.goods_spec_format) item.goods_spec_format = JSON.parse(item.goods_spec_format);

				// 商品详情
				// if (item.goods_content && this.type != 'point') item.goods_content = htmlParser(item.goods_content);

				// if (item.content && this.type == 'point') item.content = htmlParser(item.content);

				this.goodsDetail.unit = this.goodsDetail.unit || '件';

				this.keyInput(true);

				this.$langConfig.title(item.goods_name);
			},
			changeNum(tag) {
				if (this.goodsDetail.stock == 0) return;

				var stock = this.goodsDetail.stock;
				var min = 1;

				if (this.maxBuy > 0 && this.maxBuy < stock) stock = this.maxBuy;

				if (this.maxBuy > 0 && this.goodsDetail.purchased_num > 0) {
					stock = this.maxBuy - this.goodsDetail.purchased_num;
				}

				if (this.minBuy > 1) {
					min = this.minBuy;
				}

				if (this.type == 'pintuan' && this.goodsDetail.pintuan_id) {
					//限购数量大于库存总数取库存
					if (this.goodsDetail.buy_num > this.goodsDetail.stock) {
						stock = this.goodsDetail.stock;
					} else {
						stock = this.goodsDetail.buy_num;
					}
					// min = stock;
				} else if (this.type == 'groupbuy' && this.goodsDetail.groupbuy_id) {
					//限购数量大于库存总数取库存
					if (this.goodsDetail.buy_num > this.goodsDetail.stock) {
						stock = this.goodsDetail.stock;
					} else {
						stock = this.goodsDetail.stock;
					}
					//最低购买数量
					min = this.goodsDetail.buy_num;
				} else if (this.type == 'seckill' && this.goodsDetail.seckill_id && this.goodsDetail.num > 0 && this
					.goodsDetail.num < this.goodsDetail.stock) {
					//限购数量小于库存总数取库存
					stock = this.goodsDetail.num;
				} else if (this.type == 'bargain' && this.goodsDetail.bargain_id) {
					stock = 1;
				}
				if (tag == '+') {
					// 加
					if (this.number < stock) {
						this.number++;
					} else {
						if (this.maxBuy > 0 && this.goodsDetail.purchased_num > 0) {
							this.$util.showToast({
								title: '该商品每人限购' + this.maxBuy + this.goodsDetail.unit + '，您已购买了' + this
									.goodsDetail.purchased_num + this.goodsDetail.unit
							});
							return;
						}
						if (this.maxBuy > 0 && this.cartNumber > 0 && this.cartNumber + this.number > this.maxBuy) {
							var diff = this.maxBuy - this.cartNumber;
							if (diff > 0) {
								this.$util.showToast({
									title: '该商品每人限购' +
										this.maxBuy +
										this.goodsDetail.unit +
										'，购物车已加入了' +
										this.cartNumber +
										this.goodsDetail.unit +
										'，还能购买' +
										diff +
										this.goodsDetail.unit
								});
							} else {
								this.$util.showToast({
									title: '该商品每人限购' + this.maxBuy + this.goodsDetail.unit
								});
							}
							return;
						}
						if (this.type == 'seckill' && this.goodsDetail.seckill_id && this.goodsDetail.num > 0) {
							this.$util.showToast({
								title: '该商品每人限购' + this.goodsDetail.num + this.goodsDetail.unit
							});
							return;
						}
					}
				} else if (tag == '-') {
					// 减
					if (this.number > min) {
						this.number -= 1;
					} else {
						if (this.minBuy > 1) {
							this.$util.showToast({
								title: '该商品' + this.minBuy + this.goodsDetail.unit + '起售'
							});
						}
						return;
					}
				}
				if (this.number > this.limitNumber && this.limitNumber) {
					this.number = this.limitNumber;
				}
			},
			blur() {
				if (!this.number) {
					this.number = 0;
				}
				if (this.number > this.limitNumber && this.limitNumber) {
					this.number = this.limitNumber;
				}
				if (this.number < this.minNumber && this.minNumber) {
					this.number = this.minNumber;
				}

				if (this.maxBuy > 0 && this.number > this.maxBuy) {
					this.number = this.maxBuy;
				}

				if (this.maxBuy > 0 && this.goodsDetail.purchased_num > 0) {
					let maxBuy = this.maxBuy - this.goodsDetail.purchased_num;
					if (this.number > maxBuy) this.number = maxBuy;
				}
				if (this.number < this.minBuy && this.minBuy > 0) {
					this.number = this.minBuy;
				}

				let newNumber = parseInt(this.number);
				this.number = 0;
				setTimeout(() => {
					this.number = newNumber;
				}, 0);
			},
			//输入数量
			keyInput(flag, callback) {
				setTimeout(() => {
					var stock = this.goodsDetail.stock;

					// 库存为0
					if (this.goodsDetail.stock == 0) {
						this.number = 0;
						return;
					}

					// 防止空
					if (flag && this.number.length == 0) this.number = 1;

					// 防止输入0和负数、非法输入
					if (flag && (this.number <= 0 || isNaN(this.number))) this.number = 1;

					if (this.type == 'pintuan' && this.goodsDetail.pintuan_id && this.number > this.goodsDetail
						.buy_num) {
						//限购数量大于库存总数取库存
						this.number = this.goodsDetail.buy_num;
					} else if (this.type == 'groupbuy' && this.goodsDetail.groupbuy_id && this.number < this
						.goodsDetail.buy_num) {
						//最低购买数量
						this.number = this.goodsDetail.buy_num;
					} else if (this.type == 'seckill' && this.goodsDetail.seckill_id && this.goodsDetail.max_buy >
						0 && this.number > this.goodsDetail.max_buy) {
						//限购数量大于库存总数取库存
						this.number = this.goodsDetail.max_buy;
					} else if (this.type == 'bargain' && this.goodsDetail.bargain_id) {
						// 砍价
						this.number = 1;
					} else if (this.number > stock) {
						this.number = stock;
					}
					// 商品起售数
					if (this.minBuy > 1 && this.number < this.minBuy) {
						this.number = this.minBuy;
					}

					if (flag) this.number = parseInt(this.number);
					if (callback) callback();
				}, 0);
			},

			//提交
			confirm() {
				//console.log(this.number);
				// 删除待付款物流方式缓存
				uni.removeStorageSync('delivery');
				if (this.preview) {
					this.$util.showToast({
						title: '预览商品无法购买'
					});
					return;
				}
				//判断
				// this.photometric =photometric
				// ball_mirrorIndex:null,
				// cylinder_mirrorIndex:null,
				// axisIndex:null,
				// ball_mirrorArray:[],
				// cylinder_mirrorArray:[],
				// axisArray:[],

				//检查数据是否填完
				if (!this.checkParam()) return;

				if (!uni.getStorageSync('token')) {
					this.$refs.login.open();
					return;
				}

				//纠正数量
				this.keyInput(true, () => {
					if (this.goodsDetail.stock == 0) {
						this.$util.showToast({
							title: '商品已售罄'
						});
						return;
					}

					if (this.number.length == 0 || this.number == 0) {
						this.$util.showToast({
							title: '购买数量不能为0'
						});
						return;
					}

					if (this.number > this.goodsDetail.stock) {
						this.$util.showToast({
							title: '库存不足'
						});
						return;
					}

					if (this.maxBuy > 0 && this.goodsDetail.purchased_num > 0 && this.number > this.maxBuy - this
						.goodsDetail.purchased_num) {
						this.$util.showToast({
							title: '该商品每人限购' + this.maxBuy + this.goodsDetail.unit + '，您已购买了' + this
								.goodsDetail.purchased_num + this.goodsDetail.unit
						});
						return;
					}
					if (this.maxBuy > 0 && this.cartNumber > 0 && this.cartNumber + this.number > this.maxBuy) {
						var diff = this.maxBuy - this.cartNumber;
						if (diff > 0) {
							this.$util.showToast({
								title: '该商品每人限购' +
									this.maxBuy +
									this.goodsDetail.unit +
									'，购物车已加入了' +
									this.cartNumber +
									this.goodsDetail.unit +
									'，还能购买' +
									diff +
									this.goodsDetail.unit
							});
						} else {
							this.$util.showToast({
								title: '该商品每人限购' + this.maxBuy + this.goodsDetail.unit
							});
						}
						return;
					}

					if (this.btnSwitch) return;
					this.btnSwitch = true;

					let leftIndex = 0;
					let cylinder_mirrorIndex = 0;
					let ball_mirrorIndex = 0;
					let axisIndex = 0;
					let objIndex = 0;
					let sumIndex = 0;
					let number = 0;
					let sku_id = 0;
					this.myValue.forEach(item => {
						leftIndex = item.leftIndex;
						cylinder_mirrorIndex = item.cylinder_mirrorIndex;
						ball_mirrorIndex = item.ball_mirrorIndex;
						axisIndex = item.axisIndex;
						objIndex = item.objIndex;
						sumIndex = item.sumIndex;
						number = item.product_num;
						sku_id = item.sku_id
					})
					let LensParam = []
					this.myValue.map(e => {
						LensParam.push({
							eye: e.leftIndex == 0 ? '右眼' : '左眼', //左右眼
							passage: this.objArray[e.objIndex], //通道
							a_dd: this.sumArray[e.sumIndex], //ADD
							num: e.product_num, //数量
							ball_mirror: e.ball_mirrorArray[e.ball_mirrorIndex], //球镜
							cylinder_mirror: e.cylinder_mirrorArray[e.cylinder_mirrorIndex], //柱镜
							axis: e.axisValue, // e.axisIndex, //轴位
							sku_id: e.sku_id
						})
					})
					//console.log(LensParam, "111")
					// 加入购物车
					if (this.type == 'join_cart') this.postJoinCart(LensParam)
					//立即购买
					if (this.type == 'buy_now') this.postBuyNow();
					//秒杀
					if (this.type == 'seckill') this.postSeckill();
					// 拼团
					if (this.type == 'pintuan') this.postPintuan();
					// 专题
					if (this.type == 'topic') this.postTopic();
					// 团购
					if (this.type == 'groupbuy') this.postGroupBuy();
					// 预售
					if (this.type == 'presale') this.postPresale();
					// 砍价
					if (this.type == 'bargain') this.postBargain();
					// 积分兑换
					if (this.type == 'point') this.postPoint();
					// 批发·加入进货单
					if (this.type == 'wholesale_join_cart') this.postPfJoin();
					// 批发·立即购买
					if (this.type == 'wholesale_buy_now') this.postPfBuy();
					//清空状态
					this.myValue = []
					this.getClickGoodsAdd()
					console.error(this.goodsDetail.rimless,"rimless")
					if (this.goodsDetail.rimless == 1) {
						this.rimless = this.goodsDetail.rimless
						this.getClickGoodsAdd({}, 1)
					}
				});
			},
			/** 
			 * @return true 通过 false不通过
			 * */
			checkParam() {
				let ispost = true;

				if (this.goodsDetail.photometric != 0 || this.goodsDetail.luminosity_status == 1) { //this.photometric != 0
					this.myValue.forEach(e => {
						if (e.ball_mirrorArray[e.ball_mirrorIndex] == undefined) {
							this.$util.showToast({
								title: '请选择球镜'
							});
							ispost = false;
							return;
						}
						if (e.cylinder_mirrorArray[e.cylinder_mirrorIndex] == undefined) {
							this.$util.showToast({
								title: '请选择柱镜'
							});
							ispost = false;
							return;
						}

						// 						if ( !e.axisValue) {//e.axisIndex == undefined ||
						// 							this.$util.showToast({
						// 								title: '请输入轴位'
						// 							});
						// 							ispost = false;
						// 							return;
						// 						}
						if (e.sumIndex == undefined && this.goodsDetail.a_dd == 1) {
							this.$util.showToast({
								title: '请选择ADD'
							});
							ispost = false;
							return;
						}
						if (e.objIndex == undefined && this.goodsDetail.passage == 1) {
							this.$util.showToast({
								title: '请选择通道'
							});
							ispost = false;
							return;
						}
						this.quantity += e.product_num;
						if (this.goodsDetail.stock <= e.product_num) {
							this.$util.showToast({
								title: '请不要大于库存数量'
							});
							ispost = false;
							return;
						}

					})
				}
				return ispost
			},
			postJoinCart(LensParam) {
				let number = this.number;
				let param = this.goodsDetail.photometric != 0 || this.goodsDetail.luminosity_status == 1 ? { //镜片
					sku_id: this.skuId,
					site_id: this.goodsDetail.site_id,
					list: JSON.stringify(LensParam),
					buyer_message: this.buyer_message,
					rimless: this.rimless
				} : { //默认参数,未做修改
					site_id: this.goodsDetail.site_id,
					sku_id: this.skuId,
					ball_mirror: this.ball_mirrorIndex != null ? this.ball_mirrorArray[this
						.ball_mirrorIndex] : 0,
					cylinder_mirror: this.cylinder_mirrorIndex != null ? this
						.cylinder_mirrorArray[this.cylinder_mirrorIndex] : 0,
					axis: this.axisValue, //手动输入的值
					//选择 this.axisIndex != null ? this.axisArray[this.axisIndex] : 0,
					//add和通道数据
					a_dd_data: this.sumIndex != null ? this.sumIndex[this.sumIndex] : 0,
					passage_data: this.objIndex != null ? this.objIndex[this.objIndex] : 0,
					num: number,
					buyer_message: this.buyer_message,
					rimless: this.rimless
				}
				//console.log(param, "parammmmmmmmmmm");
				this.$api.sendRequest({
					url: '/api/cart/add',
					data: param,
					success: res => {
						//console.log(res);
						var data = res.data;
						if (data > 0) {
							this.$util.showToast({
								title: '加入购物车成功'
							});
							if (this.callback) this.callback();
						}
						this.$refs.skuPopup.close();
						this.btnSwitch = false;
					},
					fail: res => {
						this.$refs.skuPopup.close();
						this.btnSwitch = false;
					}
				});
			},
			postBuyNow() {
				var data = {
					sku_id: this.skuId,
					num: this.number,
					ball_mirror: this.ball_mirrorIndex != null ? this.ball_mirrorArray[this
						.ball_mirrorIndex] : 0,
					cylinder_mirror: this.cylinder_mirrorIndex != null ? this.cylinder_mirrorArray[this
						.cylinder_mirrorIndex] : 0,
					axis: this.axisIndex != null ? this.axisArray[this.axisIndex] : 0,
					// add和通道数据
					// a_dd_data:this.AarrySum != null ? this.AarrySum[this.AarrySum] : 0,
					// passage_data:this.AarryObj != null ? this.AarryObj[this.AarryObj] : 0,

				};

				uni.setStorage({
					key: 'orderCreateData',
					data: data,
					success: () => {
						this.$util.redirectTo('/pages/order/payment/payment');
						this.btnSwitch = false;
					}
				});
			},
			postSeckill() {

				// 秒杀
				var data = {
					seckill_id: this.goodsDetail.seckill_id,
					num: this.number,
					sku_id: this.skuId
				};

				uni.setStorage({
					key: 'seckillOrderCreateData',
					data: data,
					success: () => {
						this.$util.redirectTo('/promotionpages/seckill/payment/payment');
						this.btnSwitch = false;
					}
				});
			},
			postPintuan() {

				// 拼团
				var data = {
					pintuan_goods_id: this.goodsDetail.id,
					group_id: this.goodsDetail.group_id,
					num: this.number
				};

				uni.setStorage({
					key: 'pintuanOrderCreateData',
					data: data,
					success: () => {
						this.$util.redirectTo('/promotionpages/pintuan/payment/payment');
						this.btnSwitch = false;
					}
				});
			},
			postTopic() {
				// 专题
				var data = {
					topic_goods_id: this.goodsDetail.id,
					num: this.number
				};

				uni.setStorage({
					key: 'topicOrderCreateData',
					data: data,
					success: () => {
						this.$util.redirectTo('/promotionpages/topics/payment/payment');
						this.btnSwitch = false;
					}
				});
			},
			postGroupBuy() {
				// 团购
				var data = {
					groupbuy_id: this.goodsDetail.groupbuy_id,
					sku_id: this.skuId,
					num: this.number
				};

				uni.setStorage({
					key: 'groupbuyOrderCreateData',
					data: data,
					success: () => {
						this.$util.redirectTo('/promotionpages/groupbuy/payment/payment');
						this.btnSwitch = false;
					}
				});
			},
			postPresale() {
				// 预售
				var data = {
					presale_id: this.goodsDetail.presale_id,
					sku_id: this.skuId,
					num: this.number
				};
				uni.setStorage({
					key: 'presaleOrderCreateData',
					data: data,
					success: () => {
						this.$util.redirectTo('/promotionpages/presale/payment/payment');
						this.btnSwitch = false;
					}
				});
			},
			postBargain() {
				// 砍价
				this.$api.sendRequest({
					url: '/bargain/api/bargain/launch',
					data: {
						id: this.goodsDetail.id
					},
					success: res => {
						this.btnSwitch = false;
						if (res.code == 0) {
							this.$util.redirectTo(
								'/promotionpages/bargain/launch/launch', {
									id: res.data
								},
								'redirectTo'
							);
						} else {
							this.$util.showToast({
								title: res.message
							});
						}
					}
				});
			},
			postPoint() {

				// 积分兑换
				var data = {
					id: this.goodsDetail.exchange_id,
					sku_id: this.skuId,
					num: this.number
				};
				uni.setStorage({
					key: 'exchangeOrderCreateData',
					data: data,
					success: () => {
						this.$util.redirectTo('/promotionpages/point/payment/payment');
						this.btnSwitch = false;
					}
				});
			},
			postPfJoin() {
				// 批发·加入进货单
				this.$api.sendRequest({
					url: '/wholesale/api/cart/add',
					data: {
						site_id: this.goodsDetail.site_id,
						sku_id: this.skuId,
						num: this.number
					},
					success: res => {
						var data = res.data;
						if (data > 0) {
							this.$util.showToast({
								title: '加入进货单成功'
							});
							if (this.callback) this.callback();
							this.$store.dispatch('getWholeSaleNumber');
						}
						this.$refs.skuPopup.close();
						this.btnSwitch = false;
					},
					fail: res => {
						this.$refs.skuPopup.close();
						this.btnSwitch = false;
					}
				});
			},
			postPfBuy() {
				// 批发·立即购买
				var data = {
					sku_id: this.skuId,
					num: this.number
				};

				uni.setStorage({
					key: 'wholesaleOrderCreateData',
					data: data,
					success: () => {
						this.$util.redirectTo('/promotionpages/wholesale/payment/payment');
						this.btnSwitch = false;
					}
				});
			},
			closeSkuPopup() {
				this.$refs.skuPopup.close();
			},
			imgError() {
				this.goodsDetail.sku_image = this.$util.getDefaultImage().default_goods_img;
				this.$forceUpdate();
			},
			valueImgError(index, index_value) {
				this.goodsDetail.goods_spec_format[index].value[index_value].image = this.$util.getDefaultImage()
					.default_goods_img;
				this.$forceUpdate();
			},
			// 获取购物车数据
			getCartData() {
				this.$api.sendRequest({
					url: '/api/cart/goodslists',
					success: res => {
						if (res.code >= 0) {
							var data = res.data;
							for (var i = 0; i < data.length; i++) {
								if (data[i].sku_id == this.goodsDetail.sku_id) {
									this.cartNumber = data[i].num;
									break;
								}
							}
						}
					}
				});
			}
		}
	};
</script>
<style lang="scss">
	.remove-sku {
		// text-align: center;
		font-weight: bold;
		border: 1px solid;
		display: inline-block;
		height: 30rpx;
		width: 30rpx;
		margin: 10rpx;
		line-height: 30rpx;
		text-align: center;
		border-radius: 100rpx;
		align-self: flex-end;
		color: #ff0000;
	}

	.remarkBox {
		border: 1rpx solid #DBDBDB;
		width: calc(100% - 20rpx);
		height: 150rpx;
		margin-top: 20rpx;
		padding: 10rpx 10rpx;
	}

	.wrap-transverse {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.sku-layer .sku-info {
		height: 100vh;
		position: relative;
		z-index: 999;
	}

	.sku-layer .sku-info .header {
		padding: 30rpx 30rpx 20rpx 210rpx;
		position: relative;
		border-bottom: 1px solid $color-line;
		min-height: 170rpx;
	}

	.sku-layer .sku-info .header .img-wrap {
		width: 160rpx;
		height: 160rpx;
		position: absolute;
		left: 20rpx;
		border-radius: $border-radius;
		overflow: hidden;
		padding: 2rpx;
		background-color: #fff;
		line-height: 208rpx;
	}

	.sku-layer .sku-info .header .img-wrap image {
		width: 100%;
		height: 100%;
	}

	.sku-layer .sku-info .main {
		font-size: 12px;
		line-height: 40rpx;
		padding-right: 40rpx;

		.price-wrap {
			font-weight: bold;

			.unit {
				margin-right: 4rpx;
			}
		}

		.stock {
			font-size: $font-size-tag;
			color: $color-tip;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
			height: 70rpx;
			overflow: hidden;
		}

		.wholesale-item {
			.price-wrap {
				line-height: 1.4;
			}

			.stock {
				height: 40rpx;
			}

			.start-number {
				font-weight: normal;
			}
		}
	}

	.sku-layer .sku-info .main .price {
		word-wrap: break-word;
	}

	.sku-layer .sku-info .main .sku-name {
		display: -webkit-box;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
		overflow: hidden;
		height: 42rpx;

		.spec-value {
			&::after {
				content: '/';
			}

			&:last-child {
				&::after {
					content: '';
				}
			}
		}
	}

	.sku-layer .sku-info .sku-close {
		position: absolute;
		top: 20rpx;
		right: 40rpx;
		width: 40rpx;
		height: 80rpx;
		font-size: 40rpx;
	}

	.sku-layer .body-item {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: 0 30rpx;
		height: calc(100% - 450rpx);
		box-sizing: border-box;
	}

	.sku-layer .body-item .wrap {
		height: calc(100% - 116rpx);
	}

	.sku-layer .body-item .sku-list-wrap {

		// display: flex;
		// flex-direction: column;
		// justify-content: center;
		.item {
			// flex-grow: 0;
		}
	}

	.sku-layer .body-item .sku-list-wre {
		background: #FFE4B5;
		text-align: center;
		/* line-height: inherit; */
		height: 50rpx;
		line-height: 50rpx;
		border-radius: 8rpx;
		font-size: 25rpx;
		color: #999999;
		border: 1px dashed #999999;
	}

	.sku-layer .body-item .sku-list-wrap-cz {
		color: #1786f8 !important;
	}

	.sku-layer .body-item .sku-list-wrap .title {
		padding: 20rpx 0;
		display: block;
	}

	.sku-layer .body-item .sku-list-wrap .items {
		position: relative;
		display: inline-block;
		border: 1px solid $color-line;
		padding: 4rpx 30rpx;
		border-radius: 40rpx;
		margin: 0 20rpx 20rpx 0;
		background-color: #fff;
		font-size: $font-size-tag;
	}

	.sku-layer .body-item .sku-list-wrap .items.disabled {
		border: 1px dashed;
	}

	.sku-layer .body-item .sku-list-wrap .items image {
		height: 44rpx;
		width: 44rpx;
		border-radius: $border-radius;
		margin-right: 10rpx;
		display: inline-block;
		vertical-align: middle;
	}

	.sku-layer .body-item .number-wrap .number-line {
		padding: 20rpx 0;
		line-height: 72rpx;
	}

	.sku-layer .body-item .number-wrap .title {
		font-weight: 400;
	}

	.sku-layer .body-item .number-wrap .limit-txt {}

	.sku-layer .body-item .number-wrap .number {
		display: flex;
		height: 72rpx;
		border-radius: 6rpx;
		float: right;
	}

	.sku-layer .body-item .number-wrap .number button {
		display: inline-block;
		line-height: 64rpx;
		height: 68rpx;
		width: 60rpx;
		font-size: 48rpx;
		box-sizing: content-box;
		border: 1px solid $color-line;
		padding: 0;
		margin: 0;
		border-radius: 0;
		background-color: #fff !important;
	}

	.sku-layer .body-item .number-wrap .number button.decrease {
		border-right-width: 0 !important;
	}

	.sku-layer .body-item .number-wrap .number button.increase {
		border-left: 0 !important;
	}

	.sku-layer .body-item .number-wrap .number button:after {
		border-radius: 0;
		border: none;
	}

	.sku-layer .body-item .number-wrap .number input {
		display: inline-block;
		line-height: 64rpx;
		height: 68rpx;
		width: 72rpx;
		text-align: center;
		font-weight: 700;
		border: 1px solid;
		margin: 0;
		padding: 0;
		vertical-align: top;
		background-color: $color-bg !important;
	}

	.sku-layer .footer {
		height: 100rpx;
		width: 100%;
		position: absolute;
		bottom: 80rpx;
		color: #fff;
		z-index: 1;
		display: flex;
		justify-content: center;
		align-items: flex-start;

		button {
			width: 100%;
			height: 80rpx;
		}
	}

	.wrap-sph {
		padding-bottom: 20rpx;
		width: 100%;
		display: flex;
		justify-content: space-around;
		font-size: 14rpx;
	}

	.picker-item {
		border: 2rpx solid #007aff;
		padding: 0 6rpx;
		border-radius: 6rpx;
		text-align: center;
		width: 65rpx;
		height: 45rpx;
		text-align: center;
		line-height: 45rpx;
	}

	.add-sku {
		width: 200rpx;
		height: 48rpx;
		line-height: 48rpx;
		background-color: #007aff;
		border-radius: 50rpx;
		text-align: center;
		color: #FFFFFF;
		margin: 3% auto;

	}
</style>
<style scoped>
	/deep/ .reward-popup .uni-popup__wrapper-box {
		background: none !important;
		max-width: unset !important;
		max-height: unset !important;
	}
</style>
