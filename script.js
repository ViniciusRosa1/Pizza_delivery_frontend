const c = (e) => document.querySelector(e);
const ca = (e) => document.querySelectorAll(e);

let modalQt = 1;
let cart = [];
let modalKey = 0;

//Listagens  de produtos
pizzaJson.map((item, index) =>{
    let pizzaItem = c('.models .pizza-item').cloneNode(true);
    // preencher as infos em pizzaItem

    pizzaItem.setAttribute('data-key', index);
    
    //adicionar a class active para o primeiro item
    pizzaItem.querySelector(`.pizza-item--img img`).src = item.img; 
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    
    pizzaItem.querySelector('a').addEventListener('click', (e) =>{
        e.preventDefault();
        
        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        modalQt = 1;
        modalKey = key;
        
        c('.pizzaBig img').src = pizzaJson[key].img;
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;

        c('.pizzaInfo--size.selected').classList.remove('selected')
        ca('.pizzaInfo--size').forEach((size, sizeIndex) =>{
            if(sizeIndex == 2){
                size.classList.add('selected');
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
        });

        c('.pizzaInfo--qt').innerHTML = modalQt;

        c('.pizzaWindowArea').style.opacity = 0;
        c('.pizzaWindowArea').style.display = 'flex';
        setTimeout(() => {
        c('.pizzaWindowArea').style.opacity = 1;
        }, 200)

    });
    c('.pizza-area').append(pizzaItem); //innerHtml iria sempre substituir 1 pizza

});

// Events from Modal
function closeModal(){
    c('.pizzaWindowArea').style.opacity=0;
    setTimeout(()=>{
        c('.pizzaWindowArea').style.display = 'none';
    }, 500);
}

ca('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=>{
    item.addEventListener("click", closeModal);
});

c('.pizzaInfo--qtmenos').addEventListener('click', ()=>{
    if(modalQt > 1){
        modalQt--;
        c('.pizzaInfo--qt').innerHTML = modalQt;
    }
} );
c('.pizzaInfo--qtmais').addEventListener('click', ()=>{
    modalQt++;
    c('.pizzaInfo--qt').innerHTML = modalQt;
});
ca('.pizzaInfo--size').forEach((size, sizeIndex) =>{
    size.addEventListener('click', (e)=>{
        c('.pizzaInfo--size.selected').classList.remove('selected')
        size.classList.add('selected');
    });
});

c('.pizzaInfo--addButton').addEventListener( "click" ,()=>{
 
    let size =  parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));
    let identifier = pizzaJson[modalKey].id + '@' + size;
    
    let key = cart.findIndex((item)=>item.identifier == identifier);

    if(key > -1){
        cart[key].qt += modalQt;
    }else{
        cart.push({
            identifier,
            id: pizzaJson[modalKey].id,
            size,
            qt:modalQt
        });
    }
    updateCartPizza();
    closeModal();
});

c('.menu-openner').addEventListener('click', () =>{
    if(cart.length >0 ){
        c('aside').style.left = '0';
    };
});
c('.menu-closer').addEventListener('click', () =>{

    c('aside').style.left = '100vw';

});

function updateCartPizza(){
    c('.menu-openner span').innerHTML = cart.length;

    if(cart.length > 0){
        c('aside').classList.add('show');
        c('.cart').innerHTML = '';

        let subTotal = 0;
        let desconto = 0;
        let total = 0;


        for(let i in cart){
            let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id);
            let cartItem = c('.models .cart--item').cloneNode(true);
            
            subTotal += pizzaItem.price * cart[i].qt;


            let pizzaSize;
            switch(cart[i].size){
                case 0:
                    pizzaSize = 'P'
                    break;
                case 1:
                    pizzaSize = 'M'
                    break;
                case 2:
                    pizzaSize = 'G'
                    break;
            }

            let pizzaName = `${pizzaItem.name} (${pizzaSize})`

            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=> {
                if (cart[i].qt > 1) {
                    cart[i].qt--;
                }else{
                    cart.splice(i, 1);
                }
                updateCartPizza();
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=> {
                cart[i].qt++;
                updateCartPizza();
            });

            c('.cart').append(cartItem);
        };

        desconto = subTotal * 0.1;
        total = subTotal - desconto;

        c('.subtotal span:last-child').innerHTML = `R$ ${subTotal.toFixed(2)}`;
        c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;

    }else{
        c('aside').classList.remove('show');
        c('aside').style.left = '100vw';
    }
};