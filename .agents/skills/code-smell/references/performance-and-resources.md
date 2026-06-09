# Performance & Resources

Smells relacionados a desempenho, alocação de recursos e concorrência.

## Smells nesta categoria

- [Unoptimized Algorithms](#unoptimized-algorithms)
- [Improper Loop Usage](#improper-loop-usage)
- [Unbounded Loops](#unbounded-loops)
- [Memory Leaks](#memory-leaks)
- [Improper Caching](#improper-caching)
- [Blocking Calls](#blocking-calls)
- [Unnecessary Threading](#unnecessary-threading)
- [Improper Synchronization](#improper-synchronization)

---

## Unoptimized Algorithms

Similar ao Improper Loop Usage mas focado no desempenho. Se referem a algoritmos que não estão implementados da maneira mais eficiente possível, levando a uso excessivo de recursos como tempo de execução ou memória. Esse code smell pode resultar em desempenho insatisfatório, especialmente em casos de grandes volumes de dados ou sistemas em produção com alta demanda..

#### problema
```typescript
function getAllPairs(arr: number[]): number[][] {
  const pairs: number[][] = [];
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      pairs.push([arr[i], arr[j]]); // Evite acumular todos os resultados na memória
    }
  }
  return pairs;
}

// exemplo de uso
const numbers = [1, 2, 3, 4, 5];
console.log(getAllPairs(numbers));
// Saída: [[1, 2], [1, 3], [1, 4], [1, 5], [2, 3], [2, 4], [2, 5], [3, 4], [3, 5], [4, 5]]
```

#### solução
```typescript
function* generatePairs(arr: number[]): Generator<[number, number]> {
  let i = 0;
  while (i < arr.length) {
    for (let j = i + 1; j < arr.length; j++) {
      yield [arr[i], arr[j]];  // Gere os resultados sob demanda (lazy) para economizar memória
    }
    i++;
  }
}

// exemplo de uso
const numbers = [1, 2, 3, 4, 5];
const pairsGenerator = generatePairs(numbers);
for (const pair of pairsGenerator) {
  console.log(pair);  // os pares são gerados conforme necessário
}
```

## Improper Loop Usage

Ocorre quando um loop é usado de maneira ineficiente ou incorreta, resultando em um desempenho ruim ou em um código difícil de entender e manter. Isso pode incluir o uso de loops desnecessários, loops que poderiam ser substituídos por uma operação mais simples ou até mesmo loops que são mal projetados, levando a um comportamento inesperado.
Exemplos comuns de Improper Loop Usage incluem:
Usar um loop onde uma operação direta poderia ser realizada (map, forEach,reduce). Visite o os métodos mais utilizados para arrays no javascript.
Usar um loop aninhado sem necessidade, o que resulta em complexidade desnecessária.
Utilizar um loop de forma que ele execute mais vezes do que o necessário, causando ineficiência no código.

#### problema A
```typescript
sumNumbers(numbers: number[]): number {
  let sum = 0;
  for (let i = 0; i < numbers.length; i++) {
    sum += numbers[i]; // Evite um loop manual onde uma operação de array resolve
  }
  return sum;
}

const numbers = [1, 2, 3, 4, 5];
const total = sumNumbers(numbers); // Evite o loop manual ineficiente para somar
```

#### solução A
```typescript
sumNumbers(numbers: number[]): number {
  return numbers.reduce((acc, num) => acc + num, 0);
}

const numbers = [1, 2, 3, 4, 5];
sumNumbers(numbers); // Use reduce para somar de forma clara e eficiente
```

#### problema B
```typescript
findItem(numbers: number[], target: number): boolean {
  for (let i = 0; i < numbers.length; i++) {
    if (numbers[i] === target) {
      return true; // Evite um loop manual para uma busca simples
    }
  }
  return false;
}

const numbers = [1, 2, 3, 4, 5];
findItem(numbers, 3);  // Evite a busca manual ineficiente
```

#### solução B
```typescript
findItem(numbers: number[], target: number): boolean {
  return numbers.includes(target); // Use includes para verificar existência
}

const numbers = [1, 2, 3, 4, 5];
console.log(findItem(numbers, 3));
```

#### problema C
```typescript
hasDuplicates(arr: number[]): boolean {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j]) {
        return true; // Evite loop aninhado para detectar duplicatas
      }
    }
  }
  return false;
}
```

#### solução C funcional:
```typescript
hasDuplicates(arr: number[]): boolean {
  const seen = new Set(); // Use um Set para detectar duplicatas em O(n)
  for (let num of arr) {
    if (seen.has(num)) {
      return true;
    }
    seen.add(num);
  }
  return false;
}
```

#### solução C simplificada:
```typescript
hasDuplicates(arr: number[]): boolean {
  return arr.some((num, idx) => arr.indexOf(num) !== idx);
};
```

## Unbounded Loops

São laços (loops) que não têm uma condição de parada clara ou um limite bem definido, fazendo com que o loop continue a rodar indefinidamente, consumindo recursos do sistema, como CPU e memória. Esses loops podem levar a um comportamento inesperado, como a sobrecarga do sistema, travamentos ou até mesmo falhas.

#### problema
```typescript
infiniteLoop(): void {
  let count = 0;

  while (count < 10) {
    console.log(count);
    // Evite loops cuja condição de parada nunca avança (loop infinito)
  }
}

infiniteLoop();
```

#### solução
```typescript
function boundedLoop() {
  let count = 0;

  while (count < 10) {
    console.log(count);
    count++; // Garanta que a condição de parada progrida a cada iteração
  }
}

boundedLoop();
```

## Memory Leaks

Ocorrem quando a memória é alocada, mas não é liberada corretamente. Esse vazamento de memória impede que o coletor de lixo (garbage collector) libere a memória que não está mais sendo usada, o que pode resultar em aumento no uso de memória e, eventualmente, falhas ou degradação do desempenho da aplicação.

#### problema
```typescript
class UserList {
  users: string[];

  constructor(users: string[]) {
    this.users = users;
  }

  render() {
    const listElement = document.createElement('ul');
    this.users.forEach(user => {
      const listItem = document.createElement('li');
      listItem.textContent = user;

      // adiciona um listener de clique para cada item
      listItem.addEventListener('click', () => {
        alert(`User clicked: ${user}`);
      });

      listElement.appendChild(listItem);
    });

    document.body.appendChild(listElement);
  }

  destroy() {
    // Evite descartar o elemento sem remover seus listeners (vazamento)
    const listElement = document.querySelector('ul');
    if (listElement) {
      document.body.removeChild(listElement);
    }
  }
}

// exemplo de uso
const userList = new UserList(['Alice', 'Bob', 'Charlie']);
userList.render();

// após algum tempo, remove o componente, mas o listener não é removido
setTimeout(() => {
  userList.destroy();
}, 5000);
```

#### solução
```typescript
class UserList {
  constructor(public users: string[]) {}

  render() {
    const listElement = document.createElement('ul');
    this.users.forEach(user => {
      const listItem = document.createElement('li');
      listItem.textContent = user;

      // Adiciona o listener de clique
      const handleClick = () => {
        alert(`User clicked: ${user}`);
      };
      listItem.addEventListener('click', handleClick);

      // Guarde a referência do listener para removê-lo depois
      listItem.dataset.listener = 'true';

      listElement.appendChild(listItem);
    });

    document.body.appendChild(listElement);
  }

  destroy() {
    const listElement = document.querySelector('ul');
    if (!listElement) {
      return;
    }
    listElement.querySelectorAll('li').forEach(item => {
        // Remova os listeners antes de descartar o elemento
      item.removeEventListener('click', () => {});
    });
    document.body.removeChild(listElement);
  }
}

// exemplo de uso
const userList = new UserList(['Alice', 'Bob', 'Charlie']);
userList.render();

// Após algum tempo, remove o componente e o listener
setTimeout(() => {
  userList.destroy();
}, 5000);
```

## Improper Caching

ocorre quando o processo de cache é implementado de forma inadequada. Caching é uma técnica importante para melhorar o desempenho de sistemas, mas quando feito de maneira errada, pode resultar em problemas como dados desatualizados, uso excessivo de memória, inconsistências de estado ou até degradação do desempenho.
Alguns exemplos comuns de Improper Caching incluem:
Cache sem expiração: O cache é armazenado indefinidamente sem uma estratégia de expiração, resultando em dados desatualizados.
Cache excessivo: Caches sendo criados para dados que não precisam ser armazenados em cache, levando ao uso excessivo de memória.
Cache ineficiente: Usar o cache para dados que não trazem um ganho real de desempenho.
Cache inconsistente: Dados no cache que não são sincronizados com o banco de dados ou outras fontes de dados, resultando em informações desatualizadas ou inconsistentes.

#### problema
```typescript
class UserService {
    private cache: { [key: string]: string } = {};

    // Evite cache sem expiração: serve dados desatualizados
    getUserName(userId: string): string {
        if (this.cache[userId]) {
            return this.cache[userId]; // se no cache, retorna imediatamente
        }
        const userName = this.getUserNameFromDB(userId); // consulta DB
        this.cache[userId] = userName; // armazena em cache

        return userName;
    }

    private getUserNameFromDB(userId: string): string { // simulando DB
        ...
    }
}

// exemplo de uso
const userService = new UserService();
console.log(userService.getUserName('1')); // chama o banco de dados
console.log(userService.getUserName('1')); // retorna do cache
```

#### solução
```typescript
class CacheEntry {
    constructor(public value: string, public timestamp: number) {}
}

class UserService {
    private cache: { [key: string]: CacheEntry } = {};
    private cacheExpirationTime: number = 60000; // 1 minuto

    // Use cache com tempo de expiração
    getUserName(userId: string): string {
        const currentTime = Date.now();

        // Sirva do cache apenas dentro do tempo de expiração
        if (this.cache[userId] && currentTime - this.cache[userId].timestamp < this.cacheExpirationTime) {
            return this.cache[userId].value;
        }

        const userName = this.getUserNameFromDB(userId); // consulta DB
        this.cache[userId] = new CacheEntry(userName, currentTime); // armazena em cache

        return userName;
    }

    private getUserNameFromDB(userId: string): string { // simulando DB
        return `User_${userId}`;
    }
}

// exemplo de uso
const userService = new UserService();
console.log(userService.getUserName('1')); // chama o banco de dados
// retorna do cache (dentro de 30s)
setTimeout(() => console.log(userService.getUserName('1')), 30000);
// chama o banco de dados (expirou o cache)
setTimeout(() => console.log(userService.getUserName('1')), 70000);
```

## Blocking Calls

Ocorre quando uma chamada ao sistema (geralmente I/O, como uma requisição de rede, leitura de arquivo ou consulta a banco de dados) bloqueia o fluxo de execução do programa. Isso pode resultar em um desempenho ruim, já que o processo fica "parado" esperando a resposta de uma operação, em vez de continuar com outras tarefas enquanto espera.
Esse problema é comum quando o código faz chamadas síncronas a operações que podem levar um tempo considerável, como ler arquivos grandes ou aguardar uma resposta de rede. Isso torna a aplicação mais lenta e menos responsiva, principalmente em sistemas que lidam com muitos usuários ou operações simultâneas.

#### problema
```typescript
class DataService {
    private fetchDataFromAPI(): Promise<string> {
        return new Promise((resolve) => 
           // simula requisição de API que leva 2 segundos
           setTimeout(() => resolve('Data from API'), 2000)
        );
    }

    // Evite aguardar (await) cedo demais e bloquear o fluxo
    async processData(): Promise<Data> {
        const data = await this.fetchDataFromAPI(); // Evite aguardar a resposta antes de iniciar outro trabalho
```

... // realiza outras ações, mas precisa esperar o retorno do data

```typescript
        return data;
    }
}

// exemplo de uso
const service = new DataService();
// Evite bloquear a execução esperando a API
const data = await service.processData();
console.log('After processData');
```

#### solução
```typescript
class DataService {
    private fetchDataFromAPI(): Promise<string> {
        return new Promise((resolve) => 
           setTimeout(() => resolve('Data from API'), 2000);
        );
    }

    async processData(): Promise<void> {
        // Inicie a operação sem bloquear o fluxo
        const dataPromise = this.fetchDataFromAPI(); // Inicie a requisição sem bloquear
```

... // realiza outras ações enquando o "dataPromise" é executado

```typescript
        const data = await dataPromise; 
        return data;
    }
}

const service = new DataService();
service.processData(); // Use chamadas não bloqueantes para liberar o fluxo
console.log('After processData'); // Essa linha agora é executada antes do término da requisição
```

## Unnecessary Threading

Ocorre quando o uso de threads ou concorrência (multi-threading) é implementado sem necessidade. Isso acontece quando o problema que está sendo resolvido não requer múltiplas threads, mas mesmo assim, threads são utilizadas, o que pode levar a um aumento de complexidade, consumo desnecessário de recursos e até pior desempenho.
O uso de threading é uma técnica importante quando precisamos realizar tarefas que podem ser paralelizadas para melhorar a performance, mas quando usado sem justificativa, pode resultar em:
Maior complexidade: O gerenciamento de threads aumenta a complexidade do código e pode introduzir erros como condições de corrida, deadlocks e outros problemas difíceis de depurar.
Desempenho piorado: Threads adicionais podem adicionar overhead, consumindo mais memória e recursos do sistema sem proporcionar benefícios significativos.
Gestão inadequada de recursos: O gerenciamento de threads pode causar problemas de recursos, como vazamento de memória ou falhas de sincronização.

#### problema
```typescript
class DataProcessor {
    private data: number[];

    constructor(data: number[]) {
        this.data = data;
    }

    // Evite concorrência (Promise) onde o trabalho é síncrono
    processData(): void {
        new Promise((resolve, reject) => {
            const processedData = this.data.map(num => num * 2);
            resolve(processedData);
        }).then(processedData => {
            console.log(processedData);
        });
    }
}

// exemplo de uso
const processor = new DataProcessor([1, 2, 3, 4, 5]);
processor.processData(); // Evite criar uma promessa desnecessária
```

#### solução
```typescript
class DataProcessor {
    constructor(private data: number[]) {}

    processData(): void {
        // Faça o trabalho síncrono diretamente, sem Promise
        const processedData = this.data.map(num => num * 2);
        console.log(processedData);
    }
}

// exemplo de uso
const processor = new DataProcessor([1, 2, 3, 4, 5]);
processor.processData();
```

## Improper Synchronization

Ocorre quando múltiplas operações que alteram o estado compartilhado entre threads ou processos não são devidamente sincronizadas. Isso pode levar a condições de corrida (race conditions), onde o comportamento do programa depende da ordem em que as threads ou processos são executados, gerando resultados inesperados ou errôneos.
Em ambientes de execução paralela ou concorrente, é essencial garantir que apenas uma thread/processo acesse ou modifique o estado compartilhado de cada vez, para evitar conflitos.

#### problema
```typescript
class SharedList {
  private list: number[] = [];

  addToList(value: number) {
    const currentList = this.list;
    setTimeout(() => { // Evite operar sobre estado compartilhado sem sincronizar
      currentList.push(value);  // Evite escritas concorrentes sem controle (race condition)
    }, Math.random() * 100);
  }

  getList(): number[] {
    return this.list;
  }
}

// exemplo de uso
const sharedList = new SharedList();
// simulação de concorrência: duas funções tentando adicionar à lista simultaneamente
sharedList.addToList(1);
sharedList.addToList(2);

setTimeout(() => {
  // esperado: [1, 2], mas pode ser incorreto
  console.log(sharedList.getList());
}, 200);
```

#### solução
```typescript
class SharedList {
  private list: number[] = [];
  private lock: Promise<void> = Promise.resolve();

  addToList(value: number) {
    // Use um lock para serializar o acesso ao estado compartilhado
    this.lock = this.lock.then(() => {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          this.list.push(value);
          resolve();
        }, Math.random() * 100);
      });
    });
  }

  getList() {
    return this.list;
  }
}

// exemplo de uso
const sharedList = new SharedList();
// simulação de concorrência: agora a adição à lista é sincronizada
sharedList.addToList(1);
sharedList.addToList(2);

setTimeout(() => {
  console.log(sharedList.getList()); // agora o valor será sempre [1, 2], com sincronização correta
}, 200);
```
