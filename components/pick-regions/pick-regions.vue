<template>
	<picker mode="multiSelector" :value="multiIndex" :range="multiArray" @change="handleValueChange" @columnchange="handleColumnChange">
		<slot></slot>
	</picker>
</template>

<script>
	export default {
		props: {
			defaultRegions: {
				type: Array,
				default () {
					return []
				}
			},
			defaultRegionCode: {
				type: String
			},
			defaultRegion: [String, Array]
		},
		data() {
			return {
				areaData: [{
					"code": "11",
					"name": "北京市",
					"childs": [{
						"code": "1101",
						"name": "市辖区",
						"childs": []
					}]
				}],
				cityArr: [{
					"code": "11",
					"name": "北京市",
					"childs": [{
						"code": "1101",
						"name": "市辖区",
						"childs": []
					}]
				}][0].childs,
				districtArr: [{
					"code": "11",
					"name": "北京市",
					"childs": [{
						"code": "1101",
						"name": "市辖区",
						"childs": []
					}]
				}][0].childs[0].childs,
				multiIndex: [0, 0, 0],
				isInitMultiArray: true,
				isArea: false
			}
		},
		watch: {
			defaultRegion: {
				handler(region, oldRegion) {
					if (Array.isArray(region)) {
						// 避免传的是字面量的时候重复触发
						oldRegion = oldRegion || []
						if (region.join('') !== oldRegion.join('')) {
							this.handleDefaultRegion(region)
						}
					} else if (region && region.length == 6) {
						this.handleDefaultRegion(region)
					} else {
						console.warn('defaultRegion非有效格式')
					}
				},
				immediate: true,
			}
		},
		computed: {
			multiArray() {
				this.handleGetAreaData();
				return this.pickedArr.map(arr => arr.map(item => item.name))
			},
			pickedArr() {
				// 进行初始化
				this.handleGetAreaData();
				if (this.isInitMultiArray) {
					return [
						this.areaData,
						this.areaData[0].childs,
						this.areaData[0].childs[0].childs
					]
				}
				return [this.areaData, this.cityArr, this.districtArr];
			}
		},
		methods: {
			handleColumnChange(e) {
				this.isInitMultiArray = false;
				const that = this;
				let col = e.detail.column;
				let row = e.detail.value;
				that.multiIndex[col] = row;
				try {
					switch (col) {
						case 0:
							if (that.areaData[that.multiIndex[0]].childs.length == 0) {
								that.cityArr = that.districtArr = [that.areaData[that.multiIndex[0]]]
								break;
							}
							that.cityArr = that.areaData[that.multiIndex[0]].childs
							that.districtArr = that.areaData[that.multiIndex[0]].childs[that.multiIndex[1]].childs
							break;
						case 1:
							that.districtArr = that.areaData[that.multiIndex[0]].childs[that.multiIndex[1]].childs
							break;
						case 2:
							break;
					}
				} catch (e) {
					that.districtArr = that.areaData[that.multiIndex[0]].childs[0].childs
				}
			},
			handleValueChange(e) {
				// 结构赋值
				let [index0, index1, index2] = e.detail.value;
				let [arr0, arr1, arr2] = this.pickedArr;
				let address = [arr0[index0], arr1[index1], arr2[index2]];
				this.$emit('getRegion', address)
			},
			handleDefaultRegion(region) {
				const isCode = !Array.isArray(region)
				this.isInitMultiArray = false;
				let children = this.areaData
				for (let i = 0; i < 3; i++) {
					for (let j = 0; j < children.length; j++) {
						let condition = isCode ? children[j].code == region.slice(0, (i + 1) * 2) : children[j].name
							.includes(region[i]);
						if (condition) {
							// 匹配成功进行赋值
							children = children[j].childs;
							if (i == 0) {
								this.cityArr = children
							} else if (i == 1) {
								this.districtArr = children
							}
							this.$set(this.multiIndex, i, j)
							break;
						} else {
							// 首次匹配失败就用默认的初始化
							// console.log(i,j,children.length-1);
							if (i == 0 && j == (children.length - 1)) {
								this.isInitMultiArray = true;
							}
						}
					}
				}
			},
			handleGetAreaData() {
				if (this.isArea == false) {
					this.isArea = true;
					this.$api.sendRequest({
						url: '/api/address/getAllArea',
						success: res => {
							this.areaData    = res.data
							this.cityArr     = this.areaData[0].childs;
							this.districtArr = this.areaData[0].childs[0].childs;
						}
					})
				}
			}
		},
	}
</script>