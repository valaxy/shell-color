const path = require('path')

module.exports = {
    context: path.join(__dirname, '../'),
    entry: {
        'index.js': './src/index.js',
        'test.js': './test/unit/index.js',
        'worker.js': './src/worker.js',
        'test-block-mode.js': './test/manual/test-block-mode.js',
        'test-inline-mode.js': './test/manual/test-inline-mode.js'
    },
    output: {
        filename: '[name]',
        path: path.join(__dirname, '../dest/')
    },
    module: {
    }
}
