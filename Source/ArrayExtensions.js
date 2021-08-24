Array.prototype.addLookups = function(keyName)
{
	for (var i = 0; i < this.length; i++)
	{
		var element = this[i];
		this[element[keyName]] = element;
	}
}
