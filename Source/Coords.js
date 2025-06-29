
class Coords
{
	constructor(x, y)
	{
		this.x = x;
		this.y = y;
	}

	static create()
	{
		return new Coords();
	}

	static fromXY(x, y)
	{
		return new Coords(x, y);
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
