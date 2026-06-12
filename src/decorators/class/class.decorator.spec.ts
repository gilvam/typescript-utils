import { Dto } from './class.decorator';
import { Options } from './_models/options.model';

/* eslint-disable camelcase, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment */
describe('dto', () => {
	describe('constructor', () => {
		@Dto()
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
		@Dto({ noNullValue: true, keyCamelCase: false })
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
		@Dto()
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
		@Dto()
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

	describe('flag keyCamelCase', () => {
		describe('@dto() com as flags default (noNullValue: true, keyCamelCase: false)', () => {
			@Dto()
			class Sample {
				constructor(
					public payload?: any,
					public extra?: unknown
				) {}

				static create(payload: any): any {
					return payload;
				}
			}

			it('deve manter as keys originais e converter null (top-level) em undefined', () => {
				const instance = new Sample({ first_name: 'Ana' }, null);
				expect(instance.payload).toEqual({ first_name: 'Ana' });
				expect(instance.extra).toBeUndefined();
			});

			it('deve manter null aninhado dentro do objeto (noNullValue é raso)', () => {
				const instance = new Sample({ first_name: 'Ana', last_name: null });
				expect(instance.payload).toEqual({ first_name: 'Ana', last_name: null });
			});

			it('deve manter as keys originais no create', () => {
				expect(Sample.create({ first_name: 'Ana' })).toEqual({ first_name: 'Ana' });
			});
		});

		describe('@dto({ noNullValue: true, keyCamelCase: true }) — ambas as flags ativas', () => {
			@Dto({ noNullValue: true, keyCamelCase: true })
			class Sample {
				constructor(
					public payload?: any,
					public extra?: unknown
				) {}

				static create(payload: any): any {
					return payload;
				}
			}

			it('deve manter as keys originais no constructor e converter null (top-level) em undefined', () => {
				const instance = new Sample({ first_name: 'Ana' }, null);
				expect(instance.payload).toEqual({ first_name: 'Ana' });
				expect(instance.extra).toBeUndefined();
			});

			it('deve converter as keys para camelCase no create', () => {
				expect(Sample.create({ first_name: 'Ana' })).toEqual({ firstName: 'Ana' });
			});

			it('deve converter keys de objetos aninhados e arrays (profundo) no create', () => {
				const result = Sample.create({
					user_data: { home_address: 'rua' },
					tag_list: [{ tag_name: 'a' }]
				});
				expect(result).toEqual({
					userData: { homeAddress: 'rua' },
					tagList: [{ tagName: 'a' }]
				});
			});
		});

		describe('@dto({ noNullValue: false, keyCamelCase: true }) — apenas keyCamelCase', () => {
			@Dto({ noNullValue: false, keyCamelCase: true })
			class Sample {
				constructor(public payload?: any) {}

				static create(payload: any): any {
					return payload;
				}
			}

			it('deve manter as keys originais no constructor mesmo com keyCamelCase ativo', () => {
				const instance = new Sample({ first_name: null, last_name: 'Souza' });
				expect(instance.payload).toEqual({ first_name: null, last_name: 'Souza' });
			});

			it('deve converter as keys para camelCase no create mantendo null como null', () => {
				expect(Sample.create({ first_name: null, last_name: 'Souza' })).toEqual({
					firstName: null,
					lastName: 'Souza'
				});
			});

			it('deve manter argumento null de nível superior como null', () => {
				const instance = new Sample(null);
				expect(instance.payload).toBeNull();
			});
		});

		describe('@dto({ noNullValue: false, keyCamelCase: false }) — nenhuma transformação', () => {
			@Dto({ noNullValue: false, keyCamelCase: false })
			class Sample {
				constructor(public payload?: any) {}
			}

			it('deve manter os argumentos intactos', () => {
				const original = { first_name: null, last_name: 'Souza' };
				const instance = new Sample(original);
				expect(instance.payload).toEqual({ first_name: null, last_name: 'Souza' });
			});

			it('deve manter argumento null de nível superior como null', () => {
				const instance = new Sample(null);
				expect(instance.payload).toBeNull();
			});
		});
	});

	describe('variantes de parâmetros { } com keys', () => {
		function buildSample(
			options: Partial<Options>
		): (new (payload?: unknown) => { payload?: unknown }) & { create(payload: unknown): unknown } {
			@Dto(options)
			class Sample {
				constructor(public payload?: any) {}

				static create(payload: any): any {
					return payload;
				}
			}
			return Sample;
		}

		it('@Dto({}) — converte null no constructor e mantém keys no create', () => {
			const Sample = buildSample({});
			expect(new Sample(null).payload).toBeUndefined();
			expect(Sample.create({ first_name: 'Ana' })).toEqual({ first_name: 'Ana' });
			expect(Sample.create(null)).toBeUndefined();
		});

		it('@Dto({ noNullValue: true }) — converte null no constructor e mantém keys no create', () => {
			const Sample = buildSample({ noNullValue: true });
			expect(new Sample(null).payload).toBeUndefined();
			expect(Sample.create({ first_name: 'Ana' })).toEqual({ first_name: 'Ana' });
			expect(Sample.create(null)).toBeUndefined();
		});

		it('@Dto({ noNullValue: false }) — mantém null no constructor e mantém keys no create', () => {
			const Sample = buildSample({ noNullValue: false });
			expect(new Sample(null).payload).toBeNull();
			expect(Sample.create({ first_name: 'Ana' })).toEqual({ first_name: 'Ana' });
			expect(Sample.create(null)).toBeNull();
		});

		it('@Dto({ keyCamelCase: true }) — converte null no constructor e converte keys no create', () => {
			const Sample = buildSample({ keyCamelCase: true });
			expect(new Sample(null).payload).toBeUndefined();
			expect(Sample.create({ first_name: 'Ana' })).toEqual({ firstName: 'Ana' });
			expect(Sample.create(null)).toBeUndefined();
		});

		it('@Dto({ keyCamelCase: false }) — converte null no constructor e mantém keys no create', () => {
			const Sample = buildSample({ keyCamelCase: false });
			expect(new Sample(null).payload).toBeUndefined();
			expect(Sample.create({ first_name: 'Ana' })).toEqual({ first_name: 'Ana' });
			expect(Sample.create(null)).toBeUndefined();
		});

		it('@Dto({ noNullValue: true, keyCamelCase: true }) — converte null no constructor e converte keys no create', () => {
			const Sample = buildSample({ noNullValue: true, keyCamelCase: true });
			expect(new Sample(null).payload).toBeUndefined();
			expect(Sample.create({ first_name: 'Ana' })).toEqual({ firstName: 'Ana' });
			expect(Sample.create(null)).toBeUndefined();
		});

		it('@Dto({ noNullValue: true, keyCamelCase: false }) — converte null no constructor e mantém keys no create', () => {
			const Sample = buildSample({ noNullValue: true, keyCamelCase: false });
			expect(new Sample(null).payload).toBeUndefined();
			expect(Sample.create({ first_name: 'Ana' })).toEqual({ first_name: 'Ana' });
			expect(Sample.create(null)).toBeUndefined();
		});

		it('@Dto({ noNullValue: false, keyCamelCase: true }) — mantém null no constructor e converte keys no create', () => {
			const Sample = buildSample({ noNullValue: false, keyCamelCase: true });
			expect(new Sample(null).payload).toBeNull();
			expect(Sample.create({ first_name: 'Ana' })).toEqual({ firstName: 'Ana' });
			expect(Sample.create(null)).toBeNull();
		});

		it('@Dto({ noNullValue: false, keyCamelCase: false }) — mantém null no constructor e mantém keys no create', () => {
			const Sample = buildSample({ noNullValue: false, keyCamelCase: false });
			expect(new Sample(null).payload).toBeNull();
			expect(Sample.create({ first_name: 'Ana' })).toEqual({ first_name: 'Ana' });
			expect(Sample.create(null)).toBeNull();
		});
	});
});
