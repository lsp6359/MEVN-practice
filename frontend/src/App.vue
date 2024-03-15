<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>Vuetify</span>
        <span class="font-weight-light">MATERIAL DESIGN</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn href="https://github.com/vuetifyjs/vuetify/releases/latest" target="_blank" text>
        <span class="mr-2">Latest Release</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <div>
        
        <table border="1" height="500px">
          <tr>
            <td><current-weather /><dust/></td>
            <td><google-map /></td>
          </tr>
          <tr>
            <td>
              <forecast />
            </td>
            <td>
              <data-table />
            </td>
          </tr>
        </table>

      </div>
    </v-main>
  </v-app>
</template>

<script>
import DataTable from './components/DataTable';
import GoogleMap from './components/GoogleMap'; // 구글맵 컴포넌트 추가
import CurrentWeather from './components/CurrentWeather';
import Forecast from './components/Forecast';
import Dust from './components/Dust';


export default {
  name: 'App',
  components: {
    DataTable, // db테이블 등록
    CurrentWeather, // 기온 컴포넌트 등록
    Forecast, // 날씨 예보 컴포넌트 등록
    GoogleMap, // 구글맵 컴포넌트 등록
    Dust // 미세먼지 컴포넌트 등록
  },
  data: () => ({
    //
  }),
}
</script>
<style scoped>
h2 {
  margin-top: 20px;
  margin-left: 10px;
  color: blue;
}

table {
  margin: 0 auto;
  /* 좌우 여백을 자동으로 설정하여 가운데 정렬합니다. */
}
</style>
