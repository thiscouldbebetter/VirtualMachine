
class Operand
{
	constructor(defn, expressionType, expression)
	{
		this.defn = defn;
		this.expressionType = expressionType;
		this.expression = expression;
	}

	static fromLinesAssembly
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
	)
	{
		var operandSizeInBits = operandDefn.sizeInBits;

		if (operandDefn.canBeDereference == false)
		{
			Operand.fromLinesAssembly_Direct
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
				operandAsString,
				operandSizeInBits
			);
		}
		else
		{
			Operand.fromLinesAssembly_Dereference
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
				operandAsString,
				operandSizeInBits
			);
		}
	}

	static fromLinesAssembly_Direct
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
		operandAsString,
		operandSizeInBits
	)
	{
		var lookup = architecture.registerAbbreviationToIndexLookup;
		var registerIndex = lookup[operandAsString];
		if (registerIndex != null)
		{
			if (registerIndex >= Math.pow(2, operandSizeInBits))
			{
				errorsSoFar.push
				(
					"Register cannot be used as an argument for opcode: "
					+ "'" + operandAsString + "', '" + mnemonic + "'"
					+ "."
				);
			}
			operandAsString = "" + registerIndex;
		}

		var operand;

		if (isNaN(operandAsString))
		{
			var operand = new Operand
			(
				operandDefn, 
				OperandExpressionType.Instances().Label,
				operandAsString
			);
		}
		else
		{
			var operandAsInteger = parseInt(operandAsString);

			var operand = new Operand
			(
				operandDefn, 
				OperandExpressionType.Instances().Direct,
				operandAsInteger
			);
		}


		operands.push(operand);
	}

	static fromLinesAssembly_Dereference
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
		operandAsString,
		operandSizeInBits
	)
	{
		if (operandAsString.indexOf("[") == 0)
		{
			if (operandAsString.indexOf("]") != operandAsString.length - 1)
			{
				errorsSoFar.push
				(
					"Unclosed bracket in operand."
				);
			}
			else
			{
				operandAsString =
					operandAsString.substr(1, operandAsString.length - 2);
				operandAsString = operandAsString.replace(" ","");

				var operand = new Operand
				(
					operandDefn,
					OperandExpressionType.Instances().Dereference,
					operandAsString
				)

				operands.push(operand);
			}
		}
		else
		{
			Operand.fromLinesAssembly_Direct
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
				operandAsString,
				operandSizeInBits
			);
		}
	}


	// instance methods

	toStringAssembly()
	{
		throw("Not yet implemented!");
	}

	toMemoryBits()
	{
		var returnValue;

		var operandExpressionTypes = OperandExpressionType.Instances(); 
		if (this.expressionType == operandExpressionTypes.Direct)
		{
			returnValue = this.expression;
		}
		else if (this.expressionType == operandExpressionTypes.Dereference)
		{
			throw("Not yet implemented!");

			var operandBaseAsString;
			var operandOffset;

			var plusSign = "+";

			if (this.expression.indexOf(plusSign) == -1)
			{
				operandBaseAsString = this.expression;
			}
			else
			{
				var expressionSplitOnPlusSign = this.expression.split(plusSign);
				operandBaseAsString = expressionSplitOnPlusSign[0];
				operandOffset = parseInt(expressionSplitOnPlusSign[1]);
			}

			var machine = Globals.Instance().machine; // hack
			var architecture = machine.architecture; // hack
			var lookup = architecture.registerAbbreviationToIndexLookup;
			var registerIndex = lookup[operandBaseAsString];

			if (registerIndex == null)
			{
				throw("Not yet implemented!");
			}
			else
			{
				var memoryCellIndex =
					machine.registers[registerIndex] + operandOffset;
				returnValue = machine.memoryCells[memoryCellIndex];
			}
		}
		else
		{
			throw("Unrecognized operand expression type!");
		}

		return returnValue;
	}

	v() // ?
	{
		var returnValue;

		var operandExpressionTypes = OperandExpressionType.Instances();
		if (this.expressionType == operandExpressionTypes.Direct)
		{
			returnValue = this.expression;
		}
		else if (this.expressionType == operandExpressionTypes.Dereference)
		{
			var operandBaseAsString;
			var operandOffset;

			var plusSign = "+";

			if (this.expression.indexOf(plusSign) == -1)
			{
				operandBaseAsString = this.expression;
			}
			else
			{
				var expressionSplitOnPlusSign = this.expression.split(plusSign);
				operandBaseAsString = expressionSplitOnPlusSign[0];
				operandOffset = parseInt(expressionSplitOnPlusSign[1]);
			}

			var machine = Globals.Instance().machine; // hack
			var architecture = machine.architecture; // hack
			var lookup = architecture.registerAbbreviationToIndexLookup;
			var registerIndex = lookup[operandBaseAsString];

			if (registerIndex == null)
			{
				throw "Not yet implemented!"
			}
			else
			{
				var memoryCellIndex =
					machine.registers[registerIndex] + operandOffset;
				returnValue = machine.memoryCells[memoryCellIndex];
			}
		}
		else
		{
			throw("Unrecognized operand expression type!");
		}

		return returnValue;
	}
}
