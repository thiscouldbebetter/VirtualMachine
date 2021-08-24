
class Globals
{
	static Instance()
	{
		if (Globals._instance == null)
		{
			Globals._instance = new Globals();
		}
		return Globals._instance;
	}

	initialize(millisecondsPerTick, machine)
	{
		this.machine = machine;

		this.machine.boot();

		setInterval(this.tick.bind(this), millisecondsPerTick);
	}

	tick()
	{
		this.machine.tick();
	}
}
