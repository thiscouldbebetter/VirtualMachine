
// classes

class ArrayHelper
{
	static overwriteSourceAtIndexWithTargetAtIndexForCount
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
			var sourceElement =
				sourceArray[sourceStartIndex + i];

			targetArray[targetStartIndex + i] =
				sourceElement;
		}
	}
}
