export class Options<T = unknown> {
	constructor(
		public noNullValue = true,
		public keyCamelCase = false,
		public defaultValues?: T | T[]
	) {}
}
