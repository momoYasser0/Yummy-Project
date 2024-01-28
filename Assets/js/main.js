$(document).ready(function () {
    searchByName("a").then(() => {
        $(".loading .loader").fadeOut(300, function () {
            $(".loading").fadeOut(300, function () {
                $("body").css("overflow", "visible");
                $(".loading").remove()
            })
        })

    })
})
let navBodyW = $(".nav-body").outerWidth();
$(".side-nav").css("left", -navBodyW);
$(".side-nav .links").toggle(1000)


function openCloseSideBar() {
    if ($(".side-nav").css("left") == "0px") {
        $(".side-nav").css("left", -navBodyW);
        $(".toggle-icon").toggleClass("d-none");
        $(".side-nav .links").slideToggle(700);

    }
    else {
        $(".side-nav").css("left", "0px");
        $(".toggle-icon").toggleClass("d-none");
        $(".side-nav .links").slideToggle(700);
    }
}


$(".nav-header .toggle-icon").on("click", function () {
    // $(".toggle-icon").toggleClass("d-none");
    // $(".side-nav .links").slideToggle(700);
    openCloseSideBar()

})
$(".links li").on("click", function () {
    openCloseSideBar()

})


/* >==========Start Category Section <========== */
async function GetCategory() {
    $(".inner-loading").fadeIn(500)
    let data = await fetch("https://www.themealdb.com/api/json/v1/1/categories.php")
    if (data.ok && data.status != 400) {
        let response = await data.json()
        displayCategory(response.categories);
    }
    $(".inner-loading").fadeOut(500)

}
$(".category-link").on("click", GetCategory)
function displayCategory(data) {
    let blackBox = '';
    for (let i = 0; i < data.length; i++) {
        blackBox += `  <div class="col-lg-3  col-sm-6">
                        <div onclick="getCategoryMeals('${data[i].strCategory}')" class="image position-relative">
                            <div class="inner">
                                <h2 class="inner-text">${data[i].strCategory}</h2>
                                <p>${data[i].strCategoryDescription.split(" ").slice(0, 20).join(" ")}</p>
                            </div>
                            <img src="${data[i].strCategoryThumb}" alt="" class="img-fluid">

                        </div>
                    </div>`;
    }
    $(".row-data").html(blackBox);
}
async function getCategoryMeals(CatagoryData) {
    $("inner-loading").fadeIn(500);
    let mealsData = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${CatagoryData}`);
    let res = await mealsData.json();
    displayMeals(res.meals)
    $("inner-loading").fadeOut(500);


}
function displayMeals(meal) {
    let blackBox = ''
    for (let i = 0; i < meal.length; i++) {
        blackBox += `
                     <div class="col-lg-3 col-md-4 col-sm-6">
                         <div class="image position-relative" onclick='displayDetails(${meal[i].idMeal})'>
                         
                             <div class="inner d-flex justify-content-center align-items-center">
                                 <h2 class="inner-text">${meal[i].strMeal}</h2>
                             </div>
                             <img src="${meal[i].strMealThumb}" alt="" class="img-fluid">
 
                         </div>
                     </div>`

    }
    $(".row-data").html(blackBox);

}
async function displayDetails(ID) {
    let ingredients = ``
    let tags = ``;
    let data = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${ID}`);
    let response = await data.json();


    if (response.meals[0].strTags != null) {
        let tagscontent = response.meals[0].strTags.split(",");
        for (let j = 0; j < tagscontent.length; j++) {
            tags += `<li class="alert alert-danger m-2 p-1">${tagscontent[j]}</li>`
        }
    }

    for (let i = 1; i <= 20; i++) {
        if (response.meals[0][`strIngredient${i}`]) {
            ingredients += `<li class="alert alert-info p-1 m-2">${response.meals[0][`strMeasure${i}`]} ${response.meals[0][`strIngredient${i}`]}</li>`
        }


    }
    let blackBox = `                <div class="col-md-4 text-white">
                    <img src="${response.meals[0].strMealThumb ? response.meals[0].strMealThumb : altImg}" alt="strMealThumb" class="img-fluid mb-2">
                    <h2>${response.meals[0].strMeal}</h2>
                </div>
                <div class="col-md-8 text-white">

                    <div class="header d-flex justify-content-between">
                        <h3>Instructions</h3>
                        <i class="fa-solid fa-xmark fa-2xl" id="CloseBtn"></i>
                    </div>
                    <p>${response.meals[0].strInstructions}</p>
                    <h3><span class="fw-bolder">Area :</span> ${response.meals[0].strArea}</h3>
                    <h3><span class="fw-bloder">Category :</span> ${response.meals[0].strCategory} </h3>
                    <h3>Recipes :</h3>
                    <ul class="list-unstyled d-flex g-2 flex-wrap">
                        ${ingredients}
                    </ul>
                    <h3>Tags :</h3>
                    <ul class="list-unstyled d-flex g-3 flex-wrap">
                        ${tags}
                    </ul>
                    <div class="links mt-3"><a href="${response.meals[0].strSource}" class="btn btn-success" target="_blank">Source</a>
                        <a href="${response.meals[0].strYoutube}" class="btn btn-danger" target="_blank">Youtube</a>
                    </div>
                </div>
    `
    $(".row-data").html(blackBox);
    $("#CloseBtn").on("click", function () {
        searchByName("a")
    })
}


$("#CloseBtn").on("click", function () {
    GetCategory()
})

/* >==========End Category Section <========== */



/* >==========Start Area Section <========== */
$(".area-link").on("click", GetArea);
$("inner-loading").fadeIn(500);
async function GetArea() {
    let areas = await fetch("https://www.themealdb.com/api/json/v1/1/list.php?a=list");
    let respone = await areas.json();
    displayAreas(respone.meals)
    $("inner-loading").fadeOut(500);
}


function displayAreas(meals) {

    let areaData = ``;
    for (let i = 0; i < meals.length; i++) {

        areaData += ` <div class="col-lg-3 col-md-4 col-sm-6 lang-item text-center text-white" onclick='getMealsArea("${meals[i].strArea}")'>
                        <div class="inner"><i class="fa-solid fa-house-laptop fa-4x mb-2 "></i>
                            <h3>${meals[i].strArea}</h3>
                        </div>
                    </div>`
    }
    $(".row-data").html(areaData)
}

async function getMealsArea(meal) {
    $("inner-loading").fadeIn(500);
    let areaMealsData = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${meal}`)
    let respone = await areaMealsData.json()
    displayMeals(respone.meals)
    $("inner-loading").fadeOut(500);
}

/* >==========End Area Section <========== */
/* >==========Start Ingredients Section <========== */
/* Handling Style  */
$(".ingred-link").on("click", getIngredients)
async function getIngredients() {
    $("inner-loading").fadeIn(500);
    let ingredients = await fetch("https://www.themealdb.com/api/json/v1/1/list.php?i=list");
    let respone = await ingredients.json()
    displayIngredients(respone.meals.slice(0, 20))
    $("inner-loading").fadeOut(500);
}

function displayIngredients(meal) {
    let blackBox = ``;
    for (let i = 0; i < meal.length; i++) {
        blackBox += ` <div class="col-lg-3 col-md-4 col-sm-6  text-white text-center" onclick="getMainIngedients('${meal[i].strIngredient}')">
                        <div class="inner">
                            <i class="fa-solid fa-drumstick-bite fa-4x mb-2"></i>
                            <h3>${meal[i].strIngredient}</h3>
                            <p> ${meal[i].strDescription.split(" ").slice(0, 20).join(" ")}</p >
                        </div ></div> `
    }
    $(".row-data").html(blackBox)
}
async function getMainIngedients(ingredients) {
    $("inner-loading").fadeIn(500);
    let mainData = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredients}`)
    let respone = await mainData.json()
    displayMainIngredients(respone.meals.slice(0, 20))
    $("inner-loading").fadeOut(500);
}

function displayMainIngredients(main) {
    let blackBox = ``;

    for (let i = 0; i < main.length; i++) {
        blackBox += `
                    <div class="col-lg-3 col-md-4 col-sm-6">
                         <div class="image position-relative" onclick='displayDetails(${main[i].idMeal})'>
                         
                             <div class="inner d-flex justify-content-center align-items-center">
                                 <h2 class="inner-text">${main[i].strMeal}</h2>
                             </div>
                             <img src="${main[i].strMealThumb}" alt="" class="img-fluid">

                         </div>
                     </div>`

    }
    $(".row-data").html(blackBox)

}
/* >==========End Ingredients Section <========== */

/* >==========Start Search Section <========== */
$(".search-link").on("click", function () {
    let serachContent = `<div class="col-md-6">
                    <div class="form-floating">
                        <input type="text" class="form-control" id="SBName" placeholder="Search By Name">
                        <label for="SBName">Search By Name</label>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-floating">
                        <input type="text" class="form-control" id="SBFLetter" placeholder="Search By First Letter"
                            maxlength="1">
                        <label for="SBFLetter">Search By First Letter</label>
                    </div>
                </div>`
    $(".row-data").html("")
    $("#search").html(serachContent);

    $("#SBName").on("keyup", function () {
        searchByName(this.value);
    })
    $("#SBFLetter").on("keyup", function () {
        searchByLetter(this.value);

    })
});
async function searchByName(inputValue) {
    $("inner-loading").fadeIn(500);
    let name = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${inputValue}`);
    let respone = await name.json();
    respone.meals ? displayData(respone.meals) : displayData([]);;
    $(".inner-loading").fadeOut(500)
}

async function searchByLetter(inputValue) {
    inputValue == "" ? inputValue = "a" : "";
    let ajax = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${inputValue}`);
    let respone = await ajax.json();
    respone.meals ? displayData(respone.meals) : displayData([]);;
}

function displayData(a) {
    let blackBox = ``;
    for (let i = 0; i < a.length; i++) {
        blackBox += `<div class="col-lg-3 col-md-4 col-sm-6">
                         <div class="image position-relative" onclick='displayDetails(${a[i].idMeal})'>
                         
                             <div class="inner d-flex justify-content-center align-items-center">
                                 <h2 class="inner-text">${a[i].strMeal}</h2>
                             </div>
                             <img src="${a[i].strMealThumb}" alt="" class="img-fluid">

                         </div>
                     </div>
        `
    }
    $(".row-data").html(blackBox)
}

$(".links li").not(".search-link").on("click", function () {
    $("#search").empty();
})


/* >==========End Search Section <========== */
/* >==========Start Contacts Section <========== */
$(".contact-link").on("click", function () {
    showContact()
})

function showContact() {
    contactContent = `
        <div id="Contact" class="min-vh-100 d-flex justify-content-center align-items-center">
                    <div class="container w-75 text-center">
                        <form class="row g-3">
                            <div class="col-md-6">
                                <input type="text" required placeholder="Enter Your Name" name="name"
                                    class="form-control" onkeyup="inputsValid()">
                                <div class=" rounded-1  invalid">At least 6 characters & special characters and numbers
                                    not allowed</div>
                            </div>
                            <div class="col-md-6">
                                <input type="email" required placeholder="Enter Your Email" name="email"
                                    class="form-control" onkeyup="inputsValid()">
                                <div class=" rounded-1  invalid">Please enter a valid email</div>

                            </div>
                            <div class="col-md-6">
                                <input type="text" required placeholder="Enter Your Phone" name="phone"
                                    class="form-control" onkeyup="inputsValid()">
                                <div class=" rounded-1  invalid">Please enter a valid phone number</div>

                            </div>
                            <div class="col-md-6">
                                <input type="number" required placeholder="Enter Your Age" name="age"
                                    class="form-control" onkeyup="inputsValid()">
                                <div class=" rounded-1  invalid ">Please enter a valid age</div>
                            </div>
                            <div class="col-md-6">
                                <input type="password" required placeholder="Enter Your Password" name="password"
                                    class="form-control" onkeyup="inputsValid()">
                                <div class=" rounded-1  invalid ">Minimum eight characters, at least one letter
                                    and one
                                    number</div>
                            </div>
                            <div class="col-md-6">
                                <input type="password" required placeholder="Re-Password" name="repassword"
                                    class="form-control" onkeyup="inputsValid()">
                                <div class=" rounded-1  invalid ">Repassword is not correct</div>
                            </div>
                        </form>
                        <button class="btn btn-outline-danger mt-4" disabled="true" id="submitBtn">Submit</button>
                    </div>
                </div>`;
    $(".row-data").html(contactContent);
}

/* >==========End Contacts Section <========== */
/* >==========Start Inputs Validation<========== */
const regex = {
    name: /^[A-Za-z\s]{6,}$/,
    email: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
    age: /^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/,
    phoneNo: /^[0-9]{6,}$/,
    password: /^(?=.*?[A-Za-z])(?=.*?[0-9]).{8,}$/,

};
const inputName = $("input[name='name']");
const inputEmail = $("input[name='email']");
const inputPhone = $("input[name='phone']");
const inputPass = $("input[name='password']");
const inputAge = $("input[name='age']")
const inputRePass = $("input[name='repassword']");
const altImg = '../imgs/altImage.jpg'


$(inputName).on("blur", () => {
    return nameInput = true;
})
$(inputEmail).on("blur", () => {
    return emailInput = true;
})
$(inputPhone).on("blur", () => {
    return phoneInput = true;
})
$(inputPass).on("blur", () => {
    return passwordInput = true;
})
$(inputAge).on("blur", () => {
    return ageInput = true;
})
$(inputRePass).on("blur", () => {
    return repasswordInput = true;
})
let nameInput = false;
let emailInput = false;
let phoneInput = false;
let ageInput = false;
let passwordInput = false;
let repasswordInput = false;

function validName() {
    return (regex.name.test(inputName.val()));

}

function validEmail() {
    return (regex.email.test(inputEmail.val()));


}
function validPhone() {
    return (regex.phoneNo.test(inputPhone.val()));

}
function validPassword() {
    return (regex.password.test(inputPass.val()));

}
function validAge() {
    return (regex.age.test(inputAge.val()));

}
function rePassword() {
    if (inputPass.val() == inputRePass.val()) {
        return true;
    } else {
        return false;
    }
}
function inputsValid() {
    console.log("hiiii");
    if (nameInput) {
        if (validName()) {
            inputName.addClass("is-valid");
            inputName.removeClass("is-invalid");
            inputName.next().css("display", "none");
        } else {
            inputName.next().css("display", "block");
            inputName.removeClass("is-valid");
            inputName.addClass("is-invalid");
        }
    }
    if (emailInput) {
        if (validEmail()) {
            inputEmail.addClass("is-valid")
            inputEmail.removeClass("is-invalid")
            inputEmail.next().css("display", "none")
        } else {
            inputEmail.next().css("display", "block")
            inputEmail.removeClass("is-valid")
            inputEmail.addClass("is-invalid")
        };
    }



    if (phoneInput) {
        if (validPhone()) {
            inputPhone.addClass("is-valid")
            inputPhone.removeClass("is-invalid")
            inputPhone.next().css("display", "none")
        } else {
            inputPhone.next().css("display", "block")
            inputPhone.removeClass("is-valid")
            inputPhone.addClass("is-invalid")
        }
    }
    if (ageInput) {
        if (validAge()) {
            inputAge.addClass("is-valid")
            inputAge.removeClass("is-invalid")
            inputAge.next().css("display", "none")
        } else {
            inputAge.addClass("is-valid")
            inputAge.removeClass("is-invalid")
            inputAge.next().css("display", "none")
        }
    }
    if (passwordInput) {
        if (validPassword()) {
            inputPass.addClass("is-valid")
            inputPass.removeClass("is-invalid")
            inputPass.next().css("display", "none")
        } else {
            inputPass.addClass("is-valid")
            inputPass.removeClass("is-invalid")
            inputPass.next().css("display", "none")
        }
    }
    if (repasswordInput) {
        if (rePassword()) {
            inputPass.addClass("is-valid")
            inputPass.removeClass("is-invalid")
            inputPass.next().css("display", "none")
        } else {
            inputPass.addClass("is-valid")
            inputPass.removeClass("is-invalid")
            inputPass.next().css("display", "none")
        }
    }
    if (rePassword() && validPassword() && validPhone() && validName() && validEmail() && validAge()) {
        document.getElementById("submitBtn").removeAttribute("disabled");
    } else {
        document.getElementById("submitBtn").setAttribute("disabled", true);
    }
}
/* >==========End Inputs Validation<========== */





