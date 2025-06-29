
class MachineArchitecture_Instances
{
	constructor()
	{
		this.Default = this.architectureDefaultBuild();
	}

	architectureDefaultBuild()
	{
		var instructionSet = this.instructionSet();

		var registerDefns = this.registerDefns();

		var syntax = AssemblyLanguageSyntax.Instances().Default;

		var bootProgramText = this.bootProgramText();

		var returnValue = new MachineArchitecture
		(
			"Default Machine Architecture",
			16, // instructionSizeInBits
			6, // opcodeSizeInBits
			3, // operandSizeInBits
			16, // memoryCellSizeInBits
			8, // segmentOffsetWidthInBits
			registerDefns,
			instructionSet,
			syntax,
			bootProgramText
		);

		return returnValue;
	}

	bootProgramText()
	{
		var bootProgramAsLines =
		[
			"set ax, 0      ; ax = deviceID 0 (disk)",
			"devad si, ax   ; si = disk",
			"mov di, si     ; di = disk.operation",
			"stori di, 0    ; disk.operation = read",
			"addi di, 1     ; di = disk.diskAddress",
			"stori di, 0    ; disk.diskAddress = 0",
			"addi di, 1     ; di = disk.memoryAddress",
			"sethi dx, 1    ; dh = memory address for 2nd stage boot",
			"setlo dx, 0    ; dl = address of segment 1",
			"stor di, dx    ; disk.memoryAddress = 2nd stage boot",
			"addi di, 1     ; di = disk.numberOfCellsToMove",
			"stori di, 32   ; disk.numberOfCellsToMove = 32",
			"devup ax       ; disk.update()",
			"setcs 1        ; prepare to jump relative to segment 1",
			"jump 0         ; to 2nd stage boot"
		];

		var newline = "\n";
		var bootProgramText = bootProgramAsLines.join(newline);
		return bootProgramText;
	}

	instructionSet()
	{
		var oc = Opcode;
		var od = OperandDefn;
		var od2 = () => new od(2);
		var od3 = () => new od(3);
		var od4 = () => new od(4);
		var od5 = () => new od(5);
		var od6 = () => new od(6);
		var od8 = () => new od(8);
		var od10 = () => new od(10); // For jump and call.

		var arch = this;

		var opcodes =
		[
			//function Opcode(name, mnemonic, value, operandDefns, run)
			new oc("DoNothing", 		"nop", 	-1, [], 						(m, o) => { /* do nothing */ }),

			new oc("Add",				"add",	-1, [od4(), od4()], 			(m, o) => arch.add(m, o) 						),
			new oc("AddImmediate",		"addi",	-1, [od4(), od6()], 			(m, o) => arch.addImmediate(m, o) 				),
			new oc("Call",				"call",	-1, [od10()], 					(m, o) => arch.call(m, o) 						),
			new oc("Compare", 			"cmp", 	-1, [od4(), od4()],				(m, o) => arch.compare(m, o) 					),
			new oc("DeviceAddress",		"devad",-1, [od4(), od4()], 			(m, o) => arch.deviceAddress(m, o) 				),
			new oc("DeviceUpdate", 		"devup",-1, [od4()],					(m, o) => arch.deviceUpdate(m, o) 				),
			new oc("Divide",			"div",	-1, [od4(), od4()], 			(m, o) => arch.divide(m, o) 					),
			new oc("Halt",				"halt",	-1, [], 						(m, o) => arch.halt(m, o) 						),
			new oc("Jump",				"jump", -1, [od10()], 					(m, o) => arch.jump(m, o) 						),
			new oc("JumpIfEqual", 		"jeq",  -1, [od10()], 					(m, o) => arch.jumpIfEqual(m, o) 				),
			new oc("JumpIfGreater",		"jgt",  -1, [od10()], 					(m, o) => arch.jumpIfGreaterThan(m, o) 			),
			new oc("JumpIfGTE",			"jgte", -1, [od10()], 					(m, o) => arch.jumpIfGreaterThanOrEqual(m, o) 	),
			new oc("JumpIfLess",		"jlt",  -1, [od10()], 					(m, o) => arch.jumpIfLess(m, o) 				),
			new oc("JumpIfLTE",			"jlte", -1, [od10()], 					(m, o) => arch.jumpIfLessThanOrEqual(m, o) 		),
			new oc("JumpIfNotEqual",	"jne", 	-1, [od10()], 					(m, o) => arch.jumpIfNotEqual(m, o) 			),
			new oc("Load", 				"load", -1, [od4(), od4()], 			(m, o) => arch.load(m, o) 						),
			new oc("LoadImmediate", 	"loadi", -1,[od4(), od6()], 			(m, o) => arch.loadImmediate(m, o) 				),
			new oc("Loop",				"loop",	-1, [od10()], 					(m, o) => arch.loop(m, o) 						),
			new oc("MemoryCopy",		"mcopy",-1, [od3(), od3(), od3()], 		(m, o) => arch.memoryCopy(m, o) 				),
			new oc("Move",				"mov",	-1, [od5(), od5()], 			(m, o) => arch.move(m, o) 						),
			new oc("Pop",				"pop",	-1, [od4()], 					(m, o) => arch.pop(m, o) 						),
			new oc("Push",				"push",	-1, [od4()], 					(m, o) => arch.push(m, o)						),
			new oc("Return",			"ret", 	-1, [od10()], 					(m, o) => arch._return(m, o) 					),
			new oc("Set", 				"set", 	-1, [od2(), od8()], 			(m, o) => arch.set(m, o) 						),
			new oc("SetByteLow",		"setlo",-1, [od2(), od8()],				(m, o) => arch.setByteLow(m, o)					), 
			new oc("SetByteHigh",		"sethi",-1, [od2(), od8()],				(m, o) => arch.setByteHigh(m, o)				),
			new oc("SetCodeSegment",	"setcs",-1, [od10()],					(m, o) => arch.setCodeSegment(m, o) 			),
			new oc("ShiftLeft",			"shftl",-1, [od4(), od4()], 			(m, o) => arch.shiftLeft(m, o) 					),
			new oc("Store", 			"stor",-1,  [od4(), new od(4, true)], 	(m, o) => arch.store(m, o) 						),
			new oc("StoreImmediate",	"stori",-1, [od4(), od6()], 			(m, o) => arch.storeImmediate(m, o) 			),
			new oc("Subtract",			"sub",	-1, [od4(), od4()], 			(m, o) => arch.subtract(m, o) 					),
			new oc("SubtractImmediate",	"subi",	-1, [od4(), od6()], 			(m, o) => arch.subtractImmediate(m, o) 			)
		];

		for (var i = 0; i < opcodes.length; i++)
		{
			// For now.
			opcodes[i].value = i;
		}

		var instructionSet = new InstructionSet
		(
			"Default Instruction Set",
			opcodes
		);

		return instructionSet;
	}

	registerDefns()
	{
		var rd = RegisterDefn;

		var registerDefns =
		[
			new rd("General Register A", "ax"),
			new rd("General Register B", "bx"),
			new rd("General Register C", "cx"),
			new rd("General Register D", "dx"),

			new rd("Source Index", "si"),
			new rd("Destination Index", "di"),

			new rd("Base Pointer", "bp"),
			new rd("Stack Pointer", "sp"),
			new rd("Code Segment", "cs"),

			new rd("Instruction Pointer", "ip"), 
			new rd("Comparison Result", "cr"),
		];

		return registerDefns;
	}

	// Opcodes.

	add(machine, operands)
	{
		var registerTargetIndex = operands[0].value();
		var registerSourceIndex = operands[1].value();

		var registerTarget = machine.registerAtIndex(registerTargetIndex);
		var registerIncrement = machine.registerAtIndex(registerSourceIndex);
		var increment = registerIncrement.value();
		registerTarget.valueAdd(increment);
	}

	addImmediate(machine, operands)
	{
		var registerTargetIndex = operands[0].value();
		var increment = operands[1].value();

		var registerTarget = machine.registerAtIndex(registerTargetIndex);
		registerTarget.valueAdd(increment);
	}

	call(machine, operands)
	{
		var registerStackPointer = machine.registerStackPointer();
		registerStackPointer.valueAdd(-1);

		var registerInstructionPointer = machine.registerInstructionPointer();
		machine.memoryCellAtAddressSet
		(
			registerStackPointer.value(),
			registerInstructionPointer.value()
		);

		var ipNext =
			this.ipNextCalculateFromCsAndOperand(machine, operands[0]);

		registerInstructionPointer.valueSet(ipNext);
	}

	compare(machine, operands)
	{
		var operand0Value = operands[0].value();
		var operand1Value = operands[1].value();

		var register0Value = machine.registerAtIndex(operand0Value).value();
		var register1Value = machine.registerAtIndex(operand1Value).value();

		var comparisonResult = register0Value - register1Value;

		var registerComparisonResult = machine.registerComparisonResult();
		registerCr.valueSet(comparisonResult);
	}

	deviceAddress(machine, operands)
	{
		var registerTargetIndex = operands[0].value();
		var registerSourceIndex = operands[1].value();
		var registerTarget = machine.registerAtIndex(registerTargetIndex);
		var registerSource = machine.registerAtIndex(registerSourceIndex);
		var deviceIndex = registerSource.value();
		var device = machine.deviceAtIndex(deviceIndex);
		registerTarget.valueSet(device.address);
	}

	deviceUpdate(machine, operands)
	{
		var operand0Value = operands[0].value();
		var register = machine.registerAtIndex(operand0Value);
		var deviceIndex = register.value();
		var device = machine.deviceAtIndex(deviceIndex);
		device.update();
	}

	divide(machine, operands)
	{
		var operand0Value = operands[0].value();
		var operand1Value = operands[1].value();
		var registerTarget = machine.registerAtIndex(operand0Value);
		var dividend = registerTarget.value();
		var divisor = machine.registerAtIndex(operand1Value).value();
		var quotient = dividend / divisor;
		registerTarget.valueSet(quotient);
	}

	halt(machine, operands)
	{
		var ip = machine.registerInstructionPointer();
		ip.valueDecrement(); // Keep running this same instruction forever.
	}

	jump(machine, operands)
	{
		var ip = machine.registerInstructionPointer();
		var ipNext =
			this.ipNextCalculateFromCsAndOperand(machine, operands[0]);
		ip.valueSet(ipNext);
	}

	jumpIfEqual(machine, operands)
	{
		var cr = machine.registerComparisonResult();
		if (cr.value() == 0)
		{
			var ipNext =
				this.ipNextCalculateFromCsAndOperand(machine, operands[0]);
			var ip = machine.registerInstructionPointer();
			ip.valueSet(ipNext);
		}
	}

	jumpIfGreaterThan(machine, operands)
	{
		var cr = machine.registerComparisonResult();
		if (cr.value() > 0)
		{
			var ipNext =
				this.ipNextCalculateFromCsAndOperand(machine, operands[0]);
			var ip = machine.registerInstructionPointer();
			ip.valueSet(ipNext);
		}
	}

	jumpIfGreaterThanOrEqual(machine, operands)
	{
		var cr = machine.registerComparisonResult();
		if (cr.value() >= 0)
		{
			var ipNext =
				this.ipNextCalculateFromCsAndOperand(machine, operands[0]);
			var ip = machine.registerInstructionPointer();
			ip.valueSet(ipNext);
		}
	}

	jumpIfLessThan(machine, operands)
	{
		var cr = machine.registerComparisonResult();
		if (cr.value() < 0)
		{
			var ipNext =
				this.ipNextCalculateFromCsAndOperand(machine, operands[0]);
			var ip = machine.registerInstructionPointer();
			ip.valueSet(ipNext);
		}
	}

	jumpIfLessThanOrEqual(machine, operands)
	{
		var cr = machine.registerComparisonResult();
		if (cr.value() <= 0)
		{
			var ipNext =
				this.ipNextCalculateFromCsAndOperand(machine, operands[0]);
			var ip = machine.registerInstructionPointer();
			ip.valueSet(ipNext);
		}
	}

	load(machine, operands)
	{
		var operand0Value = operands[0].value();
		var operand1Value = operands[1].value();
		var registerTarget = machine.registerAtIndex(operand0Value);
		var valueNext = machine.memoryCellAt(operand1Value);
		registerTarget.valueSet(valueNext);
	}

	loadImmediate(machine, operands)
	{
		var operand0Value = operands[0].value();
		var operand1Value = operands[1].value();
		var registerTarget = machine.registerAtIndex(operand0Value);
		registerTarget.valueSet(operand1Value);
	}

	loop(machine, operands)
	{
		var cx = this.registerCx();
		cx.add(-1);
		var cxValue = cx.value(); 

		if (cxValue > 0)
		{
			var ip = machine.registerInstructionPointer();
			var ipNext =
				this.ipNextCalculateFromCsAndOperand(machine, operands[0]);
			ip.valueSet(ipNext);
		}
	}

	memoryCopy(machine, operands)
	{
		var operand0Value = operands[0].value();
		var operand1Value = operands[1].value();
		var operand2Value = operands[2].value();

		var targetStartIndex =
			machine.registerAtIndex(operand0Value).value;
		var sourceStartIndex =
			machine.registerAtIndex(operand1Value).value;
		var count =
			machine.registerAtIndex(operand2Value).value;

		var memoryCells = machine.memoryCells;

		// If the source and target overlap,
		// unexpected things may happen.

		ArrayHelper.overwriteSourceAtIndexWithTargetAtIndexForCount
		(
			// source
			memoryCells,
			sourceStartIndex,
			// target
			memoryCells,
			targetStartIndex,
			count
		);
	}

	move(machine, operands)
	{
		var operand0Value = operands[0].value();
		var operand1Value = operands[1].value();
		var registerTarget = machine.registerAtIndex(operand0Value);
		var registerSource = machine.registerAtIndex(operand1Value);
		var valueNext = registerSource.value();
		registerTarget.valueSet(valueNext);
	}

	pop(machine, operands)
	{
		var registerStackPointer = machine.registerStackPointer();
		var addressToPopFrom = registerStackPointer.value();
		var valuePoppedFromStack =
			machine.memoryCellAtAddress(addressToPopFrom);

		var registerTargetIndex = operands[0].value();
		var registerTarget = machine.registerAtIndex(registerTargetIndex);
		registerTarget.valueSet(valuePoppedFromStack);

		registerStackPointer.valueIncrement();
	}

	push(machine, operands)
	{
		var registerToPushIndex = operands[0].value();
		var registerToPush = machine.registerAtIndex(registerToPushIndex);
		var valueToPushToStack = registerToPush.value();

		var registerStackPointer = machine.registerStackPointer();
		registerStackPointer.valueDecrement();
		var addressToPushTo = registerStackPointer.value();

		machine.memoryCellAtAddressSet
		(
			addressToPushTo,
			valueToPushToStack
		);
	}

	_return(machine, operands)
	{
		var registerStackPointer = machine.registerStackPointer();
		var stackAddress = registerStackPointer.value();
		var addressToReturnTo = machine.memoryCellAtAddress(stackAddress);
		var registerInstructionPointer = machine.registerInstructionPointer();
		registerInstructionPointer.valueSet(addressToReturnTo);
		var offset = operands[0].value();
		registerStackPointer.valueAdd(offset);
	}

	set(machine, operands)
	{
		var operand0Value = operands[0].value();
		var operand1Value = operands[1].value();
		var registerTarget = machine.registerAtIndex(operand0Value);
		registerTarget.valueSet(operand1Value);
	}

	setByteLow(machine, operands)
	{
		var operand0Value = operands[0].value();
		var operand1Value = operands[1].value();
		var registerTarget = machine.registerAtIndex(operand0Value);
		var valueNext = 
			(registerTarget.value() & 0xFF00)
			| (operand1Value << MachineArchitecture.BitsPerByte);
		registerTarget.valueSet(valueNext);
	}

	setByteHigh(machine, operands)
	{
		var operand0Value = operands[0].value();
		var operand1Value = operands[1].value();
		var registerTarget = machine.registerAtIndex(operand0Value);
		var valueNext = 
			(registerTarget.value() & 0x00FF)
			| (operand1Value << MachineArchitecture.BitsPerByte);
		registerTarget.valueSet(valueNext);
	}

	setCodeSegment(machine, operands)
	{
		var operand0Value = operands[0].value();
		var cs = machine.registerCodeSegment();
		cs.valueSet(operand0Value);
	}

	shiftLeft(machine, operands)
	{
		var registerTargetIndex = operands[0].value();
		var registerTarget = machine.registerAtIndex(registerTargetIndex);
		var placesToShift = operands[1].value();
		registerTarget.valueShiftLeft(placesToShift);
	}

	store(machine, operands)
	{
		var operand0Value = operands[0].value();
		var operand1Value = operands[1].value();
		var memoryCellIndex = machine.registerAtIndex(operand0Value).value();
		var valueToStore = machine.registerAtIndex(operand1Value).value();
		machine.memoryCellAtAddressSet(memoryCellIndex, valueToStore);
	}

	storeImmediate(machine, operands)
	{
		var operand0Value = operands[0].value();
		var operand1Value = operands[1].value();
		var memoryCellIndex = machine.registerAtIndex(operand0Value).value();
		machine.memoryCellAtAddressSet(memoryCellIndex, operand1Value);
	}

	subtract(machine, operands)
	{
		var operand0Value = operands[0].value();
		var operand1Value = operands[1].value();
		var registerTarget = machine.registerAtIndex(operand0Value);
		var registerSource = machine.registerAtIndex(operand1Value);
		var decrement = registerSource.value();
		registerTarget.valueAdd(0 - decrement);
	}

	subtractImmediate(machine, operands)
	{
		var operand0Value = operands[0].value();
		var decrement = operands[1].value();
		var registerTarget = machine.registerAtIndex(operand0Value);
		registerTarget.valueAdd(0 - decrement);
	}

	// Helpers.

	ipNextCalculateFromCsAndOperand(machine, operandOffsetImmediate)
	{
		var registerCodeSegment = machine.registerCodeSegment();
		var segmentIndex = registerCodeSegment.value();
		var architecture = machine.architecture();
		var segmentStartAddress =
			segmentIndex << architecture.segmentOffsetWidthInBits;
		var offsetFromStartOfSegment =
			operandOffsetImmediate.value();
		var ipValueNext =
			segmentStartAddress | offsetFromStartOfSegment;
		return ipValueNext;
	}
}
