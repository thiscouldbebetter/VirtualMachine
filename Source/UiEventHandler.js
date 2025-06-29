
class UiEventHandler
{
	static buttonDemo_Clicked()
	{
		var programAsLines =
			Demo.programText();

		var d = document;
		var textareaAssembly =
			d.getElementById("textareaAssembly");
		textareaAssembly.value = programAsLines;
	}

	static buttonRun_Clicked()
	{
		var d = document;

		var checkboxLogInstructionsRunToConsole =
			d.getElementById("checkboxLogInstructionsRunToConsole");
		var instructionsRunShouldBeLoggedToConsole =
			checkboxLogInstructionsRunToConsole.checked;

		var textareaAssembly =
			d.getElementById("textareaAssembly");
		var assemblyToRun =
			textareaAssembly.value;

		Demo.runProgramFromText
		(
			assemblyToRun,
			instructionsRunShouldBeLoggedToConsole
		);
	}
}