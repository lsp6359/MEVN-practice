<!--기온, 날씨를 표시하는 컴포넌트-->
<template>
    <div id="current-weather">
        <div class="location">{{ location }}</div>
        <div class="weather">{{ weather }}</div>
        <div class="temperature">{{ temperature }}℃</div>
    </div>
</template>

<script>
export default {
    name: 'current-weather',
    data() {
        return {
            location: '',
            weather: '',
            temperature: 0,
            lat: 37.566535,
            lng: 126.977969 // 초기값들
        }
    },
    created() {
        // 컴포넌트가 생성될 때(라이프 사이클에서 create 될 때) 이벤트버스의 이벤트를 받을 수 있도록 준비
        // sendCordinate라는 이벤트버스가 오면 setCordinate라는 함수 실행
        // 구글맵 컴포넌트에서 에서 보낸 이벤트 버스로 안에는 위도, 경도가 들어있다.
        this.$bus.$on('sendCordinate', this.setCordinate)

    },
    methods: {
        setCordinate(cordinate) {
            this.lat = cordinate.lat() // lat과 lng에 이벤트버스로 받아온 cordinate의 lat과 lng값을 저장
            this.lng = cordinate.lng()
            // 요청 URL
            this.axios.get(`http://api.openweathermap.org/data/2.5/weather?lat=${this.lat}&lon=${this.lng}&appid=bb672980c6646d75f90e1270c968590e`)
            // 내키 : bb672980c6646d75f90e1270c968590e
                .then((response) => {
                    let data = response.data // api정보는 openweathermap 들어가보면 상세히 나와있음.
                    this.location = data.name // 지역 이름
                    this.weather = data.weather[0].main // 날씨
                    this.temperature = (data.main.temp - 273.15).toFixed(1) // 온도
                    // DB테이블에서 [현재위치추가] 버튼을 눌렀을 때 지역명칸에 데이터가 자동으로 들어가게 이벤트버스로 지역명 보내기
                    this.$bus.$emit('sendLocation', data.name); 
                    console.log("emit location : " + data.name)
                })
                .catch((error) => {
                    console.log(error)
                })
        }
    }
}
</script>

<style scoped>
.current-weather {
  margin-top: 100px;
  height: 200px
}
.location {
    text-align: center;
    font-size: 40pt;
    color: rgb(0, 0, 0);
}

.weather {
    text-align: center;
    font-size: 20pt;
    font-weight: 100;
    color: rgb(0, 0, 0);
}

.temperature {
    text-align: center;
    font-size: 50pt;
    font-weight: 100;
    color: rgb(0, 0, 0);
}
</style>