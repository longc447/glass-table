Array.prototype.sum = function() {
  return this.reduce((acc, cur) => {
    if (!cur) cur = 0;
    return acc + parseFloat(cur);
  }, 0);
};

export default {
  data() {
    return {
      sku_id: 0,
      isXp: 0,
      specIndex: [],
      table_list: [],
      thead_list: [],
      active_list: [{
        row_index: 1,
        col_index: 1
      }],
      jpSum: 0,
      noLogin: '',
      tableHeight: 9999, //表格高度
    }
  },
  watch: {
    table_list() {
      this.jpSum = this.table_list.map(e => e.slice(1).sum()).sum();
    }
  },
  async onLoad(e) {
    if (e.isXp) this.isXp = e.isXp;
    if (e.sku_id) this.sku_id = e.sku_id;
    //同步获取商品详情
    await this.getGoodsSkuDetailPost();
    this.noLogin = !uni.getStorageSync('token') && this.preview == 0;

    // uni.getSystemInfo({
    //   success: res => {
    //     this.tableHeight = res.windowHeight * 2 - 300
    //   }
    // })
  },
  methods: {
    getGoodsSkuInfo() { 
     
    },
    changeTableOrder() {
      this.isXp = 1;
    },
    changeChooseIndex(index, value, item) {
      let arr = [...this.specIndex];
      arr[index] = value;
      this.specIndex = arr;
      this.sku_id = item.sku_id;
      // this.$api.sendRequest({
      //   url: '/api/goodssku/info',
      //   data: {
      //     sku_id: item.sku_id
      //   },
      //   success: res => {
      //   }
      // })
    },
    handleClickBuyNow() {
      if (!uni.getStorageSync('token') && this.preview == 0) {
        this.$refs.login.open('/pages/goods/detail/detail?sku_id=' + this.skuId);
        return;
      }
      this.$api.sendRequest({
        url: '/api/cart/add',
        data: this.getParamsList(),
        success: ({
          data
        }) => {
          if (data > 0) {
            this.$util.showToast({
              title: '加入购物车成功'
            });
            this.table_list = this.table_list.map(e => e.map((num, index) => index > 0 ? '' : num))
            console.log(this.table_list, "table_list[row_index][col_index]")
            // console.log(this.table_list)
            // this.table_list = []
            // setTimeout(() => {
            //   this.$util.redirectTo('/pages/index/index/index', {},'tabbar');
            //  },1000)
          }
        },
        fail: res => {}
      });
    },
    getParamsList() {
      const {
        site_id,
        rimless
      } = this.goodsSkuDetail;
      // const sku_list = this.goodsSkuDetail.goods_spec_format?.map((e, i) => e.value[this.specIndex[i]]?.sku_id);
      const list = this.thead_list.slice(1).map((row, row_index) => {
        return this.table_list.filter(col => col[row_index + 1]).map(col => {
          return {
            num: col[row_index + 1],
            ball_mirror: col[0],
            cylinder_mirror: row,
            axis: 0
          }
        })[0];
      }).filter(e => e);
      console.log(list, "skulist")
      return {
        sku_id: this.sku_id, //sku_list?.length>0?sku_list[0]:0,
        site_id,
        rimless,
        list: JSON.stringify(list)
      }
    },
    async getGoodsSkuDetailPost(skuId) {
      this.skuId = skuId || this.skuId;
      const STEP = 0.25;
      const {
        data: {
          goods_sku_detail: {
            ball_max,
            ball_min,
            cylinder_max,
            cylinder_min
          }
        }
      } = await this.$api.sendRequest({
        url: '/api/goodssku/detail',
        async: false,
        data: {
          sku_id: this.skuId
        }
      });
      let table_list = [];
      let thead_list = [''];
      for (let a = ball_min; a <= ball_max; a += STEP) {
        let cy_list = [parseFloat(a).toFixed(2)];
        for (let b = cylinder_max; b >= cylinder_min; b -= STEP) {
          if (a == ball_min) thead_list.push(parseFloat(b).toFixed(2));
          cy_list.push('');
        }
        table_list = [...table_list, cy_list];
      }
      this.thead_list = thead_list;
      this.table_list = table_list;
    },
    handleClickChoose(e) {
      const {
        row_index,
        col_index
      } = e;
      if (col_index == 0) return;
      //       console.log(`=========
      //       col_index:${col_index},
      //       row_index:${row_index},
      //       col:${this.table_list[row_index][0]},
      //       row:${this.thead_list[col_index]}
      // ======`)
      this.active_list = [{
        row_index,
        col_index
      }];
    },
    goodsSkuDetailChange(newData) {
      this.skuId = newData.sku_id;
      if (this.goodsSkuDetail.luminosity_status != 1) this.setBalllist()
      if (newData.photometric != 0 || newData.luminosity_status == 1) { //联合光度
        //球镜范围
        let ball_mirrorArray = [],
          bstep = 0.25
        for (let i = newData.ball_min; i <= newData.ball_max; i += bstep) {
          bstep = i < this.goodsSkuDetail.step && this.goodsSkuDetail.step != 0 ? 0.5 : 0.25
          ball_mirrorArray.push((i.toFixed(2) > 0 ? "+" : "") + i.toFixed(2))
        }
        //柱镜范围
        let cylinder_mirrorArray = [],
          cstep = 0.25
        for (let i = newData.cylinder_min; i <= newData.cylinder_max; i += cstep) {
          cstep = i < this.goodsSkuDetail.step && this.goodsSkuDetail.step != 0 ? 0.5 : 0.25
          cylinder_mirrorArray.push((i.toFixed(2) > 0 ? "+" : "") + i.toFixed(2))
        }
        //轴位
        let axisArray = []
        for (let i = 0; i <= 180; i += 1) {
          axisArray.push(i)
        }
        //ADD
        let sumArray = []
        if (this.goodsSkuDetail.a_dd == 1) {
          sumArray = this.goodsSkuDetail.a_dd_data
        } else {
          for (let i = 0; i <= 180; i += 1) {
            sumArray.push(i)
          }
        }
        //通道
        let objArray = []
        if (this.goodsSkuDetail.passage == 1) {
          objArray = this.goodsSkuDetail.passage_data
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

        this.axisArray = axisArray
        this.sumArray = sumArray
        this.objArray = objArray
      }
    }
  }
}