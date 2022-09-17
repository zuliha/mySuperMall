<template>
    <div class="cart-list">
        <scroll class="content">
            <cart-list-item v-for="item in cartList" :key="item.iid" :product="item"></cart-list-item>
        </scroll>
    </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import Scroll from 'components/common/scroll/Scroll'
  import CartListItem from './CartListItem'
	export default {
		name: "CartList",
    components: {
		  Scroll,
          CartListItem
    },
     computed: {
         ...mapGetters(['cartList'])
     },
    // props: {
	// 	  cartList: {
	// 	    type: Array,
    //     default() {
	// 	      return []
    //     }
    //   }
    // }
	}
</script>

<style scoped>
.cart-list{
    height: calc(100%-44px-49px);
}

.content {
    overflow: hidden;
    position: absolute;
    height: 100vh;
    top: 1px;
    bottom: 49px;
    left: 0;
    right: 0;
  }
</style>