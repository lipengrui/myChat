<template>
 <div class="login">
    <div class="login-box-warp">
      <div class="login-box">
        <div class="title">
          {{textData == 'login'?'登录': '注册'}}
        </div>
        <div class="form">
          <form id="formlogin" method="post" onsubmit="return false;">
              <p class="msgError"> <a v-if="hintMsg"><i class="el-icon-information"></i>&nbsp;&nbsp;{{hintMsg}}</a></p>
              <div class="item item-fore1">
                  <el-input placeholder="用户名" v-model="loginData.name">
                    <template slot="prepend">
                      <i class="iconfont el-icon-edit-outline"></i>
                    </template>
                  </el-input>
              </div>

              <div class="item item-fore2">
                  <el-input placeholder="密码" type="password" @keydown.13.native="subLoginMsg()" v-model="loginData.password">
                      <template slot="prepend">
                        <i class="iconfont el-icon-tickets"></i>
                      </template>
                  </el-input>
              </div>
          <div class="item item-fore2" v-if="textData!='login'">
            <el-input placeholder="再一次输入确认密码" type="password" @keydown.13.native="subLoginMsg()" v-model="loginData.resurePassword">
              <template slot="prepend">
                <i class="iconfont el-icon-tickets"></i>
              </template>
            </el-input>
          </div>
              <div class="item">
                <div v-if="textData!='login'" class="ly_flex ly_flex_ali_center">
                  <el-input
                    placeholder="请输入验证码"
                    v-model="loginData.validation"
                    clearable>
                  </el-input>
                  <aside v-html="vali" @click="captcha()" class="pointer"></aside>
                </div>
                  <el-button v-if="!loginState&&textData=='login'" class="login-btn" type="primary"   @click="subLoginMsg">登&nbsp;&nbsp;录</el-button>
                  <el-button v-else-if="loginState&&textData=='login'" class="login-btn" type="primary" :loading="true">登录中</el-button>
                  <el-checkbox v-if="!loginState&&textData=='login'" v-model="loginData.is_record">是否记录登录</el-checkbox>
                <el-button @click="register" class="register">注册</el-button>
              </div>
          </form>
          <h1 v-html="dd"></h1>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  require('../assets/css/base.css');
export default {
  name: 'login',
  data () {
    return {
      type:0,
      hintMsg:"",   // 错误信息
      loginState:false,
      vali: '',
      loginData:{
        name:"",
        password:"",
        resurePassword: "",
        validation: '',
        is_record: false
      },
      textData: 'login',
      dd: '',
      api:{
        subLoginInfoApi:'subLoginInfoApi'
      }
    }
  },
  created() {
//     this.http.get('http://192.168.1.4:7001/getuser').then(response => {
//       this.dd = response.data.csrf;
// //      console.log(response.data.csrf)
//     })
  },
  methods: {
    register() { // 注册
      if (this.textData != 'register'){
          this.captcha(()=>{this.textData = 'register'});
      }else {
          this.http.post( this.baseUrl + '/register',{
            username: this.loginData.name,
            password: this.loginData.password,
            resure: this.loginData.resurePassword,
            vail: this.loginData.validation
          }).then( response=> {
            console.log(response)
           if (response.data.code == 0){
             this.$message({
                message: '您已成功注册，快去登录吧！',
                type: 'success'
              });
              this.textData = 'login';
           }else{
             this.$message({
               message: response.data.message,
               type: 'error'
             })
           }
          })
      }

    },
    captcha(callback) {
      this.http.get(this.baseUrl + '/register').then( response=> {
        this.vali = response['data'].data;
        callback&&callback();
      })
    },
    subLoginMsg(){
      let vm = this;
//      // 接口所需参数准备
      if(!vm.loginData.name && !vm.loginData.password){
        vm.hintMsg = '请输入用户名和密码';
        return
      }else if(!vm.loginData.name){
        vm.hintMsg = '请输入用户名'
        return
      }else if(!vm.loginData.password){
        vm.hintMsg = '请输入密码'
        return
      }else{
        vm.hintMsg = "";
        vm.loginState = true;
//        this.$router.push({path: '/main'})
      }
//      console.log(document.querySelector('#_csrf'))
//      var xhr = new XMLHttpRequest();
//      xhr.open('GET', 'http://192.168.1.3:7001/add');
//      xhr.withCredentials = true;
//      xhr.error = function (res) {
//          console.log(res)
//      };
//      xhr.send();

//      this.http.defaults.headers.post['Content-Type'] = 'application/json';
      // console.log(this.dd)
      this.http.post( this.baseUrl + '/login',{
//        user: document.querySelector('input[name=_csrf]').value,
//      this.http.post('http://192.168.1.3/course/getlist',{
        is_record: this.loginData.is_record,
        username: this.loginData.name,
        password: this.loginData.password,
        user: this.dd
      }).then(response => {
        this.loginState = false;
        if(response.data.code == 0) {
          this.$message({
            message: '登录成功',
            type: 'success'
          })
          sessionStorage.setItem('login_msg', JSON.stringify(response.data));
          this.$router.push({path:'/main'})
        }else {
          this.$message({
            message: response.data.message,
            type: 'error'
          })
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="css" type="text/css">
  .el-date-editor.el-input, .el-input{
    width: 100%;
  }
  .register{
    width:100%;
    margin:0;
    margin-top:20px;

  }
.login{
    height: 100%;
    width:100%;
    // background: url(./../assets/images/login-bg.jpg) no-repeat;
    background-size: 100% 100%;

  }
.login-box .title {
  width: 100%;
  height: 3.375rem;
  line-height: 3.375rem;
  font-weight: 600;
  font-size: 1rem;
  background-color: #409EFF;
  color: #fff;
  border-radius: .25rem .25rem 0 0;
  text-indent: 20px;
}
  .login-box {
      width: 21.875rem;
      /*height: 18.75rem;*/
      top: 50%;
      left: 50%;
      margin-left: -10.9375rem;
      margin-top: -9.375rem;
      position: fixed;
      z-index: 4;
      background: #fff;
      border-radius: .3125rem;
      border:.0625rem solid #ccc;
      box-sizing: border-box;
  }
#formlogin {
  width: 280px;
  margin: 20px auto;
}
#formlogin .item {
  margin-bottom: 1.25rem;
  padding:0;
}
#formlogin .login-btn {
  display: inline-block;
  width: 100%;
  font-size: 1rem;
  text-align: center;
  color: #fff;
  height: 2.5rem;
  border-radius: .25rem;
}
#formlogin .msgError {
  height: 1.4375rem;
  margin-top: .3125rem;
  margin-bottom: .3125rem;
}
#formlogin .msgError a{
  width: 100%;
  display: inline-block;
  color: #e4393c;
  line-height: .9375rem;
  padding: .1875rem 0;
  text-indent: .3125rem;
  font-size: .75rem;
}
</style>
