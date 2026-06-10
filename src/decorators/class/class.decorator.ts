import { ObjectUtil } from '../../object.util';
import { Options } from './_models/options.model';

class ClassDecorator {
	private static readonly functionsInClass = ['_create', '_createArray'].map((str) => str.substring(1));

	private static executeNoNull(args: unknown[]): unknown[] {
		return args.map((arg) => (arg === null ? undefined : arg));
	}

	private static executeCamelCase(args: unknown[]): unknown[] {
		return args.map((i) => ObjectUtil.toCamelCase(i));
	}

	private static execute(args: unknown[], options: Options): unknown[] {
		let result = args;
		if (options.camelCase) {
			result = ClassDecorator.executeCamelCase(result);
		}
		if (options.noNull) {
			result = ClassDecorator.executeNoNull(result);
		}
		return result;
	}

	/**
	 * Decorator that normalizes the arguments of the constructor and of the static
	 * create() / createArray() methods according to the given flags:
	 * - noNull: converts null to undefined (shallow, at argument level)
	 * - camelCase: converts the keys of received objects to camelCase (deep)
	 */
	static dto(options: Options) {
		return function <T extends new (...args: never[]) => object>(ctor: T): T {
			return new Proxy(ctor, {
				construct(target, args: unknown[], newTarget): object {
					return Reflect.construct(target, ClassDecorator.execute(args, options), newTarget) as object;
				},
				get(target, prop, receiver): unknown {
					const value: unknown = Reflect.get(target, prop, receiver);
					if (
						typeof prop === 'string' &&
						typeof value === 'function' &&
						ClassDecorator.functionsInClass.includes(prop)
					) {
						const original = value as (...args: unknown[]) => unknown;
						return function (this: unknown, ...args: unknown[]): unknown {
							return original.apply(this, ClassDecorator.execute(args, options));
						};
					}
					return value;
				}
			});
		};
	}
}

export function dto(options = new Options()): <T extends new (...args: never[]) => object>(ctor: T) => T {
	return ClassDecorator.dto(options);
}
