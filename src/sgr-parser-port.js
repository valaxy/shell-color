
const EventEmitter = require('wolfy87-eventemitter')


/** options:
 ** workerPath: path of worker, must exist
 */
var SGRParserPort = function (options) {
	this._callback = options.callback
	this._worker = new Worker(options.workerPath)
	delete options.callback // can not pass by postMessage


	this._worker.addEventListener('message', function (event) {
		var data = event.data
		switch (data.type) {
			case 'connect':
				this._worker.postMessage({
					type   : 'init',
					options: options
				})
				break
			case 'init':
				this._callback()
				break
			case 'reset':
				this.trigger('reset')
				break
			case 'lineStart':
				this.trigger('lineStart')
				break
			case 'snippet':
				this.trigger('snippet', [data.text, data.sgr])
				break
			case 'lineEnd':
				this.trigger('lineEnd')
				break
		}
	}.bind(this))
}


// reset/write should call after callback

Object.assign(SGRParserPort.prototype, {
	reset: function () {
		this._worker.postMessage({
			type: 'reset'
		})
	},

	write: function (text) {
		this._worker.postMessage({
			type: 'write',
			text: text
		})
	},

	stop: function () {
		this._worker.terminate()
	}
}, EventEmitter.prototype)


module.exports = SGRParserPort
