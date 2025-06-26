
class Register
{
	constructor(defn)
	{
		this.defn = defn;

		this._value = 0;
	}

	value()
	{
		return this._value;
	}

	valueAdd(increment)
	{
		return this.valueSet(this.value() + 1);
	}

	valueIncrement()
	{
		return this.valueAdd(1);
	}

	valueSet(valueToSet)
	{
		this._value = valueToSet;
		return this;
	}
}