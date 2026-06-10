import { ArrayUtil } from './array.util';

describe('ArrayUtil', () => {
	describe('toCamelCase', () => {
		it('should convert array of primitive', () => {
			const obj = [1, -10, '', '50', true, 'x_y', NaN, undefined, false, null, Symbol('symbol'), BigInt(123)];
			expect(ArrayUtil.toCamelCase(obj)).toEqual(obj);
		});

		it('should call itself recursively when the item is an array and ensure the "as"', () => {
			const input = [[1, 2]];
			const result = ArrayUtil.toCamelCase(input);

			expect(result).toEqual(input);
		});

		it('should convert array of array types ensure the "as"', () => {
			const obj = [1, ['', '50', true, 'x_y', [undefined]]];
			expect(ArrayUtil.toCamelCase(obj)).toEqual(obj);
		});

		it('should convert array of object and ensure the "as"', () => {
			const obj = [{ pet_name: 'x_y' }, { pet_name: 'xY' }];
			const objExpected = [{ petName: 'x_y' }, { petName: 'xY' }];

			expect(ArrayUtil.toCamelCase(obj)).toEqual(objExpected);
		});

		it('should convert a complex array of objects', () => {
			const obj = [{ pet_name: 'x_y' }, { pet_name: 'xY' }, [{ x: 10, y_y: [10, 20] }]];
			const objExpected = [{ petName: 'x_y' }, { petName: 'xY' }, [{ x: 10, yY: [10, 20] }]];

			expect(ArrayUtil.toCamelCase(obj)).toEqual(objExpected);
		});
	});
});
