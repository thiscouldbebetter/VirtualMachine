
class OperandDefn
{
	constructor(sizeInBits, canBeDereference)
	{
		this.sizeInBits = sizeInBits;
		this.canBeDereference = (canBeDereference == null ? false : canBeDereference);
	}
}
