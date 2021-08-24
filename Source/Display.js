
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

	static PortNames()
	{
		if (Display._portNames == null)
		{
			Display._portNames = new Display_PortNames();
		}
		return Display._portNames;
	}


	static OperationValues()
	{
		if (Display._operationValues == null)
		{
			Display._operationValues = new Display_OperationValues();
		}
		return Display._operationValues;
	}

	static DeviceDefn()
	{
		if (Display._deviceDefn == null)
		{
			Display._deviceDefn = new DeviceDefn
			(
				"Display",
				[
					new DevicePort(Display.PortNames.OperationToPerform, 0),
					new DevicePort(Display.PortNames.CharPosX, 1),
					new DevicePort(Display.PortNames.CharPosY, 2),
					new DevicePort(Display.PortNames.CharValue, 3),
					new DevicePort(Display.PortNames.DisplayMemory, 4),
				],
				// initialize
				(device) =>
				{
					device.display.initialize(); 
				},
				// update
				(device) =>
				{ 
					var display = device.display;
					var machine = device.machine;
					var portNames = Display.PortNames;
					var operationValues = Display.OperationValues;

					var operationToPerform = device.portValue(portNames.OperationToPerform);
					var charPos = new Coords
					(
						device.portValue(portNames.CharPosX),
						device.portValue(portNames.CharPosY)
					);
					var charValue = device.portValue(portNames.CharValue);

					var baseAddressOfDisplayMemory = 
						device.address
						+ this.ports[portNames.DisplayMemory].offset;
					var charOffset = charPos.y * display.sizeInCharacters.x + charPos.x;
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
				}
			);
		}

		return Display._deviceDefn;
	}

	// device

	initialize()
	{
		document.body.appendChild(this.toHTMLElement());
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

		var baseAddressOfDisplayMemory = 
			device.address
			+ device.defn.ports[Display.PortNames.DisplayMemory].offset;

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

class Display_OperationValues
{
	constructor()
	{
		this.Read = "0";
		this.Write = "1";
	}
}

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
}
