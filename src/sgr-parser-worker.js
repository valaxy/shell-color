define(function (require, exports, module) {
	var SGRParser = require('./sgr-parser')

	module.exports = function () {
		var parser = new SGRParser

		parser.on('snippet', function () {

		})

		onmessage = function (event) {
			var data = event.data
			switch (data.type) {
				case 'reset':
					parser.reset()
			}
		}

		postMessage({
			type: 'connect'
		})
	}
})