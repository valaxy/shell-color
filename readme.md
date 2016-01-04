shell-color
===========

Javascript parse [ANSI escape code](https://en.wikipedia.org/wiki/ANSI_escape_code) and render to HTML, for CommonJS package

![style](doc/style.png)

# Install
```sh
npm install --save github:valaxy/shell-color
```

# For AMD/RequireJS

```javascript
requirejs.config({
	paths: {
		'wolfy87-eventemitter': 'node_modules/wolfy87-eventemitter/EventEmitter',
		'shell-color'         : 'node_modules/shell-color/'
	}
})

var ShellColor = require('shell-color/src/index')
```

# Constructor

Common parameters

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
```

Use Worker

```javascript
var sc = new ShellColor({	
	useWorker: true,
	worker: {
		path: 'worker.js',
		callback: function() { ... }
	}
})

// in worker.js
importScripts('require.js')

requirejs.config({
	paths  : {
		'shell-color'         : 'node_modules/shell-color/',
		'wolfy87-eventemitter': 'node_modules/wolfy87-eventemitter/EventEmitter'
	}
})

require(['shell-color/src/worker'])
```

# Usage
```javascript
sc.on('reset', function() {
	console.log('reset')
})

sc.on('lineStart', function() {
	var startInfo = document.createElement('b')
	startInfo.innerText = 'start:'
	document.body.appendChild(startInfo)
})

sc.on('snippet', function(tag) {
	document.body.appendChild(tag)
})

sc.on('lineEnd', function() {
	var br = document.createElement('br')
	document.body.appendChild(br)
})

sc.reset()
  .write('\x1b[30m black\n\x1b[m\x1b[31m red\nend')
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

# ChangeLog
- 1.1.0 Add web worker support

# Reference
- https://en.wikipedia.org/wiki/ANSI_escape_code
- http://www.2cto.com/os/201112/114400.html