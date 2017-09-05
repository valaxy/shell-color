const ShellColor = require('../../src/index')

var div = document.getElementById('everything')

ShellColor.toBlockTags([
    'abc',
    '',
    '123',
    '',
    '',
    'ggg',
    'xxx'
].join('\n')).forEach(function(tag) {
    div.appendChild(tag)
})
