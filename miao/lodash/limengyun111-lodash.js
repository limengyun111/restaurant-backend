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
    if (index < 0) {
      index = array.length - Math.abs(index)
      if (index < 0) {
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

  join: function (array, separator = ",") {
    var result = ""
    for (var i = 0; i < array.length - 1; i++) {
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
  flip: function (func) {
    return function (...args) {
      return func(...args.reverse())
    }
  },

  before: function (n, func) {
    var times = 0
    var lastresult
    return function () {
      times++
      if (times < n) {
        return lastresult = func(...args)
      } else {
        return lastresult
      }
    }
  },

  after: function (n, func) {
    var times = 0
    return function (...args) {
      times++
      if (times < n) {
        return
      } else {
        return func(...args)
      }
    }
  },


  ary: function (f, n = f.length) {
    return function (...args) {
      return f(...args.slice(0, n))
    }
  },

  unary: function (f) {
    return ary(f, 1)
  },

  spread: function (f) {
    return function (ary) {
      return f.apply(null, ary)
    }
  },

  memoize: function (func) {
    var cache = {}
    return function (arg) {
      if (arg in cache) {
        return cache[arg]
      } else {
        return cache[arg] = f(arg)
      }
    }
  },
  forOwn: function (obj, iterator) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        iterator(obj[key], key, obj)
      }
    }
  },
  lastIndexOf: function (array, value, index = array.length - 1) {
    for (var i = index; i > 0; i--) {
      if (array[i] === value) {
        return i
      }
    }
    return -1
  },
  reverse: function (ary) {
    var i = 0;
    var j = ary.length - 1
    while (i < j) {
      t = ary[i]
      ary[i] = ary[j]
      ary[j] = t
      i++
      j--
    }
    return ary
  },
  sortedIndex: function (array, value) {
    var l = 0;
    var r = array.length
    while (l < r) {
      var mid = (l + r) >> 1
      array[mid] > value ? r = mid - 1 : l = mid + 1
    }
    return l
  },
  
  matches: function (src) {
    return function (obj) {
      return limengyun111.ismatch(obj, src)
    }
  },
  ismatch: function (obj, src) {
    for (var key in src) {
      if (typeof src[key] == "object" && src[key] !== null) {
        if (!ismatch(src[key], obj[key])) {
          return false
        }
      } else {
        if (src[key] !== obj[key]) {
          return false
        }
      }
    }
    return true
  },
  bind: function (f, thisArg, ...fixedArgs) {
    var acturalArgs = [...fixedArgs]
    return function (...args) {
      for (var i = 0; i < acturalArgs.length; i++) {
        if (acturalArgs[i] == window) {
          acturalArgs[i] = args.shift()
        }
      }
      acturalArgs.push(...args)
      return f.apply(thisArg, acturalArgs)
    }
  },
  toPath: function (str) {
    return str.split(/\.|\[|\]./g)
  },
  get: function (obj, path, defaultVal) {
    var path = limengyun111.toPath(path)
    for (var i = 0; i < path.length; i++) {
      if (path[i] == undefined) {
        return defaultVal
      }
      obj = obj[path[i]]
    }
    return obj
  },
  matchedProperty: function (path, value) {
    return function (obj) {
      return limengyun111.isEqual(limengyun111.get(obj, path), value)
    }
  },
  property: function (path) {
    return function (obj) {
      return limengyun111.get(obj, path)
    }
  },
  chunk: function (array, size = 1) {
    var result = []
    while (array.length > 0) {
      var tmpResult = []
      for (var i = 0; i < size; i++) {
        if (array[i] == undefined) {
          continue
        }
        tmpResult.push(array[i])
      }
      result.push(tmpResult)
      array = array.slice(size)
    }
    return result
  },
  difference: function (array, ...arrays) {
    return array.filter(x => !arrays.flat().includes(x))

  },
  differenceBy: function (array, ...values) {
    if (Array.isArray(values[values.length - 1])) {
      return array.filter(x => !values.flat().includes(x))
    }
    var iterator = values.pop()
    if (typeof iterator == "function") {
      return array.filter(x => !values.map(it => iterator(it)).includes(iterator(x)))
    }
    if (typeof iterator == "string") {
      return array.filter(it => !values.map(x => x[iterator]).includes(it[iterator]))
    }
  },
  drop: function (array, n = 1) {
    return array.slice(n)
  },
  dropRight: function (array, n = 1) {
    if (n >= array.length) {
      return array
    }
    return array.slice(0, array.length - 1)
  },

  dropRightWhile: function (array,predicate) {
    if(typeof predicate == "function"){
       
    }
    if(typeof predicate == "string"){

    }
    if(Array.isArray(predicate)){
      
    }
    if(typeof predicate == "object"){

    }
  },
  findIndex:function(array,predicate,from = 1){
    if(typeof predicate == "function"){
       for(var i =0 ;i < array.length;i++){
         if(predicate(array[i])){
           return i
         }
       }
    }
    if(typeof predicate == "string"){
      limengyun111.matches()
    }
    if(Array.isArray(predicate)){
       
    }
    if(typeof predicate == "object"){
      for(var i = 0;i < array.length;i++){
        if(limengyun111.ismatch(predicate, array[i])){
          return i
        }
      }
    }

  },

  flattenDeep:function(array){
    var result = []
    for(item of array){
      if(Array.isArray(item)){
        var flattenItem = this.flattenDeep(item)
        result.push(...flattenItem)
      }else{
        result.push(item)
      }
    }  
    return result 
  },
 
  flattenDepth:function(array,depth = 1){
    var result = []
    for(item of array){
      if(Array.isArray(item) && depth!= 0){
        var flattenItem = this.flattenDeep(item,depth - 1)
        result.push(...flattenItem)
      }else{
        result.push(item)
      }
    }  
    return result 
  },
  fromPairs:function(pairs){
    var map = {}
    for(var i = 0;i < pairs.length;i++){
        map[pairs[i][0]] = pairs[i][1]
    }
    return map
  },
  head:function(array){
     if(array.length > 0){
       return array.shift()
     }else{
       return undefined
     }
  },
  initial:function(array){
    return result = array.pop()

  },
  last:function(ary){
    return ary.pop()
  },
  intersection:function(arrays){
    for(var i = 1;i < arguments.length;i++){
      arguments[0] = arguments[0].filter(it =>arguments[i].includes(it))
    }
    return arguments[0]
  },
  pull:function(array,values){
   var s = array.filter(it =>!(values.includes(it)))
   return s
  },
  union: function (...arrays) {
    var result = []
    result = [].concat(...arrays)
    result = [...new Set(result)]
    return result
  },
  unionBy:function(arrays,iterate){
   var result = []
   var finalresult = []
   var map = [] 
    result =result.concat(...arrays)
     if(typeof iterate == "function"){
       for(var item of result){
          if(!map.includes(iterate(item))){
            map.push(iterate(item))
            finalresult.push(item)
          }
       }
     }
     if(typeof iterate == "string"){
       for(var item of result){
         if(!item[iterate] in map){
           map.push(item[iterate])
           finalresult.push(item)
         }
       }
     }
     return finalresult
  },
  zip:function(arrays){
    var result = []
    var fResult = []
    for(var i = 0;i < arrays[0].length;i++){
      for(var j = 0;j < arrays.length;j++){
        result.push(arrays[j][i])
      }
      fResult.push(result)
      result = []
    }
    return fResult
  },
  unzip:function(ary){
    var sumresult = []
     var result = []
     for(var i = 0;i < ary[0].length;i++){
       for(var j = 0;j < ary.length;j++){
         result.push(ary[j][i])
       }
      sumresult.push(result)
      result = []
     }
     return sumresult
  },
  countBy:function(collection,iterate){
    var map = []
     if(typeof iterate == "function"){
       for(var i = 0;i < collection.length;i++){
         var m = iterate(collection[i])
         if(m in map){
           map[m]++
         }else{
           map[m] = 1
         }
       }
     }
     if(typeof iterate == "string"){
       var map  = {}
       for(var j = 0;j < collection.length;j++){
         var n = collection[j][iterate]
         if(n in map){
           map[n]++
         }else{
           map[n] = 1
         }
       }
     }
     return map
  },
  flatMap:function(collection,iterate){
    var result = []
      for(var i = 0;i < collection.length;i++){
        var m = iterate(collection[i])
        result.push(m)
      }
      return result
  },
  uniq:function(array){
    var s = new Set(array)
    var ss = [...s]
    return ss
  },
  property:function(path){
     return function(obj){
       var newpath = path.split(/\./g)
       for(var i = 0;i < newpath.length;i++){
           var key =  newpath[i]
           obj = obj[key]
       }
       return obj
     }
  },
  matchesProperty:function(path, srcValue){
      return function(obj){
        var newpath = path.split(/\./g)
        for(var i = 0;i < newpath.length;i++){
           var key =  newpath[i]
           obj = obj[key]
       }
       if(obj == srcValue){
         return true
       }else{
         return false
       }
      }
  },
  matches:function(source){
      return function(obj){
        for(item in source){
          if(!(item in obj)){
            return false
          }
          if(obj[item] != source[item]){
            return false
          }
        }
        return true
      }
  },
  every:function(collection,predicate){
    if(typeof predicate == "function"){
      for(item of collection){
        if(!predicate(item)){
          return false
        }
      }
      return true
    }
    if(typeof predicate == "object"){
      for(item of collection){
        if(!limengyun111.matches(predicate,item)){
            return false
        }
      }
      return true
    }
    if(typeof predicate == "string"){
      for(item of collection){
        if(!limengyun111.property(predicate)(item)){
            return false
        }
      }
      return true
    }
  },
}