
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

		this.registerAbbreviationToIndexLookup = new Map();

		var registerDefns = this.architecture.registerDefns;
		for (var r = 0; r < registerDefns.length; r++)
		{
			this.registers[r] = 0;
			var registerDefn = registerDefns[r];
			this.registerAbbreviationToIndexLookup.set(registerDefn.abbreviation, r);
		}

		// convenience aliases

		this.defn = this.architecture;
		this.reg = this.registers;
		this.ri = this.registerAbbreviationToIndexLookup;
		this.mem = this.memoryCells;
	}

	boot()
	{
		this.reg[this.ri.sp] = this.memoryCellOffsetForDevices - 1;

		for (var d = 0; d < this.devices.length; d++)
		{
			this.devices[d].initialize();
		}

		var bootProgramAsMemoryCells =
			this.architecture.bootProgram.toMemoryCells(this);

		this.memoryWriteCells
		(
			bootProgramAsMemoryCells,
			0 // origin
		);
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

	tick()
	{
		var ip = this.reg[this.ri.ip];
		var instructionAsMemoryCell = this.memoryCells[ip];
		var instruction = Instruction.fromMemoryCell
		(
			this.architecture,
			instructionAsMemoryCell
		);
		this.reg[this.ri.ip]++;

		instruction.run(this);
	}
}
