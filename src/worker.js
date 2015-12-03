define(function (require, exports, module) {
	var SGRParser = require('./sgr-parser')

	var parser

	var initParser = function (options) {
		parser = new SGRParser(options)

		parser.on('reset', function () {
			postMessage({
				type: 'reset'
			})
		})

		parser.on('snippet', function (text, sgr) {
			postMessage({
				type: 'snippet',
				text: text,
				sgr : sgr
			})
		})

		parser.on('lineStart', function () {
			postMessage({
				type: 'lineStart'
			})
		})

		parser.on('lineEnd', function () {
			postMessage({
				type: 'lineEnd'
			})
		})
	}

	onmessage = function (event) {
		var data = event.data
		switch (data.type) {
			case 'init':
				initParser(data.options)
				postMessage({
					type: 'init'
				})
				break
			case 'reset':
				parser.reset()
				break
			case 'write':
				parser.write(data.text)
				break
		}
	}

	postMessage({ // reset/write should after connect/init
		type: 'connect'
	})
})