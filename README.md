> 1.0.0-dev is under development, the document is deprecated

shell-color
===========

Javascript to parse [ANSI escape code](https://en.wikipedia.org/wiki/ANSI_escape_code) and render to HTML, for CommonJS package

> RequireJS and AMD package user check [guybedford/cjs](https://github.com/guybedford/cjs)

![style](doc/style.png)

# Options
```javascript
var ShellColor = require('shell-color')
var sc = new ShellColor({	
	colorMap: {                       // optional
		white: '#cccccc',
    	black: '#333333'	
	},
	lineFeedTransform: 'brTag',       // or 'blockTag'
	defaultBackgroundColor: 'white',  // optional
	defaultForegroundColor: 'black'   // optional
})
```

# API
> You can not keep `\n` in final output, because `tag.innerText` convert `\n` to `<br>`, for example:    
> ```javascript
> var span = document.createElement('span')
> span.innerText = '123\n\n456'
> assert.equal(span.innerHTML, '123<br><br>567')
> ```

```javascript
var text = '\x1b[30m black \x1b[m\x1b[31m red'

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

// reset
sc.reset()
```

# Reference
- https://en.wikipedia.org/wiki/ANSI_escape_code
- http://www.2cto.com/os/201112/114400.html