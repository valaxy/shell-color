define(function (require) {
	QUnit.module('sgr-parser-worker')

	QUnit.test('default', function (assert) {
		var done = assert.async()
		var worker = new Worker('./worker-test.js')

		worker.onmessage = function (e) {
			var data = e.data
			switch (data.type) {
				case 'connect':
					assert.ok(true)
					assert.expect(1)
					done()
					break
				case 'event':
					console.log('event')
					break
			}
		}

		//setTimeout(function () {
		//	worker.postMessage({
		//		a: 1,
		//		b: 2
		//	})
		//}, 2000)
	})
})