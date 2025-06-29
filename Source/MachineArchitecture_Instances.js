
class MachineArchitecture_Instances
{
	constructor()
	{
		var instructionSet = this.instructionSet();

		var registerDefns = this.registerDefns();

		var syntax = AssemblyLanguageSyntax.Instances().Default;

		var bootProgramText = this.bootProgramText();

		this.Default = new MachineArchitecture
		(
			"Default Machine Architecture",
			16, // instructionSizeInBits
			6, // opcodeSizeInBits
			3, // operandSizeInBits
			16, // memoryCellSizeInBits
			registerDefns,
			instructionSet,
			syntax,
			bootProgramText
		);
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
			"setbh dx, 1    ; dh = memory address for 2nd stage boot",
			"setbl dx, 0    ; dl = address of segment 1",
			"stor di, dx    ; disk.memoryAddress = 2nd stage boot",
			"addi di, 1     ; di = disk.numberOfCellsToMove",
			"stori di, 32   ; disk.numberOfCellsToMove = 32",
			"devup ax       ; disk.update()",
			"setcs 1        ; prepare to jump to segment 1",
			"jmp 0          ; to 2nd stage boot",
			"halt           ; Upon returning, halt."
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
		var od10 = () => new od(10);

		var opcodes =
		[
			//function Opcode(name, mnemonic, value, operandDefns, run)
			new oc("DoNothing", 		"nop", 	-1, [], 						(m, o) => { /* do nothing */ }),

			new oc("Add",				"add",	-1, [od4(), od4()], 			this.add 						),
			new oc("AddImmediate",		"addi",	-1, [od4(), od6()], 			this.addImmediate 				),
			new oc("Call",				"call",	-1, [od10()], 					this.call 						),
			new oc("Compare", 			"cmp", 	-1, [od4(), od4()],				this.compare 					),
			new oc("DeviceAddress",		"devad",-1, [od4(), od4()], 			this.deviceAddress 				),
			new oc("DeviceUpdate", 		"devup",-1, [od4()],					this.deviceUpdate 				),
			new oc("Divide",			"div",	-1, [od4(), od4()], 			this.divide 					),
			new oc("Halt",				"halt",	-1, [], 						this.halt 						),
			new oc("Jump",				"jmp", 	-1, [od10()], 					this.jump 						),
			new oc("JumpIfEqual", 		"jeq",  -1, [od10()], 					this.jumpIfEqual 				),
			new oc("JumpIfGreater",		"jgt",  -1, [od10()], 					this.jumpIfGreaterThan 			),
			new oc("JumpIfGTE",			"jgte", -1, [od10()], 					this.jumpIfGreaterThanOrEqual 	),
			new oc("JumpIfLess",		"jlt",  -1, [od10()], 					this.jumpIfLess 				),
			new oc("JumpIfLTE",			"jlte", -1, [od10()], 					this.jumpIfLessThanOrEqual 		),
			new oc("JumpIfNotEqual",	"jne", 	-1, [od10()], 					this.jumpIfNotEqual 			),
			new oc("Load", 				"load", -1, [od4(), od4()], 			this.load 						),
			new oc("LoadImmediate", 	"loadi", -1,[od4(), od6()], 			this.loadImmediate 				),
			new oc("Loop",				"loop",	-1, [od10()], 					this.loop 						),
			new oc("MemoryCopy",		"mcopy",-1, [od3(), od3(), od3()], 		this.memoryCopy 				),
			new oc("Move",				"mov",	-1, [od5(), od5()], 			this.move 						),
			new oc("Pop",				"pop",	-1, [od4()], 					this.pop 						),
			new oc("Push",				"push",	-1, [od4()], 					this.push						),
			new oc("Return",			"ret", 	-1, [od10()], 					this._return 					),
			new oc("Set", 				"set", 	-1, [od2(), od8()], 			this.set 						),
			new oc("SetByteLow",		"setbl",-1, [od2(), od8()],				this.setByteLow					), 
			new oc("SetByteHigh",		"setbh",-1, [od2(), od8()],				this.setByteHigh				),
			new oc("SetCodeSegment",	"setcs",-1, [od10()],					this.setCodeSegment 			),
			new oc("Store", 			"stor",-1,  [od4(), new od(4, true)], 	this.store 						),
			new oc("StoreImmediate",	"stori",-1, [od4(), od6()], 			this.storeImmediate 			),
			new oc("Subtract",			"sub",	-1, [od4(), od4()], 			this.subtract 					),
			new oc("SubtractImmediate",	"subi",	-1, [od4(), od6()], 			this.subtractImmediate 			)
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
		var operand0Value = operands[0].value();

		var registerStackPointer = machine.registerStackPointer();
		registerStackPointer.valueAdd(-1);

		var registerInstructionPointer = machine.registerInstructionPointer();
		machine.memoryCellAtAddressSet
		(
			registerStackPointer.value(),
			registerInstructionPointer.value()
		);

		var cs = machine.registerCodeSegment().value();
		var ipValueNext = (cs << 8) | operand0Value;

		registerInstructionPointer.valueSet(ipValueNext);
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
		ip.decrement(); // Keep running this same instruction forever.
	}

	jump(machine, operands)
	{
		var operand0Value = operands[0].value();
		var ip = machine.registerInstructionPointer();
		var cs = machine.registerCodeSegment();
		var csValue = cs.value();
		var ipNext = (csValue << 8) | operand0Value;
		ip.valueSet(ipNext);
	}

	jumpIfEqual(machine, operands)
	{
		var cr = machine.registerComparisonResult();
		if (cr.value() == 0)
		{
			var cs = machine.registerCodeSegment();
			var csValue = cs.value();
			var operand0Value = operands[0].value;
			var valueNext = (csValue << 8) | operand0Value;
			var ip = machine.registerInstructionPointer();
			ip.valueSet(valueNext);
		}
	}

	jumpIfGreaterThan(machine, operands)
	{
		var cr = machine.registerComparisonResult();
		if (cr.value() > 0)
		{
			var cs = machine.registerCodeSegment();
			var csValue = cs.value();
			var operand0Value = operands[0].value;
			var valueNext = (csValue << 8) | operand0Value;
			var ip = machine.registerInstructionPointer();
			ip.valueSet(valueNext);
		}
	}

	jumpIfGreaterThanOrEqual(machine, operands)
	{
		var cr = machine.registerComparisonResult();
		if (cr.value() >= 0)
		{
			var cs = machine.registerCodeSegment();
			var csValue = cs.value();
			var operand0Value = operands[0].value;
			var valueNext = (csValue << 8) | operand0Value;
			var ip = machine.registerInstructionPointer();
			ip.valueSet(valueNext);
		}
	}

	jumpIfLessThan(machine, operands)
	{
		var cr = machine.registerComparisonResult();
		if (cr.value() < 0)
		{
			var cs = machine.registerCodeSegment();
			var csValue = cs.value();
			var operand0Value = operands[0].value();
			var valueNext = (csValue << 8) | operand0Value;
			var ip = machine.registerInstructionPointer();
			ip.valueSet(valueNext);
		}
	}

	jumpIfLessThanOrEqual(machine, operands)
	{
		var cr = machine.registerComparisonResult();
		if (cr.value() <= 0)
		{
			var cs = machine.registerCodeSegment();
			var csValue = cs.value();
			var operand0Value = operands[0].value();
			var valueNext = (csValue << 8) | operand0Value;
			var ip = machine.registerInstructionPointer();
			ip.valueSet(valueNext);
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
			var cs = machine.registerCodeSegment().value();
			var operand0Value = operands[0].value();
			var valueNext = (cs << 8) | operand0Value;
			ip.valueSet(valueNext);
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
		var operand0Value = operands[0].value();
		var sp = machine.registerStackPointer();
		var registerTarget = machine.registerAtIndex(operand0Value);
		var memoryCellIndex = sp.value();
		var value = machine.memoryCellAtAddress(memoryCellIndex);
		registerTarget.valueSet(value);
		sp.valueIncrement();
	}

	push(machine, operands)
	{
		var operand0Value = operands[0].value();
		var sp = machine.registerStackPointer();
		sp.valueDecrement();
		var valueNext = machine.registerAtIndex(operand0Value);
		machine.memoryCellAtAddressSet
		(
			operand0Value,
			valueNext
		);
	}

	_return(machine, operands)
	{
		var sp = machine.registerStackPointer();
		var memoryCellIndex = sp.value();
		var memoryCell = machine.memoryCellAtAddress(memoryCellIndex);
		var ip = machine.registerInstructionPointer();
		ip.valueSet(valueNext);
		var offset = operands[0].value();
		sp.add(offset);
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

	subtract(machine, operands)
	{
		var operand0Value = operands[0].value();
		var decrement = operands[1].value();
		var registerTarget = machine.registerAtIndex(operand0Value);
		registerTarget.valueAdd(0 - decrement);
	}
}
