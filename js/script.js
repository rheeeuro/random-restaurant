var mapUiResetBtn = document.getElementById('mapUiResetBtn');
var mapUiListBtn = document.getElementById('mapUiListBtn');
var mapUiLocationBtn = document.getElementById('mapUiLocationBtn');

var infowindow, mapContainer, map, ps;
var keyword, range;
var userCoords = {
    latitude: 37.566826,
    longitude: 126.9786567
};
var userLocation, bounds;
var restaurants;



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
    map = new kakao.maps.Map(mapContainer, mapOption); 
    ps = new kakao.maps.services.Places(map); 
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

    // 이동할 위도 경도 위치를 생성합니다 
    
    // 지도 중심을 부드럽게 이동시킵니다
    // 만약 이동할 거리가 지도 화면보다 크면 부드러운 효과 없이 이동합니다
    // map.panTo(moveLatLon);
    
    // let menu = []
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
        for(let i=1 ; i<=3 ; i++){
            ps.keywordSearch(keyword + '맛집', placesSearchCB, {page: i, size: 15});
        }
    }
}

// 키워드 검색 완료 시 호출되는 콜백함수 입니다
function placesSearchCB (data, status, pagination) {
    if (status === kakao.maps.services.Status.OK) {
        restaurants = restaurants.concat(data);
        for (var i=0; i<data.length; i++) {
            displayMarker(data[i]);
            createItem(data[i]);
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
}

// 지도에 마커를 표시하는 함수입니다
function displayMarker(place) {
    // 마커를 생성하고 지도에 표시합니다
    var point = new kakao.maps.LatLng(place.y, place.x) 
    var marker = new kakao.maps.Marker({
        map: map,
        position: point
    });

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


