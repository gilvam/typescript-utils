type Constructor<T = any> = new (...args: any[]) => T;

/**
 * Decorador que converte null em undefined para:
 * - Argumentos do constructor
 * - Argumentos do método estático execute() e executeArray()
 */
export function NoNull() {
	return function <T extends Constructor>(Ctor: T): T {
		const functionsInClass = ['_execute', '_executeArray'].map((str) => str.substring(1));

		const normalizeNullArgs = (args: any[]): any[] => args.map((i) => (null === i ? undefined : i));

		const wrapped: any = function (...args: any[]) {
			return Reflect.construct(Ctor, normalizeNullArgs(args), new.target);
		};

		wrapped.prototype = Ctor.prototype;

		Object.getOwnPropertyNames(Ctor).forEach((name) => {
			if (name !== 'prototype') {
				const descriptor = Object.getOwnPropertyDescriptor(Ctor, name)!;
				if (functionsInClass.includes(name) && typeof descriptor.value === 'function') {
					const originalExecute = descriptor.value;
					descriptor.value = function (...args: any[]) {
						const normalized = normalizeNullArgs(args);
						return originalExecute.apply(this, normalized);
					};
				}

				Object.defineProperty(wrapped, name, descriptor);
			}
		});

		return wrapped as T;
	};
}
