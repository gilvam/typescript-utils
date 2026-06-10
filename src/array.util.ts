import { ObjectUtil } from './object.util';

export class ArrayUtil {
	static toCamelCase<T>(arr: T[]): T[] {
		return ObjectUtil.arrayToCamelCase(arr);
	}
}
