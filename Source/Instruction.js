
class Instruction
{
	constructor(opcode, operands)
	{
		this.opcode = opcode;
		this.operands = operands;
	}

	run(machine)
	{
		this.opcode.run(machine, this.operands);
	}

	// memory

	static fromMemoryCell(architecture, memoryCellValue)
	{
		var shiftForOpcode = 
			architecture.instructionSizeInBits
			- architecture.opcodeSizeInBits;

		var opcodeValue = memoryCellValue >> shiftForOpcode;

		var opcode =
			architecture.instructionSet.opcodeByValue(opcodeValue);

		var operands = [];

		memoryCellValue -= opcodeValue << shiftForOpcode;

		var bitsRemaining = 
			architecture.instructionSizeInBits 
			- architecture.opcodeSizeInBits;

		var operandDefns = opcode.operandDefns;
		for (var i = 0; i < operandDefns.length; i++)
		{
			var operandDefn = operandDefns[i];

			var bitsToShift = bitsRemaining - operandDefn.sizeInBits;

			var operandValue = memoryCellValue >> bitsToShift; 

			memoryCellValue -= operandValue << bitsToShift;

			bitsRemaining -= operandDefn.sizeInBits;

			var operand = new Operand
			(
				operandDefn, 
				OperandExpressionType.Instances().Direct,
				operandValue
			);

			operands.push(operand);
		}

		var returnValue = new Instruction(opcode, operands);

		return returnValue;	
	}

	toMemoryCell(machine)
	{
		var returnValue = this.opcode.value;

		var architecture = machine.architecture();
		var bitsUsedSoFar = architecture.opcodeSizeInBits;

		var operandDefns = this.opcode.operandDefns;
		for (var i = 0; i < operandDefns.length; i++)
		{
			var operand = this.operands[i];
			var operandSizeInBits = operandDefns[i].sizeInBits;

			returnValue = returnValue << operandSizeInBits;

			bitsUsedSoFar += operandSizeInBits;

			var operandAsMemoryBits = operand.toMemoryBits(machine);
			var mask = Math.pow(2, operandSizeInBits) - 1;
			returnValue += operandAsMemoryBits & mask;
		}

		var bitsUnused = architecture.instructionSizeInBits - bitsUsedSoFar;

		returnValue = returnValue << bitsUnused;

		return returnValue;	
	}

	// strings

	toStringAssembly(architecture)
	{
		var returnValue = this.opcode.mnemonic;

		for (var i = 0; i < this.operands.length; i++)
		{
			var operand = this.operands[i];
			returnValue += " " + operand.toStringAssembly(); // todo
		}

		return returnValue;
	}
}
