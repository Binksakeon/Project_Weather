let current_date = new Date();
let current_city_name;
let is_not_found = false;
let search_value;

let today_container = document.querySelector('.today-container');
let forecast_container = document.querySelector('.forecast-container');
let error_container = document.querySelector('.error-container');

let city_input = document.querySelector('.search');
let search_img = document.querySelector('.search-img');
let date = document.querySelector('.current-date');
let weater_name = document.querySelector('.weather-name');
let weater_img = document.querySelector('.current-weather-img');
let current_temp = document.querySelector('.current-temperature');
let current_temp_real = document.querySelector('.current-temperature-real');
let sunrise = document.querySelector('.sunrise');
let sunset = document.querySelector('.sunset');
let day_duration = document.querySelector('.day-duration');

let day_info_name = document.querySelector('.hourly-info .day-name');
let time_info = document.querySelectorAll('.hourly-info tr');

let forecast_time_info = document.querySelectorAll('.forecast-hourly-info tr');
let forecast_day_info_name = document.querySelector('.forecast-hourly-info .day-name');
let days_elems = document.querySelectorAll('.forecast-day');

let forecast_day_name = document.querySelectorAll('.forecast-day-name');
let forecast_day_date = document.querySelectorAll('.forecast-day-date');
let forecast_day_img = document.querySelectorAll('.forecast-day-img');
let forecast_day_temperature = document.querySelectorAll('.forecast-day-temperature');
let forecast_day_weather = document.querySelectorAll('.forecast-day-weather');

let nearby_places = document.querySelector('.nearby-places');

let menu_item_today = document.querySelector('.menu-item-today');
let menu_item_forecast = document.querySelector('.menu-item-forecast');

let error_message = document.querySelector('.error-message');

currentCity();

function checkToday(){
    if(!is_not_found){
        today_container.style.display='block';
        forecast_container.style.display='none';
        error_container.style.display='none';
    }
}

function checkForecast(){
    if(!is_not_found){
        today_container.style.display='none';
        forecast_container.style.display='block';
        error_container.style.display='none';
    }
}

function showError(){
    error_message.innerHTML = current_city_name+' could not be found.<br>Please enter a different location.';
    today_container.style.display='none';
    forecast_container.style.display='none';
    error_container.style.display='block';
}

menu_item_today.addEventListener('click',()=>{
    menu_item_today.classList.add('menu-checked');
    menu_item_forecast.classList.remove('menu-checked');
    checkToday();   
});
menu_item_forecast.addEventListener('click',()=>{
    menu_item_forecast.classList.add('menu-checked');
    menu_item_today.classList.remove('menu-checked');
    checkForecast();   
});

function currentCity(){
    if(localStorage.getItem('city')!=null){
        current_city_name=localStorage.getItem('city');
        rebootWeather(current_city_name);
    }
    else{
        rebootWeather('Kiev');
        let geo = navigator.geolocation;
        geo.getCurrentPosition(async (data)=>{
            let find = await fetch(`http://api.openweathermap.org/data/2.5/find?lat=${data.coords.latitude}&lon=${data.coords.longitude}&cnt=1&units=metric&appid=c86051d7435e726198e7719b6758252b`)
            let find_res = await find.json();
            current_city_name = find_res.list[0].name;
            checkToday();
            rebootWeather(current_city_name);
        },()=>current_city_name = 'Zhytomyr');
    }
}

function windDirection(deg){
    switch(true){
        case (deg<11.25): return 'NtE';
        case (deg<22.5): return 'NNE';
        case (deg<33.75): return 'NEtN';
        case (deg<45): return 'NE';
        case (deg<56.25): return 'NEtE';
        case (deg<67.5): return 'ENE';
        case (deg<78.75): return 'EtN';
        case (deg<90): return 'E';
        case (deg<101.25): return 'EtS';
        case (deg<112.5): return 'ESE';
        case (deg<123.75): return 'SEtE';
        case (deg<135): return 'SE';
        case (deg<146.25): return 'SEtS';
        case (deg<157.5): return 'SSE';
        case (deg<168.75): return 'StE';
        case (deg<180): return 'S';
        case (deg<191.25): return 'StW';
        case (deg<202.5): return 'SSW';
        case (deg<213.75): return 'SWtS';
        case (deg<225): return 'SW';
        case (deg<236.25): return 'SWtW';
        case (deg<247.5): return 'WSW';
        case (deg<258.75): return 'WtS';
        case (deg<270): return 'W';
        case (deg<281.25): return 'WtN';
        case (deg<292.5): return 'WNW';
        case (deg<303.75): return 'NWtW';
        case (deg<315): return 'NW';
        case (deg<326.25): return 'NWtN';
        case (deg<337.5): return 'NNW';
        case (deg<348.75): return 'NtW';
        case (deg<360): return 'N';
    }
}

function timeFormat(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let merde = 'AM';
    if(hours>12){
        hours-=12;
        merde = 'PM';
    }
    return `${parseInt(hours/10)}${hours%10}:${parseInt(minutes/10)}${minutes%10} ${merde}`;
}

async function rebootRequest(response){
    nearby_places.innerHTML='';
    search_value=response.name+', '+response.sys.country;
    city_input.value=search_value;
    date.innerHTML=current_date.getDate()+'.'+current_date.getMonth()+1+'.'+current_date.getFullYear();
    weater_name.innerHTML=response.weather[0].description.charAt(0).toUpperCase() + response.weather[0].description.slice(1);
    weater_img.src=`http://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`;
    current_temp.innerHTML = response.main.temp.toFixed(1)+'&degC';
    current_temp_real.innerHTML ='Real Feel '+ response.main.feels_like.toFixed(1)+'&degC';
    
    let sunrise_time = new Date(response.sys.sunrise*1000);
    sunrise.innerHTML=timeFormat(sunrise_time);
    let sunset_time = new Date(response.sys.sunset*1000);
    sunset.innerHTML=timeFormat(sunset_time);
    let duration_time = new Date((response.sys.sunset-response.sys.sunrise)*1000);
    let hours = duration_time.getHours();
    let minutes = duration_time.getMinutes();
    day_duration.innerHTML=`${parseInt(hours/10)}${hours%10}:${parseInt(minutes/10)}${minutes%10} hr`;

    let nearby_request = await fetch(`http://api.openweathermap.org/data/2.5/find?lat=${response.coord.lat}&lon=${response.coord.lon}&cnt=5&units=metric&appid=c86051d7435e726198e7719b6758252b`);
    let nearby_response = await nearby_request.json();
    let list = nearby_response.list;
    for(let i = 1;i<list.length;i++){
        let nearby_city = document.createElement('div');
        nearby_city.className='nearby-city';
        let nearby_city_name_div = document.createElement('div');
        let nearby_city_name = document.createElement('p');
        nearby_city_name.innerHTML=list[i].name;
        nearby_city_name_div.append(nearby_city_name);
        
        let nearby_city_weather_div = document.createElement('div');
        let nearby_city_weather = document.createElement('img');
        nearby_city_weather.src = `http://openweathermap.org/img/wn/${list[i].weather[0].icon}@2x.png`;
        let nearby_city_temperature = document.createElement('p');
        nearby_city_temperature.innerHTML=list[i].main.temp.toFixed(1)+'&degC';
        nearby_city_weather_div.append(nearby_city_weather);
        nearby_city_weather_div.append(nearby_city_temperature);

        nearby_city.append(nearby_city_name_div);
        nearby_city.append(nearby_city_weather_div);

        nearby_places.append(nearby_city);

        nearby_city.addEventListener('click',(e)=>{
            rebootWeather(list[i].name);
        });
    }
    
};

function nameOfDay(date) {
    switch(date.getDay()){
        case 1: return 'Monday';
        case 2: return 'Tuesday';
        case 3: return 'Wednesday';
        case 4: return 'Thursday';
        case 5: return 'Friday';
        case 6: return 'Saturday';
        case 0: return 'Sunday';
    }
}

function nameOfMonth(date) {
    switch(date.getMonth()){
        case 0: return 'JAN';
        case 1: return 'FEB';
        case 2: return 'MAR';
        case 3: return 'APR';
        case 4: return 'MAY';
        case 5: return 'JUN';
        case 6: return 'JUL';
        case 7: return 'AUG';
        case 8: return 'SEP';
        case 9: return 'OCT';
        case 10: return 'NOV';
        case 11: return 'DEC';
    }
}

function rebootForecast(list,table){
    for(let i =1;i<table.length+1;i++){
        table[0].children[i].innerHTML=list[i].dt_txt.match(/[1-2]?[0-9]:\d+/);
        table[1].children[i].firstChild.src=`http://openweathermap.org/img/wn/${list[i].weather[0].icon}@2x.png`;
        table[2].children[i].innerHTML=list[i].weather[0].description.charAt(0).toUpperCase() + list[i].weather[0].description.slice(1);
        table[3].children[i].innerHTML=list[i].main.temp.toFixed(1)+'&degC';
        table[4].children[i].innerHTML=list[i].main.feels_like.toFixed(1)+'&degC'
        table[5].children[i].innerHTML=list[i].wind.speed.toFixed(1)+' '+windDirection(list[i].wind.deg);
    }
}

async function rebootWeather(city_name){
    let weather_request = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city_name}&units=metric&appid=c86051d7435e726198e7719b6758252b`);
    if(weather_request.status==200){
        let weather_response = await weather_request.json();
        is_not_found=false;
        checkToday();
        rebootRequest(weather_response);
        localStorage.setItem('city',city_name);
        let forecast_request = await fetch(`http://api.openweathermap.org/data/2.5/forecast?q=${city_name}&units=metric&appid=c86051d7435e726198e7719b6758252b`);
        let forecast_response = await forecast_request.json();
        day_info_name.innerHTML = nameOfDay(current_date);
        rebootForecast(forecast_response.list,time_info);

        rebootFiveDaysForecast(forecast_response);
    }
    else if(weather_request.status==404){
        is_not_found=true;
        showError();
    }
}

async function rebootFiveDaysForecast(response) {
    console.log(response);
    
    let list_of_days = [];
    console.log(response);
    let index = 0;
    for(let i=0;i<days_elems.length;i++){
        let day_forecast = [];
        let forecast_day = new Date();
        forecast_day.setDate(current_date.getDate()+i);

        forecast_day_name[i].innerHTML=nameOfDay(forecast_day).toUpperCase();
        forecast_day_date[i].innerHTML=nameOfMonth(forecast_day)+" "+parseInt(forecast_day.getDate()/10)+forecast_day.getDate()%10;
        forecast_day_img[i].src=`http://openweathermap.org/img/wn/${response.list[i*8].weather[0].icon}@2x.png`;
        forecast_day_temperature[i].innerHTML = response.list[i*8].main.temp.toFixed(1)+'&degC';
        forecast_day_weather[i].innerHTML=response.list[i].weather[0].description.charAt(0).toUpperCase() + response.list[i].weather[0].description.slice(1);
        
        for(let j=0;j<8;j++){
            day_forecast.push(response.list[index]);
            index++;
        }
        list_of_days.push(day_forecast);
        days_elems[i].addEventListener('click',(e)=>{
            for(let k=0;k<days_elems.length;k++){
                    days_elems[k].classList.remove('forecast-day-checked');
            }
            e.currentTarget.classList.add('forecast-day-checked');
            forecast_day_info_name.innerHTML=nameOfDay(forecast_day);
            rebootForecast(list_of_days[i],forecast_time_info);
        })
    }
    forecast_day_info_name.innerHTML=nameOfDay(current_date);
    rebootForecast(list_of_days[0],forecast_time_info);
    forecast_day_name[0].innerHTML='TONIGHT';
}

city_input.addEventListener('keydown',(e)=>{
    if(e.key=='Enter'&&city_input.value!=''){
        current_city_name = city_input.value;
        rebootWeather(current_city_name);
    }
});
city_input.addEventListener('blur',()=>{
    if(city_input.value==''){
        city_input.value=search_value;
    }
});
search_img.addEventListener('click',()=>{
    if(city_input.value!=''){
        current_city_name = city_input.value;
        rebootWeather(current_city_name);
    }
});