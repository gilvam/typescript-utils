import { ObjectUtil } from '../../object.util';
import { Options } from './_models/options.model';

class ClassDecorator {
	private static readonly functionsInClass = ['_create', '_createArray'].map((str) => str.substring(1));

	private static executeNoNull(args: any[]): any[] {
		return args.map((i) => (null === i ? undefined : i));
	}

	private static executeCamelCase(args: any[]): any[] {
		return args.map((i) => ObjectUtil.toCamelCase(i));
	}

	private static applyTransforms(args: any[], options: Options): any[] {
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
	 * Decorador que normaliza os argumentos do constructor e dos métodos estáticos
	 * create() / createArray() de acordo com as flags informadas:
	 * - noNull: converte null em undefined (comportamento raso, no nível dos argumentos)
	 * - camelCase: converte as keys dos objetos recebidos para camelCase (profundo)
	 */
	static dto(options: Options) {
		return function <T extends new (...args: any[]) => any>(ctor: T): T {
			const wrapped: any = function (...args: any[]) {
				return Reflect.construct(ctor, ClassDecorator.applyTransforms(args, options), new.target);
			};

			wrapped.prototype = ctor.prototype;

			Object.getOwnPropertyNames(ctor).forEach((name) => {
				if (name !== 'prototype') {
					const descriptor = Object.getOwnPropertyDescriptor(ctor, name)!;
					if (ClassDecorator.functionsInClass.includes(name) && typeof descriptor.value === 'function') {
						const originalExecute = descriptor.value;
						descriptor.value = function (...args: any[]) {
							return originalExecute.apply(this, ClassDecorator.applyTransforms(args, options));
						};
					}

					Object.defineProperty(wrapped, name, descriptor);
				}
			});

			return wrapped as T;
		};
	}
}

export function dto(options = new Options()) {
	return ClassDecorator.dto({ noNull: options.noNull, camelCase: options.camelCase });
}
