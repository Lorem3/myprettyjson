"use strict";

const suffix = "[⭕️]";
if (process.env.JQ3_SUFFIX64) {

  try {
    const decoded = Buffer.from(process.env.JQ3_SUFFIX64, 'base64').toString();
    suffix = decoded;
  } catch (err) {
    console.error('Failed to decode JQ3_SUFFIX64:', err);
  }
}
function deepConvert(obj) {
  if (obj === null) return null;
  if (obj === undefined) return undefined;
  if (typeof obj == "string") {
    return InnerStr2Obj(obj, {});
  }
  if (Array.isArray(obj)) {
    let arr = obj;
    let arrOut = [];
    for (let i = 0; i < arr.length; i++) {
      const element = arr[i];
      if (typeof element == "string") {
        let o = {};
        let v = InnerStr2Obj(element, o);
        if (o.change == 1) {
          arrOut.push(suffix);
        }
        arrOut.push(v);
      } else {
        arrOut.push(deepConvert(element));
      }
    }
    return arrOut;
  } else if (typeof obj == "object") {
    let objOut = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const element = obj[key];

        if (typeof element == "string") {
          let o = {};
          let v = InnerStr2Obj(element, o);
          if (o.change == 1) {
            objOut[key] = undefined;
            objOut[key + suffix] = v;
          } else {
            objOut[key] = v;
          }
        } else {
          objOut[key] = deepConvert(element);
        }
      }
    }

    return objOut;
  }

  return obj;
}
function InnerStr2Obj(str, outV) {
  if (str === null) return null;
  if (str === undefined) return undefined;
  if (str.substring(0, 1) == "{") {
    try {
      let obj = JSON.parse(str);
      outV.change = 1;
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          const element = obj[key];

          if (typeof element == "string") {
            let o = {};
            let v = InnerStr2Obj(element, o);
            if (o.change == 1) {
              delete obj[key] 
              obj[key + suffix] = v;
            } else {
              obj[key] = v;
            }
          } else {
            obj[key] = deepConvert(element);
          }
        }
      }

      return obj;
    } catch (error) {}
  } else if (str.substring(0, 1) == "[") {
    try {
      let arr = JSON.parse(str);
      outV.change = 1;
      let arrOut = [];
      for (let i = 0; i < arr.length; i++) {
        const element = arr[i];
        if (typeof element == "string") {
          let o = {};
          let v = InnerStr2Obj(element, { o });
          if (o.change == 1) {
            arrOut.push(suffix);
          }
          arrOut.push(v);
        } else {
          arrOut.push(element);
        }
      }

      return arrOut;
    } catch (error) {}
  }

  return str;
}


function deepConvertBack(obj){
  let t = typeof obj
  
  if(Array.isArray(obj)){
    let flg = 0
    let rArr = []
    for (let index = 0; index < obj.length; index++) {
      const element = obj[index];
      if (element == suffix) {
        flg = 1
        continue;
      }else{
        if (flg == 1) {
           let e  = deepConvertBack(element)
           rArr.push(JSON.stringify(e))
        }else{
          rArr.push(deepConvertBack(element))
        }

        flg = 0;
      }
    }
    return rArr
  }else if ( t == 'object') {
    let r = {}
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const element = obj[key];
        if (key.indexOf(suffix) > -1) {
          let k = key.replace(suffix, "")
          let objItem  = deepConvertBack(element);
          r[k] = JSON.stringify(objItem)
        }
        else {
          r[key] = deepConvertBack(element);
        }
      }
    }
    return r 
  }else{
    return obj
  }
}

module.exports = {deepConvert,deepConvertBack}