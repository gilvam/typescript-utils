import { ArrayUtil } from './array.util';

export class ObjectUtil {
	private static normalizeSpecialLetters(key: string): string {
		return key.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
	}

	private static regexLetterAfterDelimiter(delimiters: string[]): RegExp {
		return new RegExp(`[${delimiters.join('')}]([\\p{L}])`, 'gu');
	}

	private static keyToCamelCase(keyDefault: string, delimiters: string[] = ['_', '-']): string {
		const key = this.normalizeSpecialLetters(keyDefault);
		const regexLetterAfterDelimiter = this.regexLetterAfterDelimiter(delimiters);
		const startsWithDelimiter = delimiters.some((d) => key.startsWith(d));
		const base = startsWithDelimiter ? key.slice(1) : key;
		const camel = base.replace(regexLetterAfterDelimiter, (_, letter: string) => letter.toUpperCase());
		return startsWithDelimiter ? `${delimiters[0]}${camel}` : camel;
	}

	static toCamelCase<T>(obj: T): T {
		if (ArrayUtil.isArray(obj)) {
			return { ...ArrayUtil.toCamelCase(obj) } as T;
		}

		if (!this.isObject(obj)) {
			return obj;
		}

		const newObj: Record<string, unknown> = {};
		for (const key in obj) {
			const value = obj[key];
			const camelKey = this.keyToCamelCase(key);

			if (ObjectUtil.isObject(value)) {
				newObj[camelKey] = ObjectUtil.toCamelCase(value);
				continue;
			}

			if (ArrayUtil.isArray(value)) {
				newObj[camelKey] = ArrayUtil.toCamelCase(value);
				continue;
			}

			newObj[camelKey] = value;
		}
		return newObj as T;
	}

	static isObject(obj: unknown): obj is Record<string, unknown> {
		return !!obj && typeof obj === 'object' && !Array.isArray(obj);
	}

	static nullToUndefined<T>(obj: Partial<T>): Partial<T> {
		const convert = (value: unknown): unknown => {
			if (value === null) {
				return undefined;
			}
			if (ArrayUtil.isArray(value)) {
				return value.map((item) => convert(item));
			}
			if (this.isObject(value)) {
				return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, convert(item)]));
			}
			return value;
		};
		return convert(obj) as Partial<T>;
	}

	static partial<T>(obj: unknown, className: new () => object): Partial<T> {
		const objInitial = this.nullToUndefined(obj as Partial<T>);
		return Object.assign(new className(), objInitial);
	}
}
