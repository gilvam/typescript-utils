import { NoNull } from './class.decorator';

describe('NoNull', () => {
	describe('constructor', () => {
		@NoNull()
		class Sample {
			constructor(
				public a?: unknown,
				public b?: unknown,
				public c?: unknown
			) {}

			getValues(): unknown[] {
				return [this.a, this.b, this.c];
			}
		}

		it('deve converter argumentos null em undefined no constructor', () => {
			const instance = new Sample(null, null, null);
			expect(instance.a).toBeUndefined();
			expect(instance.b).toBeUndefined();
			expect(instance.c).toBeUndefined();
		});

		it('deve normalizar apenas os argumentos null mantendo os demais', () => {
			const instance = new Sample(null, 'x', null);
			expect(instance.a).toBeUndefined();
			expect(instance.b).toBe('x');
			expect(instance.c).toBeUndefined();
		});

		it('deve preservar valores falsy que não são null', () => {
			const instance = new Sample(0, '', false);
			expect(instance.a).toBe(0);
			expect(instance.b).toBe('');
			expect(instance.c).toBe(false);
		});

		it('deve manter undefined como undefined', () => {
			const instance = new Sample(undefined, undefined, undefined);
			expect(instance.a).toBeUndefined();
			expect(instance.b).toBeUndefined();
			expect(instance.c).toBeUndefined();
		});

		it('deve criar uma instância da classe decorada (instanceof)', () => {
			const instance = new Sample(1, 2, 3);
			expect(instance).toBeInstanceOf(Sample);
		});

		it('deve preservar os métodos de instância (prototype)', () => {
			const instance = new Sample(null, 2, null);
			expect(instance.getValues()).toEqual([undefined, 2, undefined]);
		});
	});

	describe('métodos estáticos create / createArray', () => {
		@NoNull()
		class Service {
			static create(...args: unknown[]): unknown[] {
				return args;
			}

			static createArray(...args: unknown[]): unknown[] {
				return args;
			}

			static other(...args: unknown[]): unknown[] {
				return args;
			}
		}

		it('deve converter null em undefined nos argumentos de create', () => {
			expect(Service.create(null, 'a', null)).toEqual([undefined, 'a', undefined]);
		});

		it('deve converter null em undefined nos argumentos de createArray', () => {
			expect(Service.createArray(null, [1], null)).toEqual([undefined, [1], undefined]);
		});

		it('deve preservar valores falsy que não são null em create', () => {
			expect(Service.create(0, '', false)).toEqual([0, '', false]);
		});

		it('deve retornar o valor original de create quando não há null', () => {
			expect(Service.create('a', 1, true)).toEqual(['a', 1, true]);
		});

		it('não deve normalizar argumentos de métodos estáticos diferentes de create/createArray', () => {
			expect(Service.other(null, 'a')).toEqual([null, 'a']);
		});
	});

	describe('contexto e membros estáticos', () => {
		@NoNull()
		class Calculator {
			static base = 100;

			static create(value: unknown): { base: number; value: unknown } {
				return { base: this.base, value };
			}
		}

		it('deve copiar as propriedades estáticas não-função para a classe decorada', () => {
			expect(Calculator.base).toBe(100);
		});

		it('deve manter o binding de this dentro de create', () => {
			expect(Calculator.create(null)).toEqual({ base: 100, value: undefined });
		});
	});

	describe('combinando constructor e estáticos', () => {
		@NoNull()
		class User {
			constructor(
				public id?: unknown,
				public name?: unknown
			) {}

			static create(id: unknown, name: unknown): User {
				return new User(id, name);
			}
		}

		it('deve normalizar null tanto no create quanto no constructor encadeado', () => {
			const user = User.create(null, 'João');
			expect(user).toBeInstanceOf(User);
			expect(user.id).toBeUndefined();
			expect(user.name).toBe('João');
		});
	});
});
