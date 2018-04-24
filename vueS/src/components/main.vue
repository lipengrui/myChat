<template>
  <el-container>
      <el-header>
        {{userData['username']}}
        <div class="right">
<el-button  v-if="userData['username']!='请登录'" @click="exit()">退出</el-button>
        </div>

      </el-header>
      <el-container>
          <el-aside width="0px">

<el-menu :default-active="activeUrl" router class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" :collapse="isCollapse">

  <el-menu-item :index="item.path" v-for="item in pathData" :key="item.path">
    <i :class="item.icon"></i>
    <span slot="title">{{item.name}}</span>
  </el-menu-item>
</el-menu>

          </el-aside>
          <el-main>
            <router-view></router-view>
          </el-main>
      </el-container>
  </el-container>
</template>
<script>
import Vue from 'vue'
import VueSocketio from 'vue-socket.io';

require('../assets/css/base.css');
    export default {
        name: 'mainCon',
       data() {
      return {
          activeUrl:this.$route.path,
        isCollapse: false, // 是否水平
        userData: {username:'请登录'},
        pathData: [
            {
          path:'/chat',
          name: '聊聊天',
          icon: 'el-icon-star-on'
        },
        {
          path: '/toview',
          name: '查看数据',
          icon: 'el-icon-star-on'
        },
        {
          path: '/discount',
          name: '优惠码管理',
          icon: 'el-icon-star-on'
        },{
          path: '/calculate',
          name: '结算中心',
          icon: 'el-icon-star-on'
        }
        ]
      };
    },
    sockets: {
      loginCover: function (res) {
        this.$message({
          message: '该账号已在其他客户端登陆，此次登陆被迫下线',
          type: 'error'
        });
        this.$router.push({'path':'/'});
        sessionStorage.removeItem('login_msg');
      }
    },
    methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
      exit(){
        this.http.get( this.baseUrl + '/exit/' + JSON.parse(sessionStorage.getItem('login_msg')).cid).then(response => {
          if(response.data.code == 0){
            this.$message({
              message: '已退出登录',
              type: 'success'
            });
            this.$router.push({'path':'/'})
          }else {
            this.$message({
              message: response.data.message,
              type: 'error'
            })
          }
        })
      }
    },
    created() {
      if (JSON.parse(sessionStorage.getItem('login_msg')) == null) {
        this.$router.push({'path': '/'});
        return;
      }
      this.userData.username = JSON.parse(sessionStorage.getItem('login_msg')).username;
      this.$socket.emit('bindName',{cid: JSON.parse(sessionStorage.getItem('login_msg')).cid});
    }
}
</script>
<style lang="css" scoped>
.el-menu-item{
    text-align: left;
}
.el-container{
    height:100%;
}
.el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }

  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 200px;
  }

  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    line-height: 160px;
  }

  body > .el-container {
    margin-bottom: 40px;
  }
.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    /* min-height: 400px; */
  }
</style>

