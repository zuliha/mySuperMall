const getters = {
    // cartList(state) {
    //     return state.cartList
    // },
    // cartCount(state, getters) {
    //     return getters.cartList.length
    // }
    cartLength(state) {
        return state.cartList.length
    },
    cartList(state) {
        return state.cartList
    }
}

export default getters