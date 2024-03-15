# MEVN-practice

# 초기 설정
npm install

# 프로그램 시작
backend cmd -> node index.js
frontend cmd -> npm run serve

크롬 - http://localhost:8080/

# 서비스 시나리오
1. 구글 지도를 옮겨서 놓으면 해당 지도의 중앙 좌표값에 해당하는 지역의 현재 날씨 정보와 일기 예보 정보, 미세먼지 정보를 표시했습니다. 미세먼지는 0~50까진 좋음, 51~100까진 보통, 101~150까진 나쁨으로 설정하였습니다.
2. 입력 창을 이용하여 지명을 입력하면 해당 지명의 좌표 정보를 얻어 지도의 위치를 옮기고 날씨 정보, 일기 예보 정보, 미세먼지 정보를 갱신하도록 만들었습니다.
3. DataTable.vue에 MongoDB연동을 통해 테이블을 읽어와 표시하였고 사용자가 직접 번호, 지역명, 위도, 경도를 입력해 테이블에 추가, 수정, 삭제가 가능하도록 만들었고 현재 위치 추가 버튼을 클릭하면 현재 지도에 중앙 좌표값에 해당하는 지역의 지역명, 위도, 경도가 자동으로 들어가 추가되게 됩니다.
4. 테이블에 있는 데이터들 중 원하는 데이터가 들어있는 row를 클릭하게 되면 그 행에 들어있는 위도 경도에 맞게 지도의 중앙 좌표값이 이동하고 해당하는 지역의 현재 날씨 정보와 일기 예보 정보, 미세먼지 정보를 갱신하도록 만들었습니다.
   

![image](https://github.com/lsp6359/MEVN-practice/assets/130120597/9ff32296-65d4-4d1f-855f-2aaaf938fada)

# 사용한 API
Google Maps API: 지도를 표시하고 지도 이동 시 이벤트 처리를 위해 사용
OpenWeather API: 날씨 정보, 일기 예보를 가져오기 위해 사용
IQair API : 미세먼지 정보를 가져오기 위해 사용
backend API : 수업시간에 실습했던 DB 테이블을 읽어와 보여주기 위해 사용
Geocoding API : 구글맵에서 제공하는 API로 주소를 지리좌표(위도, 경도)로 변환해줌

# 화면구성
테이블은 2x2의 형태로, 왼쪽 위에는 기온, 미세먼지 정보, 오른쪽 위에는 구글 지도, 왼쪽 아래에는 날씨 정보, 오른쪽 아래에는 DB 테이블이 표시됩니다.

# 버스 구조

![image](https://github.com/lsp6359/MEVN-practice/assets/130120597/37fbc4e4-f600-424a-9180-9643af416d75)

From GoogleMap.vue
구글맵에선 중앙 좌표값의 위도 경도를 CurrentWeather, Dust, Forecast, DataTable 로 이벤트버스를 통해 보냅니다.
CurrentWeather는 이벤트버스로 받은 위도, 경도값을 기반으로 해당 지역의 이름, 날씨, 기온을 보여줍니다.
Dust에서도 버스로 받은 위도, 경도값을 기반으로 해당 지역의 상세이름, 미세먼지, 시간 등을 표시합니다.
Forecast에서도 버스로 받은 위도, 경도값을 기반으로 해당 지역의 일기 예보를 받아 향후 5일간의 예보를 보여줍니다.
DataTable에서도 버스로 위도, 경도값을 받아옵니다. “현재 위치 추가” 버튼을 눌렀을 때 자동으로 가르키고있는 위도, 경도값을 테이블에 삽입하기 위한 목적입니다.

From CurrentWeather.vue
CurrentWeather에서 지역이름을 이벤트버스를 통해 DataTable로 보냅니다.
DataTable에서 “현재 위치 추가” 버튼을 눌러 자동으로 지역명을 테이블에 삽입하기 위한 목적입니다.

From DataTable.vue
DataTable에서 테이블에 저장되어있는 위도, 경도값을 이벤트버스를 통해 Google맵으로 보냅니다.
테이블을 눌렀을 때 저장되어 있는 위도, 경도로 구글맵을 자동으로 움직이게 하기 위한 목적입니다.
Googlemap에선 DataTable에서 버스로 보낸 위도 경도를 받은 위도, 경도를 가지고 중앙 좌표값을 갱신합니다.

# 데이터베이스 테이블 구조

![image](https://github.com/lsp6359/MEVN-practice/assets/130120597/863949c7-25de-42b9-a13c-dab84194dde6)

contactId : 번호
name : 지역명
lat : 위도
lon : 경도

# 컴포넌트
1) CurrentWeather.vue
현재 날씨, 기온을 표시하는 컴포넌트로 GoogleMap에서 sendCordinate라는 이름으로 이벤트 버스를 보내면 거기서 위도, 경도를 받아 
axios.get으로 http://api.openweathermap.org/data/2.5/weather?lat=(받아온위도)&lon=(받아온경도)&appid=(자신의 api 키) 로 요청을 보내 위도와 경도를 중심으로 그 지역의 이름, 날씨, 온도등을 보여주는 컴포넌트입니다.

2) DataTable.vue
몽고DB를 이용해 테이블을 만들고 저장되어있는 테이블을 보여주는 컴포넌트입니다.

3) Dust.vue
미세먼지 수치를 보여주는 컴포넌트입니다.
googleMap의 위도 경도를 받아와 그 위치를 중심으로 지역명과 날짜, 미세먼지 농도를 가져와 수치로 표시하고 수치에 따라 좋음, 보통, 나쁨으로 표기해 보여줍니다.

4) Forecast.vue
일기 예보를 보여주는 컴포넌트입니다.
googleMap의 위도 경도를 받아와 그 위치를 중심으로 지역의 일기 예보를 현재 요일 포함 5일 후 까지의 일기를 예보해 줍니다.

5) GoogleMap.vue
구글에서 제공한 맵을 보여주는 컴포넌트입니다.




