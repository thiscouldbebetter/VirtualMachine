
class Machine
{
	constructor
	(
		name, 
		architecture, 
		memorySizeInCells,
		memoryCellOffsetForDevices, 
		devices
	)
	{
		this.name = name;
		this._architecture = architecture;
		this.memoryCellOffsetForDevices =
			memoryCellOffsetForDevices;
		this.devices = devices;

		this.registers = [];
		this.memoryCells =
			new Array(memorySizeInCells);

		for (var c = 0; c < this.memoryCells.length; c++)
		{
			this.memoryCells[c] = 0;
		}

		for (var d = 0; d < this.devices.length; d++)
		{
			var device = this.devices[d];
			device.machine = this;
			// this.devices["_" + device.address] = device;
			//device.initialize();
		}

		var registerDefns = architecture.registerDefns;

		this.registers =
			registerDefns.map(x => new Register(x) );

		this.registersByAbbreviation = new Map
		(
			this.registers.map(x => [x.defn.abbreviation, x] )
		);
	}

	architecture()
	{
		return this._architecture;
	}

	boot()
	{
		// Set the stack pointer to the max allowed value.
		var sp = this.registerStackPointer();
		sp.valueSet(this.memoryCellOffsetForDevices - 1);

		this.devices.forEach(x => x.initialize() );

		var architecture = this.architecture();

		this.programWriteToMemoryCellsAtOffset
		(
			architecture.bootProgram,
			0
		);
	}

	deviceAtIndex(index)
	{
		return this.devices[index];
	}

	deviceByAddress(addressToFind)
	{
		return this.devices.find(x => x.address == addressToFind);
	}

	devicesUpdate()
	{
		for (var d = 0; d < this.devices.length; d++)
		{
			var device = this.devices[d];
			device.update();
		}
	}

	instructionGetAndAdvance()
	{
		var ip = this.registerInstructionPointer();

		var ipValue = ip.value();
		var instructionAsMemoryCell =
			this.memoryCellAtAddress(ipValue);
		var architecture = this.architecture();
		var instruction = Instruction.fromMemoryCell
		(
			architecture,
			instructionAsMemoryCell
		);

		ip.valueIncrement();

		return instruction;
	}

	memoryCellAtAddress(memoryCellIndex)
	{
		return this.memoryCells[memoryCellIndex];
	}

	memoryCellAtAddressSet(memoryCellIndex, value)
	{
		this.memoryCells[memoryCellIndex] = value;
		return this;
	}

	memoryWriteCells(cellsToWrite, addressToWriteTo)
	{
		ArrayHelper.overwriteSourceAtIndexWithTargetAtIndexForCount
		(
			// source
			cellsToWrite,
			0,
			// target
			this.memoryCells,
			addressToWriteTo,
			// count
			cellsToWrite.length
		);
	}

	programWriteToMemoryCellsAtOffset(program, offset)
	{
		var programAsMemoryCells =
			program.toMemoryCells(this);

		this.memoryWriteCells
		(
			programAsMemoryCells,
			offset
		);
	}

	registerByAbbreviation(abbreviation)
	{
		return this.registersByAbbreviation.get(abbreviation);
	}

	registerWithAbbreviationSetToValue(abbreviation, valueToSet)
	{
		var register = 
			this.registerByAbbreviation(abbreviation); 
		register.valueSet(valueToSet);
	}

	tick()
	{
		var instruction = this.instructionGetAndAdvance();
		instruction.run(this);
	}

	// Convenience abbreviations.

	registerAtIndex(registerIndex)
	{
		return this.registers[registerIndex];
	}

	// registers

	registerCodeSegment()
	{
		return this.registerByAbbreviation("cs");
	}

	registerInstructionPointer()
	{
		return this.registerByAbbreviation("ip");
	}

	registerStackPointer()
	{
		return this.registerByAbbreviation("sp");
	}

}
