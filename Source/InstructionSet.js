
class InstructionSet
{
	constructor(name, opcodes)
	{
		this.name = name;
		this.opcodes = opcodes;

		this.mnemonicToOpcodeLookup = new Map();
		this.valueToOpcodeLookup = new Map();

		for (var i = 0; i < this.opcodes.length; i++)
		{
			var opcode = this.opcodes[i];
			this.mnemonicToOpcodeLookup.set(opcode.mnemonic, opcode);
			this.valueToOpcodeLookup.set(opcode.value, opcode);
		}
	}

	opcodeByMnemonic(mnemonic)
	{
		return this.mnemonicToOpcodeLookup.get(mnemonic);
	}

	opcodeByValue(value)
	{
		return this.valueToOpcodeLookup.get(value);
	}
}
