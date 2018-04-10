<template>
  <div id="app" @click="clickButton('123')">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  sockets:{
    connect: function(){
      console.log('socket connecte123d')
    },
    loginStatus: function (res) {
      if (!!res) {
        sessionStorage.removeItem('login_msg');
        sessionStorage.setItem('login_msg', JSON.stringify(res));
      }
    },
  },
  methods: {
    clickButton: function(val){
//        console.log('dainji')
      // $socket is socket.io-client instance
    //  this.$socket.emit('user', 'eeeee');
    }
  },
  created() {
//      console.log(this)
//    console.log(this.$socket)
  }
}
</script>

<style>
#app{
  height:100%;
}
</style>
