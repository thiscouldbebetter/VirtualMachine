
class Disk_OperationValues
{
	constructor()
	{
		this.Read = "0";
		this.Write = "1";
	}

	static Instance()
	{
		if (this._instance == null)
		{
			this._instance = new Disk_OperationValues();
		}
		return this._instance;
	}

}
