
class Disk
{
	constructor(device, sizeInMemoryCells)
	{
		this.device = device;
		this.device.disk = this;
		this.sizeInMemoryCells = sizeInMemoryCells;

		this.memoryCells = [];
	}

	static PortNames()
	{
		if (Disk._portNames == null)
		{
			Disk._portNames = new Disk_PortNames();
		}
		return Disk._portNames;
	}

	static OperationValues()
	{
		if (Disk._operationValues == null)
		{
			Disk._operationValues = new Disk_OperationValues();
		}
		return Disk._operationValues;
	}

	static DeviceDefn()
	{
		if (Disk._deviceDefn == null)
		{
			Disk._deviceDefn = new DeviceDefn
			(
				"Disk",
				[
					new DevicePort(Disk.PortNames.OperationToPerform, 0),
					new DevicePort(Disk.PortNames.DiskAddress, 1),
					new DevicePort(Disk.PortNames.MachineAddress, 2),
					new DevicePort(Disk.PortNames.NumberOfCellsToMove, 3),
				],
				// deviceInitialize
				(device) => { /* todo */ },
				// deviceUpdate
				(device) =>
				{ 
					var machine = this.machine;
					var portNames = Disk.PortNames;
					var operationValues = Disk.OperationValues;

					var operationToPerform = device.portValue(portNames.OperationToPerform);

					if (operationToPerform == operationValues.Read)
					{
						var diskAddress = device.portValue(Disk.PortNames.DiskAddress);
						var machineAddress = device.portValue(Disk.PortNames.MachineAddress);
						var numberOfCellsToMove = device.portValue(Disk.PortNames.NumberOfCellsToMove);

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
							device.portValue(Disk.PortNames.MachineAddress),
							device.portValue(Disk.PortNames.DiskAddress),
							device.portValue(Disk.PortNames.NumberOfCellsToMove)
						);
					}
				}
			);
		}

		return Disk._deviceDefn;
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

class Disk_OperationValues
{
	constructor()
	{
		this.Read = "0";
		this.Write = "1";
	}
}

class Disk_PortNames
{
	constructor()
	{
		this.OperationToPerform = "OperationToPerform";
		this.DiskAddress = "DiskAddress";
		this.MachineAddress = "MachineAddress";
		this.NumberOfCellsToMove = "NumberOfCellsToMove";
	}
}
