
class OperandExpressionType_Instances
{
	constructor()
	{
		this.Dereference 	= new OperandExpressionType("Dereference", 1);
		this.Direct 		= new OperandExpressionType("Direct", 0);
		this.Label		= new OperandExpressionType("Label", 0);
		this.Register 		= new OperandExpressionType("Register", 1);
	}
}
