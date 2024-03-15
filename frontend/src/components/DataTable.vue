<!--db 테이블을 표시하는 컴포넌트-->
<template>
  <div id="app">
    <v-layout row justify-center>
      <v-dialog v-model="dialog" persistent>
        <v-card>
          <v-card-title>
            <span class="headline">{{ dialogTitle }}</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12>
                  <v-text-field label="번호" v-model="contactInfo.contactId" required></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field label="지역명" v-model="contactInfo.name" required></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field label="위도" v-model="contactInfo.lat" required></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field label="경도" v-model="contactInfo.lon" required></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="btnClick($event)">취소</v-btn>
            <v-btn color="blue darken-1" text @click="btnClick($event)">확인</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
    <v-btn color="primary" v-on:click.native="addContact()">추가</v-btn>
    <v-btn color="primary" v-on:click.native="addCurrentContact()">현재 위치 추가</v-btn>
    <v-data-table :headers="headers" :items="items" class="elevation-1">
      <template v-slot:item="row">
        <!-- row를 클릭했을 때 이벤트를 감지해 handleClick 함수를 실행 -->
        <tr @click="handleClick(row.item)">
          <td>{{ row.item.contactId }}</td>
          <td>{{ row.item.name }}</td>
          <td>{{ row.item.lat }}</td>
          <td>{{ row.item.lon }}</td>
          <td class="text-xs-right">
            <!-- 수정 버튼 클릭 시 updateContact 함수 실행 하지만 tr의 하위 요소인 td.v-btn에서 이벤트가 일어났을 때도 handleClick 함수가 실행되는 오류가 생김 -->
            <!-- 이 현상을 해결하기 위해 updataeContact, deleteContact 함수 안에 event.stopPropagation()를 사용해 상위 요소로 이벤트가 전파되는걸 방지 -->
            <v-btn color="primary" v-on:click.native="updateContact(row.item, $event)">수정</v-btn>
            <v-btn color="primary" v-on:click.native="deleteContact(row.item, $event)">삭제</v-btn>
          </td>
        </tr>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      urlinfo: 'http://localhost:8000/contacts',
      contactInfo: {
        _id: null,
        contactId: null,
        name: null,
        lat: null,
        lon: null,

      },
      dialog: false,
      dialogTitle: null,
      exContactId: 100,
      headers: [
        { text: '번호', align: 'left', value: 'contactId' },
        { text: '지역명', align: 'left', value: 'name' },
        { text: '위도', align: 'left', value: 'lat' },
        { text: '경도', align: 'left', value: 'lon' },
        { text: '관리', align: 'left', value: '' },
      ],
      items: []
    }
  },
  created() {
    axios.get(this.urlinfo) //서버에 요청하기
      .then((res) => {
        console.log(res.data); //성공시
        this.items = res.data;
      })
      .catch((err) => {
        alert('에러 발생: ' + err); //에러 발생
      });
    this.$bus.$on('sendCordinate', this.setCordinate);
    this.$bus.$on('sendLocation', (res) => {
      console.log('이벤트 수신');
      this.contactInfo.name = res;
    });

  },
  methods: {
    // 행을 클릭할 때 그 행의 위도, 경도 값을 이벤트 버스로 구글맵에 보내는 역할
    handleClick(item) {
      // 행을 클릭할 때 호출됩니다.
      console.log('클릭된 lat:', item.lat);
      console.log('클릭된 lon:', item.lon);
      this.$bus.$emit('sendlatlon', { lat: item.lat, lon: item.lon });
    },
    addContact() {
      this.dialog = true;
      this.dialogTitle = "추가";
    },
    setCordinate(cordinate) {
      this.lat = cordinate.lat() // lat과 lng에 이벤트버스로 받아온 cordinate의 lat과 lng값을 저장
      this.lng = cordinate.lng()
    },
    addCurrentContact() {
      this.dialogTitle = "current";

      //alert(`${this.name}`);
      if (this.dialogTitle == "current") {
        axios.post(this.urlinfo, {
          contactId: this.exContactId,
          name: this.contactInfo.name, //this.contactInfo.name,
          lat: this.lat,
          lon: this.lng
        })
          .then(() => {
            axios.get(this.urlinfo) //서버에 요청하기
              .then((res) => {
                //console.log(res.data); //성공시
                this.items = res.data;
                this.exContactId++;
                console.log("가져온 지역 이름은 " + this.contactInfo.name);
                alert('성공');
              })
              .catch((err) => {
                alert('에러 발생: ' + err); //에러 발생
              });

          })
          .catch((err) => {
            alert('에러 발생: ' + err); //에러 발생
          });
      }


    },
    updateContact(data, event) {
      event.stopPropagation(); // 이벤트 전파 중지 (상위 요소들이 이벤트를 감지하지 못하게 함)
      this.dialog = true;
      this.dialogTitle = "수정";
      this.contactInfo.contactId = data.contactId;
      this.contactInfo.name = data.name;
      this.contactInfo.lat = data.lat;
      this.contactInfo.lon = data.lon;
    },
    deleteContact(data, event) {
      event.stopPropagation(); // 이벤트 전파 중지 (상위 요소들이 이벤트를 감지하지 못하게 함)
      this.dialog = true;
      this.dialogTitle = "삭제";
      this.contactInfo.contactId = data.contactId;
      console.log('deleteContact : ' + data);
    },
    btnClick($event) {
      this.dialog = false;
      if ($event.target.innerHTML == "확인") {
        if (this.dialogTitle == "추가") {
          axios.post(this.urlinfo, {
            contactId: this.contactInfo.contactId,
            name: this.contactInfo.name,
            lat: this.contactInfo.lat,
            lon: this.contactInfo.lon  //, register_date:this.contactInfo.register_date
          })
            .then(() => {
              axios.get(this.urlinfo) //서버에 요청하기
                .then((res) => {
                  //console.log(res.data); //성공시
                  this.items = res.data;
                  alert("데이터 추가 성공");

                })
                .catch((err) => {
                  alert('에러 발생: ' + err); //에러 발생
                });

            })
            .catch((err) => {
              alert('에러 발생: ' + err); //에러 발생
            });

        }
        else if (this.dialogTitle == "수정") {
          //alert("입력된 정보 : " + "이메일 : " + this.contactInfo.email + " 패스워드 : " + this.contactInfo.password);
          axios.put(this.urlinfo + '/' + this.contactInfo.contactId, {
            contactId: this.contactInfo.contactId,
            name: this.contactInfo.name,
            lat: this.contactInfo.lat,
            lon: this.contactInfo.lon
          })
            .then(() => {
              axios.get(this.urlinfo) //서버에 요청하기
                .then((res) => {
                  //console.log(res.data); //성공시
                  this.items = res.data;
                  alert("업데이트 성공");
                })
                .catch((err) => {
                  alert('에러 발생1: ' + err); //에러 발생
                });
            })
            .catch((err) => {
              alert('에러 발생2: ' + err); //에러 발생
            });

        }
        else {
          axios.delete(this.urlinfo + '/' + this.contactInfo.contactId, { data: { contactId: this.contactInfo.contactId } })
            .then((result) => {
              console.log("삭제 후" + result); //성공시
              axios.get(this.urlinfo) //서버에 요청하기
                .then((res) => {
                  this.items = res.data;
                  alert("삭제 성공");
                })
                .catch((err) => {
                  alert(' 삭제 후 데이터 가져오는 중 에러 발생: ' + err); //에러 발생
                });
            })
            .catch((err) => { alert('에러 발생: ' + err); });

        }
      }


      this.contactInfo.contactId = null;
      this.contactInfo.name = null;

      this.contactInfo.lat = null;
      this.contactInfo.lon = null;
    }



  }
}
</script>
<style scoped>
div {
  margin: 0 5px 0 5px;
}
</style>