shell-color
===========

Javascript parse [ANSI escape code](https://en.wikipedia.org/wiki/ANSI_escape_code) and render to HTML, for CommonJS package

![style](doc/style.png)

# Install
```sh
npm install --save github:valaxy/shell-color
```

# For AMD/RequireJS
> RequireJS user check [guybedford/cjs](https://github.com/guybedford/cjs)

```javascript
requirejs.config({
	paths: {
		'wolfy87-eventemitter': 'node_modules/wolfy87-eventemitter/EventEmitter',
		'cjs'                 : 'node_modules/cjs/cjs',
		'amd-loader'          : 'node_modules/amd-loader/amd-loader'
	},
	maps: {
		'*': {
			'shell-color'         : 'node_modules/shell-color/src/shell-color'
		}
	}
})

var ShellColor = require('cjs!shell-color')
```

# Usage
```javascript
var sc = new ShellColor({	
	colorMap: {                       // optional
		white: '#cccccc',
    	black: '#333333'	
	},
	defaultBackgroundColor: 'white',  // optional
	defaultForegroundColor: 'black',  // optional
	snippetTag:             'span'    // optional
})

var sc = new ShellColor

sc.on('lineStart', function() {
	var startInfo = document.createElement('b')
	startInfo.innerText = 'start:'
	document.body.append(startInfo)
})

sc.on('snippet', function(tag) {
	document.body.append(tag)
})

sc.on('lineEnd', function() {
	var br = document.body.append('br')
	document.body.append(br)
})

sc.reset()
sc.write('\x1b[30m black\n\x1b[m\x1b[31m red\nend')
```

## sc.reset()
Create a new stream, before write you must call reset at least once.

## sc.write(text)
Push a text to current stream

> You can not keep `\n` in final output, because `tag.innerText` convert `\n` to `<br>`, for example:
> ```javascript    
> var span = document.createElement('span')
> span.innerText = '123\n\n456'
> assert.equal(span.innerHTML, '123<br><br>567')
> ```

## sc.on()
```javascript
sc.on('lineStart', function() { ... })
sc.on('snippet', function(tag) { ... })
sc.on('lineEnd', function() { ... })
```

## ShellColor.strip(text)
```javascript
var text = '\x1b[30m black \x1b[m\x1b[31m red'
var str = sc.strip(text) // ' black  red'
```

## ShellColor.toBlockTags(text)
```javascript
var tags = ShellColor.toBlockTags(text)
tags.forEach(function (tag) {
	document.body.appendChild(tag) // <p>...</p>
})
```


## ShellColor.toInlineTags(text)
```javascript
var tags = ShellColor.toInlineTags(text)
tags.forEach(function (tag) {
	document.body.appendChild(tag) // <span>...</span> or <br>
})
```

# Reference
- https://en.wikipedia.org/wiki/ANSI_escape_code
- http://www.2cto.com/os/201112/114400.html