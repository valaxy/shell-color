const ShellColor = require('../../src/index')

var str = [
    'default color',
    '\x1b[30mblack color',
    '\x1b[31mred color',
    '\x1b[32mgreen color',
    '\x1b[33myellow color',
    '\x1b[34mblue color',
    '\x1b[35mmagenta color',
    '\x1b[36mcyan color',
    '\x1b[37mwhite color',
    '\x1b[m',
    '\x1b[40mblack background',
    '\x1b[41mred background',
    '\x1b[42mgreen background',
    '\x1b[43myellow background',
    '\x1b[44mblue background',
    '\x1b[45mmagenta background',
    '\x1b[46mcyan background',
    '\x1b[47m white background',
    '\x1b[0m',
    '\x1b[1mbold\x1b[m',
    '\x1b[3mitalic\x1b[m',
    '\x1b[4munderline\x1b[m',
    '\x1b[9mdeletion\x1b[m',
    '\x1b[53moverline\x1b[m'
].join('')

// no use worker
var container = document.getElementById('everything')
ShellColor.toInlineTags(str, {
    colorMap: {
        white: '#dddddd',
        black: '#222222'
    },
    defaultBackgroundColor: 'white',
    defaultForegroundColor: 'black'
}).forEach(function(tag) {
    container.appendChild(tag)
})
container.appendChild(document.createElement('br'))
container.appendChild(document.createElement('br'))

// use worker
var sc = new ShellColor({
    useWorker: true,
    worker: {
        path: '../unit/worker-test.js',
        callback: function() {
            sc.reset().write(str)
        }
    }
})

sc.on('snippet', function(tag) {
    container.appendChild(tag)
})
