//Mis vars globlales
var idJsonElement = "#jsonElement"
var idSlideElement = "#slideContainer"
var endpointURL = "https://ajaxclass-1ca34.firebaseio.com/verox/blog/.json";
var newPost = {}
var allPosts = {}
var firstSlide = `
    <div class="carousel-item w-100 h-100 active">
        <img src="/css/images/welcome.jpg" class="d-block w-100 h-100" alt="...">
    </div>
    `
var firstNumberSlide = `<li data-target="#carouselExampleCaptions" data-slide-to="0" class="active"></li>`

//Listener Filtros
$(".listFilters li").click( event => {
    let value = $(event.target).data("filter")
    console.log(value)
    getTheJson (value)
})


//Listener formulario New Post
$("input, textarea, select").change(event => {
    let property = event.target.name
    let value = event.target.value
    newPost[property] = value
})

//Listener boton NewPost
$("#newPost").click(() => {
    newPost["starred"] = $("#star:checked").val() ? true : false
    console.log("NewPost")
    crudTheJson(newPost, "POST")
})

//Request de GET a AJAX
const getTheJson = criteria => {
    let endpoint = endpointURL;
    $.ajax({
        url: endpoint,
        method: "GET",
        success: data => {
            allPosts = data
            fillDataToCards(data,criteria)
            starredSlides(data)
        },
        error: "",
    });
}

//Ejecuta acciones de CUD
const crudTheJson = (theEntry, action) => {
    let endpoint = endpointURL;
    let dataValue = ""
    switch (action) {
        case "POST":
            theEntry["dateFull"] = Date.now()
            date = new Date()
            theEntry["date"] = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
            dataValue = JSON.stringify(theEntry);
            console.log("POST")
            break
        case "DELETE":
            endpoint = endpoint.replace(".json", theEntry + "/.json")
            console.log("DELETE")
            break
    }

    $.ajax({
        url: endpoint,
        method: action,
        data: dataValue,
        success: data => {
            getTheJson("All")
        },
        error: "",
    });
}

//Funcion que llena Cards en HTML
const fillDataToCards = (theJson,criteria) => {
    $(jsonElement).empty()
    for (key in theJson) {
        let object = theJson[key]
        let { date, title, text, author, imageURL, category } = object
        if(category === criteria || criteria === "All"){
            let newCard = `
                <div class="card mb-3 m-1 d-flex flex-column flex-md-row bg-transparent border-0" data-entry-key=${key}>
                    <div class="col-12 col-md-4 bg-light myborder mr-1 mb-1 rounded-0">  
                        <img src="${imageURL}" class="card-img w-100" alt="...">
                    </div>  
                    <div class="col-12 col-md-8 card-body bg-light rounded-0 myborder mr-1 p-3 position-relative">
                        <h5 class="card-title">${title}</h5>
                        <p class="card-text"><small>${author}</small></p>
                        <p class="card-text text-wrap">${text}</p>
                        <p class="card-text"><small class="text-muted">${date}</small></p>
                        <p class="card-text"><small class="text-muted">${category}</small></p>
                        <button type="button" class="btn btn-danger btn-sm btn-delete position-absolute" data-entry-key=${key}>-</button>
                    </div>
                </div>
                `
            $(jsonElement).append(newCard)
            }
        }
    $(jsonElement).html() === "" ? $(jsonElement).html(`<p class="p-3 font-weight-bold w-100">¡Oops! Aún no hay entradas en la categoria seleccionada.</p>`) : addBtnDeleteListener()
}

//Listener de los botones delete
const addBtnDeleteListener = () => {
    let btnDelete = document.querySelectorAll(".btn-delete")
    btnDelete.forEach(button => {
        button.addEventListener("click", event => {
            let entryID = event.target.dataset.entryKey
            crudTheJson(entryID, "DELETE")
        })
    })
    addCardsListener()
}

//Listener de cards
const addCardsListener = () => {
    $("#jsonElement .card").click( event => {
        let entryKey = $(event.target).closest(".card").data("entry-key")
        let theObject = allPosts[entryKey]
        let { date, title, text, author, imageURL, category } = theObject
        $("#thePost .modal-title").text(title)
        $("#thePost .modal-body .img-post").attr( {src: imageURL})
        $("#thePost .modal-body .author").text(author)
        $("#thePost .modal-body .text-post").text(text)
        $("#thePost .modal-body .date").text(date)
        $("#thePost .modal-body .category").text(category)
        $("#thePost").modal("show")
    })
}

//Llena destacados
const starredSlides = theJson => {
    $(idSlideElement+",#slideNumber").empty()
    $(idSlideElement).append(firstSlide)
    $("#slideNumber").append(firstNumberSlide)
    let i = 1;
    for (key in theJson) {
        let object = theJson[key]
        let { title, text, imageURL, starred } = object
        if (starred === true) {
            let newCard = `
                <div class="carousel-item w-100 h-100">
                    <img src="${imageURL}" class="d-block w-100 h-100" alt="...">
                    <div class="carousel-caption d-none d-md-block">
                        <h5>${title}</h5>
                        <p>${text}</p>
                    </div>
                </div>
                `
            let newNumberCard = `
                <li data-target="#carouselExampleCaptions" data-slide-to="${i}"></li>
                `
            i++
            $("#slideNumber").append(newNumberCard)
            $(idSlideElement).append(newCard)
        }
    }

}

getTheJson("All")