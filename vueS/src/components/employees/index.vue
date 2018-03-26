<template>
  <div>
     <el-row>
       <el-col :span="8" class="grid-content bg-purple-light pointer backgHover relative"><span class="fill backgHover000" @mouseenter="showFriendbox">聊天</span>  </el-col>
       <el-col :span="8" class="grid-content bg-purple pointer backgHover relative"><span class="fill backgHover000" @mouseenter="showFriendbox">朋友</span> </el-col>
       <el-col :span="8" class="grid-content bg-purple-light pointer backgHover relative"><span class="fill backgHover000" @mouseenter="showFriendbox">我</span> </el-col>
     </el-row>
     <div class="relative">
<section class="chat relative ly_flex ly_flex_col">
  <div class="header relative">
    <ul class="clear">
      <li v-for="item in sessionUser" :key="item.name" class="left">
          <img :src="!!item.img?item.img: '../../../static/images/logo.png'" alt="图片加载失败">
          <span>{{item.name}}</span>
      </li>
    </ul>
    <p class="absolute header_p" v-if="sessionUser.length == 1"> 正在输入...</p>
    <p class="absolute header_p" v-if="sessionUser.length == 0"> 请选择对话人物</p>
  </div>
  <ul class="ly_flex1 sec_con" ref="con_text">



    <!-- <li v-for="(item, index) in dataList" :key="index">
      <p class="timer">{{item.time}}</p>
      <div class="con clear">
      <img class="head left" src="../../../static/images/logo.png" alt="">
      <p class="left context">{{item.text}}</p>
      </div>
    </li> -->
    <!-- <li>
      <div class="con clear">
      <img class="head left" src="../../../static/images/logo.png" alt="">
      <p class="left context">sdfasdf</p>
      </div>
    </li>
    <li>
      <p class="timer">2018-15-22</p>
      <div class="con clear">
      <img class="head left" src="../../../static/images/logo.png" alt="">
      <p class="left context">sdfasdf</p>
      </div>
    </li> -->


<!-- <li class="isMy">
      <p class="timer">2018-15-22</p>
      <div class="con clear">
      <img class="head right" src="../../../static/images/logo.png" alt="">
      <p class="right context">sdfasdf</p>
      </div>
    </li> -->


  </ul>
  <div class="sec_bottom ly_flex">
    <el-input
      placeholder="请输入内容"
      v-model="message"
      class="ly_flex1"
      :style = "{display: 'block'}"
      clearable>
    </el-input>
<el-button type="primary" @click="send">发送</el-button>
  </div>
    </section>
    <aside class="@slideR friendbox fn_friendbox" :style="friendbox" @mouseleave="hiddenFriendbox">
        <ul>
          <li v-for="item in userList" :key="item.name" class="clear" @click="addSession(item)">
              <img :src="!!item.img?item.img: '../../../static/images/logo.png'" alt="图片加载失败" class="left">
              <span class="left">{{item.name}}</span>
          </li>
        </ul>
    </aside>
     </div>
    
  </div>
</template>
<script>
require('../../assets/css/modify.css')
export default {
  name: 'chat',
  data(){
      return{
        friendbox:{ display: 'none' },
        message: '',
        inItValue: {
          lateTime: new Date().getTime(),
          awaitTime: 1 * 10 * 1000
        },
        userList: [
          {cid: 1, name: '李1', img: '', status: true},
          {cid: 2,name: '李2', img: '', status: true},
          {cid: 3,name: '李3', img: '', status: true},
        ],
        sessionUser:[
          {cid: 1, name: '李1', img: '', status: true},
        ]
      }
  },
   sockets:{
    message: function (res) {
      const nowTime = res[1];
      let timer = '';
        if ( nowTime - this.inItValue.lateTime  >= this.inItValue.awaitTime){
          timer = `<p class="timer">${this.util.formatDate(new Date(nowTime), 'yy-MM-dd hh:mm')}</p>`;
        }
        var creatLi = document.createElement('li');
        creatLi.innerHTML = ` ${timer}
      <div class="con clear">
      <img class="head left" src="../../../static/images/logo.png" alt="">
      <p class="left context">${res[0]}</p>
      </div>`;
      this.$refs.con_text.appendChild(creatLi);
      this.inItValue.lateTime = nowTime;
    },
  },
  methods: {
     handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
      addSession(item){
        let is_have = false;
        let index = 0;
        for (let i=0; i< this.sessionUser.length; i++){
          if (this.sessionUser[i].cid == item.cid){
            index = i;
            is_have = true; break;
          }
        }
        if(is_have){ // 已存在
               this.sessionUser.splice(index,1);
        }else{ // 不存在
              this.sessionUser.push(item);
        }
      },
      send(){
        const nowTime = new Date().getTime();
        this.$socket.emit('message', this.message,nowTime);
        let timer = '';
        if ( nowTime - this.inItValue.lateTime  >= this.inItValue.awaitTime){
          timer = `<p class="timer">${this.util.formatDate(new Date(nowTime), 'yy-MM-dd hh:mm')}</p>`;
        }
        var creatLi = document.createElement('li');
        creatLi.className = 'isMy';
        creatLi.innerHTML = ` ${timer}
      <div class="con clear">
      <img class="head right" src="../../../static/images/logo.png" alt="">
      <p class="right context">${this.message}</p>
      </div>`;
      this.$refs.con_text.appendChild(creatLi);
      this.inItValue.lateTime = nowTime;
      this.message = '';
      },
      showFriendbox(){
        this.friendbox={display: 'block'};
        setTimeout( () => {
          this.friendbox= {opacity:1, right:0, display: 'block'};
        }, 100)
      },
      hiddenFriendbox(){
        this.friendbox = { display: 'block'};
        setTimeout( () => {
          this.friendbox= {display: 'none'};
        }, 300)
      }
  }






  
}
</script>
<style lang="css" scoped>
.sec_bottom{
  height:40px;
}


.header_p{
  top:0;left:0;bottom: 0;right:0;
  line-height: 52px;
}
.header ul{
  padding: 1px 0;
  height: 52px;
  overflow-y: hidden;
  overflow-x: auto;
  border-bottom: 1px solid #ccc;
}
.header li{
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 70px;
  height:50px;
  line-height: 50px;
}
.header span{
  display: block;
  width:100%;
  font-size: 14px;
  text-align: center;
  line-height: 1em;
}
.header img{
  margin-left: 20px;
  height:30px;
  display: block;
}
.sec_bottom input{
  display: block;
}
.friendbox{
  overflow-y: auto;
  padding: 30px 0;
}
.friendbox li{
  height:50px;
  line-height: 50px;
  text-align: left;
  padding:10px;
}
.friendbox li:nth-child(odd){
  background-color:rgba(200,200,200,.2);
}
.friendbox li:hover{
  background-color: rgba(200,200,200,.6);
}
.friendbox img{
  width: 40px;
  height: 40px;
  margin-top: 5px;
}
.friendbox span{
  margin-left: 20px;
}
  .chat{
    width:600px;
    height:80vh;
    margin: 0 auto;
    box-shadow: 0px 0px 2px 2px #ccc;
  }
  .el-row {
    margin-bottom: 20px;
    height: 40px;
    line-height: 40px;
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
  .friendbox{
    width: 400px;
    background-color: rgba(0,0,0, .05);
    position: absolute;
    border-radius: 6px;
    box-shadow: 2px 2px 20px 1px rgba(255,255,255, .3);
    top: 0;
    bottom:0;
    opacity: 0;
    right: -10px;
    /* opacity: 1;
    right: 0px; */
    transition: opacity ease-in-out .5s, right ease-in-out .3s;
  }
</style>


