# weapp-webtorm-code-block
微信小程序webstorm代码块插件(微信小程序版本 0.15.152900)
## 项目介绍
为了方便开发者在webstorm上开发，抽取微信web工具源码里面的editor里面的js代码模块，重新组装成webstorm版本的代码块插件

## 环境准备
直接使用方法：
  
mac系统： 把dist/wx.xml文件放入"/Users/你的用户名/Library/Preferences/WebStorm版本/templates"文件夹
window系统：c:\users\用户名\WebStorm版本\config\templates文件夹  
如果文件夹不存在请自行建立；

## 使用方法

```javascript
//wxP + tab
<code>
App({
    onLaunch: function () {
        String1
    },
    onShow: function () {
        String2
    },
    onHide: function () {
        String3
    },
    onError: function (msg) {
        String4
    }
});

```
重新构建方法:

把微信web工具里面的安装包里面的
```
/Applications/wechatwebdevtools.app/Contents/Resources/app.nw/app/dist/editor/index.min.js
```
放到项目的src/lib里面；
然后执行

```
$ npm run build

```