<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick = 'titleClick' ref="nav"></detail-nav-bar>
    <scroll class="content" ref="scroll" :probe-type = '3' @scroll="contentScroll" >
      <detail-swiper :top-images = 'topImages'></detail-swiper>
      <detail-base-info :goods = 'goods'></detail-base-info>
      <detail-shop-info :shop = 'shop'></detail-shop-info>
      <detail-goods-info :detail-info = 'detailInfo' @imgLoad = 'imgLoad' class="goods-info" ref="goodsInfo"></detail-goods-info>
      <detail-param-info :param-info = 'paramInfo' ref="params"></detail-param-info>
      <detail-comment-info :comment-info = 'commentInfo' ref="comment"></detail-comment-info>
      <goods-list :goods= 'recommends' ref="recommend"></goods-list>
    </scroll>
    <detail-bottom-bar @addCart = 'addCart' @buyNow = 'buyNow' ></detail-bottom-bar>
    <back-top  @click.native = "backClick" v-show = 'isShowBackTop'></back-top>
  </div>
</template>

<script>
  import DetailNavBar from './childComps/DetailNavBar'
  import DetailSwiper from './childComps/DetailSwiper'
  import DetailBaseInfo from './childComps/DetailBaseInfo'
  import DetailShopInfo from './childComps/DetailShopInfo'
  import DetailGoodsInfo from './childComps/DetailGoodsInfo'
  import DetailParamInfo from './childComps/DetailParamInfo'
  import DetailCommentInfo from './childComps/DetailCommentInfo'
  import DetailBottomBar from './childComps/DetailBottomBar'
  import GoodsList from 'components/content/goods/GoodsList'
  import Scroll from 'components/common/scroll/Scroll'
import BackTop from 'components/content/backTop/BackTop'
  
  import {debounce} from 'common/utils'
  import {getDetail, Goods, Shop, GoodsParam, getRecommend} from 'network/detail'
  import { itemListenerMixin,backTopMixin} from 'common/mixin'
  
  export default {
    name: 'Detail',
    components: {
      DetailNavBar,
      DetailSwiper,
      DetailBaseInfo,
      DetailShopInfo,
      Scroll,
      DetailGoodsInfo,
      DetailParamInfo,
      DetailCommentInfo,
      GoodsList,
      DetailBottomBar,
      BackTop
    },
    mixins: [itemListenerMixin,backTopMixin],
    data() {
      return {
        iid: null,
        topImages: [],
        goods: {},
        shop: {},
        detailInfo: {},
        paramInfo: {},
        commentInfo: {},
        recommends: [],
        themeTopYs: [],
        getThemeTopY:null,
        currentIndex: 0,
      }
    },
    //????????????
    methods: {
      // ??????navbar????????????????????????
      titleClick(index) {
        this.$refs.scroll.scrollTo(0,-this.themeTopYs[index], 200)
        // console.log(index);
      },


      // ????????????????????????????????????????????????
      imgLoad() {
        console.log('----------------------------------------');
        this.$refs.scroll.refresh()
        this.getThemeTopY()
      },

      contentScroll(position) {
        // ??????Y???
        const positionY = -position.y
        // ???themeTopY???????????????????????????navbar????????????????????????
        let length = this.themeTopYs.length;
        for(let i =0; i < length-1; i++) {
          if(this.currentIndex !== i && (positionY >=  this.themeTopYs[i] && positionY < this.themeTopYs[i+1])){
            this.currentIndex = i;
            this.$refs.nav.currentIndex = this.currentIndex
          }
        };
        // ??????backtop????????????
        this.isShowBackTop = (- position.y) > this.$refs.goodsInfo.$el.offsetTop;
      },
    //   titleClick(index) {
    //   this.$refs.scroll.ScrollTo(0, -this.themeTopYs[index], 200);
    // },
      // ???????????????
      addCart() {
        // ????????????????????????????????????
        const product = {}
        product.image = this.topImages[0];
        product.title = this.goods.title;
        product.desc = this.goods.desc;
        product.price = this.goods.realPrice;
        product.iid = this.iid;

        // ?????????????????????
        if(product.iid){
        this.$store.dispatch('addCart',product).then(res => {
          this.$toast.show(res, 1500)
        })}else {
          this.$toast.show('???????????????????????????', 1500)
        }
      },
      buyNow() {
        const product = {}
        product.image = this.topImages[0];
        product.title = this.goods.title;
        product.desc = this.goods.desc;
        product.price = this.goods.realPrice;
        product.iid = this.iid;
        // ?????????????????????
        if(product.iid){
        this.$store.dispatch('buyNow',product).then(res => { 
          this.$toast.show(res, 1500)
          this.$router.push('/cart')
        })}else {
          this.$toast.show('???????????????????????????', 1500)
        }
      }
    },
    created() {
      // ???????????????ID
      this.iid = this.$route.params.iid
      // ??????ID??????????????????
      getDetail(this.iid).then(res => {
        // ???????????????????????????
        const data = res.result;
        this.topImages = data.itemInfo.topImages
        // ??????????????????
        this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)
        // ??????????????????
        this.shop = new Shop(data.shopInfo)
        // ????????????????????????
        this.detailInfo = data.detailInfo
        // ??????????????????
        this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)
        // ??????????????????
        if(data.rate.cRate !== 0) {
          this.commentInfo = data.rate.list[0]
        }
      });
      // ??????????????????
      getRecommend().then(res => {
        this.recommends = res.data.list
      });

         //???????????????????????????????????????
        this.getThemeTopY=debounce(()=>{
        this.themeTopYs = []
        this.themeTopYs.push(0);
        this.themeTopYs.push(this.$refs.params.$el.offsetTop-50);
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop-50);
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop-50);
        this.themeTopYs.push(Number.MAX_VALUE);
      },100)
    },
     activated() {
    //??????????????????????????????????????????????????????????????????????????????
    debounce(this.$bus.$on("imgLoad", () => {
      this.$refs.scroll.Refresh();
    }),100)
  },
  deactivated() {
    this.$bus.$off("itemImgLoad", this.itemImgListener);
  },
    // destroyed() {
    //   // ??????????????????????????????????????????
    //   this.$bus.$off('itemImgLoad',this.itemImgListener)
    // }
  }
</script>
<style scoped>
  #detail {
    height: 100vh;
    position: relative;
    z-index: 9;
    background-color: #fff;
  }
  .content {
    height: calc(100% - 100px);
    overflow: hidden;
    position: absolute;
    top:44px;
  }
  .detail-nav {
    position: relative;
    z-index: 9;
    background-color: #fff;
  }
  .goods-info{
    position: relative;
  }
</style>