//varibles
const cartBtn = document.getElementsByClassName('cart-btn')[0]
const closeCartBtn = document.getElementsByClassName('close-cart')[0]
const clearCartBtn = document.getElementsByClassName('clear-cart')[0]
const checkOutBtn = document.getElementsByClassName('check-out')[0]
const cartDOM = document.getElementsByClassName('cart')[0]
const cartOverlay = document.getElementsByClassName('cart-overlay')[0]
const cartItems = document.getElementsByClassName('cart-items')[0]
const cartTotal = document.getElementsByClassName('cart-total')[0]
const cartContent = document.getElementsByClassName('cart-content') [0]
const productsDOM = document.getElementsByClassName("products-center")[0]

// shopping-cart
let cart = []
//buttons
let buttonsDOM = []

//getting products
class Products{
 async getProducts(){
  try {
    let result = await fetch ('https://sheetdb.io/api/v1/bz1fg4lzoe9kl')
    let data = await result.json()
    
    let products = data
    products = products.map(item => {
        const {title} = item
        const {price} = item
        const {id} = item
        const {image} = item
        return {title,price,id,image}
    })
    console.log(products)
    return products
  } catch (error) {
      console.log(error)
  }
}
}
//UI-display products
class UI{
displayProducts(products){
    let result = products.map(product => {
        return `
        <!-- single product -->
    <article class="product">
        <div class="img-container">
            <img src=${product.image} alt="product" class="product-img">
            <button class="bag-btn" data-id=${product.id}>
                <i class="fas fa-shopping-cart"></i>
            add to bag
            </button>
        </div>
        <h3>${product.title}</h3>
        <h4>${product.price}₫</h4>
    </article>
    <!-- end of single product -->
        `
    })
    productsDOM.innerHTML = result.join("")
}
    getBtns (){
        const buttons = [...document.getElementsByClassName('bag-btn')]
        buttonsDOM = buttons
        buttons.forEach(button => {
            let id = button.dataset.id
            let inCart = cart.find(item => item,id === id)
            //if item incart do this
            if(inCart){
                button.innerText = "In Cart"
                button.disabled = true
            }
                button.addEventListener('click' , (event) => {
                    event.target.innerText = "In Cart"
                    event.target.disabled = true
                    // get product from collections (1)
                    let cartItem = {...Storage.getProduct(id), amount :1}
                    // add product to cart
                    cart = [...cart , cartItem]
                    // save cart on storage(2)
                    Storage.saveCart(cart)
                    // change cart value (3)
                    this.setCartValues(cart)
                    // display in-cart items(4)
                    this.addCartItem(cartItem)
                    // show the cart overlay(5)
                    // this.showCartOverlay()
                    console.log(Storage.getCart())
                })
        })
    }
    //(3)
    setCartValues(cart){
        let tempTotal = 0
        let itemsTotal = 0
        cart.map(item => {
            tempTotal += item.price * item.amount
            itemsTotal += item.amount
        })
        cartTotal.innerText = parseFloat(tempTotal.toFixed(2))
        cartItems.innerText = itemsTotal
    }
    //(4)
    addCartItem(item){
        const div = document.createElement('div')
        div.classList.add('cart-item')
        div.innerHTML =`
        <img src="${item.image}" alt="product">
        <!-- item info -->
        <div>
            <h4>${item.title}</h4>
            <h5>${item.price}₫</h5>
            <span class="remove-item" data-id=${item.id}>remove</span>
        </div>
        <!-- end of item info -->
        <!-- item counter -->
        <div>
            <i class="fas fa-chevron-up" data-id=${item.id}></i>
            <p class="item-amount">${item.amount}</p>
            <i class="fas fa-chevron-down" data-id=${item.id}></i>
        </div>`
        cartContent.appendChild(div);
    }
    //(5)
    showCartOverlay(){
        cartOverlay.classList.add('transparentBcg')
        cartDOM.classList.add('showCart')
    }
    setupAPP(){
        cart = Storage.getCart()
        this.setCartValues(cart)
        this.populate(cart)
        cartBtn.addEventListener('click', this.showCartOverlay)
        closeCartBtn.addEventListener('click', this.hideCart)
    }
    populate(cart){
        cart.forEach(item => this.addCartItem(item))
    }
    hideCart(){
        cartOverlay.classList.remove('transparentBcg')
        cartDOM.classList.remove('showCart')
    }
    cartOptions(){
        //clearCart
        clearCartBtn.addEventListener('click', ()=>
        {this.clearCart()
        this.removeKey()})
        //removeSingleItem
        cartContent.addEventListener('click', event =>{
            console.log(cartContent)
            if(event.target.classList.contains('remove-item')){
                let removeItem = event.target
                let id = removeItem.dataset.id
                cartContent.removeChild(removeItem.parentElement.parentElement)
                this.removeItem(id)
            }else if(event.target.classList.contains('fa-chevron-up')){
                let icrAmount = event.target
                let id = icrAmount.dataset.id
                let tempItem = cart.find(item => item.id === id)
                tempItem.amount = tempItem.amount + 1
                Storage.saveCart(cart)
                this.setCartValues(cart)
                icrAmount.nextElementSibling.innerText = tempItem.amount  
            }else if(event.target.classList.contains('fa-chevron-down')){
                let dcrAmount = event.target
                let id = dcrAmount.dataset.id
                let tempItem = cart.find(item => item.id === id)
                tempItem.amount = tempItem.amount - 1
                if(tempItem.amount > 0){
                Storage.saveCart(cart)
                this.setCartValues(cart)
                dcrAmount.previousElementSibling.innerText = tempItem.amount}
                else{
                    cartContent.removeChild(dcrAmount.parentElement.parentElement)
                    this.removeItem
                }
            }
        } )
        //checkout

    }
    removeKey(){
        localStorage.removeItem("cart")
    }
    clearCart(){
        let cartItems = cart.map(item => item.id)
        cartItems.forEach(id => this.removeItem(id))
        console.log(cartContent.children)
        while(cartContent.children.length > 0){
           cartContent.removeChild(cartContent.children[0]) 
        }
        this.hideCart()

    }
    removeItem(id){
        cart = cart.filter(item => item.id != id)
        this.setCartValues(cart)
        Storage.saveCart(cart)
        let button = this.getSingleButton(id)
        button.disabled = false
        button.innerHTML = ` <i class="fas fa-shopping-cart"></i>add to bag`
    }
    getSingleButton(id){
        return buttonsDOM.find(button => button.dataset.id === id)

    }
}
//local strorage
class Storage{
static saveProducts(products){
    localStorage.setItem("products", JSON.stringify(products))
}
        // Method (1)
        static getProduct(id){
        let products = JSON.parse(localStorage.getItem("products"))
        return products.find(products => products.id === id)
    }
        //Method (2)
        static saveCart(cart){
            localStorage.setItem('cart', JSON.stringify(cart))
        }
        // Get item from localStorage
        static getCart(){
        return localStorage.getItem('cart')?JSON.parse(localStorage.getItem('cart')):[]
        }
}
document.addEventListener("DOMContentLoaded", () => {
const ui = new UI();
const products = new Products();
//setupApp
ui.setupAPP()
//get all products
products.getProducts().then(products => {
    ui.displayProducts(products)
    Storage.saveProducts(products)
}).then(() => {
    ui.getBtns()
    ui.cartOptions()
})
})
console.log(Storage.getCart())