
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

		this.registerAbbreviationToIndexLookup =
			new Map(this.registerDefns.map( (x, i) => [x.abbreviation, i] ) );

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
		if (this._instances == null)
		{
			this._instances = new MachineArchitecture_Instances();
		}
		return this._instances;
	}

	registerIndexByAbbreviation(abbreviation)
	{
		return this.registerAbbreviationToIndexLookup.get(abbreviation);
	}
}
