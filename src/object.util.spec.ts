import { ObjectUtil } from './object.util';

describe('ObjectUtil', () => {
	describe('toCamelCase', () => {
		it('deve retornar um novo objeto camelCase se for array', () => {
			const input = [{ test_key: 1 }, { another_key: 2 }];
			const result = ObjectUtil.toCamelCase(input);
			expect(result).toEqual({ '0': { testKey: 1 }, '1': { anotherKey: 2 } });
		});

		it('deve retornar o valor original se não for objeto nem array', () => {
			expect(ObjectUtil.toCamelCase(123)).toBe(123);
			expect(ObjectUtil.toCamelCase('abc')).toBe('abc');
			expect(ObjectUtil.toCamelCase(null)).toBe(null);
			expect(ObjectUtil.toCamelCase(undefined)).toBe(undefined);
		});

		it('deve converter as chaves de um objeto simples para camelCase', () => {
			const input = { test_key: 1, another_key: 2 };
			const result = ObjectUtil.toCamelCase(input);
			expect(result).toEqual({ testKey: 1, anotherKey: 2 });
		});

		it('deve usar manter a key iniciada com o delimitador _', () => {
			const input = { _test_key: 1 } as any;
			const result = ObjectUtil.toCamelCase(input);
			expect(result).toEqual({ _testKey: 1 });
		});

		it('deve converter objetos aninhados e arrays para camelCase', () => {
			const input = {
				test_key: 1,
				nested_obj: { another_key: 2 },
				arr: [{ inner_key: 3 }]
			};
			const result = ObjectUtil.toCamelCase(input);
			expect(result).toEqual({
				testKey: 1,
				nestedObj: { anotherKey: 2 },
				arr: [{ innerKey: 3 }]
			});
		});

		it('deve manter valores primitivos em objetos', () => {
			const input = { a: 1, b: 'x', c: true };
			const result = ObjectUtil.toCamelCase(input);
			expect(result).toEqual({ a: 1, b: 'x', c: true });
		});

		describe('toCamelCase vs toCamelCaseOld — propriedades enumeráveis herdadas do prototype', () => {
			const createInputWithInheritedKey = (): Record<string, unknown> => {
				const proto = { inherited_key: 'parent' };
				const input = Object.create(proto) as Record<string, unknown>;
				input['own_key'] = 'child';
				return input;
			};

			it('toCamelCase deve ignorar propriedades herdadas (Object.entries só lê propriedades próprias)', () => {
				const result = ObjectUtil.toCamelCase(createInputWithInheritedKey());
				expect(result).toEqual({ ownKey: 'child' });
				expect(result).not.toHaveProperty('inheritedKey');
			});
		});

		describe('estruturas profundamente aninhadas — 12 camadas de objetos e arrays', () => {
			// prettier-ignore
			// eslint-disable-next-line camelcase
			const createDeepInput = (): Record<string, unknown> => ({ level_one: { level_two: { level_three: [{ level_four: { level_five: [{ level_six: { level_seven: { level_eight: [{ level_nine: { level_ten: { level_eleven: [{ level_twelve: 'deep_value' }] } } }] } } }] } }] } }, sibling_list: [1, 'two', null, { item_key: true }] });
			// prettier-ignore
			const createDeepExpected = (): Record<string, unknown> => ({ levelOne: { levelTwo: { levelThree: [{ levelFour: { levelFive: [{ levelSix: { levelSeven: { levelEight: [{ levelNine: { levelTen: { levelEleven: [{ levelTwelve: 'deep_value' }] } } }] } } }] } }] } }, siblingList: [1, 'two', null, { itemKey: true }] });

			it('toCamelCase deve converter todas as keys nas 12 camadas de objetos e arrays', () => {
				const result = ObjectUtil.toCamelCase(createDeepInput());
				expect(result).toEqual(createDeepExpected());
				expect(result).toHaveProperty(
					'levelOne.levelTwo.levelThree.0.levelFour.levelFive.0.levelSix.levelSeven.levelEight.0.levelNine.levelTen.levelEleven.0',
					{ levelTwelve: 'deep_value' }
				);
			});
		});
	});

	describe('nullToUndefined', () => {
		it('returns undefined for null values in a flat object', () => {
			const input = { a: null, b: 1, c: 'test' };
			const result = ObjectUtil.nullToUndefined(input);
			expect(result).toEqual({ a: undefined, b: 1, c: 'test' });
		});

		it('returns undefined for null values in a nested object', () => {
			const input = { a: null, b: { c: null, d: 2 } };
			const result = ObjectUtil.nullToUndefined(input);
			expect(result).toEqual({ a: undefined, b: { c: undefined, d: 2 } });
		});

		it('returns undefined for null values in an array', () => {
			const input = [null, 1, 'test'];
			const result = ObjectUtil.nullToUndefined(input);
			expect(result).toEqual([undefined, 1, 'test']);
		});

		it('returns undefined for null values in an array of objects', () => {
			const input = [{ a: null }, { b: 2 }];
			const result = ObjectUtil.nullToUndefined(input);
			expect(result).toEqual([{ a: undefined }, { b: 2 }]);
		});

		it('returns the same object if there are no null values', () => {
			const input = { a: 1, b: 'test' };
			const result = ObjectUtil.nullToUndefined(input);
			expect(result).toEqual(input);
		});

		it('returns the same array if there are no null values', () => {
			const input = [1, 'test'];
			const result = ObjectUtil.nullToUndefined(input);
			expect(result).toEqual(input);
		});

		it('handles empty objects correctly', () => {
			const input = {};
			const result = ObjectUtil.nullToUndefined(input);
			expect(result).toEqual({});
		});

		it('handles empty arrays correctly', () => {
			const input: any[] = [];
			const result = ObjectUtil.nullToUndefined(input);
			expect(result).toEqual([]);
		});

		it('deve converter estruturas profundamente aninhadas com arrays e objetos', () => {
			// prettier-ignore
			const input = [{ a: [{ b: {c: [{ d: null, e: 1 }, { d: 2, e: null } ]}, f: null }], g_h: null }];
			// prettier-ignore
			const expected = [{ a: [ { b: { c: [{ d: undefined, e: 1 }, { d: 2, e: undefined }] }, f: undefined } ], gH: undefined }];
			const result = ObjectUtil.nullToUndefined(input);
			expect(result).toEqual(expected);
		});

		it('returns the same value for primitive types', () => {
			expect(ObjectUtil.nullToUndefined(1)).toBe(1);
			expect(ObjectUtil.nullToUndefined('test')).toBe('test');
			expect(ObjectUtil.nullToUndefined(true)).toBe(true);
			expect(ObjectUtil.nullToUndefined(null as any)).toBeUndefined();
			expect(ObjectUtil.nullToUndefined(undefined as any)).toBeUndefined();
		});
	});

	describe('partial', () => {
		class User {
			constructor(
				public id = '',
				public key = '',
				public active = false
			) {
				this.key = key || this.withoutKey;
			}

			// response: Partial<Record<keyof AddressDto, string | null | undefined>> = new AddressDto()
			static create(response: Partial<User> = new User()): User {
				const i = ObjectUtil.nullToUndefined<User>(response);
				return new User(i.id, i.key, i.active);
			}

			get isEmpty(): boolean {
				return !(this.id && this.key);
			}

			get withoutKey(): string {
				return 'N/N';
			}
		}
		class Client {
			constructor(
				public name = '',
				public type = '',
				public user = new User()
			) {}

			static create(response: Partial<Client> = new Client()): Client {
				const i = ObjectUtil.nullToUndefined<Client>(response);
				return new Client(i.name, i.type, User.create(i.user));
			}

			get isEmpty(): boolean {
				return !(this.type && this.name && this.user) && this.user.isEmpty;
			}
		}
		it('deve criar uma instância com todos os valores padrão sem as funções', () => {
			const client = ObjectUtil.partial<Client>({}, Client);
			expect(client).toMatchObject({ type: '', name: '', user: { id: '', key: 'N/N', active: false } });
			expect(client).toBeInstanceOf(Client);
		});

		it('deve lidar com valores nulos e undefined', () => {
			const client = ObjectUtil.partial<Client>({ name: null, asfd: undefined }, Client);
			expect(client.name).toBe(undefined);
			expect(client.type).toBe('');
			expect(client?.user?.active).toBeFalsy();
		});

		it('deve sobrescrever todos os campos se todos forem fornecidos sem instância OO', () => {
			const client = ObjectUtil.partial<Client>(
				{ name: 'J', type: 'adm', user: { id: '1', key: null, active: true } },
				Client
			);
			expect(client.name).toBe('J');
			expect(client.type).toBe('adm');
			expect(client?.user?.isEmpty).toBeUndefined();
			expect(client?.user?.id).toBe('1');
			expect(client?.user?.key).toBe(undefined);
			expect(client?.user?.active).toBeTruthy();
			expect(client?.user?.isEmpty).toBeUndefined();
			expect(client?.user?.withoutKey).toBeUndefined();
		});

		it('deve sobrescrever todos os campos se todos forem fornecidos com instância OO', () => {
			const client = Client.create(
				ObjectUtil.partial({ name: 'J', type: 'adm', user: { id: '1', key: '', active: true } }, Client)
			);
			expect(client.name).toBe('J');
			expect(client.type).toBe('adm');
			expect(client.isEmpty).toBeFalsy();
			expect(client.isEmpty).not.toBeUndefined();
			expect(client.user.id).toBe('1');
			expect(client.user.key).toBe('N/N');
			expect(client.user.active).toBeTruthy();
			expect(client.user.isEmpty).not.toBeUndefined();
			expect(client.user.isEmpty).toBeFalsy();
			expect(client.user.withoutKey).toBe('N/N');
		});

		it('deve retornar undefined para valores null em um array', () => {
			const input = [1, 2];
			const result = ObjectUtil.nullToUndefined(input);
			expect(result).toEqual([1, 2]);
		});
		it('deve retornar undefined para valores null em um array', () => {
			const input = [] as any;
			const result = ObjectUtil.nullToUndefined(input);
			expect(result).toEqual([]);
		});
	});

	describe('fillEmpty', () => {
		it('deve substituir valores null, undefined e string vazia pelos valores do fallback', () => {
			const fallback = { a: 'a', b: 'b', c: 'c' };
			const value = { a: null, b: undefined, c: '' };
			expect(ObjectUtil.fillEmpty(value, fallback)).toEqual({ a: 'a', b: 'b', c: 'c' });
		});

		it('deve manter os valores preenchidos do value mesmo quando o fallback tem outro valor', () => {
			const fallback = { a: 'a', b: 'b' };
			const value = { a: 'novo', b: null };
			expect(ObjectUtil.fillEmpty(value, fallback)).toEqual({ a: 'novo', b: 'b' });
		});

		it('deve preservar valores falsy que não são vazios (0 e false)', () => {
			const fallback = { a: 1, b: true };
			const value = { a: 0, b: false };
			expect(ObjectUtil.fillEmpty(value, fallback)).toEqual({ a: 0, b: false });
		});

		it('deve preencher valores aninhados profundamente', () => {
			const fallback = { user: { name: 'pikachu', address: { city: 'kanto' } } };
			const value = { user: { name: 'raichu', address: { city: '' } } };
			expect(ObjectUtil.fillEmpty(value, fallback)).toEqual({
				user: { name: 'raichu', address: { city: 'kanto' } }
			});
		});

		it('deve preencher um objeto inteiro quando o value está undefined', () => {
			const fallback = { other: { officialArtwork: { default: '25.png' } } };
			const value = { other: undefined };
			expect(ObjectUtil.fillEmpty(value, fallback)).toEqual({
				other: { officialArtwork: { default: '25.png' } }
			});
		});

		it('deve mesclar arrays elemento a elemento por índice', () => {
			const fallback = [{ id: 1, name: 'a' }];
			const value = [{ id: null, name: 'b' }];
			expect(ObjectUtil.fillEmpty(value, fallback)).toEqual([{ id: 1, name: 'b' }]);
		});

		it('deve aplicar o mesmo fallback (objeto único) a cada elemento de um array', () => {
			const fallback = { id: 1, name: 'default' };
			const value = [{ id: null, name: 'a' }, { id: 2, name: '' }];
			expect(ObjectUtil.fillEmpty(value, fallback)).toEqual([
				{ id: 1, name: 'a' },
				{ id: 2, name: 'default' }
			]);
		});

		it('deve clonar o fallback em vez de compartilhar a referência', () => {
			const fallback = { nested: { value: 'x' } };
			const value = { nested: undefined };
			const result = ObjectUtil.fillEmpty<typeof fallback>(value, fallback);
			expect(result.nested).toEqual(fallback.nested);
			expect(result.nested).not.toBe(fallback.nested);
		});

		it('deve substituir o objeto inteiro pelo fallback quando o value está vazio', () => {
			const fallback = { a: 1, b: 2 };
			expect(ObjectUtil.fillEmpty(null, fallback)).toEqual({ a: 1, b: 2 });
			expect(ObjectUtil.fillEmpty(undefined, fallback)).toEqual({ a: 1, b: 2 });
		});

		it('deve preencher todas as chaves do fallback quando o value é um objeto vazio', () => {
			const fallback = { a: 1, b: 2 };
			expect(ObjectUtil.fillEmpty({}, fallback)).toEqual({ a: 1, b: 2 });
		});

		it('deve completar o objeto pokemon do exemplo (cenário completo)', () => {
			const fallback = {
				id: 25,
				name: 'pikachu',
				experience: 112,
				sprites: {
					front: '25.png',
					back: 'back/25.png',
					other: { officialArtwork: { default: '25.png' } }
				},
				stats: [{ baseStat: 35, stat: { name: 'hp', url: 'https://pokeapi.co/api/v2/stat/1/' } }]
			};
			const value = {
				id: null,
				name: 'Raichu',
				experience: 300,
				sprites: { front: '30.png', back: '', other: undefined },
				stats: [{ baseStat: 100, stat: { name: undefined, url: '' } }]
			};
			expect(ObjectUtil.fillEmpty(value, fallback)).toEqual({
				id: 25,
				name: 'Raichu',
				experience: 300,
				sprites: {
					front: '30.png',
					back: 'back/25.png',
					other: { officialArtwork: { default: '25.png' } }
				},
				stats: [{ baseStat: 100, stat: { name: 'hp', url: 'https://pokeapi.co/api/v2/stat/1/' } }]
			});
		});
	});
});
