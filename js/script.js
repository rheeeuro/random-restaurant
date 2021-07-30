var mapUiResetBtn = document.getElementById('mapUiResetBtn');
var mapUiListBtn = document.getElementById('mapUiListBtn');
var mapUiLocationBtn = document.getElementById('mapUiLocationBtn');

var infowindow, mapContainer, map, ps;
var hereImg, yellowImg;
var keyword, range;
var userCoords = {
    latitude: 37.566826,
    longitude: 126.9786567
};
var userLocation, userMarker, bounds;
var restaurants, restaurantMarkers;



function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function initKakaoMap(){
    infowindow = new kakao.maps.InfoWindow({zIndex:1});

    mapContainer = document.getElementById('map'), // 지도를 표시할 div 
        mapOption = {
            center: new kakao.maps.LatLng(37.566826, 126.9786567), // 지도의 중심좌표
            level: 3 // 지도의 확대 레벨
    };

    hereImg = new kakao.maps.MarkerImage(
        '../img/here.png',
        new kakao.maps.Size(40, 60), new kakao.maps.Point(20, 60));
    yellowImg = new kakao.maps.MarkerImage(
        '../img/yellow.png',
        new kakao.maps.Size(40, 60), new kakao.maps.Point(20, 60));

        
    map = new kakao.maps.Map(mapContainer, mapOption); 
    ps = new kakao.maps.services.Places(map); 
    userMarker = new kakao.maps.Marker({
        position: userLocation,
        image: hereImg
    });
    userMarker.setMap(map);
}

function initGeolocation(){
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition( success, fail );
    }
    else {
        alert("Sorry, your browser does not support geolocation services.");
    }
}

function success(position){
    userCoords.latitude = position.coords.latitude;
    userCoords.longitude = position.coords.longitude;

    userLocation = new kakao.maps.LatLng(userCoords.latitude, userCoords.longitude);

    initKakaoMap();
    searchRestaurant();
}

function fail(){
    // Could not obtain location
}

function searchRestaurant(){
    bounds = new kakao.maps.LatLngBounds();
    document.getElementById('popup').innerHTML = '';
    if (keyword === ''){
        for(let i=1 ; i<=3 ; i++){
            ps.categorySearch('FD6', placesSearchCB, {x: userCoords.longitude, y: userCoords.latitude, radius: range, page: i, size: 15}); 
        }
    } else {

        var div = document.createElement("div");
        var p = document.createElement("p");
        p.innerText = keyword;
        div.classList.add("keyword-title");
        div.appendChild(p);
        document.getElementById('mapContainer').appendChild(div);

        for(let i=1 ; i<=3 ; i++){
            ps.keywordSearch(keyword + '맛집', placesSearchCB, {page: i, size: 15});
        }
    }
}

// 키워드 검색 완료 시 호출되는 콜백함수 입니다
function placesSearchCB (data, status, pagination) {
    if (status === kakao.maps.services.Status.OK) {
        const filtered = data.filter(d => d.category_group_name === "음식점");
        restaurants = restaurants.concat(filtered);
        for (var i=0; i<filtered.length; i++) {
            displayMarker(filtered[i]);
            createItem(filtered[i]);
        }   
        randomRestaurant();    
    }
}

function createItem(item){
    var a = document.createElement("a");
    a.href = item.place_url;
    var div = document.createElement("div");
    div.classList.add("popup-list-item");
    var h1 = document.createElement("h1");
    var span1 = document.createElement("span");
    span1.classList.add("item-title");
    span1.innerText = item.place_name;
    var span2 = document.createElement("span");
    span2.classList.add("item-category");
    span2.innerText = item.category_name.slice(6);
    var p = document.createElement("p");
    p.innerText = item.road_address_name;

    h1.appendChild(span1);
    h1.appendChild(span2);
    div.appendChild(h1);
    div.appendChild(p);
    a.appendChild(div);
    document.getElementById('popup').appendChild(a);
}

function randomRestaurant(){
    console.log(restaurants);
    // 랜덤 이벤트
    const randomIndex = Math.floor(Math.random() * restaurants.length);
    console.log(randomIndex)

    for(var i=0 ; i<restaurantMarkers.length ; i++){
        restaurantMarkers[i].setImage();
    }
    restaurantMarkers[randomIndex].setZIndex(3);
    restaurantMarkers[randomIndex].setImage(yellowImg);
    const randomElement = restaurants[randomIndex];



    rendomRouletteUi(randomIndex);
    randomResultUi(randomElement);
}

function rendomRouletteUi(randomIndex){
    if (document.getElementById('roulette')){
        document.getElementById('roulette').remove();
    }
    var div = document.createElement("div");
    div.id = 'roulette';

    var ul = document.createElement("ul");
    for(let i=randomIndex ; i<restaurants.length; i++){
        var li = document.createElement("li");
        var h6 = document.createElement("h6");
        h6.innerText = restaurants[i].category_name.slice(6);
        var p = document.createElement("p");
        p.innerText = restaurants[i].place_name;
        li.appendChild(h6);
        li.appendChild(p);
        ul.appendChild(li);
    }
    for(let i=0 ; i<randomIndex; i++){
        var li = document.createElement("li");
        var p = document.createElement("p");
        p.innerText = restaurants[i].place_name;
        li.appendChild(p);
        ul.appendChild(li);
    }
    div.appendChild(ul);
    document.getElementById('mapContainer').appendChild(div);
    ul.animate([
        // keyframes
        { transform: `translateY(-${(restaurants.length-1)*100}px)` },
        { transform: `translateY(-${(restaurants.length-1)*81}px)` },
        { transform: `translateY(-${(restaurants.length-1)*64}px)` },
        { transform: `translateY(-${(restaurants.length-1)*49}px)` },
        { transform: `translateY(-${(restaurants.length-1)*36}px)` },
        { transform: `translateY(-${(restaurants.length-1)*25}px)` },
        { transform: `translateY(-${(restaurants.length-1)*16}px)` },
        { transform: `translateY(-${(restaurants.length-1)*9}px)` },
        { transform: `translateY(-${(restaurants.length-1)*4}px)` },
        { transform: `translateY(-${(restaurants.length-1)*1}px)` },
        { transform: `translateY(-${(restaurants.length-1)*0}px)` },
      ], {
        // timing options
        duration: 2000,
        });
    document.getElementById('mapContainer').addEventListener('click', ()=>{
        document.getElementById('roulette').style.display = 'none';
    })
}

function randomResultUi(element){
    if (document.getElementById('random-result')){
        document.getElementById('random-result').remove();
    }
    var div = document.createElement("div");
    var p = document.createElement("p");
    p.innerText = '선정된 음식점: ' + element.place_name;
    div.id = 'random-result'
    div.appendChild(p);
    div.addEventListener('click', ()=>{
        location.href = element.place_url;
    })
    document.getElementById('mapContainer').appendChild(div);
}


function displayMarker(place) {
    var point = new kakao.maps.LatLng(place.y, place.x) 
    var marker = new kakao.maps.Marker({
        map: map,
        position: point,
    });
    restaurantMarkers.push(marker);
    // 마커에 클릭이벤트를 등록합니다
    kakao.maps.event.addListener(marker, 'click', function() {
        // 마커를 클릭하면 장소명이 인포윈도우에 표출됩니다
        infowindow.setContent('<a href="' + place.place_url + '"><div style="padding:5px;font-size:12px;color:black;">' + place.place_name + '</div></a>');
        infowindow.open(map, marker);
    });

    bounds.extend(point);
    map.setBounds(bounds);
}

function onListBtn(){
    document.getElementById('map-block').style.display = 'block';
    document.getElementById('popup-container').style.display = 'block';
    document.getElementById('popupCloseBtn').addEventListener('click', onCloseBtn);
    document.getElementById('map-block').addEventListener('click', onCloseBtn);
}

function onLocationBtn(){
    map.panTo(userLocation);
    console.log(restaurants);
}

function onCloseBtn(){
    document.getElementById('map-block').style.display = 'none';
    document.getElementById('popup-container').style.display = 'none';
}

function onResetBtn(){
    map.setBounds(bounds);
}

function init(){
    restaurants = [];
    restaurantMarkers = [];
    keyword = getParameterByName('keyword')
    range = parseInt(getParameterByName('range'))

    initGeolocation();

    mapUiListBtn.addEventListener('click', onListBtn);
    mapUiLocationBtn.addEventListener('click', onLocationBtn);
    mapUiResetBtn.addEventListener('click', onResetBtn);
    
}

if (mapUiBackBtn){
    init();
}