Vue.component('product-details', {
    props: {
        details: {
            type: Array,
            required: true
        }
    },
    template: `
    <ul>
      <li v-for="detail in details">{{ detail }}</li>
    </ul>
  `
})
Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    template: `
   <div class="product">

        <div class="product-image">
            <img :src="image" :alt="AltText"/>
        </div>

        <div class="product-info">
            <h1>{{ title }}</h1>
            <p v-if="invertory > 10" :class="{ outOfStock: !inStock }">In Stock</p>
            <p></p>
            <p v-else :class="{ outOfStock: !inStock }">Out of Stock</p>
            <p>{{ sale }}</p>
            <ul>
                <li v-for="detail in details">{{ detail }}</li>
            </ul>
            <ul>
                <li v-for="size in sizes">{{ size }}</li>
            </ul>
            <p>Shipping: {{ shipping }}</p>
            <div
                    class="color-box"
                    v-for="(variant, index) in variants"
                    :key="variant.variantId"
                    :style="{ backgroundColor:variant.variantColor }"
                 @mouseover="updateProduct(index)">



            </div>
            <p v-else-if="invertory <= 10 && invertory > 0">Almost sold out</p>
            <p v-else>="Out of stock</p>
            <a :href="link">More products like this</a><br>
            <div class="cart">
                <p>Cart({{ cart }})</p>
            </div>
            <button
                    v-on:click="addToCart"
                    :disabled="!inStock"
                    :class="{ disabledButton: !inStock }"
            >Add to cart</button>
            <button @click="removeFromCart">Remove from cart</button>

        </div>

    </div>
 `,
    data() {
        return {
            product: "Socks",
            brand: "Vue Mastery",
            description: 'A pair of warm, fuzzy socks',
            selectedVariant: 0,
            altText: "A pair of socks",
            DopText: "More products like this.",
            link: "https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=socks",
            invertory: 15,
            onSale: true,
            details: ['80% cotton', '20% polyester', 'Gender-neutral'],
            sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
            variants: [
                {
                    variantId: 2234,
                    variantColor: 'green',
                    variantImage: "assets/vmSocks-green-onWhite.jpg",
                    variantQuantity: 10
                },
                {
                    variantId: 2235,
                    variantColor: 'blue',
                    variantImage: "assets/vmSocks-blue-onWhite.jpg",
                    variantQuantity: 0
                }
            ],
            cart: 0,
            }
        },
            methods: {
                addToCart() {
                    this.cart += 1
                },
                removeFromCart() {
                    this.cart -= 1
                },
                updateProduct(index) {
                    this.selectedVariant = index
                    console.log(index);
                }
            },
            computed: {
                title() {
                    return this.brand + ' ' + this.product;
                },
                image() {
                    return this.variants[this.selectedVariant].variantImage;
                },
                inStock() {
                    return this.variants[this.selectedVariant].variantQuantity
                },
                sale() {
                    if (this.onSale) {
                        return this.brand + ' ' + this.product + ' are on Sale!'
                    }
                    return this.brand + ' ' + this.product + ' are not on Sale'
                },
                shipping() {
                if (this.premium) {
                    return "Free"
                } else {
                    return 2.99
                }
                }
            }

})
let app = new Vue({
    el: '#app',
    data: {
        premium: true
    }

})


