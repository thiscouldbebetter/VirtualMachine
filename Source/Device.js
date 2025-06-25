
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

	portValue(portName)
	{
		var port = this.defn.portByName(portName);
		var memoryCellIndex = this.address + port.offset;
		return this.machine.memoryCells[memoryCellIndex];
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
