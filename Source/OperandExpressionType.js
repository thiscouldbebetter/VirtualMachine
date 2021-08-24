
class OperandExpressionType
{
	constructor(name, value)
	{
		this.name = name;
		this.value = value;	
	}

	static Instances()
	{
		if (OperandExpressionType._instances == null)
		{
			OperandExpressionType._instances =
				new OperandExpressionType_Instances();
		}
		return OperandExpressionType._instances;
	}
}

class OperandExpressionType_Instances
{
	constructor()
	{
		this.Dereference 	= new OperandExpressionType("Dereference", 1);
		this.Direct 		= new OperandExpressionType("Direct", 0);
		this.Label 			= new OperandExpressionType("Label", 0);
		this.Register 		= new OperandExpressionType("Register", 1);
	}
}
