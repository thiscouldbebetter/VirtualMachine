
class Disk_PortNames
{
	constructor()
	{
		this.OperationToPerform = "OperationToPerform";
		this.DiskAddress = "DiskAddress";
		this.MachineAddress = "MachineAddress";
		this.NumberOfCellsToMove = "NumberOfCellsToMove";
	}

	static Instance()
	{
		if (this._instance == null)
		{
			this._instance = new Disk_PortNames();
		}
		return this._instance;
	}
}
