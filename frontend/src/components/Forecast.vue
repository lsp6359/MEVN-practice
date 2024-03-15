<!--일기 예보를 보여주는 컴포넌트-->
<template>
    <div>
        <ul class="forecasts">
            <template v-for="(forecast, i) in forecasts">
                <!-- 조건이 만족할 때만 실행, 아래 key는 key값으로 forecast.dt(api 설명서 보면 나옴)를 사용하겠다 (키값으로 서로다른걸 구분하기 위해 사용)-->
                <li v-if="i % 8 == 0" :key="forecast.dt" class="item">
                    <div class="weekday">
                        <!-- 실질적으로 dt(시간정보)로 요일 계산해야함 -->
                        <!-- "|" 는 심플 파이프로 convertToDate로 나온 데이터가 weekday로 넘어감 -->
                        {{ convertToDate(forecast.dt) | weekday }}
                    </div>
                    <div class="icon">
                        <img :src="`http://openweathermap.org/img/w/${forecast.weather[0].icon}.png`">
                        <!-- 바인딩(:)을 붙어야함 src앞에 그래야 그림 나옴-->
                    </div>
                    <div class="temperature">
                        {{ (forecast.main.temp - 273.15).toFixed(0) }}℃
                    </div>
                </li>

            </template>
        </ul>
    </div>
</template>

<script>
export default {
    name: 'forecast',
    data() {
        return {
            forecasts: [],
            lat: 37.566535,
            lon: 126.977969
        }
    },
    
    filters: {
        weekday(date) {
            let weekdayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
            return weekdayName[date.getDay()]; // getDay는 요일계산, 0이면 일, 1이면 월, 2이면 화...
        }
    },
    created() {
        this.$bus.$on('sendCordinate', this.setCordinate)
    },
    methods: {
        setCordinate(cordinate) {
            this.lat = cordinate.lat() // lat과 lng에 이벤트버스로 받아온 cordinate의 lat과 lng값을 저장
            this.lng = cordinate.lng()
            this.axios.get(`http://api.openweathermap.org/data/2.5/forecast?lat=${this.lat}&lon=${this.lon}&appid=bb672980c6646d75f90e1270c968590e`)
            // 내키 : bb672980c6646d75f90e1270c968590e
                .then((response) => {
                    let data = response.data
                    this.forecasts = data.list
                })
                .catch((error) => {
                    console.log(error);
                })
        },
        convertToDate(timestamp) {
            return new Date(timestamp * 1000) // 유닉스타임은 초단위이기 때문에 밀리초단위로 바꿔줌
        }
    }
}
</script>

<style scoped>
.forecasts {
    display: flex;
    width: 80%;
    padding: 0;
    margin: 0 auto;
    align-items: center;
    justify-content: center;
    padding-top: 10px;
	background-color: rgb(255, 255, 255);
	height: 100px;
}

.forecasts>li.item {
    position: relative;
    flex: 1;
    color: rgb(0, 0, 0);
    text-align: center;
    list-style-type: none;
}

.forecasts>li.item:first-child:before {
    content: '';
    position: absolute;
    top: -10px;
    left: 50%;
    display: block;
    width: 6px;
    height: 6px;
    margin-left: -3px;
    border-radius: 80%;
    background-color: #ff0000;
}

.forecasts>li.item>.temperature {
    margin-top: -8px;
}</style>