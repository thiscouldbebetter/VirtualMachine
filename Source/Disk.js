
class Disk
{
	constructor(device, sizeInMemoryCells)
	{
		this.device = device;
		this.device.disk = this;
		this.sizeInMemoryCells = sizeInMemoryCells;

		this.memoryCells = [];
	}

	static DeviceDefn()
	{
		var portNames = Disk_PortNames.Instance();

		if (this._deviceDefn == null)
		{
			var ports =
			[
				new DevicePort(portNames.OperationToPerform, 0),
				new DevicePort(portNames.DiskAddress, 1),
				new DevicePort(portNames.MachineAddress, 2),
				new DevicePort(portNames.NumberOfCellsToMove, 3),
			];

			this._deviceDefn = new DeviceDefn
			(
				"Disk",
				ports,
				(device) => { /* todo */ }, // deviceInitialize
				Disk.deviceUpdate
			);
		}

		return this._deviceDefn;
	}

	static deviceUpdate(device)
	{
		var portNames = Disk_PortNames.Instance();
		var operationValues = Disk_OperationValues.Instance();

		var machine = this.machine;

		var operationToPerform =
			device.portValueByName(portNames.OperationToPerform);

		var diskAddress =
			device.portValueByName(portNames.DiskAddress);
		var machineAddress =
			device.portValueByName(portNames.MachineAddress);
		var numberOfCellsToMove =
			device.portValueByName(portNames.NumberOfCellsToMove);

		if (operationToPerform == operationValues.Read)
		{
			device.disk.readToMemory
			(
				diskAddress,
				machineAddress,
				numberOfCellsToMove
			);
		}
		else if (operationToPerform == operationValues.Write)
		{
			device.disk.writeFromMemory
			(
				machineAddress,
				diskAddress,
				numberOfCellsToMove
			);
		}
		else
		{
			var errorMessage =
				"Unrecognized disk device operation: "
				+ operationToPerform;
			throw new Error(errorMessage);
		}
	};

	readToMemory(diskAddress, machineAddress, numberOfCellsToRead)
	{
		ArrayHelper.overwriteSourceAtIndexWithTargetAtIndexForCount
		(
			// source
			this.memoryCells,
			diskAddress,
			// target
			this.device.machine.memoryCells,
			machineAddress,
			// count
			numberOfCellsToRead
		);
	}

	writeFromMemory(machine, machineAddress, diskAddress, numberOfCellsToWrite)
	{
		ArrayHelper.overwriteSourceAtIndexWithTargetAtIndexForCount
		(
			// source
			this.device.machine.memoryCells,
			machineAddress,
			// target
			this.memoryCells,
			diskAddress,
			// count
			numberOfCellsToWrite
		);
	}

	writeMemoryCells(diskAddress, memoryCellsToWrite)
	{
		ArrayHelper.overwriteSourceAtIndexWithTargetAtIndexForCount
		(
			// source
			memoryCellsToWrite,
			0,
			// target
			this.memoryCells,
			diskAddress,
			// count
			memoryCellsToWrite.length
		);
	}
}
