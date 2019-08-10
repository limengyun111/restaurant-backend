var limengyun111 = {
  compact: function (ary) {
    return ary.filter(it => it)
  },
  fill: function (array, value, start = 0, end = array.length) {
    for (var i = start; i < end; i++) {
      array[i] = value
    }
    return array
  },

  indexOf: function (array, value, index = 0) {
    if(index < 0){
      index = array.length - Math.abs(index)
      if(index < 0){
        index = 0
      }
    }
      for (var i = index; i < array.length; i++) {
        if (array[i] === value) {
          return i
        }
      }
    return -1
   
  },

  join: function (array, separator=",") {
    var result = ""
    for(var i = 0;i < array.length - 1;i++){
      result = result + array[i] + separator
    }
    return result + array[length - 1]
  },

  flatten: function (array) {
    var result = []
    array.forEach(element => {
      result = result.concat(element)
    })
    return result
  },
// includes需要分很多种情况吗，比如数组和对象
  // includes:function (collection,value,index = 0){
    
  // },
  flip:function (func) {
    return function(...args) {
     return func(...args.reverse())
    }
  },
  
  before:function(n,func){
    var times = 0
    var lastresult
    return function(){
      times++
      if(times < n){
        return lastresult = func(...args)
      }else{
        return lastresult
      }
    } 
  },
  
  after:function(n,func){
    var times = 0
    return function (...args){
      times++
      if(times < n){
        return
      }else{
        return func(...args)
      }
    }
  },


  ary:function(f,n = f.length){
    return function(...args){
        return f(...args.slice(0,n))
    }
  },

  unary:function(f){
   return ary(f,1)
  },

  spread:function(f){
    return function(ary){
      return f.apply(null,ary)
    }
  },

  memoize:function(func){
    var cache = {}
    return function(arg){
       if(arg in cache){
         return cache[arg]
       }else{
         return cache[arg] = f(arg)
       }
    }
  },
  forOwn:function(obj,iterator){
    for(var key in obj){
      if(obj.hasOwnProperty(key)){
        iterator(obj[key],key,obj)
      }
    }
  },
  lastIndexOf:function(array,value,index = array.length - 1){
    for(var i = index; i >= 0;i--){
      if(array[i] === value){
        return array.length - 1 - i
      }
    }
  },
  reverse:function(ary){
   var i = 0;
   var j = ary.length - 1
   while(i < j){
     t = ary[i]
     ary[i] = ary[j]
     ary[j] = t
     i++
     j--
   }
   return ary
  },
  sortedIndex:function(array, value){
    var l = 0;
    var r = array.length
    while(l <= r){
      var mid = (l + r) >> 1
      array[mid] > value? r = mid + 1:l = mid  -1
    }
    return l
  },
  union:function(arrays){
   var array = arrays.reduce((a,b)=>a.concat(b))
   return [...new Set([...array])]
  },
  matches:function(src){
    return function(obj){
      return ismatch(obj,src)
    }
  },
  ismatch:function(obj,src){
    for(var key in src){
      if(typeof src[key] =="object" && src[key] !==null){
        if(!ismatch(src[key],obj[key])){
          return false
        }
      }else{
        if(src[key] !== obj[key]){
          return false
        }
      }
    }
    return true
  },
  bind:function(f,thisArg,...fixedArgs){
    var acturalArgs = [...fixedArgs]
     return function(...args){
        for(var i = 0;i < acturalArgs.length;i++){
          if(acturalArgs[i]== window){
            acturalArgs[i] = args.shift()
          }
        }
        acturalArgs.push(...args)
        return f.apply(thisArg,acturalArgs)
     }     
  },
 toPath:function(str){
   return str.split(/\.|\[|\]./g)
 },
 get:function(obj,path,defaultVal){
   var path = this.toPath(path)
   for(var i = 0;i < path.length;i++){
     if(path[i] == undefined){
       return defaultVal
     }
     obj = obj[path[i]]
   }
 },
 matchedProperty:function(path,value){
   return function(obj){
     return isEqual(get(obj,path),value)
   }
 },
 property:function(path){
   return function(obj){
     return get(obj,path)
   }
 },

 
}