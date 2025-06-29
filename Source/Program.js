
class Program
{
	constructor(name, instructions)
	{
		this.name = name;
		this.instructions = instructions;
	}

	static fromAssembly
	(
		name,
		architecture,
		assemblyLanguageSyntax,
		programText
	)
	{
		var instructionsSoFar = [];
		var labelToOffsetLookup = new Map();
		var mnemonicToOpcodeLookup =
			architecture.instructionSet.mnemonicToOpcodeLookup;
		var errorsSoFar = [];

		var newline = "\n";
		var programLines = programText.split(newline);

		for (var i = 0; i < programLines.length; i++)
		{
			var programLine = programLines[i]; 

			var indexOfCommentDelimiter = programLine.indexOf
			(
				assemblyLanguageSyntax.delimiterForComments
			);

			if (indexOfCommentDelimiter >= 0)
			{
				programLine = programLine.substring(0, indexOfCommentDelimiter);
			}

			programLine = programLine.trim();

			programLine = programLine.replace(",", " ");
			while (programLine.indexOf("  ") >= 0)
			{
				programLine = programLine.replace("  ", " ");
			}

			if (programLine.length > 0)
			{
				this.fromLinesAssembly_ParseLabelOrInstruction
				(
					programLine,
					architecture,
					instructionsSoFar,
					labelToOffsetLookup, 
					mnemonicToOpcodeLookup,
					errorsSoFar
				);
			}
		}

		if (errorsSoFar.length > 0)
		{
			// todo - Handle errors.
		}

		var operandExpressionTypes =
			OperandExpressionType.Instances();

		for (var i = 0; i < instructionsSoFar.length; i++)
		{
			var instruction = instructionsSoFar[i];

			var operands = instruction.operands;
			for (var j = 0; j < operands.length; j++)
			{
				var operand = operands[j];

				if (operand.expressionType == operandExpressionTypes.Label)
				{
					var label = operand.expression;
					var offsetForLabel = labelToOffsetLookup.get(label);
					if (offsetForLabel == null)
					{
						throw new Error("Label '" + label + "' not found!");
					}
					else
					{
						operand.expressionType =
							operandExpressionTypes.Direct;
						operand.expression = offsetForLabel;
					}
				}
			}
		}

		var returnValue = new Program
		(
			name,
			instructionsSoFar
		);

		return returnValue;
	}

	static fromLinesAssembly_ParseLabelOrInstruction
	(
		programLine,
		architecture,
		instructionsSoFar,
		labelToOffsetLookup,
		mnemonicToOpcodeLookup,
		errorsSoFar
	)
	{
		if (programLine.indexOf(":") == programLine.length - 1)
		{
			this.fromLinesAssembly_ParseLabel
			(
				programLine,
				architecture,
				instructionsSoFar,
				labelToOffsetLookup, 
				mnemonicToOpcodeLookup,
				errorsSoFar
			);
		}
		else if (programLine.indexOf("data") == 0)
		{
			this.fromLinesAssembly_ParseData
			(
				programLine,
				architecture,
				instructionsSoFar,
				labelToOffsetLookup, 
				mnemonicToOpcodeLookup,
				errorsSoFar
			);
		}
		else
		{
			this.fromLinesAssembly_ParseInstruction
			(
				programLine,
				architecture,
				instructionsSoFar,
				labelToOffsetLookup, 
				mnemonicToOpcodeLookup,
				errorsSoFar
			);
		}
	}

	static fromLinesAssembly_ParseData
	(
		programLine,
		architecture,
		instructionsSoFar,
		labelToOffsetLookup,
		mnemonicToOpcodeLookup,
		errorsSoFar
	)
	{
		var tokens = programLine.split(",");

		for (var t = 1; t < tokens.length; t++)
		{
			var token = tokens[t];

			token = token.trim();

			if (token.indexOf("\"") == 0)
			{
				if (token.lastIndexOf("\"") != token.length - 1)
				{
					errorsSoFar.push
					(
						"Invalid data value."
					);
				}
				else
				{
					for (var c = 1; c < token.length - 1; c++)
					{
						var charFromString = token[c];

						instructionsSoFar.push
						(
							new Instruction
							(
								null, // opcode
								[ charFromString ]
							)
						);
					}
				}
			}
			else
			{
				var tokenAsInteger = parseInt(token);

				if (isNaN(tokenAsInteger) == true)
				{
					errorsSoFar.push
					(
						"Invalid data value."
					);
				}
				else
				{
					instructionsSoFar.push
					(
						new Instruction
						(
							null, // opcode
							[ tokenAsInteger ]
						)
					);
				}
			}
		}
	}

	static fromLinesAssembly_ParseLabel
	(
		programLine, 
		architecture,
		instructionsSoFar,
		labelToOffsetLookup, 
		mnemonicToOpcodeLookup,
		errorsSoFar
	)
	{
		var indexOfColon = programLine.indexOf(":");

		var label = programLine.substring(0, indexOfColon).trim();

		if (labelToOffsetLookup.has(label) )
		{
			errorsSoFar.push
			(
				"Label already in use: '" + label + "'."
			);
		}
		else if (mnemonicToOpcodeLookup.has(label) )
		{
			errorsSoFar.push
			(
				"Label must not be an opcode: '" + label + "'."
			)
		}
		else
		{
			labelToOffsetLookup.set(label, instructionsSoFar.length);
		}
	}

	static fromLinesAssembly_ParseInstruction
	(
		programLine,
		architecture,
		instructionsSoFar,
		labelToOffsetLookup,
		mnemonicToOpcodeLookup,
		errorsSoFar
	)
	{
		var operandExpressionTypes = OperandExpressionType.Instances;

		var tokens = programLine.split(" ");

		var mnemonic = tokens[0];

		var opcode = mnemonicToOpcodeLookup.get(mnemonic);

		if (opcode == null)
		{
			errorsSoFar.push
			(
				("Invalid opcode: '" + mnemonic + "'.")
			);
		}
		else
		{
			this.fromLinesAssembly_ParseInstruction_Operands
			(
				programLine, 
				architecture,
				instructionsSoFar,
				labelToOffsetLookup, 
				mnemonicToOpcodeLookup,
				errorsSoFar,
				tokens,
				opcode
			);
		}
	}

	static fromLinesAssembly_ParseInstruction_Operands
	(
		programLine, 
		architecture,
		instructionsSoFar,
		labelToOffsetLookup, 
		mnemonicToOpcodeLookup,
		errorsSoFar,
		tokens,
		opcode
	)
	{
		var operands = [];

		var operandDefns = opcode.operandDefns;

		for (var s = 0; s < operandDefns.length; s++)
		{
			var operandDefn = operandDefns[s];

			var operandAsString = tokens[s + 1];

			Operand.fromLinesAssembly
			(
				programLine, 
				architecture,
				instructionsSoFar,
				labelToOffsetLookup, 
				mnemonicToOpcodeLookup,
				errorsSoFar,
				tokens,
				opcode,
				operands,
				operandDefn,
				operandAsString
			);
		}

		var instruction = new Instruction(opcode, operands);

		instructionsSoFar.push(instruction);
	}

	// Strings.

	static fromStringAssembly(architecture, programAsString)
	{
		var newline = "\r\n";
		var returnValue = this.fromLinesAssembly
		(
			architecture,
			programAsString.split(newline)
		);
		return returnValue;
	}

	toStringAssembly(architecture)
	{
		var returnValue = "";

		var newline = "\r\n";

		for (var i = 0; i < this.instructions.length; i++)
		{
			var instruction = this.instructions[i];

			returnValue += 
				instruction.toStringAssembly(architecture) 
				+ newline;
		}

		return returnValue;
	}

	// memory

	toMemoryCells(machine)
	{
		var returnValue = [];

		for (var i = 0; i < this.instructions.length; i++)
		{
			var instruction = this.instructions[i];
			var instructionAsMemoryCell =
				instruction.toMemoryCell(machine);
			returnValue.push(instructionAsMemoryCell);
		}

		return returnValue;
	}

}
