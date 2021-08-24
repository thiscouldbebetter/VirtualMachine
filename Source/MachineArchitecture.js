
class MachineArchitecture
{
	constructor
	(
		name, 
		instructionSizeInBits, 
		opcodeSizeInBits,
		operandSizeInBits,
		memoryCellSizeInBits, 
		registerDefns,
		instructionSet,
		assemblyLanguageSyntax,
		bootProgramLines
	)
	{
		this.name = name;
		this.instructionSizeInBits = instructionSizeInBits;
		this.opcodeSizeInBits = opcodeSizeInBits;
		this.operandSizeInBits = operandSizeInBits;
		this.memoryCellSizeInBits = memoryCellSizeInBits;
		this.registerDefns = registerDefns;
		this.instructionSet = instructionSet;

		this.registerAbbreviationToIndexLookup = [];

		for (var r = 0; r < this.registerDefns.length; r++)
		{
			var registerDefn = this.registerDefns[r];
			this.registerAbbreviationToIndexLookup[registerDefn.abbreviation] = r;
		}

		this.bootProgram = Program.fromLinesAssembly
		(
			"Boot Routine",
			this,
			assemblyLanguageSyntax,
			bootProgramLines
		);
	}

	static BitsPerByte = 8;

	static Instances()
	{
		if (MachineArchitecture._instances == null)
		{
			MachineArchitecture._instances =
				new MachineArchitecture_Instances();
		}
		return MachineArchitecture._instances;
	}
}

class MachineArchitecture_Instances
{
	constructor()
	{
		var od =
			(sizeInBits, canBeDereference) =>
				new OperandDefn(sizeInBits, canBeDereference);

		var opcodes = 
		[
			//function Opcode(name, mnemonic, value, operandDefns, run)
			new Opcode("DoNothing", "nop", 	-1, [], 					(m, o) =>  { /* do nothing */ }),

			new Opcode("Add",		"add",	-1, [od(4), od(4)], 		(m, o) =>  { m.reg[o[0].v()] += m.reg[o[1].v()]; }),
			new Opcode("AddImmed",	"addi",	-1, [od(4), od(6)], 		(m, o) =>  { m.reg[o[0].v()] += o[1].v(); }),
			new Opcode("Call",		"call",	-1, [od(10)], 				(m, o) =>  { m.reg[m.ri.sp]--; m.mem[m.reg[m.ri.sp]] = m.reg[m.ri.ip]; m.reg[m.ri.ip] = (m.reg[m.ri.cs] << 8) | o[0].v(); }),
			new Opcode("Compare", 	"cmp", 	-1, [od(4), od(4)],			(m, o) =>  { m.reg[m.ri.cr] = m.reg[o[0].v()] - m.reg[o[1].v()];}),
			new Opcode("DevAddress","devad",-1, [od(4), od(4)], 		(m, o) =>  { m.reg[o[0].v()] = m.devices[m.reg[o[1].v()]].address; }),
			new Opcode("DevUpdate", "devup",-1, [od(4)],				(m, o) =>  { m.devices[m.reg[o[0].v()]].update(); }),
			new Opcode("Divide",	"div",	-1, [od(4), od(4)], 		(m, o) =>  { m.reg[o[0].v()] /= m.reg[o[1].v()]; }),
			new Opcode("Jump",		"jmp", 	-1, [od(10)], 				(m, o) =>  { m.reg[m.ri.ip] = (m.reg[m.ri.cs] << 8) | o[0].v(); }),
			new Opcode("JmpEqual", 	"jeq",  -1, [od(10)], 				(m, o) =>  { if (m.reg[m.ri.cr] == 0) { m.reg[m.ri.ip] = (m.reg[m.ri.cs] << 8) | o[0].v(); } }),
			new Opcode("JmpGreater","jgt",  -1, [od(10)], 				(m, o) =>  { if (m.reg[m.ri.cr] > 0) { m.reg[m.ri.ip] = (m.reg[m.ri.cs] << 8) | o[0].v(); } }),
			new Opcode("JmpGTE",	"jgte", -1, [od(10)], 				(m, o) =>  { if (m.reg[m.ri.cr] >= 0) { m.reg[m.ri.ip] = (m.reg[m.ri.cs] << 8) | o[0].v(); } }),
			new Opcode("JmpLess",	"jlt",  -1, [od(10)], 				(m, o) =>  { if (m.reg[m.ri.cr] < 0) { m.reg[m.ri.ip] = (m.reg[m.ri.cs] << 8) | o[0].v(); } }),
			new Opcode("JmpLTE",	"jlte", -1, [od(10)], 				(m, o) =>  { if (m.reg[m.ri.cr] <= 0) { m.reg[m.ri.ip] = (m.reg[m.ri.cs] << 8) | o[0].v(); } }),
			new Opcode("JmpNotEqual","jne", -1, [od(10)], 				(m, o) =>  { if (m.reg[m.ri.cr] != 0) { m.reg[m.ri.ip] = (m.reg[m.ri.cs] << 8) | o[0].v(); } }),
			new Opcode("Load", 		"load", -1, [od(4), od(4)], 		(m, o) =>  { m.reg[o[0].v()] = m.mem[m.reg[o[1].v()]]; }),
			new Opcode("LoadImmed", "loadi", -1,[od(4), od(6)], 		(m, o) =>  { m.reg[o[0].v()] = o[1].v(); }),
			new Opcode("Move",		"mov",	-1, [od(5), od(5)], 		(m, o) =>  { m.reg[o[0].v()] = m.reg[o[1].v()]; }),
			new Opcode("Loop",		"loop",	-1, [od(10)], 				(m, o) =>  { m.reg[m.ri.cx]--; if (m.reg[m.ri.cx] > 0) { m.reg[m.ri.ip] = (m.reg[m.ri.cs] << 8) | o[0].v(); } }),
			new Opcode("MemCopy",	"mcopy",-1, [od(3), od(3), od(3)], 	(m, o) =>  { ArrayHelper.overwriteArrayWithOther( m.mem, m.reg[o[1].v()], m.mem, m.reg[o[0].v()], m.reg[o[2].v()] ); }),
			new Opcode("Pop",		"pop",	-1, [od(4)], 				(m, o) =>  { m.reg[o[0].v()] = m.mem[m.reg[m.ri.sp]]; m.reg[m.ri.sp]++; }),
			new Opcode("Push",		"push",	-1, [od(4)], 				(m, o) =>  { m.reg[m.ri.sp]--; m.mem[m.reg[m.ri.sp]] = m.reg[o[0].v()]; }),
			new Opcode("Return",	"ret", 	-1, [od(10)], 				(m, o) =>  { m.reg[m.ri.ip] = m.mem[m.reg[m.ri.sp]]; m.reg[m.ri.sp] += o[0].v(); }),
			new Opcode("Set", 		"set", 	-1, [od(2), od(8)], 		(m, o) =>  { m.reg[o[0].v()] = o[1].v(); }),
			new Opcode("SetByteLow","setbl",-1, [od(2), od(8)],			(m, o) =>  { m.reg[o[0].v()] = (m.reg[o[0].v()] & 0xFF00) | o[1].v(); }), 
			new Opcode("SetByteHi",	"setbh",-1, [od(2), od(8)],			(m, o) =>  { m.reg[o[0].v()] = (m.reg[o[0].v()] & 0x00FF) | (o[1].v() << MachineArchitecture.BitsPerByte); }),
			new Opcode("SetCodeSeg","setcs",-1, [od(10)],				(m, o) =>  { m.reg[m.ri.cs] = o[0].v(); }),
			new Opcode("Store", 	"stor",-1,  [od(4), od(4, true)], 	(m, o) =>  { m.mem[m.reg[o[0].v()]] = m.reg[o[1].v()]; }),
			new Opcode("StoreImmed","stori",-1, [od(4), od(6)], 		(m, o) =>  { m.mem[m.reg[o[0].v()]] = o[1].v(); }),
			new Opcode("Subtract",	"sub",	-1, [od(4), od(4)], 		(m, o) =>  { m.reg[o[0].v()] += m.reg[o[1].v()]; }),
			new Opcode("SubtractI",	"subi",	-1, [od(4), od(6)], 		(m, o) =>  { m.reg[o[0].v()] -= m.reg[o[1].v()]; }),
		];

		for (var i = 0; i < opcodes.length; i++)
		{
			// for now
			opcodes[i].value = i;
		}

		this.Default = new MachineArchitecture
		(
			"Default Machine Architecture",

			16, // instructionSizeInBits

			6, // opcodeSizeInBits

			3, // operandSizeInBits

			16, // memoryCellSizeInBits

			// registerDefns
			[
				new RegisterDefn("General Register A", "ax"),
				new RegisterDefn("General Register B", "bx"),
				new RegisterDefn("General Register C", "cx"),
				new RegisterDefn("General Register D", "dx"),

				new RegisterDefn("Source Index", "si"),
				new RegisterDefn("Destination Index", "di"),

				new RegisterDefn("Base Pointer", "bp"),
				new RegisterDefn("Stack Pointer", "sp"),
				new RegisterDefn("Code Segment", "cs"),

				new RegisterDefn("Instruction Pointer", "ip"), 
				new RegisterDefn("Comparison Result", "cr"),
			],

			new InstructionSet
			(
				"Default Instruction Set",
				opcodes
			),

			AssemblyLanguageSyntax.Instances().Default,

			// bootProgramLines
			[
				"set ax, 0		; ax = deviceID 0 (disk)",
				"devad si, ax 	; si = disk",
				"mov di, si		; di = disk.operation",
				"stori di, 0 	; disk.operation = read",
				"addi di, 1		; di = disk.diskAddress",
				"stori di, 0	; disk.diskAddress = 0",
				"addi di, 1		; di = disk.memoryAddress",
				"setbh dx, 1 	; dx = memory address for 2nd stage boot",
				"setbl dx, 0	; (address of segment 1)",
				"stor di, dx  	; disk.memoryAddress = 2nd stage boot",
				"addi di, 1		; di = disk.numberOfCellsToMove",
				"stori di, 32	; disk.numberOfCellsToMove = 32",
				"devup ax		; disk.update()",
				"setcs 1		; prepare to jump to segment 1",
				"jmp 0			; to 2nd stage boot",
			]
		);
	}
}
