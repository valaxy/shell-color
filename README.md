shell-color
===========

Javascript to parse linux shell with color info, amd/cmd module


# Introduction
var text = '[15;23mabcdefg[mhijklmn[15;24mopqrst[m'
var $dom = $('<div>').html(sc.convertToHtml(text))
console.log($dom.html())