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
      },
    /**
   * 深拷贝对象
   */
  deepCopyObj : function (obj) {
    if (obj instanceof Array || typeof obj != 'object') {
        return obj;
    }
    let newobj = {};
    for (let attr in obj) {
        newobj[attr] = this.deepCopyObj(obj[attr]);
    }
    return newobj;
  },
   /*
  * 拷贝对象数组
  * */
  deepCopyArrayObj: function ( array ) {
    let arr = [];
    for ( let arrItem of array ) {
      if ( arrItem instanceof Array) {
        arr.push(this.deepCopyArrayObj(arrItem));
        continue;
      } else if (arrItem instanceof Object) {
        let obj = {};
        for ( const key in arrItem) {
          obj[key] = arrItem[key];
        }
        arr.push(obj);
        continue;
      } else {
        arr.push(arrItem);
        continue;
      }
    }
    return arr;
  },
  equals : function(array1, array2){ // 比较俩个数组里的值是否相等
    array1 = array1.sort();
    array2 = array2.sort();
    if (!array1 || !array2)
           return false;
  
     // compare lengths - can save a lot of time 
    if (array1.length != array2.length)
         return false;

   for (var i = 0, l = array1.length; i < l; i++) {
       // Check if we have nested arrays
        if (array1[i] instanceof Array && array2[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this.equals(array1[i], array2[i]))
               return false;       
        } else if (array1[i] != array2[i]) { 
             // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;   
        }           
    }       
     return true;
  },
  /*
   *
   * 用后面对象去填充前面对象
   *  arg1 = {a: 1, b:'', } arg2 = {a:2, b:'bb', c:'cc'}
   * fullObj(arg1, arg2, ['a'])  ==> arg1= {a:1,b:'bb'}
   * */
  fullObj: function ( first, second, reserve) {
    for ( const key in first ) {
      if ( reserve.includes(key) ) {
        continue;
      } else {
        first[key] = second[key] || '';
      }
    }
  },

  // 用后面的数组内的对象 覆盖前面数组里 对象 根据 特点值来区别数组内的顺序
  /**
   * let aa = [{a:1,b:2,c:3},{a:4,b:5},{a:6,b: 8}];
      let bb = [{a:7,b:'bb'},{a:1,b:'bb',c:'cc'},{a:4, b:'bb'}];
      fullArrayObj(aa,bb,'a');  => [{a:1,b:'bb',c:'cc'},{a:4, b:'bb'},{a:6,b: 8}]
   * 
   */
  fullArrayObj: function (arry1, arry2, key) {
    for (let i = 0, l = arry1.length; i < l;  i++){
      for(let j = 0, n = arry2.length; j < n;  j++){
        if (arry1[i][key] == arry2[j][key] ){
          arry1[i] = arry2[j];
        }
      }
    }
  },
  //筛选出 具备某一特定值  里的数组对象里的某一个对象
  filterArrayObj: function (target ,obj) {
    let finisharr = [];
    let index = [];
    for (let i = 0, l = target.length; i< l; i++){
      let is_true = false;
      for (let key in obj){
        if(target[i][key] == obj[key]){
          is_true = true;
        }else {
          is_true = false;
        }
      }
      if (is_true){
        finisharr.push(target[i]);
        index.push(i);
      }
    }
    // target.forEach( ele => {
    //   let is_true = false; // 是否满足obj里的条件
      // for (let key in obj){
      //   if(ele[key] == obj[key]){
      //     is_true = true;
      //   }else {
      //     is_true = false;
      //   }
      // }
      // if (is_true){
      //   finisharr.push(ele);
      // }
    // });
    return {index: index, arr: finisharr};
  },
};