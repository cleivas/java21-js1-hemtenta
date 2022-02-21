const key = '0c357f6746084525bab95fc6a44fce5f'; //weather bit key

const btn = document.querySelector('button');
btn.addEventListener('click', clickEvent) //Ha en eventlistener på knappen

function clickEvent(e){
    e.preventDefault(); //Se till att formuläret inte skickas som default
 
    document.querySelector('h4').innerText = ''; //Ta bort eventuellt error meddelande

    //Hämta det som skrevs in i inputen och skapa två urler. En för att hämta current weather och en för forecast
    const input = document.querySelector('input');
    const urlCurrent = `https://api.weatherbit.io/v2.0/current?city=${input.value}&key=${key}&lang=sv`;
    const urlForecast = `https://api.weatherbit.io/v2.0/forecast/daily?city=${input.value}&key=${key}&lang=sv`;
    
    //Hämta dagens och kommande väder
    getCurrentWeather(urlCurrent);
    getForecast(urlForecast);
    input.value = ''; //så att text inputen blir tom
}

function getCurrentWeather(url){
    fetch(url).then( 
        res => res.json()
    ).then( 
        data => displayCurrent(data.data[0]) //Om data hämtats anropas displayCurrent
    ).catch( displayError ); //Annars andropas displayError
}

function getForecast(url){
    fetch(url).then( 
        res => res.json()
    ).then( data => {
        //Sparar ner objekten med väderinfo för de fem kommande dagarna
        const fiveDayForecast = [];
        for(let i=1; i<6; i++){
            fiveDayForecast.push(data.data[i]);
            console.log(data.data[i]);
        }
        displayForecast(fiveDayForecast); //Skicka med objekten när displayWeather anropas
    }).catch( displayError ); //Om ingen data hämtades anropas displayError
}

function displayCurrent(weather){
    //Weather är objektet med dagens väderinfo

    //Ikonen
    document.querySelector('#current-weather img').src = `https://www.weatherbit.io/static/img/icons/${weather.weather.icon}.png`;

    //Beskrivning (des för description)
    document.querySelector('#current-des').innerText = weather.weather.description;

    //Temperaturen
    document.querySelector('#current-temp').innerText = weather.temp + '℃';

    //Vidhastigheten
    document.querySelector('#current-wind').innerText = Math.round(weather.wind_spd) + ' m/s';

    //Luftfuktigheten
    document.querySelector('#current-hum').innerText = Math.round(weather.rh) + '%';
}

function displayForecast(weather){
//Precis som ovan men weather är en array som innehåller 5 objekt med väderinfo

    const divs = document.querySelectorAll('#forecast-weather div');
    //Loopa igenom alla fem dagar
    for(let i=0; i<weather.length; i++){
        divs[i].innerHTML = '';

        const img = document.createElement('img');
        img.src = `https://www.weatherbit.io/static/img/icons/${weather[i].weather.icon}.png`;
        divs[i].appendChild(img);

        const pdes = document.createElement('p');
        pdes.innerText = weather[i].weather.description;
        divs[i].appendChild(pdes);

        const ptemp = document.createElement('p');
        ptemp.innerText = `${Math.round(weather[i].temp)}℃`;
        divs[i].appendChild(ptemp);
    }
}

//Om ett error uppstår kommer det i vårat fall endast bero på att ingen stad kunde hittas. Då visas ett errormeddelande
function displayError(e){
    document.querySelector('h4').innerText = 'Staden kunde inte hittas. Försök med en annan stad!';
}