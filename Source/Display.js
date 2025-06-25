
class Display
{
	constructor(device, sizeInCharacters)
	{
		this.device = device;
		this.device.display = this;
		this.sizeInCharacters = sizeInCharacters;

		this.charSizeInPixels = new Coords(8, 16);
		this.sizeInPixels = this.sizeInCharacters.clone().multiply
		(
			this.charSizeInPixels
		);
	}

	static DeviceDefn()
	{
		if (this._deviceDefn == null)
		{
			var portNames = new Display_PortNames();
			var operationValues = new Display_OperationValues();

			var ports =
			[
				new DevicePort(portNames.OperationToPerform, 0),
				new DevicePort(portNames.CharPosX, 1),
				new DevicePort(portNames.CharPosY, 2),
				new DevicePort(portNames.CharValue, 3),
				new DevicePort(portNames.DisplayMemory, 4),
			];

			var update = (device) =>
			{ 
				var display = device.display;
				var machine = device.machine;
				var portNames = new Display_PortNames();
				var operationValues = new Display_OperationValues();

				var operationToPerform = device.portValue(portNames.OperationToPerform);
				var charPos = new Coords
				(
					device.portValue(portNames.CharPosX),
					device.portValue(portNames.CharPosY)
				);
				var charValue = device.portValue(portNames.CharValue);

				var portDisplayMemory = this.portByName(portNames.DisplayMemory);
				var baseAddressOfDisplayMemory = 
					device.address
					+ portDisplayMemory.offset;
				var charOffset =
					charPos.y * display.sizeInCharacters.x + charPos.x;
				var charAddress = 
					baseAddressOfDisplayMemory
					+ charOffset;

				if (operationToPerform == Display.OperationValues.Read)
				{
					// todo
				}
				else if (operationToPerform == Display.OperationValues.Write)
				{	
					machine.memoryCells[charAddress] = charValue;
					display.update(this);
				}
			};

			this._deviceDefn = new DeviceDefn
			(
				"Display",
				ports,
				// initialize
				(device) => device.display.initialize(),
				update
			);
		}

		return this._deviceDefn;
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

		var charPos = new Coords(0, 0);
		var charPosInPixels = new Coords(0, 0);

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

				var charOffset = charPos.y * this.sizeInCharacters.x + charPos.x;
				var charAddress = 
					baseAddressOfDisplayMemory
					+ charOffset;

				var charValue = machine.memoryCells[charAddress];
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
