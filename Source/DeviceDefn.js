
class DeviceDefn
{
	constructor(name, ports, deviceInitialize, deviceUpdate)
	{
		this.name = name;
		this.ports = ports;
		this.deviceInitialize = deviceInitialize;
		this.deviceUpdate = deviceUpdate;

		this.ports.addLookups("name");
	}
}
