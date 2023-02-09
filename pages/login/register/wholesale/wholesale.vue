<template>
	<view class="container" v-if="show==0">
		<view class="input-wrap">
			<view>
				<text><text class="dot">*</text>门店名称:</text>
			</view>
			<view>
				<input v-model="store_name" type="text" placeholder="请填写门店名称">
			</view>
		</view>
		<view class="input-wrap">
			<view>
				<text><text class="dot">*</text>所在地区:</text>
			</view>
			<view>
				<pick-regions @getRegion="handleGetRegion">
					<text>{{regionName ? regionName : '请选择所在地区'}}</text>
				</pick-regions>
			</view>
		</view>
		<view class="input-wrap">
			<view>
				<text><text class="dot">*</text>地址:</text>
			</view>
			<view>
				<input v-model="address" type="text" placeholder="请填写地址">
			</view>
		</view>
		<view class="input-wrap">
			<view>
				<text><text class="dot">*</text>联系人:</text>
			</view>
			<view>
				<input v-model="realname" type="text" placeholder="请填写联系人">
			</view>
		</view>
		<view class="input-wrap">
			<view>
				<text>手机号:</text>
			</view>
			<view>
				<input v-model="mobile" type="number" placeholder="请填写手机号">
			</view>
		</view>
		<!-- <view class="input-wrap">
			<view>
				<text><text class="dot">*</text>密码:</text>
			</view>
			<view>
				<input v-model="password" type="password" placeholder="请输入密码">
			</view>
		</view>
		<view class="input-wrap">
			<view>
				<text><text class="dot">*</text>确认密码:</text>
			</view>
			<view>
				<input v-model="cpwd" type="password" placeholder="请确认密码">
			</view>
		</view> -->
		<!-- <view class="input-wrap">
			<view>
				<text class="dot">*</text>
				<text>身份证:</text>
			</view>
			<view @click="uploadFn('license_front')" style="flex:2;">
				<image :src="license_front" style="width: 200rpx;" mode="widthFix" v-if="license_front"></image>
				<image src="http://caihuo2020.oss-cn-beijing.aliyuncs.com/app/front.png" style="width: 200rpx;" mode="widthFix" v-else></image>
			</view>
			<view @click="uploadFn('license_behind')" >
				<image :src="license_behind" style="width: 200rpx;" mode="widthFix" v-if="license_behind"></image>
				<image src="http://caihuo2020.oss-cn-beijing.aliyuncs.com/app/behind.png" style="width: 200rpx;" mode="widthFix" v-else></image>
			</view>
		</view> -->
		<view class="input-wrap">
			<view>
				<text><text class="dot">*</text>营业执照:</text>
			</view>
			<view @click="uploadFn('license')">
				<view class="license" v-if="license">{{license.split('/')[license.split('/').length - 1]}}</view>
				<view v-else class="upload">点击上传</view>
			</view>
		</view>
		<view class="submit" @click="submitFn">注册</view>
	</view>
	<view   class="shenhe" v-else-if="show==1">
		<view class="img">
			<image src="https://dafeiapp.oss-cn-beijing.aliyuncs.com/shenhezhong.png"></image>
			</view>
		<view class="text">商户认证中，耐心等待审核</view>
		<view class="submit" @click="getWholesale">
			点击刷新
		</view>
	</view>
	<view   class="shenhe" v-else-if="show==2">
		<view class="img2">
			<image src="https://dafeiapp.oss-cn-beijing.aliyuncs.com/shenheshibai.png?versionId=CAEQExiBgMD9zbfN3hciIDA0ODY0YWMzODE2ODQzMTc5ZTIyYWVjMTc0YjE5YjZl"></image>
		</view>
		<view class="submit" @click="agin">点击重新申请</view>
	</view>
	<view class="shenhe" v-else-if="show==3">
		<view class="img2">
			<svg t="1646400750999" class="icon" viewBox="0 0 1025 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1244" width="100" height="100"><path d="M511.85139 1024c-69.098781 0-136.100634-13.580107-199.308045-40.241053-61.010629-25.762262-115.730473-62.708142-162.76158-109.739249-47.031107-47.031107-83.877133-101.750951-109.739249-162.76158C13.481424 648.150561 0.00117 581.148708 0.00117 512.049927s13.580107-136.100634 40.241053-199.308045c25.762262-61.010629 62.708142-115.730473 109.739249-162.76158s101.750951-83.877133 162.76158-109.739249C375.750756 13.679961 442.752608 0.099854 511.85139 0.099854c69.098781 0 136.100634 13.580107 199.308044 40.241053 61.010629 25.762262 115.730473 62.708142 162.76158 109.739249 47.031107 47.031107 83.877133 101.750951 109.739249 162.76158 26.660946 63.107557 40.241053 130.209264 40.241053 199.308045s-13.580107 136.100634-40.241053 199.308044c-25.762262 61.010629-62.708142 115.730473-109.739249 162.76158-47.031107 47.031107-101.750951 83.877133-162.76158 109.739249-63.107557 26.461238-130.209264 40.041346-199.308044 40.041346z m0-983.958654c-260.21882 0-472.008581 211.689907-472.008582 472.008581 0 260.21882 211.689907 472.008581 472.008582 472.008581 260.21882 0 472.008581-211.689907 472.008581-472.008581 0-260.21882-211.689907-472.008581-472.008581-472.008581z m-70.796295 676.50902c-5.192394 0-10.484642-0.998537-15.277621-3.19532-8.487567-0.79883-16.475865-4.29371-22.167528-9.885519L235.256558 544.102974l-0.199708-0.199707c-13.779815-13.779815-13.779815-38.044271 0-51.824086 13.779815-13.779815 37.74471-13.779815 51.624379-0.199708l148.881911 140.993467 301.058996-317.634715 0.199707-0.199707c6.490492-6.490492 15.976597-10.284934 25.96197-10.284934s19.371624 3.794442 25.96197 10.284934c13.779815 13.779815 13.779815 37.74471 0.199707 51.624378l-321.728718 339.502682-0.199707 0.199707c-6.889907 6.6902-16.376012 10.18508-25.96197 10.185081z" fill="#727171" p-id="1245"></path></svg>
		</view>
		<view class="text">您已经是批发商了</view>
		<view class="submit" @click="toIndex">返回首页</view>
	</view>
</template>

<script>
	import pickRegions from '@/components/pick-regions/pick-regions.vue'
	export default {
		components:{ pickRegions },
		data() {
			return {
				show:3,
				region:[],
				store_name:null,
				address:null,
				realname:null,
				password:null,
				cpwd:null,
				license:null,
				mobile:null,
				license_front:null,
				license_behind:null
			}
		},
		async onLoad() {
			this.getWholesale()
		},
		computed:{
			regionName(){
				// 转为字符串
				return this.region.map(item=>item.name).join('-')
			}
		},
		methods: {
			toIndex(){
				uni.reLaunch({
					url:"/pages/index/index/index"
				})
			},
			async getWholesale(){
				var res = await this.$api.sendRequest({
					url: '/api/member/detail',
					async: false
				});
				console.log(res)
				if (res.code == 0) {
					this.show = res.is_wholesaler
				}
			},
			msg(title, duration = 1500, mask = false, icon = 'none'){
				if(Boolean(title) === false){
					return;
				}
				uni.showToast({
					title,
					duration,
					mask,
					icon,
					position:'bottom'
				});
			},
			agin(){
				this.show = 0
			},
			submitFn(){
				if(!this.store_name){
					this.msg('请填写门店名称')
					return
				}else if(!this.region.length){
					this.msg('请选择所在地区')
					return
				}else if(!this.address){
					this.msg('请填写地址')
					return
				}else if(!this.realname){
					this.msg('请填写联系人')
					return
				}
				else if(!this.license){
					this.msg('请上传营业执照')
					return
				}
				console.log(this.region)
				this.$api.sendRequest({
					url: '/api/member/addWholesaler',
					data: {
						store_name:this.store_name,
						province:this.region[0].name,
						city:this.region[1].name,
						district:this.region[2].name,
						address:this.address,
						realname:this.realname,
						mobile:this.mobile,
						password:'123456',
						license:this.license,
						front:this.license_behind,
						behind:this.license_front
					},
					success: res => {
						if (res.code > 0) {
							console.log(res)
							this.msg(res.message)
							setTimeout(() => {
								uni.navigateBack()
							}, 1500);
						}else{
							this.msg(res.message)
						}
					}
				});
			},
			uploadFn(e){
				console.log(e)
				this.$util.upload(
					1, {
						path: 'chatimg'
					},
					res => {
						console.log(res)
						//this.license = res[0]
						
						switch(e){
							case "license_front":
								this.license_front = res[0]
								break
							case "license_behind":
								this.license_behind = res[0]
								break
							case "license":
								this.license = res[0]
								break
						}
						
					},
					'/servicer/api/chat/chatimg'
				);
				
			
			},
			handleGetRegion(region){
				this.region = region
			}
		}
	}
</script>

<style>
	.container{
		background-color: #fff;
		min-height: 100vh;
	}
	input{
		font-size: 4vw;
	}
	.input-wrap{
		display: flex;
		align-items: center;
		padding: 4vw 0;
		margin: 0 4vw;
		border-bottom: 1px solid rgb(235,235,235);
	}
	.input-wrap>view:nth-of-type(1){
		flex: 1;
		font-size: 3.5vw;
		color: rgb(51,51,51);
		margin-right: 4vw;
	}
	.input-wrap>view:nth-of-type(2){
		flex: 4;
	}
	.dot{
		color: red;
	}
	.license{
		font-size: 3vw;
		font-style: italic;
		float: left;
		width: 10vw;
	}
	.upload{
		color: #fff;
		background: rgb(231,83,35);
		padding: 1.5vw 3vw;
		border-radius: 1vw;
		font-size: 3.5vw;
		float: left;
	}
	.submit{
		color: #fff;
		background: rgb(231,83,35);
		width: 92vw;
		height: 11vw;
		line-height: 11vw;
		text-align: center;
		font-size: 4vw;
		border-radius: 10vw;
		position: absolute;
		bottom: 8vw;
		left: 0;
		right: 0;
		margin: 0 auto;
	}
	.shenhe{
		padding-top: 200rpx;
		width: 100%;
	}
	.shenhe .img{
		width: 200rpx;
		height: 158rpx;
		margin: auto;
	}
	.shenhe .img image{
		width: 200rpx;
		height: 158rpx;
		
	}
	.shenhe .img2{
		width: 200rpx;
		height: 200rpx;
		margin: auto;
	}
	.shenhe .img2 image{
		width: 200rpx;
		height: 200rpx;
		
	}
	.shenhe .text{
		text-align: center;
		padding-top: 100rpx;
		color: #999999;
	}
</style>
