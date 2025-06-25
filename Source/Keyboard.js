
class Keyboard
{
	constructor(device)
	{
		this.device = device;
		this.device.keyboard = this;
	}

	// DeviceDefn Instance

	static DeviceDefn()
	{
		if (this._deviceDefn == null)
		{
			var portNames = new Keyboard_PortNames();

			this._deviceDefn = new DeviceDefn
			(
				"Keyboard",
				[
					new DevicePort(portNames.KeyCodePressed, 0),
				],
				// initialize
				(device) => device.keyboard.initialize(),
				// update
				(device) => { } // todo
			);
		}
		return this._deviceDefn;
	}

	// Static Methods

	static processKeyDown(event)
	{
		// todo
		var keyCodePressed = event.keyCode;
	}

	// Device Methods

	initialize()
	{
		document.keyboard = this;
		document.onkeydown = Keyboard.processKeyDown;
	}

	update()
	{
		// todo
	}
}
