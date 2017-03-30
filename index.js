/**
 * Created by chenyulun on 2017/3/30.
 */
let fs = require('fs');
let path = require('path');
let editorPath = "src/lib/index.min.js";

// 读取文件编辑器文件
function readFile(fileName) {
	return new Promise(function (resolve, reject) {
		fs.readFile(fileName, function (error, data) {
			if (error) reject(error);
			resolve(data);
		});
	});
}

// 写入webstorm wx.xml
function writeFile(fileName, w_data) {
	return new Promise(function (resolve, reject) {
		fs.writeFile(fileName, w_data, {flag: 'w'}, function (err) {
			if (err) {
				consoel.log(err);
				reject(err)
			} else {
				resolve("成功写入");
			}
			;
		});
	})
}

//代码块输入后输入属性
function getVariableList(variableObject) {
	let variableList = ``;
	for ([key, value] of Object.entries(variableObject)) {
		variableList += `      <variable name="${key}" expression="" defaultValue="${"&quot;" + value + "&quot;"}" alwaysStopAt="true" />
`;
	}
	return variableList;


}

//每个API方法生成代码块xml
function temple(options) {
	let Variable = getVariableList(options.variableObject);

	return `  <template name="${options.name}" value="${options.value}" description="${options.documentation}" toReformat="true" toShortenFQNames="true">
${Variable}      <context>
        <option name="JS_STATEMENT" value="true" />
      </context>
  </template>
`;
}

//处理weixin原始代码块方法
function transformToLineTemple(key, value, isAddWx) {
	let i = 0;
	let variableObject = {};
	value.insertText = (isAddWx?"wx.":"") + value.insertText
			.replace(/\n/g, "&#10;").replace(/\\'/g, "")
			.replace(/{{({[\S]*?})}}|{{(\/\/\s[\S]*?)}}|{{([\S]*?)}}/g, function (word, $1, $2, $3) {
				let value = $1 || $2 || $3 || "";
				i++;
				variableObject["String" + i] = value;
				return "$String" + i + "$"
			})
			.replace(/"/g, "'");
	let name = "wx" + key[0].toUpperCase() + key.substring(1, key.length);
	return temple({
		variableObject: variableObject,
		name: name,
		value: value.insertText,
		documentation: value.documentation,
	})


}

async function getFile() {

	//直接执行内部有一个属性指向xxx,为了不报错，写兼容属性
	let monaco = {
		languages: {
			CompletionItemKind: {
				Function: function () {
				}
			}
		}
	};

	//读取原始文件
	let File = await readFile(path.resolve(__dirname, editorPath));
	//提前想要的API，直接执行41模块；以后官方更新后可能会变化
	eval(File.toString().replace('return t.m=e,t.c=n,t.p="",t(0)', 'return t.m=e,t.c=n,t.p="",t(41)'));

	//开始生成webstorm用代码块xml文件
	let lineTempFile =
		`<templateSet group="wx">
`;
	for ([key, value] of Object.entries(module.exports.api)) {
		lineTempFile += transformToLineTemple(key, value,true);
	}
	for ([key, value] of Object.entries(module.exports.mina)) {
		lineTempFile += transformToLineTemple(key, value,false);
	}
	lineTempFile += `</templateSet>`;
	let backString = await writeFile(path.resolve(__dirname, "dist/wx.xml"), lineTempFile);
	console.log(backString,",请查看dist目录的wx.xml");
	//return File;
}
getFile();




