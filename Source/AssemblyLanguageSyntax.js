
class AssemblyLanguageSyntax
{
	constructor(name, delimiterForComments)
	{
		this.name = name;
		this.delimiterForComments = delimiterForComments;
	}

	static Instances()
	{
		if (this._instances == null)
		{
			this._instances = new AssemblyLanguageSyntax_Instances();
		}
		return this._instances;
	}
}
