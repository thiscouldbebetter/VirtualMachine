
class Device
{
	constructor(name, defn, address, sizeInCells)
	{
		this.name = name;
		this.defn = defn;
		this.address = address;
		this.sizeInCells = sizeInCells;

		this.machine = null;
	}

	portValueByName(portName)
	{
		var port = this.defn.portByName(portName);
		var memoryCellIndex = this.address + port.offset;
		var value =
			this.machine.memoryCellAtAddress(memoryCellIndex);
		return value;
	}

	initialize()
	{
		this.defn.deviceInitialize(this);
	}

	update()
	{
		this.defn.deviceUpdate(this);
	}
}
