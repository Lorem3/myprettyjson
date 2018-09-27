# README
## MyPrettyJson

+ 快捷键 shift + cmd + j 格式化.
+ 快捷键 shift + cmd + u 压缩.

此命令会把 number boolean 转换成 string
例如
```
{
    "a":true,
    "b":false,
    "c":{ "a":true,"b":false},
    "d":[
        "ccc",{ "a":true,"b":false},
        [true,"abc",false]
    ]

}
```
转换成下面的
```
{
	"a":"1",
	"b":"0",
	"c":
	{
		"a":"1",
		"b":"0"
	},
	"d":
	[
		"ccc",
		{
			"a":"1",
			"b":"0"
		},
		["1","abc","0"]
	]
}

```
 

**Enjoy!**
