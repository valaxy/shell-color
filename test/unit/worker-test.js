importScripts('../../node_modules/requirejs/require.js')

requirejs.config({
	baseUrl: '../../',
	paths  : {
		'wolfy87-eventemitter': 'node_modules/wolfy87-eventemitter/EventEmitter'
	}
})

require(['src/worker'])