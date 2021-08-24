
class InstructionSet
{
	constructor(name, opcodes)
	{
		this.name = name;
		this.opcodes = opcodes;

		this.mnemonicToOpcodeLookup = [];
		this.valueToOpcodeLookup = [];

		for (var i = 0; i < this.opcodes.length; i++)
		{
			var opcode = this.opcodes[i];
			this.mnemonicToOpcodeLookup[opcode.mnemonic] = opcode;
			this.valueToOpcodeLookup["_" + opcode.value] = opcode;
		}
	}
}
