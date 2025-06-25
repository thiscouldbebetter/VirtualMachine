
class DeviceDefn
{
	constructor(name, ports, deviceInitialize, deviceUpdate)
	{
		this.name = name;
		this.ports = ports;
		this.deviceInitialize = deviceInitialize;
		this.deviceUpdate = deviceUpdate;

		this.portsByName = new Map(this.ports.map(x => [x.name, x]) );
	}

	portByName(name)
	{
		return this.portsByName.get(name);
	}
}
