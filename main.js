// consulta de productos
const URLProducts = 'http://localhost:3000/products'
const responseGetProducts = fetch(URLProducts);
responseGetProducts.then(response => response.json()) 
.then(dataProducts => {
    // separa los elemnetos de ofertas y mas produtos
    const saleProduts = dataProducts.filter(saleProduct => saleProduct.discount !=='');
    const moreProduts = dataProducts.filter(product => product.discount ==='');

    //obtención id html ofertas y mas productos
    const htmlSaleProducts = document.getElementById('sale-products-list');
    const htmlMoreProducts = document.getElementById('more-products-list');

    //renderiza ofertas
    htmlSaleProducts.innerHTML=''; 
    saleProduts.forEach(function(el) {
        
        htmlSaleProducts.innerHTML+= `
            <div class="col">
                <div class="card border-0">
                    <span class="discount">${el.discount}</span>
                    <button type="button" class="btn"  onclick="getInfoProductSelect(${el.id})"  data-bs-toggle="modal" data-bs-target="#productModal">
                        <img src="${el.url}" alt="lemon">
                    </button>
                    <div class="card-body">
                        <p><b class="black">${el.newPrice}</b> <span class="text-decoration-line-throug">${el.price}</span></p>
                        <p class="card-text">${el.productName}</p>
                        <button type="button" class="btn border w-100 my-2" onclick="postFavorite(${el.id})">
                            Añadir a favoritos
                            <img width="25" src="./images/icons/red-heart-icon.svg" alt="heart">
                        </button>
                        <div class="w-100 d-flex justify-content-center">
                            <button type="button" class="add-product" onclick="addProductCar('${encodeURI(JSON.stringify(el))}')">Agregar</button>
                        </div>
                    </div>
                </div>
            </div>
        `
    })
    //renderiza mas productos
    htmlMoreProducts.innerHTML=''; 
    moreProduts.forEach(function(el) {
        htmlMoreProducts.innerHTML+= `
            <div class="col">
                <div class="card border-0">
                <button type="button" class="btn"  onclick="getInfoProductSelect(${el.id})"  data-bs-toggle="modal" data-bs-target="#productModal">
                    <img src="${el.url}" alt="lemon">
                </button>
                <div class="card-body">
                    <p><b class="black">${el.price}</b></p>
                    <p class="card-text">${el.productName}</p>
                    <p class="cant">${el.priceCantMin}</p>
                    <button type="button" class="btn border w-100 my-2 " onclick="postFavorite(${el.id})">
                        Añadir a favoritos
                        <img width="25" src="./images/icons/red-heart-icon.svg" alt="heart">
                    </button>
                    <div class="w-100 d-flex justify-content-center">
                        <button type="button" class="add-product"  onclick="addProductCar('${encodeURI(JSON.stringify(el))}')">Agregar</button>
                    </div>
                </div>
                </div>
            </div>
        `
    })
})


// consulta localización
const URLLocalization = 'http://localhost:3000/localization'
const responseGetLocalization = fetch(URLLocalization);
responseGetLocalization.then(response => response.json()) 
.then(dataLocalization => {
    //obtención id html ubicaciones
    const htmlLocalization = document.getElementById('localization');
    //renderiza ubicaciones
    htmlLocalization.innerHTML='<option selected disabled value="">Ingresa tu dirección</option>'; 
    dataLocalization.forEach(function(el) {
        htmlLocalization.innerHTML+= `
            <option value="${el.id}">${el.municipaly}</option>
        `
    })
})

//obtiene el html del municipio seleccionado y cambia su valor
const localizationSelected = document.getElementById("localizationSelected");
const carLocalization= document.getElementById('location-car')
localizationSelected.innerText= localStorage.getItem('localization')
carLocalization.innerText= localStorage.getItem('localization')


//guardar valor de ubicación localStorage
document.getElementById("saveLocalization").addEventListener("click", saveLocalization);

function saveLocalization(event) {
    //obtiene el elemento html de select
    const select = document.getElementById("localization");
    //obtiene le valor seleccionado
    const getTextSelect = select.options[select.selectedIndex].text;
    //valida su valor 
    if(select.value){
        localStorage.setItem('localization', getTextSelect)
        //cambia su valor dirección
        localizationSelected.innerText= getTextSelect
        carLocalization.innerText= getTextSelect;
        // obtiene id modal y lo cierra
        const modalLocalization= document.getElementById('localizationModal')
        bootstrap.Modal.getInstance(modalLocalization).hide()
    }else {
        alert("seleccione un valor")
    }
}

//consuta de datos de favoritos
const URLFavorites = 'http://localhost:3000/favorites'
const getFavorites = () => {
    const responseGetFavorites = fetch(URLFavorites);
    responseGetFavorites.then(response => response.json()) 
    .then( async dataFavorites => {
        //obtención id favoritos
        const htmlFavorites = document.getElementById('favoritesList');
        // crea filtro por Id de favoritos
        const favoritesCurrent = dataFavorites.map(el=> el.productId).join('&id=');
    
        //consulta informacion de los productos favoritos
        const responseGetProducts = await fetch(`${URLProducts}/?id=${favoritesCurrent}`);
        const dataProdutsFavorites = await responseGetProducts.json();
    
        //renderiza favoritos
        htmlFavorites.innerHTML=''; 
        dataProdutsFavorites.forEach(function(fv) {
            htmlFavorites.innerHTML+= `
                <div class="row add-car-product border-bottom">
                    <div class="col-3 align-items-center d-flex">
                        <img class="w-100" src="${fv.url}" alt="pdt-1">
                    </div>
                    <div class="col-7">
                        <p class="title-add-product">${fv.productName}</p>
                        <p class="price-add-product">${fv.newPrice?fv.newPrice:fv.price}</p>
                    </div>
                    <div class="col-2 d-flex">
                        <div class="hstack">
                            <button type="button" class="btn"  onclick="deleteFavorite(${fv.id})">
                                <img src="./images/icons/less.svg" alt="less">
                            </button>
                        </div>
                    </div>
                </div>
            `
        })
    })
}
getFavorites();

//añadir producto a favoritos
const postFavorite = async (idProduct) =>{
   const objeto= {
    "productId": idProduct
   };
    //añadir el favorito
    await fetch(`${URLFavorites}`, {
        method:'POST',
        body: JSON.stringify(objeto),
        headers: {
            "content-Type": "application/json; charset=utf-8"
        }
    })
    getFavorites()
}

// elimina el favorito seleccionado
const deleteFavorite = async (idProduct) =>{
    // consulta en favoritos el produto seleccionado
    const responseGetIdProduct = await fetch(`${URLFavorites}/?productId=${idProduct}`);
    const idFavorite = await responseGetIdProduct.json();
    //elimina el favorito
    await fetch(`${URLFavorites}/${idFavorite[0].id}`, {
        method: 'DELETE'
    });
    getFavorites()
}

// consuta infomrmacion modal seleccioando

const getInfoProductSelect = (idProduct) => {
    const htmlProductDetail = document.getElementById('product-detail');
    const responseGetProduct = fetch(`${URLProducts}/${idProduct}`);
    responseGetProduct.then(response => response.json()) 
    .then(dataProduct => {
            //renderiza producto seleccionado
        htmlProductDetail.innerHTML=''; 
        htmlProductDetail.innerHTML+= `
            <div class="col-md-6">
                <img class="w-100" src="${dataProduct.url}" alt="avocato">
            </div>
            <div class="col-md-6 datail-product">
                <h3>${dataProduct.productName}</h3>
                <h4>· ${dataProduct.newPrice?dataProduct.newPrice:dataProduct.price}</h4>
                <p class="caption-amp">Precios con IVA incluido</p>
                <p class="description-amp">Peso aproximado por pieza, puede variar de acuerdo al peso real.</p>
                <p class="title-select-amp">Selecciona la ${dataProduct.category==='healthy'?'madurez':'fabricación'}  que deseas</p>
                <select class="form-select" aria-label="Default select example" id="select${dataProduct.id}">
                    <option selected disabled value="">Por elegir</option>
                    <option value="${dataProduct.category==='healthy'?'Maduro':''} (Para hoy)"> ${dataProduct.category==='healthy'?'Maduro':''} (Para hoy)</option>
                    <option value="${dataProduct.category==='healthy'?'Normal':''} (3-5 días)">${dataProduct.category==='healthy'?'Normal':''} (3-5 días)</option>
                    <option value=">${dataProduct.category==='healthy'?'Verde':''} (7 días)">${dataProduct.category==='healthy'?'Verde':''} (7 días)</option>
                </select>
                <div class="row">
                <div class="col-md-6">
                    <div class="hstack">
                    <button type="button" class="btn" onclick="addProduct(${dataProduct.id},'${dataProduct.category}','itemModal')">
                        <img src="./images/icons/plus.svg" id alt="sum">
                    </button>
                    <span class="me-2"><span id="itemModal${dataProduct.id}">0</span> ${dataProduct.category==='healthy'?'Kg':'U'}</span>
                    <button type="button" class="btn" onclick="subtract(${dataProduct.id},'${dataProduct.category}','itemModal')">
                        <img src="./images/icons/less.svg" alt="less">
                    </button>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="w-100 d-flex justify-content-center">
                    <button type="button" class="add-product" data-bs-toggle="modal" data-bs-target="#productModal" onclick="addProductCar('${encodeURI(JSON.stringify(dataProduct))}',${true},${true},'itemModal')">Agregar</button>
                    </div>
                </div>
                </div>
                <button type="button" class="btn border w-100 mt-2"  onclick="postFavorite(${dataProduct.id})">
                    Añadir a favoritos
                    <img width="25" src="./images/icons/red-heart-icon.svg" alt="heart">
                </button>
            </div>
              
        `
        // consuta productos relacionados
        relationatedProducts(dataProduct.category,dataProduct.id);
    })
}


// consultar produtos relacionados
const relationatedProducts = (category, currentId) =>{
    const htmlRelationatedProduct = document.getElementById('product-relationated');
    const responseGetRelationatedProduct = fetch(`${URLProducts}/?category=${category}`);

    responseGetRelationatedProduct.then(response => response.json()) 
    .then(dataProductsRelationated => {
        //elimia producto ampliado
        const dataFilter=dataProductsRelationated.filter(el=> el.id !== currentId);
        //renderiza producto seleccionado
         htmlRelationatedProduct.innerHTML=''; 
         dataFilter.forEach(function(rl) {
            htmlRelationatedProduct.innerHTML+= `
                <div class="col">
                    <div class="card border-0">
                    <span class="discount ${rl.discount?'':'d-none'}">${rl.discount}</span>
                    <img src="${rl.url}" >
                    <div class="card-body">
                        <p><b class="black">${rl.newPrice?rl.newPrice:rl.price}</b> <span class="text-decoration-line-throug">${rl.price}</span</p>
                        <p class="card-text">${rl.productName}</p>
                        <button type="button" class="btn border w-100 my-2 ">
                            Añadir a favoritos
                            <img width="25" src="./images/icons/red-heart-icon.svg" alt="heart">
                        </button>
                        <div class="w-100 d-flex justify-content-center">
                            <button type="button" class="add-product">Agregar</button>
                        </div>
                    </div>
                    </div>
                </div>
            `
         })
         
    })
}


// aumentar cantidad de producto
const maxValue=5000
const minValue=0

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

//agregar producto
const addProductCar= (product,modal,cant,idElm)=>{
    const newElement= JSON.parse(decodeURI(product));
    //se se añadio producto desde el modal agregar los valorews adicionales
    if(modal){
        const valueSelect= document.getElementById(`select${newElement.id}`).value
        newElement.select=valueSelect;
    }
    if(cant){
        const htmlItem= document.getElementById(`${idElm}${newElement.id}`)
        newElement.cant= htmlItem.textContent
    }
    // consulta localstorage y añade nuevo producto
    let products= JSON.parse(localStorage.getItem('productsCar') || '[]');
    const index=products.findIndex(i=>i.id==newElement.id);
    if(index>-1){
        products.splice(index,1)
    }
    products.push(newElement)
    localStorage.setItem('productsCar', JSON.stringify(products))
    // alerta de procti añadido
    const alertProduct= document.getElementById('alertProduct');
    new bootstrap.Toast(alertProduct).show()
    const myTimeout = setTimeout(()=>{
        new bootstrap.Toast(alertProduct).hide()
    }, 1000);
    getProdutCar();
}


// consultar productos del carrito
const getProdutCar = ()=>{
    const productsCar= JSON.parse(localStorage.getItem('productsCar') || '[]');

    //actualiza cantidad de productos header
    const htmlCantHeader= document.getElementById('totalproductsHeader')
    htmlCantHeader.innerText= productsCar.length;
    // actualiza cant produtos carro
    const htmlCantCar= document.getElementById('totalproductsCar')
    htmlCantCar.innerText= productsCar.length;
    
    ///renderiza productso carro
    const htmlCarItems = document.getElementById('items-car');
    
    htmlCarItems.innerHTML='';
    let valorTotal=0 
    if(productsCar.length===0){
        htmlCarItems.innerHTML+= `
            <div class="empty"> 
                <img src="./images/Family Values Shopping.png" alt="car">
                <p>Tu canasta está vacía</p>
                <div class="d-flex justify-content-center">
                <button type="button" class="add-product">Agregar productos</button>
                </div>
            </div>
        `
    }else{
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
    }
    //muestra la suma valor total cant productos
    const htmlTotalCar= document.getElementById('totalCar')
    htmlTotalCar.innerText='$ '+valorTotal;

}
getProdutCar();


//vaciar carro 
const emptyCar= () => {
    localStorage.setItem('productsCar', JSON.stringify([]))
    getProdutCar();
}
document.getElementById('emptyCar').addEventListener('click', emptyCar)


//ir a pagar
const goPayCar= () => {
    if(JSON.parse(localStorage.getItem('productsCar') || '[]').length>0){
        window.location='./page-payment.html'
    }else {
        alert("falta agregar produtos")
    }
}
document.getElementById('payCar').addEventListener('click', goPayCar)

