
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
		var portNames = new Disk_PortNames();
		var operationValues = new Disk_OperationValues();

		if (this._deviceDefn == null)
		{
			var ports =
			[
				new DevicePort(portNames.OperationToPerform, 0),
				new DevicePort(portNames.DiskAddress, 1),
				new DevicePort(portNames.MachineAddress, 2),
				new DevicePort(portNames.NumberOfCellsToMove, 3),
			];

			var deviceUpdate = (device) =>
			{
				var machine = this.machine;

				var operationToPerform = device.portValue(portNames.OperationToPerform);

				if (operationToPerform == operationValues.Read)
				{
					var diskAddress =
						device.portValue(portNames.DiskAddress);
					var machineAddress =
						device.portValue(portNames.MachineAddress);
					var numberOfCellsToMove =
						device.portValue(portNames.NumberOfCellsToMove);

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
						device.portValue(portNames.MachineAddress),
						device.portValue(portNames.DiskAddress),
						device.portValue(portNames.NumberOfCellsToMove)
					);
				}
			};

			this._deviceDefn = new DeviceDefn
			(
				"Disk",
				ports,
				(device) => { /* todo */ }, // deviceInitialize
				deviceUpdate
			);
		}

		return this._deviceDefn;
	}

	readToMemory(diskAddress, machineAddress, numberOfCellsToRead)
	{
		ArrayHelper.overwriteArrayWithOther
		(
			this.memoryCells,
			diskAddress,
			this.device.machine.memoryCells,
			machineAddress,
			numberOfCellsToRead
		);
	}

	writeFromMemory(machineAddress, diskAddress, numberOfCellsToWrite)
	{
		ArrayHelper.overwriteArrayWithOther
		(
			this.machine.memoryCells,
			machineAddress,
			this.memoryCells,
			diskAddress,
			numberOfCellsToWrite
		);
	}

	writeMemoryCells(diskAddress, memoryCellsToWrite)
	{
		ArrayHelper.overwriteArrayWithOther
		(
			memoryCellsToWrite,
			0,
			this.memoryCells,
			diskAddress,
			memoryCellsToWrite.length
		);
	}
}
