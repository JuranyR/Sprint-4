// consulta de productos
const URLProducts = 'http://localhost:3000/products/'
const responseGetProducts = fetch(URLProducts);
responseGetProducts.then(response => response.json()) 
.then(dataProducts => {
    //obtiene elemento Html
    const productList= document.getElementById('productsList')
    //renderiza produts
    productList.innerHTML=''; 
    dataProducts.forEach(function(el) {
        productList.innerHTML+= `
            <li class="list-group-item  d-flex justify-content-center align-items-center border-0" id="productsList">
                <div class="row add-car-product border-bottom">
                    <div class="col-3 align-items-center d-flex">
                        <img class="w-100" src="${el.url}" alt="pdt-1" style="max-width: 120px;">
                    </div>
                    <div class="col-5">
                        <p class="title-add-product">${el.productName}</p>
                        <p class="price-add-product">${el.newPrice? el.newPrice: el.price}</p>
                    </div>
                    <div class="col-4 d-flex">
                        <div class="hstack">
                        <button class="btn btn-dark btn sm float-end" id=${el.id} type="button">Borrar</button>
                        </div>
                    </div>
                </div>
            </li>
        `
    })
})



//Capturar Datos del formulario

const CapDatos = () => {
    const url = document.getElementById('inputUrl').value
    const productName = document.getElementById('inputNombre').value
    const price = document.getElementById('inputPrice').value
    const discount = document.getElementById('inputDescount').value
    const newPrice = document.getElementById('inputNewPrice').value
    const category = document.getElementById('inputCategory').value
    const priceCantMin = document.getElementById('inputCantMin').value
    
    const producto = {url, productName, price, discount, newPrice, category,priceCantMin}
    return producto;
}

//crear producto
const form= document.querySelector('.form-group')
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const objeto = CapDatos()

    await fetch(URLProducts, {
        method:'POST',
        body: JSON.stringify(objeto),
        headers: {
            "content-Type": "application/json; charset=utf-8"
        }
    })
})

// eliminar producto

const ul = document.querySelector('.list-group')
ul.addEventListener('click', async(e) => {
    const BtnEliminar = e.target.classList.contains ('btn-dark')
    console.log(BtnEliminar)
    if (BtnEliminar === true){
        const id= e.target.id;
        await fetch(URLProducts + id, {
            method: 'DELETE'
        })
    }
})

//actualizar prooductopro

const btnModificar = document.getElementById ('btnModificar')

btnModificar.addEventListener('click', async (e) => {
    e.preventDefault();
    const objeto = CapDatos()
    const newObject= {}
    for(const property in objeto) { 
        if(objeto[property] !== '') {
            newObject[`${property}`]=objeto[property];
        }
    }

    const id =  document.getElementById ('inputId').value;
    await fetch(URLProducts + id, {
        method:'PATCH',
        body: JSON.stringify(newObject),
        headers: {
            "content-Type": "application/json; charset=utf-8"
        }
    })
})


//lista de compras
const btnShop = document.getElementById ('btnShop')

btnShop.addEventListener('click', async () => {
    const URLShopping = 'http://localhost:3000/Shooping';
    const responseGetShopping = fetch(URLShopping);
    responseGetShopping.then(response => response.json()) 
    .then(dataShop => {
        //obtiene elemento Html
        const productList= document.getElementById('productsList') 

        //renderiza produts
        productList.innerHTML=''; 
        dataShop.forEach(function(sp, indexS) {
            sp.map((el,index)=>{
                if(index==0){
                    productList.innerHTML+= `<li><b>Compra #${indexS+1}</b></li>`
                }
                productList.innerHTML+= `
                <li class="list-group-item  d-flex justify-content-center align-items-center border-0" id="productsList">
                    <div class="row add-car-product border-bottom">
                        <div class="col-3 align-items-center d-flex">
                            <img class="w-100" src="${el.url}" alt="pdt-1" style="max-width: 120px;">
                        </div>
                        <div class="col-5">
                            <p class="title-add-product">${el.productName}</p>
                            <p class="price-add-product">${el.newPrice? el.newPrice: el.price}</p>
                        </div>
                        <div class="col-4 d-flex">
                            <div class="hstack">
                            <button class="btn btn-dark btn sm float-end" type="button">Borrar</button>
                            </div>
                        </div>
                    </div>
                </li>
                `  
            })
        })
    })

})
