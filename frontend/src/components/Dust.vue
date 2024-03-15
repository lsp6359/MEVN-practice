<!--미세먼지 수치를 보여주는 컴포넌트-->
<template>
    <div>
        <div class="location">국가 : {{ country }}</div>
        <div class="location">도시 : {{ city }}</div>
        <div class="pollution">미세먼지 : {{ aqi }}</div>
        <div class="pollution">{{ aqiStatus }}</div>
        <div class="time">날짜 : {{ formattedTime }}</div>
        <div class="time">위도 : {{ lat }}</div>
        <div class="time">경도 : {{ lng }}</div>
    </div>
</template>

<script>
export default {
    name: 'dust-info',
    data() {
        return {
            city: '', //대전
            country: '', // South Korea
            time: 0,
            aqi: 0,
            lat: 0,
            lng: 0
        }
    },
    created() {
        // 컴포넌트가 생성될 때(라이프 사이클에서 create 될 때) 이벤트버스의 이벤트를 받을 수 있도록 준비
        // sendCordinate라는 이벤트버스가 오면 setCordinate라는 함수 실행
        this.$bus.$on('sendCordinate', this.setCordinate)
    },
    methods: {
        setCordinate(cordinate) {
            this.lat = cordinate.lat() // lat과 lng에 이벤트버스로 받아온 cordinate의 lat과 lng값을 저장
            this.lng = cordinate.lng()

            this.axios.get(`http://api.airvisual.com/v2/nearest_city?lat=${this.lat}&lon=${this.lng}&rad=500&key=20a9df0a-8b49-4878-8783-b5125bc56545`)
                // 내 키 : 20a9df0a-8b49-4878-8783-b5125bc56545
                .then((response) => {
                    let data1 = response.data
                    this.city = data1.data.city
                    this.country = data1.data.country
                    this.time = data1.data.current.pollution.ts
                    this.aqi = data1.data.current.pollution.aqius // 미국기준
                })
                .catch((error) => {
                    console.log(error)
                })
        }
    },
    computed: {
        aqiStatus: function () {
            if (this.aqi >= 0 && this.aqi <= 50) {
                return '좋음';
            } else if (this.aqi > 50 && this.aqi <= 100) {
                return '보통';
            } else {
                return '나쁨';
            }
        },
        formattedTime: function () {
            const date = new Date(this.time);
            const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
            return date.toLocaleString('ko-KR', options);
        }
    }
}
</script>

<style scoped>
.location {
    text-align: center;
    color: rgb(0, 0, 0);
}

.time {
    text-align: center;
    color: rgb(0, 0, 0);
}

.pollution {
    text-align: center;
    color: rgb(255, 0, 0);
}
</style>