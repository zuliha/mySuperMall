<template>
  <div id="home">
  <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
  <tab-control :titles="['流行', '新款', '精选']"
              @tabClick="tabClick"
              ref="tabControl1"
              class="tab-control"
              v-show="isTabFixed"/>
  <scroll class="content"
        ref="scroll" 
        :probe-type="3" 
        @scroll="contentScroll"
        :pull-up-load="true"
        @pullingUp="loadMore">
  <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"/>
  <recommend-view :recommends="recommends"/>
  <feature-view/>
  <tab-control :titles="['流行', '新款', '精选']"
                   @tabClick="tabClick"
                   ref="tabControl2"/>
  <goods-list :goods="showGoods"/>
  </scroll>
  <back-top @click.native="backClick" v-show="isShowBackTop"/>
  </div>
</template>

<script>
import NavBar from 'components/common/navbar/NavBar'
import TabControl from 'components/content/tabControl/TabControl'
import GoodsList from 'components/content/goods/GoodsList'
import Scroll from 'components/common/scroll/Scroll'
import BackTop from 'components/content/backTop/BackTop'

import {getHomeMultidata,getHomeGoods} from 'network/home'
import {debounce} from 'common/utils'



import HomeSwiper from './childComps/HomeSwiper'
import RecommendView from './childComps/RecommendView'
import FeatureView from './childComps/FeatureView'


export default {
    name:'Home',
    components:{
        NavBar,
        HomeSwiper,
        RecommendView,
        FeatureView,
        TabControl,
        GoodsList,
        Scroll,
        BackTop,
    },
    data(){
        return {
            // result:null
            banners:[],
            recommends:[],
            goods:{
                'pop':{page:0,list:[]},
                'new':{page:0,list:[]},
                'sell':{page:0,list:[]},

            },
             currentType: 'pop',
             isShowBackTop:false,
             taboffsetTop:0,
             isTabFixed:false,
             saveY:0,    //保存离开时的位置
            //  itemImgListener:null
        }
    },
    computed: {
      showGoods() {
        return this.goods[this.currentType].list
      }
    },
    activated(){
      this.$refs.scroll.scrollTo(0,this.saveY,0)
      this.$refs.scroll.refresh()
    },
    deactivated(){
      this.saveY=this.$refs.scroll. getScrollY;
    },
    created(){
        // 1.请求多个数据
        this. getHomeMultidata()

        // 2.请求商品数据
      this.getHomeGoods('pop')
      this.getHomeGoods('new')
      this.getHomeGoods('sell')

      
    },
    mounted(){
      // 1.监听item中图片加载完成
      const refresh=debounce(this.$refs.scroll.refresh)
      this.$bus.$on('itemImageLoad',()=>{
        refresh()
      })

      
    },
    methods:{
        /**
         * 事件监听相关的方法
         */
       
      tabClick(index) {
        switch (index) {
          case 0:
            this.currentType = 'pop'
            break
          case 1:
            this.currentType = 'new'
            break
          case 2:
            this.currentType = 'sell'
            break
        }
        this.$refs.tabControl1.currentIndex=index;
        this.$refs.tabControl2.currentIndex=index;

      },
      backClick(){

        // $refs.scroll拿的只是Scroll组件,所以还需在拿到data中的scroll
        this.$refs.scroll.scroll.scrollTo(0,0);
        // this.$refs.scroll.message;
      },
      contentScroll(position){
          // console.log(position);
          // 1.判断回到顶部的隐藏或显示
          this.isShowBackTop=(-position.y)>1000
          //  2.判断tabControl是否吸顶(position:fixed)
          this.isTabFixed=(-position.y)>this.taboffsetTop
      },
      loadMore(){
        this.getHomeGoods(this.currentType)
      },
      swiperImageLoad(){
      // 所有的组件都有一个属性：$el,用于获取组件中的元素
      // console.log(this.$refs.tabControl.$el.offsetTop);
      this.taboffsetTop=this.$refs.tabControl2.$el.offsetTop
      },

        /**
         * 网络请求相关的方法
         */
        getHomeMultidata(){
        getHomeMultidata().then(res=>{
            // console.log(res);
            // this.result=res;
            this.banners=res.data.banner.list;
            this.recommends=res.data.recommend.list;
        })
    },
    getHomeGoods(type){
         const page = this.goods[type].page + 1
        getHomeGoods(type,1).then(res=>{

          this.goods[type].list.push(...res.data.list)
          this.goods[type].page += 1

          // 完成上拉加载更多
          this.$refs.scroll.finishPullUp()
        })
    }
    }
}
</script>

<style scoped>
  #home {
    /*padding-top: 44px;*/
    height: 100vh;
    position: relative;
  }
  .home-nav {
    background-color: var(--color-tint);
    color: #fff;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 9;
  }
  .tab-control {
    position: sticky;
    top: 44px;
    z-index: 9;
  }
  .content {
    overflow: hidden;
    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }


</style>