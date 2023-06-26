const dropList = document.querySelectorAll(".drop-list select"),
fromCurrency = document.querySelector(".from select"),
toCurrency = document.querySelector(".to select"),
getButton = document.querySelector("form button");

for(let i = 0; i < dropList.length; i++) {
    for(currency_code in country_code ){
        //selecting USD by default as FROM currency and JMD as TO currency
        let selected;
        if(i == 0){
            selected = currency_code == "USD" ? "selected" : "";
        } else if (i == 1){
            selected = currency_code == "JMD" ? "selected" : "";
        }
        //creating option tag with passing currency code as text and value
        let optionTag = `<option value="${currency_code}" ${selected}>${currency_code}</option>`
        //inserting options tag inside select tag
        dropList[i].insertAdjacentHTML("beforeend", optionTag);
    }
    dropList[i].addEventListener("change", e => {
        loadFlag(e.target) //calling loadflag, passing target element as an argument
    })
}

function loadFlag(element) {
    for (code in country_code) {
        if(code == element.value) { // if currency code of country list is equal to option value
            let imgTag = element.parentElement.querySelector("img") // selecting img tag of particular drop list
            // passing country code of a selected currency code in an img url
            imgTag.src = `https://flagcdn.com/48x36/${country_code[code].toLowerCase()}.png`;
        }
    }
}

window.addEventListener("load", () => {
   getExchangeRate();
})

getButton.addEventListener("click", e => {
    e.preventDefault; // preventing form from submitting
    getExchangeRate()
})

const exchangeIcon = document.querySelector("form .icon")
exchangeIcon.addEventListener("click", () => {
    let tempCode = fromCurrency.value; // temporary currency code of FROM drop list
    fromCurrency.value = toCurrency.value; // passing TO currency code to FROM currency code
    toCurrency.value = tempCode; // passing temporary currency code to TO currency code
    loadFlag(fromCurrency); // calling loadFlag with passing select element (fromCurrency) of FROM
    loadFlag(toCurrency); // calling loadFlag with passing selet element (toCurrency) of TO
    getExchangeRate();
});

function getExchangeRate() {
    const amount = document.querySelector(".amount input"),
    exchangeRateTxt = document.querySelector(".exchange-rate");
    let amountVal = amount.value; 
    // if user does not event any value or enters 0, we'll set 1 as default in the input field
    if(amountVal == "" || amountVal == "0") {
        amount.value = "1"
        amountVal = 1
    }
    exchangeRateTxt.innerText = "Getting exchange rate..."
    let url = `https://v6.exchangerate-api.com/v6/88d49c6328fca00ee8e0ca48/latest/${fromCurrency.value}`;
    //fetching api response and parsing what's returned into js object; and in another method receiving that object
    fetch(url).then(response => response.json()).then(result => {
        let exchangeRate = result.conversion_rates[toCurrency.value]
        let totalExchangeRate = (amountVal * exchangeRate).toFixed(2);
        const exchangeRateTxt = document.querySelector(".exchange-rate");
        exchangeRateTxt.innerText = `${amountVal} ${fromCurrency.value} = ${totalExchangeRate} ${toCurrency.value}`
    }).catch(() => { // if user is offline or any other error occurd while fetching data then catch function will run
        exchangeRateTxt.innerText = "Something went wrong";
    });
}