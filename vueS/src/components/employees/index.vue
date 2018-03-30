<template>
  <div>
     <el-row>
       <el-col :span="8" class="grid-content bg-purple-light pointer backgHover relative na_more"><el-dropdown @command="creategroup"><span class="fill backgHover000 el-dropdown-link">更多</span> 
       
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="group">群聊</el-dropdown-item>
        <el-dropdown-item>期待更多</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
        </el-col>
       <el-col :span="8" class="grid-content bg-purple pointer backgHover relative"><span class="fill backgHover000" @mouseenter="showFriendbox">朋友</span> </el-col>
       <el-col :span="8" class="grid-content bg-purple-light pointer backgHover relative"><span class="fill backgHover000" @mouseenter="showFriendbox">我</span> </el-col>
     </el-row>
     <div class="relative chatparent">
<section class="chat absolute ly_flex ly_flex_col" v-for="(sec, index) in sessionList" :key="index" :roomId="sec.roomId" v-if="sessionStatus[sec.roomId]">
  <ul class="absolute na_sessionList header">
          <li class="pointer hover000 relative" :class="{active:sessionStatus[sec.roomId] }" v-for="(sec, index) in sessionList" :key="index" v-if="sec.sessionUser.length > 0" @click="selectSession(sec.roomId)">
              <img class="lineH1em" :src="sec.sessionUser[0].img?sec.sessionUser[0].img: '../../../static/images/logo.png'" alt="图片加载失败">
              <span>{{sec.sessionUser[0].name}}</span>
              <!-- <span class="Badge absolute">4</span> -->
          </li>
        </ul>
  <div class="header relative">
    <ul class="clear">
      <li v-for="(item, userIndex) in sec.sessionUser" :key="item.name" class="left relative jianParent pointer">
          <img :src="!!item.img?item.img: '../../../static/images/logo.png'" alt="图片加载失败">
          <span>{{item.name}}</span>
          <i class="jian iconfont icon-53 absolute" @click="removeuser(index, sec.roomId, userIndex)"></i>
      </li>
      <li class="border_style_dashed na_add hover000 relative left pointer" v-if="sec.roomId != 0" @click="sessiongroup(sec.roomId ,index)"> <i class="iconfont icon-jia"></i> </li>
        <el-button v-if="sec.roomId != 0" class="lineH26 right" type="danger">删除聊天</el-button>
    </ul>
    <!-- <p class="absolute header_p" v-if="sessionUser.length == 1"> 正在输入...</p> -->
    <p class="absolute header_p" v-if="sec.roomId == 0"> 请选择对话人物</p>
  </div>
  <ul class="ly_flex1 sec_con" ref="con_text">


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
        <div class="na_ulParent">

        <ul>
          <li v-for="(item, listIndex) in userList" :key="item.c_id" class="clear pointer" @click="addSession(item)">
              <img :src="!!item.img?item.img: '../../../static/images/logo.png'" alt="图片加载失败" class="left">
              <span class="left">{{item.name}}</span>
              <el-button type="primary" class="fa_button right" v-if="!inItValue.addgroup" @click="creatRoom(JSON.stringify(item))">发送消息</el-button>
              <!-- <el-button type="danger" class="fa_button right" v-if="inItValue.addgroup && inItValue.groupName.indexOf(item.c_id) != -1" @click="creatRoom(JSON.stringify(item))">移除</el-button>
              <el-button type="primary" class="fa_button right" v-if="inItValue.addgroup && inItValue.groupName.indexOf(item.c_id) == -1" @click="adduser(item)">加入</el-button> -->

               <el-button type="primary" class="fa_button right" v-if="inItValue.addgroup && !item.selected" @click="addListUser(item.c_id, listIndex)">加入</el-button>
              <el-button type="danger" class="fa_button right" v-if="inItValue.addgroup && item.selected" @click="removeListUser(item.c_id, listIndex)">移除</el-button>
          </li>
        </ul>
        </div>
        <div v-if="inItValue.creategroup" class="absolute pB25 na_groupSure">
             <el-button type="primary" class="sure_button" @click="grouped">确定</el-button>
            <el-button class="sure_button" @click="hiddenFriendbox">取消</el-button>
          </div>
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
          awaitTime: 1 * 10 * 1000,
          addgroup: false, // 是否加入群组
          creategroup: false, // 是否新建群组
          groupName: '',
          roomIndex: 0,
          temporaryGroup: vue.login_msg.c_id
        },
        userList: [
          {c_id: 1, name: '李1', img: '', status: true, selected: false},
          {c_id: 2,name: '李2', img: '', status: true, selected: false},
          {c_id: 3,name: '李3', img: '', status: true, selected: false},
        ],
        userOldList: [
          {c_id: 1, name: '李1', img: '', status: true, selected: false},
          {c_id: 2,name: '李2', img: '', status: true, selected: false},
          {c_id: 3,name: '李3', img: '', status: true, selected: false},
        ],
        sessionStatus: {
          0: true,
        },
        sessionList: [
          {roomId:0 ,sessionUser:[]},
        ]
      }
  },
  filters: {
      json: function (value) {
        return JSON.stringify(value);
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
      <img class="head left lineH1em" src="../../../static/images/logo.png" alt="">
      <p class="left context">${res[0]}</p>
      </div>`;
      this.$refs.con_text.appendChild(creatLi);
      this.inItValue.lateTime = nowTime;
    },
  },
  computed: {
    comUserList: function () {
      return this.userList;
    }
  },
  methods: {
    creategroup(command){// 添加群组
    switch (command) {
      case 'group':
      this.inItValue.creategroup = true;
      this.inItValue.addgroup = true;
      this.showFriendbox();
      break;
    }
    },
    grouped() { // 确定创建群组

    },
    sessiongroup(roomId, roomIndex) {  // 加入群组
      this.showFriendbox();
       this.inItValue.addgroup = true;
      this.inItValue.groupName = String(roomId);
      this.inItValue.roomIndex = roomIndex;
    },
    removeuser(roomIndex, roomId, userIndex) { // 移除人员
console.log(roomIndex, roomId, userIndex)
    },
    adduser(item){ // 添加人员
      this.sessionList[this.inItValue.roomIndex].sessionUser.push(item)
    },
     handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
      selectSession(roomId) { // 根据roomid选择会话  没有roomid 的话会 新建并选中
      for (let key in this.sessionStatus){
          this.sessionStatus[key] = false;
        }
      this.sessionStatus[roomId] = true;
      this.sessionStatus = Object.assign({}, this.sessionStatus)
      },
      addListUser(c_id, index){
        this.$data.userList[index].selected = true;
        this.$data.userList= Object.assign({}, this.userList);
        this.inItValue.temporaryGroup += c_id;
      },
      removeListUser(c_id, index){
        this.userList[index].selected = false;
        this.inItValue.temporaryGroup.indexOf(c_id);
        
      },
      addSession(item){
        // let is_have = false;
        // let index = 0;
        // for (let i=0; i< this.sessionUser.length; i++){
        //   if (this.sessionUser[i].cid == item.cid){
        //     index = i;
        //     is_have = true; break;
        //   }
        // }
        // if(is_have){ // 已存在
        //        this.sessionUser.splice(index,1);
        // }else{ // 不存在
        //       this.sessionUser.push(item);
        // }
      },
      creatRoom(item){ // 创建新会话
      const itemData = JSON.parse(item);
      const roomId = vue.login_msg.c_id + '_' + itemData.c_id;
      if(!this.sessionStatus.hasOwnProperty(roomId) ) { // 之前没有新建
         this.sessionList.push({
           roomId: roomId,
          sessionUser: [
            itemData
          ]
        });
      }
        this.selectSession(roomId)
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
      <img class="head right lineH1em" src="../../../static/images/logo.png" alt="">
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
        // this.inItValue.addgroup = false;
        // this.inItValue.creatgroup = false;
        // this.inItValue.groupName ='';
        // this.friendbox = { display: 'block'};
        // setTimeout( () => {
        //   this.friendbox= {display: 'none'};
        // }, 300)
      }
  }






  
}
</script>
<style lang="css" scoped>
.na_sessionList{
  left:-73px;
  top:0;bottom:0;
  overflow-y: auto;
}
.chatparent{
  height: 80vh;
}
.header .Badge{
  background-color: red;
  color: #fff;
  padding:2px 4px;
  display: block;
  right: 5px;
  top:2px;
  font-size: 12px;
  width: auto;
  border-radius: 50%;
}
.na_sessionList .active{
  background-color: #dbeb94;
}
.sec_bottom{
  height:40px;
}
.fa_button{
  margin-top: 15px;
  margin-right: 50px;
  opacity: 0;
}
.sure_button{

}
.na_add i{
  font-size: 2.5em;
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
.na_ulParent{
  position: absolute;
  padding-top: 30px;
  padding-bottom: 60px;
  top:0;
  left:0;
  bottom:0;
  right:0;
  overflow-y: auto;
}
.friendbox{
  /* overflow-y: auto; */

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
.friendbox li:hover .fa_button{
  opacity: 1;
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
    left:0;right:0;
    margin: 0 auto;
    box-shadow: 0px 0px 2px 2px #ccc;
      background-color: #E9EEF3;
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
    transition: opacity ease-in-out .5s, right ease-in-out .3s;
  }
</style>


