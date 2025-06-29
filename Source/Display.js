
class Display
{
	constructor(device, sizeInCharacters)
	{
		this.device = device;
		this.device.display = this;
		this.sizeInCharacters = sizeInCharacters;

		this.charSizeInPixels = Coords.fromXY(8, 16);
		this.sizeInPixels = this.sizeInCharacters.clone().multiply
		(
			this.charSizeInPixels
		);
	}

	static DeviceDefn()
	{
		if (this._deviceDefn == null)
		{
			var portNames = Display_PortNames.Instance();
			var operationValues = Display_OperationValues.Instance();

			var ports =
			[
				new DevicePort(portNames.OperationToPerform, 0),
				new DevicePort(portNames.CharPosX, 1),
				new DevicePort(portNames.CharPosY, 2),
				new DevicePort(portNames.CharValue, 3),
				new DevicePort(portNames.DisplayMemory, 4),
			];

			this._deviceDefn = new DeviceDefn
			(
				"Display",
				ports,
				// initialize
				(device) => device.display.initialize(),
				Display.deviceUpdate
			);
		}

		return this._deviceDefn;
	}

	static deviceUpdate(device)
	{ 
		var display = device.display;
		var machine = device.machine;
		var portNames = Display_PortNames.Instance();

		var operationToPerform =
			device.portValueByName(portNames.OperationToPerform);
		var charPos = Coords.fromXY
		(
			device.portValueByName(portNames.CharPosX),
			device.portValueByName(portNames.CharPosY)
		);
		var charValue = device.portValueByName(portNames.CharValue);

		var portDisplayMemory =
			this.portByName(portNames.DisplayMemory);
		var baseAddressOfDisplayMemory = 
			device.address
			+ portDisplayMemory.offset;
		var charOffset =
			charPos.y * display.sizeInCharacters.x + charPos.x;
		var charAddress = 
			baseAddressOfDisplayMemory
			+ charOffset;

		var operationValues = Display_OperationValues.Instance();

		if (operationToPerform == operationValues.Read)
		{
			throw new Error("Not yet implemented!");
		}
		else if (operationToPerform == operationValues.Write)
		{
			machine.memoryCellAtAddressSet(charAddress, charValue);
			display.update(this);
		}
	}


	// device

	initialize()
	{
		var d = document;
		var divDisplay = d.getElementById("divDisplay");
		divDisplay.innerHTML = "";
		divDisplay.appendChild(this.toHTMLElement());
		this.update();
	}

	update()
	{
		var canvas = this.htmlElement;
		var graphics = canvas.graphics;

		graphics.fillStyle = "White";
		graphics.fillRect
		(
			0, 0, 
			this.sizeInPixels.x, 
			this.sizeInPixels.y
		);
		graphics.strokeStyle = "LightGray";
		graphics.strokeRect
		(
			0, 0, 
			this.sizeInPixels.x, 
			this.sizeInPixels.y
		);

		graphics.fillStyle = "LightGray";

		var device = this.device;
		var machine = device.machine;

		var charPos = Coords.create();
		var charPosInPixels = Coords.create();

		var portNames = new Display_PortNames();
		var portDisplayMemory =
			device.defn.portByName(portNames.DisplayMemory);
		var baseAddressOfDisplayMemory = 
			device.address
			+ portDisplayMemory.offset;

		for (var y = 0; y < this.sizeInCharacters.y; y++)
		{
			charPos.y = y;
		
			for (var x = 0; x < this.sizeInCharacters.x; x++)
			{
				charPos.x = x;

				charPosInPixels.overwriteWith(charPos).multiply
				(
					this.charSizeInPixels
				);

				var charOffset =
					charPos.y * this.sizeInCharacters.x + charPos.x;
				var charAddress = 
					baseAddressOfDisplayMemory
					+ charOffset;

				var charValue =
					machine.memoryCellAtAddress(charAddress);
				var charToDisplay;

				if (charValue == 0)
				{
					charToDisplay = "-";
				}
				else
				{
					charToDisplay = String.fromCharCode(charValue);
				}

				graphics.fillText
				(
					charToDisplay,
					charPosInPixels.x,
					charPosInPixels.y
				);
			}
		}
	}

	// html

	toHTMLElement()
	{
		var canvas = document.createElement("canvas");
		canvas.width = this.sizeInPixels.x;
		canvas.height = this.sizeInPixels.y;
		canvas.graphics = canvas.getContext("2d");

		this.htmlElement = canvas;

		return this.htmlElement;
	}
}
