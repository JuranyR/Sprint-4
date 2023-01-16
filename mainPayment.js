// consultar productos del carrito
const getProdutCar = ()=>{
    const productsCar= JSON.parse(localStorage.getItem('productsCar') || '[]');
    
    ///renderiza productso carro
    const htmlCarItems = document.getElementById('items-car');
    
    htmlCarItems.innerHTML='';
    let valorTotal=0 

    productsCar.forEach(function(cr) {
        const val= parseFloat((cr.newPrice? cr.newPrice:cr.price).replace(/[$]/g,''))
        valorTotal= valorTotal + Math.round(val*(cr.cant?cr.cant:0)*100)/100

        htmlCarItems.innerHTML+= `
            <div class="row add-car-product border-bottom">
                <div class="col-3 align-items-center d-flex">
                <img class="w-100" src="${cr.url}" alt="pdt-1">
                </div>
                <div class="col-5">
                <p class="title-add-product">${cr.productName}</p>
                <p class="price-add-product">${cr.newPrice?cr.newPrice:cr.price}</p>
                </div>
                <div class="col-4 d-flex">
                    <div class="hstack">
                        <button type="button" class="btn" onclick="addProduct(${cr.id},'${cr.category}','item')">
                            <img src="./images/icons/plus.svg" id alt="sum">
                        </button>
                        <span class="me-2"><span id="item${cr.id}">${cr.cant?cr.cant:'0'}</span> ${cr.category==='healthy'?'Kg':'U'}</span>
                        <button type="button" class="btn" onclick="subtract(${cr.id},'${cr.category}','item')">
                            <img src="./images/icons/less.svg" alt="less">
                        </button>
                    </div>
                </div>
            </div>     
        `
    })
    
    //suma valor total cant productos
    const htmlTotalCar= document.getElementById('totalCar')
    htmlTotalCar.innerText='$ '+valorTotal;

}
getProdutCar();
//totalizar produtos
const total= (id,cant) =>{
    let products= JSON.parse(localStorage.getItem('productsCar') || '[]');
    const product=products.filter(i=>i.id==id)[0];
    product.cant=cant;
    const index=products.findIndex(i=>i.id==id);
    if(index>-1){
        products.splice(index,1)
    }
    products.push(product)
    localStorage.setItem('productsCar', JSON.stringify(products))
    let totalProduct=0;
    products.forEach(item=>{
        const price= parseFloat((item.newPrice? item.newPrice:item.price).replace(/[$]/g,''))
        totalProduct=totalProduct +  Math.round(price*(item.cant?item.cant:0)*100)/100
    })
    // elemento html
     const htmlTotalCar= document.getElementById('totalCar')
     htmlTotalCar.innerText='$ '+totalProduct;
}
// aumentar cantidad de producto
const maxValue=5000
const minValue=0
const addProduct = (id,category,idElem) =>{
    const htmlItem= document.getElementById(`${idElem}${id}`)
    const value = parseInt(htmlItem.textContent);
    const step = category==='healthy'?250:1;
    let newValue= value+step;
    if(newValue> maxValue){
        newValue= maxValue;
    }

    htmlItem.innerText= newValue;
    if(idElem=='item'){
        total(id,newValue)
    }
}
// disminuir la cantidad de producto
const subtract = (id,category,idElm) =>{
    const htmlItem= document.getElementById(`${idElm}${id}`)
    const value = parseInt(htmlItem.textContent);
    const step = category==='healthy'?250:1;
    let newValue= value-step;
    if(newValue < minValue){
        newValue= minValue;
    }
    htmlItem.innerText= newValue;
    if(idElm=='item'){
        total(id,newValue)
    }
}
//se obtiene campo de error
const errorField= document.getElementById('errorField')

//valida si campo vacios
const inputs = document.querySelectorAll('input');
function isEveryInputEmpty() {
    let allEmpty = true;
    inputs.forEach(function(el) {
        if (el.value == '') {
            errorField.innerHTML ='<div class="error" style="color:red">Valide que todos los campos esten llenos</div>'
            el.dataset.state = 'invalid'
            allEmpty=false
            return false;
        }else {
            el.dataset.state = 'valid'
        }
    });

    return allEmpty;
}

//escucha el envio del formulario
const handleSubtmit = (event) => {
    
    event.preventDefault();
    event.stopPropagation();
    const emptyInput=isEveryInputEmpty();
    if(emptyInput){
        const value = localStorage.getItem('productsCar');
        console.log(value)
        errorField.innerHTML =''
        const URLShoppingCar= 'http://localhost:3000/Shooping'
        const responsePost = fetch(URLShoppingCar, {
            method: "POST",
            body: value,
            headers: {"Content-type": "application/json; charset=UTF-8"}
        });
        responsePost.then(response => response.json()) 
        .then(json => {
            localStorage.setItem('productsCar', JSON.stringify([]))
            const modalSuccess= document.getElementById('successPayModal')
            new  bootstrap.Modal(modalSuccess).show()
        })
    }
}


//escucha evento submit form datos tarjeta
addEventListener("submit", handleSubtmit);

document.getElementById('newShop').addEventListener('click', () => {
    window.location='./index.html'
})