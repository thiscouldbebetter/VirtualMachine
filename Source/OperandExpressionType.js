
class OperandExpressionType
{
	constructor(name, value)
	{
		this.name = name;
		this.value = value;	
	}

	static Instances()
	{
		if (this._instances == null)
		{
			this._instances = new OperandExpressionType_Instances();
		}
		return this._instances;
	}
}
