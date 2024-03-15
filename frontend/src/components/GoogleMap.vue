<!--맵을 띄우는 컴포넌트-->
<template>
    <div>
        <input v-model="city" placeholder="지명 검색">
        <button @click="searchLocation">검색</button>
        <div id="map-canvas"></div>
    </div>
</template>

<script>
export default { //export default를 사용해 다른쪽에서 얘를 사용할 수 있게 함
    name: 'map-canvas',
    mounted() {
        this.initMap();
        this.setMarker(this.mapCenter, "ce");
        //db테이블에서 위도 경도 데이터를 sendlatlon 이라는 이름으로 emit 했기 때문에
        this.$bus.$on('sendlatlon', this.setCordinate) // db테이블에서 위도 경도 데이터를 받아오기 위해 sendlatlon 이라는 이름으로 on (데이터를 받음)
    },
    methods: {
        setCordinate(cordinate) {
            console.log('Received LatLon:', cordinate.lat, cordinate.lon);
            const lat = cordinate.lat;
            const lon = cordinate.lon;
            const latlng = { lat: lat, lng: lon };
            this.map.setCenter(latlng);
            this.$bus.$emit('sendCordinate', this.map.getCenter());

        },
        initMap() {
            this.map = new google.maps.Map(document.getElementById("map-canvas"), { //getElementById로 map id 속성의 요소를 가져온다.
                center: this.mapCenter, //center로 할 위도, 경도를 지정한다.
                zoom: 17, //zoom size를 지정.
                maxZoom: 20,
                minZoom: 3,
                streetViewControl: true,
                mapTypeControl: true,
                fuulscreenControl: true,
                zoomControl: true,
            });
            this.$bus.$emit('sendCordinate', this.map.getCenter()); // 처음 마운트될 때 지도의 중심점 좌표를 전달
            // 받을땐 on 보낼땐 emit
            // 위 emit한 값들은 맵의 중심좌표(위도 경도)로 날씨, 일기 예보, 기온을 중심좌표에 있는 지역을 기준으로 가져오기위해 이벤트버스로 값을 보낸것이다.
        },
        setMarker(Points, Label) {//지도에 마커를 찍는 함수.
            const markers = new google.maps.Marker({
                position: Points,
                map: this.map,
                label: {
                    text: Label,
                    color: "#FFF",
                },
            });
            this.map.addListener('center_changed', () => { // center가 바뀌면 실행(지도를 옮기면 좌표가 바뀌므로 좌표를 갱신해야 함)
                markers.setPosition(this.map.getCenter())
            });
            this.map.addListener('dragend', () => { // 드래그를 놓으면 실행, 지도를 옮겼을 때 바뀐 중심좌표를 보내주기 위해 emit
                this.$bus.$emit('sendCordinate', this.map.getCenter());
            });
        },
        // 검색된 지명을 이용하여 지오코딩을 수행
        // 지오코딩이란 주소를 지리좌표(위도, 경도)로 변환하는 과정으로 구글에서 제공하는 API
        searchLocation() {
            // 지명을 이용하여 지오코딩을 수행
            this.geocoder.geocode({ address: this.city }, (results, status) => {
                // 지오코딩이 성공하면 status가 OK이고 results에 지오코딩 정보가 담김
                if (status === 'OK' && results[0].geometry) {
                    // 결과에서 좌표를 가져와서 location 변수에 저장
                    const location = results[0].geometry.location;
                    // 검색된 위치를 지도의 중심점으로 설정
                    this.map.setCenter(location);
                    // 이벤트 버스를 통해 중심 좌표를 다른 컴포넌트로 전달
                    this.$bus.$emit('sendCordinate', this.map.getCenter());
                } else {
                    // 실패시 에러메시지를 콘솔에 출력
                    console.error('지오코딩 실패:', status);
                }
            });
        },
    },
    data() {
        return {
            map: null,
            mapCenter: { lat: 35.105696, lng: 129.042857 },
            city: '', //입력한 지명 저장
            geocoder: new google.maps.Geocoder(), // 지오코딩 객체 생성
        };
    },
};
</script>

<style scoped>
#map-canvas {

    height: 400px;
}
</style>