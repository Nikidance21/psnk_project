let eventBus = new Vue()
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
         <img :src="image" />
      </div>
      <div class="product-info">
            <h1>{{ title }}</h1>
            <p v-if="inStock > 5 ">In Stock</p>
            <p v-else-if="inStock <= 5 && inStock > 0">Almost Sold Out</p>
            <p v-else="Instok"
            :class="{ outStock: !inStock }"
            >Out of Stock</p>
            <p>{{ sale }}</p>
            <info-tabs :shipping="shipping" :details="details"></info-tabs>
            <div class="color-box"
                    v-for="(variant, index) in variants"
                    :key="variant.variantId"
                    :style="{ backgroundColor: variant.variantColor }"
                 @mouseover="updateProduct(index)">
            </div>
            <a :href="link">More products like this</a><br>
            <button v-on:click="addToCart" 
              :disabled="!inStock"
              :class="{ disabledButton: !inStock }"
              >
            Add to cart
            </button>
            <button @click="removeFromCart" 
              >
            Remove from cart
            </button>
   </div>
<div>
            
           </div>
            
         <product-tabs :reviews="reviews"></product-tabs>
       
       </div>
             
 `,
    data() {
        return {
            product: "Socks",
            brand: "Vue Mastery",
            description: 'A pair of warm, fuzzy socks',
            selectedVariant: 0,
            inventory: 20,
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
                    variantQuantity: 10,
                },
                {
                    variantId: 2235,
                    variantColor: 'blue',
                    variantImage: "assets/vmSocks-blue-onWhite.jpg",
                    variantQuantity: 0
                }
            ],
            reviews: []
        }
    },
    methods: {
        addToCart() {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId);
        },
        updateProduct(index) {
            this.selectedVariant = index;
            console.log(index);
        },
        removeFromCart: function () {
            this.$emit('remove-from-cart', this.variants[this.selectedVariant].variantId)
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
            return this.variants[this.selectedVariant].variantQuantity;
        },
        sale() {
            if (this.onSale) {
                return this.brand + ' ' + this.product + ' are on Sale!'
            }
            return this.brand + ' ' + this.product + ' are not on Sale'
        },
        shipping() {
            if (this.premium) {
                return 'Free';
            } else {
                return '$2.99';
            }
        },
    },
    mounted() {
        eventBus.$on('review-submitted', (productReview) => {
            this.reviews.push(productReview);
        });
    },
});
Vue.component('product-review', {
    template: `
	        <form class="review-form" @submit.prevent="onSubmit">
	
	        <p v-if="errors.length">
	        <b>Please Correct the following error(s):</b>
	        <ul>
	            <li v-for="error in errors">{{error}}</li>
	        </ul>
	        </p>
	      <p>
	        <label for="name">Name:</label>
	        <input id="name" v-model="name" placeholder="name">
	      </p>
	
	     <p>
            <label for="review">Review:</label>      
            <textarea id="review" v-model="review"></textarea>
      </p>
	
	      <p>
	        <label for="rating">Rating:</label>
	        <select id="rating" v-model.number="rating">
	          <option>5</option>
	          <option>4</option>
	          <option>3</option>
	          <option>2</option>
	          <option>1</option>
	        </select>
	      </p>
	         <p>Would you recommend this product?</p>
	         <label for="positive">Yes</label>
	         <input  v-model="answer" type="radio" id="positive" name="answer" value="positive">
	         <label for="negative">No</label>
	         <input v-model="answer" type="radio" id="negative" name="answer" value="negative">
	         <br>
	      <p>
	        <input type="submit" value="Submit">
	      </p>
	    </form>
	        `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            answer: null,
            errors: [],
        };
    },
    methods: {
        onSubmit() {
            this.errors = []
            if (this.name && this.review && this.rating) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating
                };
                eventBus.$emit('review-submitted', productReview);
                this.name = null
                this.review = null
                this.rating = null
            } else {
                if (!this.name) {
                    this.errors.push("Name required.")
                }
                if (!this.review) {
                    this.errors.push("Review required.")
                }
                if (!this.rating) {
                    this.errors.push("Rating required.")
                }
            }

        }
    }
})
Vue.component('product-tabs', {
    props: {
        reviews: {
            type: Array,
            required: true
        },
    },
    template: `
     <div>
        <div>   
             <span class="tab"
                   :class="{ activeTab: selectedTab === tab }"
                   v-for="(tab, index) in tabs"
                   :key = "index"
                   @click="selectedTab = tab"
         >{{ tab }}</span>
        </div>
        
       <div v-show="selectedTab === 'Reviews'">
            <p v-if="!reviews.length">There are no reviews yet.</p>
            <ul>
               <li v-for="review in reviews">
               <p>{{ review.name }}</p>
               <p>Rating: {{ review.rating }}</p>
               <p>{{ review.review }}</p>
               </li>
            </ul>
       </div>
        <product-review 
            v-show="selectedTab !== 'Reviews'"
            ></product-review>
    </div>
`,

    data() {
        return {
            tabs: ['Reviews', 'Make a Review'],
            selectedTab: 'Reviews'  // устанавливается с помощью @click
        }
    }
})
Vue.component('info-tabs', {
    props: {
        shipping: {
            required: true
        },
        details: {
            type: Array,
            required: true
        }
    },
    template: `
      <div>
      
        <ul>
          <span class="tab" 
                :class="{ activeTab: selectedTab === tab }"
                v-for="(tab, index) in tabs"
                @click="selectedTab = tab"
                :key="tab"
          >{{ tab }}</span>
        </ul>

        <div v-show="selectedTab === 'Shipping'">
          <p>{{ shipping }}</p>
        </div>

        <div v-show="selectedTab === 'Details'">
          <ul>
            <li v-for="detail in details">{{ detail }}</li>
          </ul>
        </div>
    
      </div>
    `,
    data() {
        return {
            tabs: ['Shipping', 'Details'],
            selectedTab: 'Shipping'
        }
    }
})



let app = new Vue({
    el: '#app',
    data: {
        premium: true,
        cart: []
    },
    methods: {
        updateCart(id) {
            this.cart.push(id)
        },
        removeItem(id) {
            this.cart.pop(id)
                }
            }
})
