export default {
    addCart(context, payload) {
        // 1.查看是否添加过
        const oldProduct = context.state.cartList.find(item => item.iid === payload.iid)

        // 2.+1或者新添加
        if (oldProduct) {
            // oldProduct.count += 1
            context.commit('addCounter', oldProduct)
        } else {
            payload.count = 1
                // product.checked = true
                // context.state.cartList.push(payload)
            context.commit('addToCart', payload)
        }
    }
}