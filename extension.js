'use strict';
// vsce publish minor
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
var vscode = require('vscode');
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "helloworld" is now active!');
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    var disposable = vscode.commands.registerCommand('extension.myPrettyJson', function () {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        var e = vscode.window.activeTextEditor;
        if (e) {
            e.edit(function (eb) {
                {
                    var maxInt = 9999999999999;
                    var sp = new vscode.Position(0, 0);
                    var ep = new vscode.Position(maxInt, maxInt);
                    var rg = new vscode.Range(sp, ep);
                    var jsonstring = e.document.getText(rg);
                    var jsonObj = null;
                    try {
                        jsonObj = JSON.parse(jsonstring);
                    }
                    catch (e) {
                        console.log(e);
                        jsonObj = null;
                    }
                    if (jsonObj == null) {
                        vscode.window.showErrorMessage('the file is NOT json');
                    }
                    else {
                        var result = formatJson(jsonObj);
                        if (result != null) {
                            eb.replace(rg, result);
                        }
                    }
                }
            });
        }
    });
    context.subscriptions.push(disposable);
    var disposable2 = vscode.commands.registerCommand('extension.myUglyJson', function () {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        var e = vscode.window.activeTextEditor;
        if (e) {
            e.edit(function (eb) {
                {
                    var maxInt = 9999999999999;
                    var sp = new vscode.Position(0, 0);
                    var ep = new vscode.Position(maxInt, maxInt);
                    var rg = new vscode.Range(sp, ep);
                    var jsonstring = e.document.getText(rg);
                    var jsonObj = null;
                    try {
                        jsonObj = JSON.parse(jsonstring);
                    }
                    catch (e) {
                        console.log(e);
                        jsonObj = null;
                    }
                    if (jsonObj == null) {
                        vscode.window.showErrorMessage('the file is NOT json');
                    }
                    else {
                        var result = JSON.stringify(jsonObj);
                        if (result != null) {
                            eb.replace(rg, result);
                        }
                    }
                }
            });
        }
    });
    context.subscriptions.push(disposable2);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() {
    vscode.window.showInformationMessage('bye World!');
}
exports.deactivate = deactivate;
function isArray(obj) {
    return Object.prototype.toString.call(obj) === "[object Array]";
}
function isNumber(obj) {
    return Object.prototype.toString.call(obj) === "[object Number]";
}
function isString(obj) {
    return Object.prototype.toString.call(obj) === "[object String]";
}
function isBoolean(obj) {
    return Object.prototype.toString.call(obj) === "[object Boolean]";
}
function isNull(obj) {
    return Object.prototype.toString.call(obj) === "[object Null]";
}
function isUndefinded(obj) {
    return Object.prototype.toString.call(obj) === "[object Null]";
}
// 
function printfSpaceWithCount(params) {
    var result = "";
    for (var index = 0; index < params; index++) {
        ;
        result += '\t';
    }
    return result;
}
function convertToJsonString(params) {
    var result = params;
    result = result.replace(/\\/g, "\\\\");
    result = result.replace(/\"/g, "\\\"");
    result = result.replace(/\n/g, "\\n");
    return result;
}
function countLength(params, max) {
    if (isArray(params)) {
        var array = params;
        var len = 2;
        for (var index = 0; index < array.length; index++) {
            var subobj = array[index];
            len += countLength(subobj, max) + 1;
            if (len > max) {
                break;
            }
        }
        return len;
    }
    else if (isString(params)) {
        var str = params;
        return str.length + 2;
    }
    else if (isBoolean(params)) {
        return 1; //"1" or "0"
    }
    else if (isNumber(params)) {
        return ("" + params).length + 2;
    }
    else if (isNull(params) || isUndefinded(params)) {
        return 0;
    }
    else {
        var jsonMap = params;
        var arrPropertity = Object.getOwnPropertyNames(jsonMap);
        var len = 2;
        for (var index_1 = 0; index_1 < arrPropertity.length; index_1++) {
            var key = arrPropertity[index_1];
            var value = jsonMap[key];
            len += countLength(key, max) + countLength(value, max) + 2;
        }
        return len;
    }
}
function isSingleLine(params) {
    var maxlineLength = 150;
    if (isString(params) || isNumber(params) || isBoolean(params)) {
        return true;
    }
    else if (isArray(params)) {
        var array = params;
        for (var index = 0; index < array.length; index++) {
            var element = array[index];
            if (isString(element) == false
                && isBoolean(element) == false
                && isNull(element) == false
                && isNumber(element) == false) {
                return false;
            }
        }
        var len = countLength(params, maxlineLength);
        return len <= maxlineLength;
    }
    else if (isNull(params) || isUndefinded(params)) {
        return true;
    }
    else {
        var jsonMap = params;
        var arrPropertity = Object.getOwnPropertyNames(jsonMap);
        for (var index_2 = 0; index_2 < arrPropertity.length; index_2++) {
            var key = arrPropertity[index_2];
            var value = jsonMap[key];
            if (isString(value) == false) {
                return false;
            }
        }
        var len = countLength(jsonMap, maxlineLength);
        return len <= maxlineLength;
    }
}
function stringFromSingleLineObject(obj) {
    if (isString(obj)) {
        return "\"" + convertToJsonString(obj) + "\"";
    }
    else if (isNumber(obj)) {
        return "\"" + obj + "\"";
    }
    else if (isBoolean(obj)) {
        return "\"" + (obj ? "1" : "0") + "\"";
    }
    else if (isArray(obj)) {
        var result = "[";
        var arr = obj;
        var lenOfarr = arr.length;
        for (var index = 0; index < lenOfarr; index++) {
            var element = arr[index];
            result += stringFromSingleLineObject(element);
            if (index < lenOfarr - 1) {
                result += ", ";
            }
        }
        result += "]";
        return result;
    }
    else if (isNull(obj) || isUndefinded(obj)) {
        return "\"\"";
    }
    else {
        var allPropertityesNames = Object.getOwnPropertyNames(obj);
        var arrPropertityesNames = sortKey(allPropertityesNames);
        var strResult = "{";
        var j = allPropertityesNames.length;
        var c = j;
        for (var index = 0; index < c; index++) {
            var strKey = allPropertityesNames[index];
            var objItem = obj[strKey];
            --j;
            if (j > 0) {
                strResult += " \"" + strKey + "\":" + stringFromSingleLineObject(objItem) + ",";
            }
            else {
                strResult += " \"" + strKey + "\":" + stringFromSingleLineObject(objItem) + "";
            }
        }
        strResult += "}";
        return strResult;
    }
}
function sortKey(arr) {
    var dicSequanceValue = sortvalues();
    return arr.sort(function (obj1, obj2) {
        var i1 = dicSequanceValue[obj1];
        var i2 = dicSequanceValue[obj2];
        var intvalue1 = 0;
        if (i1 != null) {
            intvalue1 = parseInt(i1);
        }
        var intvalue2 = 0;
        if (i2 != null) {
            intvalue2 = parseInt(i2);
        }
        if (intvalue1 < intvalue2) {
            return 1;
        }
        else if (intvalue1 > intvalue2) {
            return -1;
        }
        else {
            return obj1.localeCompare(obj2);
        }
    });
    function sortvalues() {
        var dicSequanceValue = { "commRules": "10", "rules": "9", "else_rules": "8", "localKey": "5", "httpKey": "4", "if": "9.1", "servers": "11", "servers_t": "10", "servers_d": "10", "servers_by": "10", "servers_": "11", "fileVersion": "10", "command": "10", "servers_test": "0" };
        return dicSequanceValue;
    }
}
function printDic(dic, level) {
    var result = "";
    if (isSingleLine(dic)) {
        result += printfSpaceWithCount(level);
        result += stringFromSingleLineObject(dic);
    }
    else {
        var cmd = dic["command"];
        var arrIfArray = dic["if"];
        var isCommandIf = cmd != null && cmd === "if" && arrIfArray != null;
        if (isCommandIf == false) {
            result += printfSpaceWithCount(level);
            result += "{\n";
            var arrString = new Array();
            var arrObj = new Array();
            var allKeys = Object.getOwnPropertyNames(dic);
            for (var index = 0; index < allKeys.length; index++) {
                var key = allKeys[index];
                var v = dic[key];
                if (isString(v) || isNumber(v) || isBoolean(v)) {
                    arrString.push(key);
                }
                else {
                    arrObj.push(key);
                }
            }
            arrString = sortKey(arrString);
            arrObj = sortKey(arrObj);
            var addDot = arrObj.length > 0;
            var j = arrString.length;
            for (var index = 0; index < arrString.length; index++) {
                var strKey = arrString[index];
                result += printString(strKey, level + 1);
                result += ":";
                var obj = dic[strKey];
                if (isString(obj) || isNumber(obj) || isBoolean(obj)) {
                    result += stringFromSingleLineObject(obj);
                }
                else if (isArray(obj)) {
                    if (isSingleLine(obj)) {
                        printArray(obj, 0);
                    }
                    else {
                        printArray(obj, level + 1);
                    }
                }
                else {
                    if (isSingleLine(obj)) {
                        printDic(obj, 0);
                    }
                    else {
                        printDic(obj, level + 1);
                    }
                }
                if (addDot) {
                    result += ",\n";
                }
                else {
                    --j;
                    if (j > 0) {
                        result += ",\n";
                    }
                }
            }
            j = arrObj.length;
            for (var index = 0; index < arrObj.length; index++) {
                var strKey = arrObj[index];
                result += printString(strKey, level + 1);
                result += ":";
                var obj_1 = dic[strKey];
                if (isSingleLine(obj_1)) {
                    result += stringFromSingleLineObject(obj_1);
                }
                else {
                    result += "\n";
                    if (isArray(obj_1)) {
                        result += printArray(obj_1, level + 1);
                    }
                    else {
                        result += printDic(obj_1, level + 1);
                    }
                }
                --j;
                if (j > 0) {
                    result += ",\n";
                }
            }
            result += "\n";
            result += printfSpaceWithCount(level);
            result += "}";
        }
        else {
            result += printfSpaceWithCount(level);
            ;
            result += "{";
            var arrOtherKeys = new Array();
            var allKeys = Object.getOwnPropertyNames(dic);
            for (var index = 0; index < allKeys.length; index++) {
                var strKey = allKeys[index];
                if (!(strKey == "command" || strKey == "if" || strKey == "rules" || strKey == "else_rules")) {
                    arrOtherKeys.push(strKey);
                }
            }
            if (arrOtherKeys.length > 0) {
                arrOtherKeys = arrOtherKeys.sort();
                for (var index = 0; index < arrOtherKeys.length; index++) {
                    var strKey = arrOtherKeys[index];
                    result += "\n";
                    result += printString(strKey, level + 1);
                    result += ":";
                    var obj_2 = dic[strKey];
                    if (isSingleLine(obj_2)) {
                        result += stringFromSingleLineObject(obj_2);
                    }
                    else {
                        result += "\n";
                        if (isArray(obj_2)) {
                            result += printArray(obj_2, level + 2);
                        }
                        else {
                            result += printDic(obj_2, level + 2);
                        }
                    }
                    result += ",";
                }
                result += "\n" + printfSpaceWithCount(level + 1);
            }
            if (arrOtherKeys.length > 0) {
                result += "\"command\":\"if\",\"if\":";
            }
            else {
                result += " \"command\":\"if\",\"if\":";
            }
            result += stringFromSingleLineObject(arrIfArray);
            +" ";
            var arrRules = dic["rules"];
            if (arrRules != null) {
                if (arrRules.length == 0) {
                    result += ", \"rules\" : [] ";
                }
                else {
                    result += ", \"rules\" : [\n ";
                    var rulecount = arrRules.length;
                    for (var i = 0; i < arrRules.length; i++) {
                        var obj = arrRules[i];
                        --rulecount;
                        if (isSingleLine(obj)) {
                            result += printfSpaceWithCount(level + 2);
                            result += stringFromSingleLineObject(obj);
                        }
                        else {
                            if (isArray(obj)) {
                                result += printArray(obj, level + 2);
                            }
                            else {
                                result += printDic(obj, level + 2);
                            }
                        }
                        if (rulecount > 0) {
                            result += ",\n";
                        }
                    }
                    result += "\n" + printfSpaceWithCount(level + 1) + "]";
                }
            }
            var else_rules = dic["else_rules"];
            if (else_rules != null) {
                if (else_rules.length > 0) {
                    result += ",\n" + printfSpaceWithCount(level + 1);
                    result += "\"else_rules\" : [\n";
                    var rulecount = else_rules.length;
                    for (var i = 0; i < else_rules.length; i++) {
                        var obj = else_rules[i];
                        --rulecount;
                        if (isSingleLine(obj)) {
                            result += printfSpaceWithCount(level + 2);
                            result += stringFromSingleLineObject(obj);
                        }
                        else {
                            if (isArray(obj)) {
                                result += printArray(obj, level + 2);
                            }
                            else {
                                result += printDic(obj, level + 2);
                            }
                        }
                        if (rulecount > 0) {
                            result += ",\n";
                        }
                    }
                    result += "\n" + printfSpaceWithCount(level + 1) + "]";
                }
                else {
                    result += ",\n" + printfSpaceWithCount(level + 1) + "\"else_rules\" : []";
                }
            }
            result += "\n";
            result += printfSpaceWithCount(level);
            result += "}";
        }
    }
    return result;
}
function printString(str, level) {
    return printfSpaceWithCount(level) + stringFromSingleLineObject(str);
}
function printArray(arr, level) {
    var strResult = "";
    if (isSingleLine(arr)) {
        strResult += printfSpaceWithCount(level);
        strResult += "[";
        var j = arr.length;
        for (var i = 0; i < arr.length; i++) {
            var obj = arr[i];
            --j;
            strResult += stringFromSingleLineObject(obj);
            if (j > 0) {
                strResult += ",";
            }
        }
        strResult += "]";
    }
    else {
        strResult += printfSpaceWithCount(level) + "[\n";
        var j = arr.length;
        for (var i = 0; i < arr.length; i++) {
            var obj = arr[i];
            if (isString(obj) || isNumber(obj) || isBoolean(obj)) {
                strResult += printString(obj, level + 1);
            }
            else if (isArray(obj)) {
                strResult += printArray(obj, level + 1);
            }
            else if (isNull(obj || isUndefinded(obj))) {
                strResult += "\"\"";
            }
            else {
                strResult += printDic(obj, level + 1);
            }
            --j;
            if (j > 0) {
                strResult += ",\n";
            }
        }
        strResult += "\n" + printfSpaceWithCount(level) + "]";
    }
    return strResult;
}
function formatJson(obj) {
    if (isArray(obj)) {
        var arr = obj;
        return printArray(arr, 0);
    }
    else if (isUndefinded(obj) || isNull(obj) || isString(obj) || isNumber(obj)) {
        return null;
    }
    else {
        return printDic(obj, 0);
    }
}
