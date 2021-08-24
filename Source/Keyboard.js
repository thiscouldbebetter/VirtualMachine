
class Keyboard
{
	constructor(device)
	{
		this.device = device;
		this.device.keyboard = this; // hack
	}

	// DeviceDefn Instance

	static PortNames()
	{
		if (Keyboard._portNames == null)
		{
			Keyboard._portNames = new Keyboard_PortNames();
		}
		return Keyboard._portNames;
	}

	static DeviceDefn()
	{
		if (VirtualMachine._deviceDefn == null)
		{
			VirtualMachine._deviceDefn = new DeviceDefn
			(
				"Keyboard",
				[
					new DevicePort(Keyboard.PortNames().KeyCodePressed, 0),
				],
				// initialize
				(device) =>
				{
					device.keyboard.initialize(); 
				},
				// update
				(device) =>
				{
					// todo
				}
			);
		}
		return VirtualMachine._deviceDefn;
	}

	processKeyDown(event)
	{
		// todo
		var keyCodePressed = event.keyCode;
	}

	// Device.

	initialize()
	{
		document.keyboard = this; // hack
		document.onkeydown = this.processKeyDown.bind(this);
	}

	update()
	{
		// todo
	}
}

class Keyboard_PortNames
{
	constructor()
	{
		this.KeyCodePressed = "KeyCodePressed";
	}
}
