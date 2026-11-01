import { addNewsletter } from "./storage.js";


const formElement = document.getElementById("news-form");


formElement.addEventListener("submit", (event) => {

    event.preventDefault();

    addNewsletter(Object.fromEntries(new FormData(formElement)))
    
    window.location.href = "newLetter.html#news-letters";


});
