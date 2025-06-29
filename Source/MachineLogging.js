
class MachineLogging
{
	constructor(machineInner)
	{
		this.machineInner = machineInner;
	}

	architecture()
	{
		return this.machineInner.architecture();
	}

	boot()
	{
		this.machineInner.boot();
	}

	deviceAtIndex(index)
	{
		return this.machineInner.deviceAtIndex(index);
	}

	deviceByAddress(addressToFind)
	{
		return this.machineInner.deviceByAddress(addressToFind);
	}

	devicesUpdate()
	{
		this.machineInner.devicesUpdate();
	}

	instructionGetAndAdvance()
	{
		var instruction =
			this.machineInner.instructionGetAndAdvance();
		var instructionAsAssembly =
			instruction.toStringAssembly();
		console.log(instructionAsAssembly);
		return instruction;
	}

	memoryCellAtAddress(memoryCellIndex)
	{
		return this.machineInner.memoryCellAtAddress(memoryCellIndex);
	}

	memoryCellAtAddressSet(memoryCellIndex, value)
	{
		this.machineInner.memoryCellAtAddressSet(memoryCellIndex, value);
		return this;
	}

	memoryWriteCells(cellsToWrite, addressToWriteTo)
	{
		this.machineInner.memoryWriteCells(cellsToWrite, addressToWriteTo);
	}

	programWriteToMemoryCellsAtOffset(program, offset)
	{
		this.machineInner.programWriteToMemoryCellsAtOffset(program, offset);
	}

	registerByAbbreviation(abbreviation)
	{
		return this.machineInner.registerByAbbreviation(abbreviation);
	}

	registerWithAbbreviationSetToValue(abbreviation, valueToSet)
	{
		return this.machineInner.registerWithAbbreviationSetToValue(abbreviation, valueToSet);
	}

	tick()
	{
		var instruction = this.instructionGetAndAdvance();
		instruction.run(this);
	}

	// Convenience abbreviations.

	registerAtIndex(registerIndex)
	{
		return this.machineInner.registerAtIndex(registerIndex);
	}

	// registers

	registerCodeSegment()
	{
		return this.machineInner.registerCodeSegment();
	}

	registerInstructionPointer()
	{
		return this.machineInner.registerInstructionPointer();
	}

	registerStackPointer()
	{
		return this.machineInner.registerStackPointer();
	}

}
