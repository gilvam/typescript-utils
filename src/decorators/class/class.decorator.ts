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

	private static executeDefaultValues(args: unknown[], defaultValues: unknown): unknown[] {
		return args.map((arg) => ObjectUtil.fillEmpty(arg, defaultValues));
	}

	private static doConstructorArgs(args: unknown[], options: Options): unknown[] {
		return options.noNullValue ? ClassDecorator.executeNoNull(args) : args;
	}

	private static doMethodArgs(args: unknown[], options: Options): unknown[] {
		let result = args;
		if (options.keyCamelCase) {
			result = ClassDecorator.executeCamelCase(result);
		}
		result = ClassDecorator.doConstructorArgs(result, options);
		if (options.defaultValues) {
			result = ClassDecorator.executeDefaultValues(result, options.defaultValues);
		}
		return result;
	}

	/**
	 * Decorator that normalizes the arguments of the constructor and of the static
	 * create() / createArray() methods according to the given flags:
	 * - noNullValue: converts null to undefined (shallow, at argument level),
	 *   applied to the constructor and to the static create() / createArray() methods — default true
	 * - keyCamelCase: converts the keys of received objects to camelCase (deep),
	 *   applied only to the static create() / createArray() methods — default false
	 * - defaultValues: a complete object (or array of objects) of the same type as the
	 *   decorated class used to fill in empty values (null, undefined or '') of the
	 *   received arguments (deep), applied only to the static create() / createArray()
	 *   methods — default undefined (disabled)
	 */
	static dto(options: Partial<Options>) {
		const opts = Object.assign(new Options(), options);
		return function <T extends new (...args: never[]) => object>(ctor: T): T {
			return new Proxy(ctor, {
				construct(target, args: unknown[], newTarget): object {
					return Reflect.construct(target, ClassDecorator.doConstructorArgs(args, opts), newTarget) as object;
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
							return original.apply(this, ClassDecorator.doMethodArgs(args, opts));
						};
					}
					return value;
				}
			});
		};
	}
}

export function Dto<T = unknown>(
	options: Partial<Options<T>> = new Options<T>()
): <C extends new (...args: never[]) => object>(ctor: C) => C {
	return ClassDecorator.dto(options);
}
