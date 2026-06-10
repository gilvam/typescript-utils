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
		const firstDelimiter = delimiters.find((delimiter) => key.startsWith(delimiter)) ?? '';
		const base = firstDelimiter ? key.slice(1) : key;
		const camel = base.replace(regexLetterAfterDelimiter, (_, letter: string) => letter.toUpperCase());
		return `${firstDelimiter}${camel}`;
	}

	private static valueToCamelCase(value: unknown): unknown {
		if (this.isObject(value)) {
			return this.toCamelCase(value);
		}

		if (this.isArray(value)) {
			return this.arrayToCamelCase(value);
		}
		return value;
	}

	static arrayToCamelCase<T>(arr: T[]): T[] {
		return arr.map((item) => this.valueToCamelCase(item) as T);
	}

	static toCamelCase<T>(obj: T): T {
		if (this.isArray(obj)) {
			return { ...this.arrayToCamelCase(obj) } as T;
		}

		if (!this.isObject(obj)) {
			return obj;
		}

		const entries = Object.entries(obj).map(([key, value]) => {
			return [this.keyToCamelCase(key), this.valueToCamelCase(value)];
		});
		return Object.fromEntries(entries) as T;
	}

	static isObject(obj: unknown): obj is Record<string, unknown> {
		return !!obj && typeof obj === 'object' && !Array.isArray(obj);
	}

	static isArray<T>(obj: unknown): obj is T[] {
		return Array.isArray(obj);
	}

	static nullToUndefined<T>(obj: Partial<T>): Partial<T> {
		const convert = (value: unknown): unknown => {
			if (value === null) {
				return undefined;
			}
			if (this.isArray(value)) {
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
