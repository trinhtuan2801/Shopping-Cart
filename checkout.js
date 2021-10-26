const removeItemBtn = document.getElementsByClassName('fa fa-trash')
const checkOutDOM = document.getElementsByClassName('align-middle')[0]
const sanpham = JSON.parse(localStorage.getItem('cart')) //get data from localStorage
const itemContainer = document.getElementsByClassName('align-middle')[0]
const updateCheckOutTotal = document.getElementsByClassName('check-out')[0]
itemQty = document.getElementsByClassName('qty')[0]

let product = sanpham.map(item => {
    return `
    <tr class="cart-row">
        <td>
            <div class="img">
                <a href="#"><img src=${item.image} alt="Image"></a>
                <p>${item.title}</p>
            </div>
        </td>
        <td class="item-price">$${item.price}</td>
        <td>
            <div class="qty">
                <input class="item-quantity" type="number" value="${item.amount}">
            </div>
        </td>
        <td><i class="fa fa-trash fa-2x"></i></td>
    </tr>
    `   
    })
    checkOutDOM.innerHTML= product.join("")
console.log(checkOutDOM.innerHTML)
if(document.readyState == 'loading'){
    document.addEventListener('DOMContentLoaded', ready)
}else {
    ready()
}
    function ready(){
    for(var i=0; i < removeItemBtn.length; i++){
    var button = removeItemBtn[i]
    button.addEventListener('click', removeCartItem)

    let tempTotal = 0
    sanpham.forEach(item =>{tempTotal += item.price * item.amount})    
    console.log(tempTotal)
    document.getElementsByClassName('item-total')[0].innerText = '$'+ tempTotal
    }
}

function removeCartItem(event){
    let buttonClicked = event.target
    buttonClicked.parentElement.parentElement.remove()
    updateCartTotal()
}


 

// function setCartValue(sanpham){
//     let tempTotal = 0
//     sanpham.forEach(item =>{tempTotal = item.price * item.amount})    
//     console.log(tempTotal)
    
//     document.getElementsByClassName('temp-total').innerText ='$'+ tempTotal
// }

function updateCartTotal(){
    
    var cartRows = itemContainer.getElementsByClassName('cart-row')
    var total = 0
    for(var i=0; i < cartRows.length; i++){
        var  cartRow = cartRows[i]
        var priceEle = cartRow.getElementsByClassName('item-price')[0]
        var quantityEle = cartRow.getElementsByClassName('item-quantity')[0]
        var price = parseFloat(priceEle.innerText.replace('$', ''))
        var quantity = quantityEle.value
        total += (price * quantity)
        console.log(total)
    }
    document.getElementsByClassName('item-total')[0].innerText ='$'+ total
}
function updateQty(){
    var itemQty = document.querySelector('.qty')
    var counter = document.getElementsByClassName('item-quantity')[0]
    var count = 0
        itemQty.addEventListener('click', event =>{
        if(event.target.classList.contains('fa-plus')){
            console.log('+')
            count++
            counter.value = count

        }else if (event.target.classList.contains('fa-minus')){
            console.log('-')
            count--
            counter.value = count
        }if(count>0){
            this.updateQty()
        }else{
            removeCartItem()
        }
    })
}
updateQty()
