
class AssemblyLanguageSyntax
{
	constructor(name, delimiterForComments)
	{
		this.name = name;
		this.delimiterForComments = delimiterForComments;
	}

	static Instances()
	{
		if (AssemblyLanguageSyntax._instances == null)
		{
			AssemblyLanguageSyntax._instances =
				new AssemblyLanguageSyntax_Instances();
		}
		return AssemblyLanguageSyntax._instances;
	}
}

class AssemblyLanguageSyntax_Instances
{
	constructor()
	{
		this.Default = new AssemblyLanguageSyntax("Default", ";");
	}
}
