module.exports = {
	_onReset: function () {
		// do nothing
	},

	_onWrite: function (text) {
		var inlineTag = this._createInlineTag(text)
		this.trigger('snippet', [inlineTag])
	}
}