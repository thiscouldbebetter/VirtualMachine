
class Opcode
{
	constructor(name, mnemonic, value, operandDefns, run)
	{
		this.name = name;
		this.mnemonic = mnemonic;
		this.value = value;
		this.operandDefns = operandDefns;
		this.run = run;
	}
}
