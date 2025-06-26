
class Display_OperationValues
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
			this._instance = new Display_OperationValues();
		}
		return this._instance;
	}

}
