
class Machine
{
	constructor
	(
		name, 
		architecture, 
		numberOfMemoryCellsAddressable,
		memoryCellOffsetForDevices, 
		devices
	)
	{
		this.name = name;
		this.architecture = architecture;;
		this.numberOfMemoryCellsAddressable = numberOfMemoryCellsAddressable;
		this.memoryCellOffsetForDevices = memoryCellOffsetForDevices;
		this.devices = devices;

		this.registers = [];
		this.memoryCells = new Array(this.numberOfMemoryCellsAddressable);

		for (var c = 0; c < this.numberOfMemoryCellsAddressable; c++)
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

		var registerDefns = this.architecture.registerDefns;

		this.registers =
			registerDefns.map(x => new Register(x) );

		this.registersByAbbreviation = new Map
		(
			this.registers.map(x => [x.defn.abbreviation, x] )
		);
	}

	boot()
	{
		// Set the stack pointer to the max allowed value.
		var sp = this.registerStackPointer();
		sp.valueSet(this.memoryCellOffsetForDevices - 1);

		this.devices.forEach(x => x.initialize() );

		this.programWriteToMemoryCellsAtOffset
		(
			this.architecture.bootProgram,
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

	memoryCellAtIndexSetToValue(memoryCellIndex, value)
	{
		this.memoryCells[memoryCellIndex] = value;
	}

	memoryWriteCells(cellsToWrite, addressToWriteTo)
	{
		ArrayHelper.overwriteArrayWithOther
		(
			cellsToWrite,
			0, 
			this.memoryCells,
			addressToWriteTo,
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
		var ip = this.registerInstructionPointer();
		var ipValue = ip.value();
		var instructionAsMemoryCell =
			this.memoryCells[ipValue];
		var instruction = Instruction.fromMemoryCell
		(
			this.architecture,
			instructionAsMemoryCell
		);
		ip.valueIncrement();

		instruction.run(this);
	}

	// Convenience abbreviations.

	memoryCellAtIndex(memoryCellIndex)
	{
		return this.memoryCells[memoryCellIndex];
	}

	memoryCellAtIndexValue(memoryCellIndex, value)
	{
		this.memoryCells[memoryCellIndex] = value;
		return this;
	}

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
