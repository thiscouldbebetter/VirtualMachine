
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
		var memoryCellIndex =
			this.address + this.defn.ports[portName].offset;
		var returnValue = this.machine.memoryCells[memoryCellIndex];
		return returnValue;
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
