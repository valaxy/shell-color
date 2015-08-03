shell-color
===========

Javascript to parse linux shell with color info, for AMD/CMD package

![style](doc/style.png)

# Usage
```javascript
var text = '\x1b[30m black \x1b[m\x1b[31m red'

// instance
var ShellColor = require('shell-color')
var sc = new ShellColor({	
	colorMap: {                       // optional
		white: '#cccccc',
    	black: '#333333'	
	},
	defaultBackgroundColor: 'white',  // optional
	defaultForegroundColor: 'black'   // optional
})

// convertToHTMLTags
var tags = sc.convertToHTMLTags(text)
tags.forEach(function (tag) {
	document.body.appendChild(tag)
})

// convertToHTML
var html = sc.convertToHTML(text)
var div = document.createElement('div')
div.innerHTML = html
document.body.appendChild(div)

// strip
var str = sc.strip(text)
console.log(str) // ' black  red'
```

# Reference
- https://en.wikipedia.org/wiki/ANSI_escape_code
- http://www.2cto.com/os/201112/114400.html