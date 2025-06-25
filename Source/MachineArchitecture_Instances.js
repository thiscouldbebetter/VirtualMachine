
class MachineArchitecture_Instances
{
	constructor()
	{
		var oc = Opcode;
		var od = OperandDefn;

		var opcodes =
		[
			//function Opcode(name, mnemonic, value, operandDefns, run)
			new oc("DoNothing", "nop", 	-1, [], 				(m, o) => { /* do nothing */ }),

			new oc("Add",		"add",	-1, [new od(4), new od(4)], 			(m, o) => { m.reg[o[0].v()] += m.reg[o[1].v()]; }),
			new oc("AddImmed",	"addi",	-1, [new od(4), new od(6)], 			(m, o) => { m.reg[o[0].v()] += o[1].v(); }),
			new oc("Call",		"call",	-1, [new od(10)], 						(m, o) => { m.reg[m.ri.sp]--; m.mem[m.reg[m.ri.sp]] = m.reg[m.ri.ip]; m.reg[m.ri.ip] = (m.reg[m.ri.cs] << 8) | o[0].v(); }),
			new oc("Compare", 	"cmp", 	-1, [new od(4), new od(4)],				(m, o) => { m.reg[m.ri.cr] = m.reg[o[0].v()] - m.reg[o[1].v()];}),
			new oc("DevAddress","devad",-1, [new od(4), new od(4)], 			(m, o) => { m.reg[o[0].v()] = m.devices[m.reg[o[1].v()]].address; }),
			new oc("DevUpdate", "devup",-1, [new od(4)],						(m, o) => { m.devices[m.reg[o[0].v()]].update(); }),
			new oc("Divide",	"div",	-1, [new od(4), new od(4)], 			(m, o) => { m.reg[o[0].v()] /= m.reg[o[1].v()]; }),
			new oc("Jump",		"jmp", 	-1, [new od(10)], 						(m, o) => { m.reg[m.ri.ip] = (m.reg[m.ri.cs] << 8) | o[0].v(); }),
			new oc("JmpEqual", 	"jeq",  -1, [new od(10)], 						(m, o) => { if (m.reg[m.ri.cr] == 0) { m.reg[m.ri.ip] = (m.reg[m.ri.cs] << 8) | o[0].v(); } }),
			new oc("JmpGreater","jgt",  -1, [new od(10)], 						(m, o) => { if (m.reg[m.ri.cr] > 0) { m.reg[m.ri.ip] = (m.reg[m.ri.cs] << 8) | o[0].v(); } }),
			new oc("JmpGTE",	"jgte", -1, [new od(10)], 						(m, o) => { if (m.reg[m.ri.cr] >= 0) { m.reg[m.ri.ip] = (m.reg[m.ri.cs] << 8) | o[0].v(); } }),
			new oc("JmpLess",	"jlt",  -1, [new od(10)], 						(m, o) => { if (m.reg[m.ri.cr] < 0) { m.reg[m.ri.ip] = (m.reg[m.ri.cs] << 8) | o[0].v(); } }),
			new oc("JmpLTE",	"jlte", -1, [new od(10)], 						(m, o) => { if (m.reg[m.ri.cr] <= 0) { m.reg[m.ri.ip] = (m.reg[m.ri.cs] << 8) | o[0].v(); } }),
			new oc("JmpNotEqual","jne", -1, [new od(10)], 						(m, o) => { if (m.reg[m.ri.cr] != 0) { m.reg[m.ri.ip] = (m.reg[m.ri.cs] << 8) | o[0].v(); } }),
			new oc("Load", 		"load", -1, [new od(4), new od(4)], 			(m, o) => { m.reg[o[0].v()] = m.mem[m.reg[o[1].v()]]; }),
			new oc("LoadImmed", "loadi", -1,[new od(4), new od(6)], 			(m, o) => { m.reg[o[0].v()] = o[1].v(); }),
			new oc("Move",		"mov",	-1, [new od(5), new od(5)], 			(m, o) => { m.reg[o[0].v()] = m.reg[o[1].v()]; }),
			new oc("Loop",		"loop",	-1, [new od(10)], 						(m, o) => { m.reg[m.ri.cx]--; if (m.reg[m.ri.cx] > 0) { m.reg[m.ri.ip] = (m.reg[m.ri.cs] << 8) | o[0].v(); } }),
			new oc("MemCopy",	"mcopy",-1, [new od(3), new od(3), new od(3)], 	(m, o) => { ArrayHelper.overwriteArrayWithOther( m.mem, m.reg[o[1].v()], m.mem, m.reg[o[0].v()], m.reg[o[2].v()] ); }),
			new oc("Pop",		"pop",	-1, [new od(4)], 						(m, o) => { m.reg[o[0].v()] = m.mem[m.reg[m.ri.sp]]; m.reg[m.ri.sp]++; }),
			new oc("Push",		"push",	-1, [new od(4)], 						(m, o) => { m.reg[m.ri.sp]--; m.mem[m.reg[m.ri.sp]] = m.reg[o[0].v()]; }),
			new oc("Return",	"ret", 	-1, [new od(10)], 						(m, o) => { m.reg[m.ri.ip] = m.mem[m.reg[m.ri.sp]]; m.reg[m.ri.sp] += o[0].v(); }),
			new oc("Set", 		"set", 	-1, [new od(2), new od(8)], 			(m, o) => { m.reg[o[0].v()] = o[1].v(); }),
			new oc("SetByteLow","setbl",-1, [new od(2), new od(8)],				(m, o) => { m.reg[o[0].v()] = (m.reg[o[0].v()] & 0xFF00) | o[1].v(); }), 
			new oc("SetByteHi",	"setbh",-1, [new od(2), new od(8)],				(m, o) => { m.reg[o[0].v()] = (m.reg[o[0].v()] & 0x00FF) | (o[1].v() << MachineArchitecture.BitsPerByte); }),
			new oc("SetCodeSeg","setcs",-1, [new od(10)],						(m, o) => { m.reg[m.ri.cs] = o[0].v(); }),
			new oc("Store", 	"stor",-1,  [new od(4), new od(4, true)], 		(m, o) => { m.mem[m.reg[o[0].v()]] = m.reg[o[1].v()]; }),
			new oc("StoreImmed","stori",-1, [new od(4), new od(6)], 			(m, o) => { m.mem[m.reg[o[0].v()]] = o[1].v(); }),
			new oc("Subtract",	"sub",	-1, [new od(4), new od(4)], 			(m, o) => { m.reg[o[0].v()] += m.reg[o[1].v()]; }),
			new oc("SubtractI",	"subi",	-1, [new od(4), new od(6)], 			(m, o) => { m.reg[o[0].v()] -= m.reg[o[1].v()]; }),
		];

		for (var i = 0; i < opcodes.length; i++)
		{
			// For now.
			opcodes[i].value = i;
		}

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

		var bootProgramLines = 
		[
			"set ax, 0	; ax = deviceID 0 (disk)",
			"devad si, ax 	; si = disk",
			"mov di, si	; di = disk.operation",
			"stori di, 0 	; disk.operation = read",
			"addi di, 1	; di = disk.diskAddress",
			"stori di, 0	; disk.diskAddress = 0",
			"addi di, 1	; di = disk.memoryAddress",
			"setbh dx, 1 	; dx = memory address for 2nd stage boot",
			"setbl dx, 0	; 	(address of segment 1)",
			"stor di, dx  	; disk.memoryAddress = 2nd stage boot",
			"addi di, 1	; di = disk.numberOfCellsToMove",
			"stori di, 32	; disk.numberOfCellsToMove = 32",
			"devup ax	; disk.update()",
			"setcs 1	; prepare to jump to segment 1",
			"jmp 0		; to 2nd stage boot",
		];

		this.Default = new MachineArchitecture
		(
			"Default Machine Architecture",
			16, // instructionSizeInBits
			6, // opcodeSizeInBits
			3, // operandSizeInBits
			16, // memoryCellSizeInBits
			registerDefns,
			new InstructionSet
			(
				"Default Instruction Set",
				opcodes
			),
			AssemblyLanguageSyntax.Instances().Default,
			bootProgramLines
		);
	}
}
