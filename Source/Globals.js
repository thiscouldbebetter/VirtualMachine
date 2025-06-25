
class Globals
{
	static Instance()
	{
		if (this._instance == null)
		{
			this._instance = new Globals();
		}
		return this._instance;
	}

	initialize(millisecondsPerTick, machine)
	{
		this.machine = machine;

		this.machine.boot();

		setInterval(Globals.Instance().tick, millisecondsPerTick);
	}

	tick()
	{
		Globals.Instance().machine.tick();
	}
}
