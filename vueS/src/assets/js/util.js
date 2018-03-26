// 格式化时间
export const util = {
    formatDate: function (obj,fmt){
        const o ={
          'M+':obj.getMonth() + 1,//获取月份
          'd+':obj.getDate() ,//获取日
          'h+':obj.getHours(),//获取小时
          'm+':obj.getMinutes(),//获取分钟
          's+':obj.getSeconds(),//获取秒钟
          'q+':Math.floor((obj.getMonth()+3)/3),//获取季度
          'S':obj.getMilliseconds()//获取毫秒
        };
        if( /(y+)/.test(fmt)){
          fmt = fmt.replace(RegExp.$1,(obj.getFullYear()+"").substr(4-RegExp.$1.length));
        }
        for( var k in o){
          if( new RegExp("("+k+")").test(fmt)){
            fmt = fmt.replace(RegExp.$1,(RegExp.$1.length == 1)?(o[k]):(('00'+o[k]).substr((''+o[k]).length)));
          }
        }
        return fmt;
      }
};