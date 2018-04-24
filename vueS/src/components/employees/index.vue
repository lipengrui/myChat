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
              <span>{{sec.sessionUser[0].username}}</span>
              <!-- <span class="Badge absolute">4</span> -->
          </li>
        </ul>
  <div class="header relative">
    <ul class="clear">
      <li v-for="(item, userIndex) in sec.sessionUser" :key="item.name" class="left relative jianParent pointer">
          <img :src="!!item.img?item.img: '../../../static/images/logo.png'" alt="图片加载失败">
          <span>{{item.username}}</span>
          <i class="jian iconfont icon-53 absolute" v-if="sec.isMaster" @click="removeuser(index, sec.roomId, userIndex, item)"></i>
      </li>
      <li class="border_style_dashed na_add hover000 relative left pointer" v-if="sec.roomId != 0 && Number(sec.sessionUser.length) + Number(1) < userList.length" @click="addgroup(sec)"> <i class="iconfont icon-jia"></i> </li>
        <el-button v-if="sec.roomId != '_' && sec.isMaster" class="lineH26 right" type="danger" @click="removeSession(sec.roomId, index ,sec.isMaster)">删除聊天</el-button>
        <el-button v-if="sec.roomId != '_' && !sec.isMaster" class="lineH26 right" type="danger" @click="editSession(sec.roomId, index, sec.isMaster)">退出聊天</el-button>
    </ul>
    <!-- <p class="absolute header_p" v-if="sessionUser.length == 1"> 正在输入...</p> -->
    <p class="absolute header_p" v-if="sec.roomId == '_'"> 请选择对话人物</p>
  </div>
  <ul class="ly_flex1 sec_con" :ref="sec.roomId" :rooId="sec.roomId">
    <li v-for="(record) in roomRecord[sec.roomId]" :key="record.nowTime" :class="{isMy: record.isMy}">
      <p class="timer" v-if="record.nowTime - inItValue.lateTime  >= inItValue.awaitTime">{{util.formatDate(new Date(record.nowTime), 'yy-MM-dd hh:mm')}}</p>
      <div class="con clear">
      <img class="head lineH1em" src="../../../static/images/logo.png" :class="{ left: !record.isMy, right: record.isMy}" alt="">
      <p class="context" :class="{ left: !record.isMy, right: record.isMy}">{{record.message}}</p>
      </div>
    </li>
  </ul>
    </section>
      <div class="sec_bottom ly_flex" id="messge">
    <el-input
      placeholder="请输入内容"
      v-model="message"
      class="ly_flex1"
      :style = "{display: 'block'}"
      clearable>
    </el-input>
<el-button type="primary" @click="send">发送</el-button>
  </div>
    <aside class="@slideR friendbox fn_friendbox" :style="friendbox" @mouseleave="hiddenFriendbox">
        <div class="na_ulParent">

        <ul>
          <li v-for="(item, listIndex) in userList" :key="item.cid" class="clear pointer" @click="addSession(item)" v-if="!item.self">
              <img :src="!!item.img?item.img: '../../../static/images/logo.png'" alt="图片加载失败" class="left">
              <span class="left">{{item.username}}</span>
              <el-button type="primary" class="fa_button right" v-if="!inItValue.addgroup && !inItValue.creategroup" @click="creatRoom(item)">发送消息</el-button>
              <!-- <el-button type="danger" class="fa_button right" v-if="inItValue.addgroup && inItValue.groupName.indexOf(item.cid) != -1" @click="creatRoom(JSON.stringify(item))">移除</el-button>
              <el-button type="primary" class="fa_button right" v-if="inItValue.addgroup && inItValue.groupName.indexOf(item.cid) == -1" @click="adduser(item)">加入</el-button> -->

               <el-button type="primary" class="fa_button right" v-if="(inItValue.addgroup || inItValue.creategroup) && !item.selected" @click="addListUser(item, listIndex)">加入</el-button>
              <el-button type="danger" class="fa_button right" v-if="(inItValue.addgroup || inItValue.creategroup) && item.selected" @click="removeListUser(item, listIndex)">移除</el-button>
          </li>
        </ul>
        </div>
        <div v-if="inItValue.creategroup || inItValue.addgroup" class="absolute pB25 na_groupSure">
             <el-button type="primary" class="sure_button" @click="grouped">确定</el-button>
            <el-button class="sure_button" @click="hiddenFriendbox">取消</el-button>
          </div>
    </aside>
     </div>
    
  </div>
</template>
<script>
require('../../assets/css/modify.css')
import Vue from 'vue'
import VueSocketio from 'vue-socket.io'
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
          createRoomId: JSON.parse(sessionStorage.getItem('login_msg')).cid,
          createSessionUser: [],
          currentRoomId: '_', // 当前会话选择的roomid
          currentIndex: 0, // 当前会话在整个会话中的下标
          roomIndex: 0,
        },
        userList: [],
        userOldList: [
          // {cid: 1, name: '李1', img: '', status: true, selected: false},
          // {cid: 2,name: '李2', img: '', status: true, selected: false},
          // {cid: 3,name: '李3', img: '', status: true, selected: false},
        ],
        sessionStatus: { // 房间状态
          '_': true,
        },
        roomRecord:{},
        sessionList: [
          {roomId:'_' ,sessionUser:[]},
        ]
      }
  },
  filters: {
      json: function (value) {
        return JSON.stringify(value);
      }
    },
    created(){
    //   this.http.get( this.baseUrl + '/getuser').then(response => {
    //     if(response.data.code ==0 && !!response.data.data){
    //       console.log(response.data)
    //       this.userList = response.data.data;
    //       this.userList.forEach(element => {
    //         element['selected'] = false;
    //         element['self'] = false;
    //         if( element.cid == JSON.parse(sessionStorage.getItem('login_msg')).cid ){
    //           element['self'] = true;
    //         }
    //       });
    //       this.userOldList = this.util.deepCopyArrayObj(this.userList);
    //     }else if(response.data.code == 1){
    //       this.$router.push({path: '/'})
    //     }
    // });
    this.$socket.emit('getuser');
    },
   sockets:{
     getuser: function (res) {
      this.userList = res;
        this.userList.forEach(element => {
          element['selected'] = false;
          element['self'] = false;
          if( element.cid == JSON.parse(sessionStorage.getItem('login_msg')).cid ){
            element['self'] = true;
          }
        });
      this.userOldList = this.util.deepCopyArrayObj(this.userList);
     },
    message: function (res) {
      const { message, nowTime, roomId } = res[0];
      if (!this.roomRecord[roomId]) this.roomRecord[roomId] = [];
      // console.log(this.roomRecord[roomId])
      this.roomRecord[roomId].push({message: message, nowTime: nowTime, isMy: false});
      this.roomRecord = Object.assign({}, this.roomRecord);
      // this.roomRecord[roomId] = this.util.deepCopyArrayObj(this.roomRecord[roomId]);
      // const nowTime = res[1];
      // let timer = '';
      //   if ( nowTime - this.inItValue.lateTime  >= this.inItValue.awaitTime){
      //     timer = `<p class="timer">${this.util.formatDate(new Date(nowTime), 'yy-MM-dd hh:mm')}</p>`;
      //   }
      //   var creatLi = document.createElement('li');
      //   creatLi.innerHTML = ` ${timer}
      // <div class="con clear">
      // <img class="head left lineH1em" src="../../../static/images/logo.png" alt="">
      // <p class="left context">${message}</p>
      // </div>`;
      // this.$refs[this.inItValue.currentRoomId][0].appendChild(creatLi);
      // this.inItValue.lateTime = nowTime;
    },
    removeroomIng: function (roomId) {
      console.log('removeinmg')
      this.$socket.emit('removeroomIng', roomId);
    },
    addroomIng: function (roomId) {
      this.$socket.emit('addroomIng', roomId);
    },
    removeroomed: function (res) {
      const { roomId, oldRoomId ,type ,cid} = res;
      console.log('退出群组'+oldRoomId);
      if( cid == JSON.parse(sessionStorage.getItem('login_msg')).cid ) {
        const { index } = this.util.filterArrayObj(this.sessionList, {roomId: oldRoomId});
        this.sessionList.splice(index, 1);
        this.selectSession( this.sessionList[index -1 ].roomId );
        delete this.sessionStatus[oldRoomId];
        delete this.roomRecord[oldRoomId];
      }
    },
    addroomed: function (res) { // 已经加入群组的回调
    const { roomId, oldRoomId } = res;
    console.log('已经加入群组的参数',res)
      console.log('加入了群组');
      if(!this.roomRecord[oldRoomId]) { this.roomRecord[oldRoomId] = []; }
      const cidList = roomId.split('_');
      const currentCid = JSON.parse(sessionStorage.getItem('login_msg')).cid;
      if (this.sessionStatus.hasOwnProperty(oldRoomId) && oldRoomId !='_') { // 之前已经新建过
      console.log('之前已经新建过')
        const { index, arr }  = this.util.filterArrayObj(this.sessionList, {roomId: oldRoomId})
        console.log(oldRoomId+'编辑之前的参数'+roomId)
        this.editSessionUser(oldRoomId, roomId);
      
        //  this.sessionList = Object.assign({}, this.sessionList);
      }else { //  第一次新建
      console.log('第一次新建')
          let itemData = [], isMaster = false;
          if(cidList[0] == currentCid){isMaster = true;};
          cidList.forEach( element => {
            if (element != currentCid){
              itemData.push({cid: element})
            }
          });
          this.util.fullArrayObj(itemData, this.userList, 'cid');
          itemData.forEach( element => {
            element.selected = true;
          });
          this.sessionList.push({
           roomId: roomId,
           isMaster: isMaster,
          sessionUser: itemData
        });

      }
        this.selectSession(roomId);
    }
  },
  computed: {
    comUserList: function () {
      return this.userList;
    }
  },
  methods: {
    // 根据前后 roomId 变化 增减会话中的user
    editSessionUser(oldRoomId, roomId){
      console.log('编辑群组的参数','oldRoomId',oldRoomId, 'roomId',roomId);
      const cidList = roomId.split('_');
      const oldCidList = oldRoomId.split('_');
      const getroomIdSession = this.util.filterArrayObj(this.sessionList, {roomId: oldRoomId});
      const userL = [];
      for(let i = 0,l =cidList.length; i< l; i++ ){ // 添加user
          if (cidList[i] != JSON.parse(sessionStorage.getItem('login_msg')).cid) {
            const { index, arr } = this.util.filterArrayObj(this.userList, {cid: cidList[i]})
            arr[0].selected = true;
            userL.push(arr[0])
          }
      }
      this.sessionList[getroomIdSession.index].sessionUser = userL;
      this.sessionList[getroomIdSession.index].roomId = roomId;
      this.roomRecord[roomId] = [];
      this.roomRecord[roomId] = this.util.deepCopyArrayObj(this.roomRecord[oldRoomId]);
        if (this.sessionStatus.oldRoomId){ // 正在当前节点
          this.sessionStatus[oldRoomId] = false;
          this.sessionStatus[roomId] = true;
        }else {
          this.sessionStatus[roomId] = false;
        }
        delete this.roomRecord[oldRoomId];
        console.log(this.roomRecord)
        delete this.sessionStatus[oldRoomId];
     
    },
    addroom(roomId){
      this.$socket.emit('editroom', {roomId: roomId,oldRoomId: '_', cid: JSON.parse(sessionStorage.getItem('login_msg')).cid});
    },
    editroom(roomId, oldRoomId) { // 加入群组
    if (oldRoomId ==undefined){
        oldRoomId = this.inItValue.currentRoomId;
    }
    console.log(roomId+'////'+ this.inItValue.currentRoomId)
      this.$socket.emit('editroom', {roomId: roomId,oldRoomId: oldRoomId, cid: JSON.parse(sessionStorage.getItem('login_msg')).cid});
    },
    creategroup(command){// 添加群组
    switch (command) {
      case 'group':
      this.inItValue.creategroup = true;
      this.inItValue.addgroup = false;
      this.showFriendbox();
      break;
    }
    },
    grouped() { 
    if (this.inItValue.creategroup){// 确定创建群组
        if(this.inItValue.createSessionUser.length <= 0) return;
        let is_status = this.panhoveroomId(this.inItValue.createRoomId);
        if(is_status.is_have){
          this.selectSession(is_status.room);return;
        }
          // this.sessionList.push({
          //     roomId: this.inItValue.createRoomId,
          //     isMaster: true,
          //     sessionUser: this.inItValue.createSessionUser
          //   });
        this.roomRecord[this.inItValue.createRoomId] = [];
        this.addroom(this.inItValue.createRoomId);
        this.selectSession(this.inItValue.createRoomId);
        this.hiddenFriendbox();
    }else if (this.inItValue.addgroup){ // 确定对群组的修改
        // this.sessionList.splice(this.inItValue.currentIndex,1,{roomId: this.inItValue.createRoomId, isMaster: true,sessionUser: this.inItValue.createSessionUser});
        // delete this.sessionStatus[this.inItValue.currentRoomId];
        // this.roomRecord[this.inItValue.createRoomId] = this.util.deepCopyArrayObj(this.roomRecord[this.inItValue.currentRoomId]);
        // delete this.roomRecord[this.inItValue.currentRoomId];
        this.editroom(this.inItValue.createRoomId, this.inItValue.currentRoomId);
        this.selectSession(this.inItValue.createRoomId);
        this.hiddenFriendbox();
    }
    },
    addgroup(currentgroup) {  // 加入群组
    if (currentgroup.roomId == '_'){
      this.showFriendbox();
      return;
    }
      this.util.fullArrayObj(this.userList, currentgroup.sessionUser, 'cid'); // 将当前会话的用户列表 付给所有用户的状态
      console.log(this.inItValue.currentRoomId)
      this.inItValue.currentIndex = this.util.filterArrayObj(this.sessionList, {roomId: this.inItValue.currentRoomId}).index;
      console.log(this.util.filterArrayObj(this.sessionList, {roomId: this.inItValue.currentRoomId}))
      this.inItValue.createSessionUser = this.util.deepCopyArrayObj(this.sessionList[this.inItValue.currentIndex].sessionUser) ;

      this.inItValue.createRoomId = this.inItValue.currentRoomId;
      this.inItValue.addgroup = true;
      this.showFriendbox();
    },
    removeuser(roomIndex, roomId, userIndex, item, ) { // 移除人员
    const len = this.sessionList[roomIndex].sessionUser.length;
    if ( len <= 2){
      const resove = confirm('确定将会删除该会话') 
      if(resove){
          this.removeSession(roomId, roomIndex , true);
        return;
      }else{

        return;
      }
    }
    const createRoomId_arr = roomId.split('_');
    let indexa = (createRoomId_arr).indexOf(String(item.cid));
    const exp = new RegExp('_' + item.cid,'g');
    let creatRoomId = this.inItValue.currentRoomId;
    creatRoomId = this.inItValue.currentRoomId.replace(exp,'');
    this.editroom(creatRoomId, this.inItValue.currentRoomId);
    // this.selectSession(this.inItValue.currentRoomId);
    },
    removeSession(roomId, roomIndex, isMaster){// 删除聊天
      // delete this.sessionStatus[this.inItValue.currentRoomId];
      // this.sessionList.splice(roomIndex,1);
      console.log(this.sessionList);
      // const selectroom = this.sessionList[roomIndex - 1].roomId;
      this.$socket.emit('deleteRoom', {roomId: this.inItValue.currentRoomId, isMaster: isMaster, cid: JSON.parse(sessionStorage.getItem('login_msg')).cid})
      // this.selectSession(selectroom);
    },
    editSession(roomId, roomIndex, isMaster) { // 退出聊天
        const cid = JSON.parse(sessionStorage.getItem('login_msg')).cid;
        const exp = new RegExp('_' + cid,'g');
        const createRoomId = this.inItValue.currentRoomId.replace(exp,'');
        this.editroom(createRoomId);

        // this.sessionStatus[createRoomId] = true;
        // delete this.sessionStatus[roomId];
        // this.roomRecord[createRoomId] = this.util.deepCopyArrayObj(this.roomRecord[createRoomId]);
        // delete this.roomRecord[createRoomId];
        // this.sessionList[roomIndex].sessionUser = this.util.removeArrayObj(this.sessionList[roomIndex].sessionUser, {cid: cid});
        // this.sessionList = this.deepCopyArrayObj(this.sessionList);
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
      panhoveroomId(roomId){ // 判断是否存在roomid
      let is_status= {is_have: false, room: ''};
        for (let key in this.sessionStatus){
          if (this.util.equals(key.split('_'), roomId.split('_'))){is_status.is_have = true, is_status.room = key};
        }
        return is_status
      },
      selectSession(roomId) { // 根据roomid选择会话  没有roomid 的话会 新建并选中
      let is_status= {is_have: false, room: ''};
      if (roomId == 0){
        roomId="_";
      }
      for (let key in this.sessionStatus){
          if (this.util.equals(key.split('_'), roomId.split('_'))){is_status.is_have = true, is_status.room = key};
          this.sessionStatus[key] = false;
        }
        if (is_status.is_have){
          this.sessionStatus[is_status.room] = true;
          this.inItValue.currentRoomId = is_status.room;
        }else {
          this.sessionStatus[roomId] = true;
          this.inItValue.currentRoomId = roomId;
        }
      this.sessionStatus = Object.assign({}, this.sessionStatus)
      },
      addListUser(item, index){
        this.userList[index].selected = true;
          this.inItValue.createRoomId += ('_' + item.cid);
          this.inItValue.createSessionUser.push(item);
          this.userList = this.util.deepCopyArrayObj(this.userList);
      },
      removeListUser(item, index){
        this.userList[index].selected = false;
        const exp = new RegExp('_' + item.cid,'g');
        const createRoomId_arr =this.inItValue.createRoomId.split('_');
        let indexa = (createRoomId_arr).indexOf(String(item.cid));
         this.inItValue.createRoomId = this.inItValue.createRoomId.replace(exp,'');
         this.inItValue.createSessionUser.splice(indexa-1,1);
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
      creatRoom(item){ // 创建新房间
      const login_msg = JSON.parse(sessionStorage.getItem('login_msg'));
      const itemData = item;
      itemData.selected = true;
      const roomId = JSON.parse(sessionStorage.getItem('login_msg')).cid + '_' + itemData.cid;
      const is_status = this.panhoveroomId(roomId);
      if(!is_status.is_have ) { // 之前没有新建
        this.addroom(roomId);
      }else {
          this.selectSession(roomId)
      }
      },
      send(){
        const nowTime = new Date().getTime();
        const username = JSON.parse(sessionStorage.getItem('login_msg')).cid;
        this.$socket.emit('message', {message:this.message,nowTime:nowTime, roomId:this.inItValue.currentRoomId});
        this.roomRecord[this.inItValue.currentRoomId] = this.roomRecord[this.inItValue.currentRoomId] || [];
        this.roomRecord[this.inItValue.currentRoomId].push({message: this.message, nowTime: nowTime, isMy: true});
      //   let timer = '';
      //   if ( nowTime - this.inItValue.lateTime  >= this.inItValue.awaitTime){
      //     timer = `<p class="timer">${this.util.formatDate(new Date(nowTime), 'yy-MM-dd hh:mm')}</p>`;
      //   }
      //   var creatLi = document.createElement('li');
      //   creatLi.className = 'isMy';
      //   creatLi.innerHTML = ` ${timer}
      // <div class="con clear">
      // <img class="head right lineH1em" src="../../../static/images/logo.png" alt="">
      // <p class="right context">${this.message}</p>
      // </div>`;
      // this.$refs[this.inItValue.currentRoomId][0].appendChild(creatLi);
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
        this.inItValue.addgroup = false;
        this.inItValue.creategroup = false;
        this.inItValue.currentIndex = 0;
        this.inItValue.createRoomId = JSON.parse(sessionStorage.getItem('login_msg')).cid;
        this.inItValue.createSessionUser = [];
        this.friendbox = { display: 'block'};
        this.userList = this.util.deepCopyArrayObj(this.userOldList);
        setTimeout( () => {
          this.friendbox= {display: 'none'};
        }, 300)
      }
  }






  
}
</script>
<style lang="css" scoped>
#messge{
  width: 600px;
  position: absolute;
  bottom: 0;
  left:0; right:0;
    margin: 0 auto;
}
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
  margin: 0 20%;
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


