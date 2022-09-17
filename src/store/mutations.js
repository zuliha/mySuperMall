// mutations唯一的目的就是修改state中状态
// 其中的每个方法完成的事件尽可能的单一一点
const mutations = {
    addCounter(state, payload) {
        payload.count++;
    },
    addToCart(state, payload) {
        state.cartList.push(payload)
    }
}

export default mutations