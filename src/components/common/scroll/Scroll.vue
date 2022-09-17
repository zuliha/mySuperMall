<template>
    <div class="wrapper" ref="wrapper">
        <div class="content">
            <slot></slot>
        </div>
    </div>
</template>

<script>
import BScroll from 'better-scroll'
export default {
    name :'Scroll',
    props: {
      probeType: {
        type: Number,
        default: 0
      },
      pullUPLoad:{
        type:Boolean,
        default:false
      }

    },

    data(){
       return{
            scroll:null,
            // message:'哈哈哈哈' 
       }
    },
    mounted(){
        // 1.创建BScroll对象
        this.scroll = new BScroll(this.$refs.wrapper, {
        click: true,
        probeType: this.probeType,
        pullUPLoad:this.pullUPLoad
        })
        
        // 2.监听滚动的位置
      this.scroll.on('scroll', (position) => {
        // console.log(position);
        this.$emit('scroll', position)
      })


      // 3.监听上拉事件
      this.scroll.on('pullingUp',()=>{
        //  console.log(上拉加载更多);
        this.$emit('pullingUp')
      })
    },
    methods:{
      refresh() {
        this.scroll && this.scroll.refresh && this.scroll.refresh()
      },
      finishPullUp() {
		    this.scroll && this.scroll.finishPullUp && this.scroll.finishPullUp()
      },
      scrollTo(x, y, time) {
		    this.scroll && this.scroll.scrollTo && this.scroll.scrollTo(x, y, time)
      },
      getScrollY(){
        return this.scroll?this.scroll.y:0
      }
    }
}
</script>




