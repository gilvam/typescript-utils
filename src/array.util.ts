import { ObjectUtil } from './object.util';

export class ArrayUtil {
	static isArray<T>(obj: unknown): obj is T[] {
		return Array.isArray(obj);
	}

	static toCamelCase<T>(arr: T[]): T[] {
		return arr.map((item) => {
			if (ObjectUtil.isObject(item)) {
				return ObjectUtil.toCamelCase<T>(item);
			}

			if (ArrayUtil.isArray(item)) {
				return this.toCamelCase(item) as T;
			}
			return item;
		});
	}
}
