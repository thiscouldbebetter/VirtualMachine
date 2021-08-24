
class Coords
{
	constructor(x, y)
	{
		this.x = x;
		this.y = y;
	}

	clone()
	{
		return new Coords(this.x, this.y);
	}

	multiply(other)
	{
		this.x *= other.x;
		this.y *= other.y;

		return this;
	}

	overwriteWith(other)
	{
		this.x = other.x;
		this.y = other.y;

		return this;
	}
}
