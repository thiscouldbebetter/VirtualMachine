
class ArrayHelper
{
	overwriteArrayWithOther
	(
		sourceArray,
		sourceStartIndex,
		targetArray,
		targetStartIndex,
		numberOfItemsToOverwrite
	)
	{
		for (var i = 0; i < numberOfItemsToOverwrite; i++)
		{
			targetArray[targetStartIndex + i] = sourceArray[sourceStartIndex + i];
		}
	}
}
