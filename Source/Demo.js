class Demo
{
	static programText()
	{
		var programLines =
		[
			"set ax, HelloWorldText",
			"push ax	; charToPrint",
			"call CharPrintToScreen",

			"DoNothingForever:",
			"jmp DoNothingForever",

			"HelloWorldText:",
			"data \"Hello world!\"",

			"CharPrintToScreen:",
			"push bp	; save bp",
			"mov bp, sp	; save return address from stack to bp",
			"push ax	; save registers",
			"push bx",
			"push cx",
			"push dx",
			"push si",
			"push di",

			"set dx, 2 	; dx = displayID",
			"devad si, dx 	; si = devices[displayID]",
			"mov di, si	; di = display.operation",
			"stori di, 1	; display.operation = write",
			"addi di, 1	; di = display.charPosX",
			"mov bx, di	; bx = display.charPosX",
			"stori di, 1	; display.charPosX = 1",
			"addi di, 1	; di = display.charPosY",
			"stori di, 2	; display.charPosY = 2",
			"addi di, 1	; di = display.charValue",
			"stori di, 8	; display.charValue = 'H'",
			"stor di,[bp+1] ; display.charValue = charToWrite",
			"devup dx	; display.update()",

			"pop di		; restore registers",
			"pop si", 
			"pop dx",
			"pop cx",
			"pop bx",
			"pop ax",
			"pop bp",
			"ret 0		; return to caller",
		];

		var newline = "\n";
		var programText = programLines.join(newline);

		return programText;
	}

	static runProgramFromText(programToRunText)
	{
		var diskDeviceDefn = Disk.DeviceDefn();

		var disk0 = new Disk
		(
			new Device
			(
				"Disk 0",
				diskDeviceDefn,
				500, // addressInCells
				4 // sizeInCells
			),
			200000 // sizeOfDiskInCells
		);

		var keyboardDeviceDefn = Keyboard.DeviceDefn();

		var keyboard0 = new Keyboard
		(
			new Device
			(
				"Keyboard 0",
				keyboardDeviceDefn,
				600, // addressInCells
				4 // sizeInCells
			)
		);

		var displayDeviceDefn = Display.DeviceDefn();

		var display0 = new Display
		(
			new Device
			(
				"Display 0",
				displayDeviceDefn,
				1000, // addressInCells
				2000 // sizeInCells
			),
			new Coords(64, 16) // sizeInCharacters
		);

		var architecture = MachineArchitecture.Instances().Default;

		var machine = new Machine
		(
			"Test Machine",
			architecture,
			3000, // numberOfMemoryCellsAddressable
			500, // offsetOfDevices
			[
				disk0.device,
				keyboard0.device,
				display0.device,
			]
		);

		var syntaxDefault =
			AssemblyLanguageSyntax.Instances().Default;

		var programToRun = Program.fromAssembly
		(
			"BootStage2",
			architecture,
			syntaxDefault,
			programToRunText
		);

		var programToRunAsMemoryCells =
			programToRun.toMemoryCells(machine);

		disk0.writeMemoryCells
		(
			0, // address
			programToRunAsMemoryCells
		);

		var globals = Globals.Instance();
		globals.initialize
		(
			10, // millisecondsPerTick
			machine
		);
	}
}
