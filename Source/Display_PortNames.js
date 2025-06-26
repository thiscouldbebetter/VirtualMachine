
class Display_PortNames
{
	constructor()
	{
		this.OperationToPerform = "OperationToPerform";
		this.CharPosX = "CharPosX";
		this.CharPosY = "CharPosY";
		this.CharValue = "CharValue";
		this.DisplayMemory = "DisplayMemory";
	}

	static Instance()
	{
		if (this._instance == null)
		{
			this._instance = new Display_PortNames();
		}
		return this._instance;
	}

}
