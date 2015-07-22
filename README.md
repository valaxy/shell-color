shell-color
===========

Javascript to parse linux shell with color info, amd/cmd module


# Introduction
```javascript
var text = '[15;23mabcdefg[mhijklmn[15;24mopqrst[m'


// config
var ShellColor = require('shell-color')
var sc = new ShellColor({
    '29': 'white',
    '30': 'black'
})


// convertToHTML
var html = sc.convertToHtml(text)
var div = document.createElement('div')
div.innerHTML = html
console.log(div.innerHTML)


```