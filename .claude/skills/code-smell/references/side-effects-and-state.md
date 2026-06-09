# Side Effects & State

Funções/métodos que modificam estado inesperado ou expõem detalhes internos.

## Smells nesta categoria

- [Side Effects](#side-effects)
- [Default Parameters Misuse](#default-parameters-misuse)
- [Control Flag](#control-flag)
- [Leaky Abstraction](#leaky-abstraction)

---

## Side Effects

_Também conhecido como: Uncontrolled Side Effects._

Ocorre quando uma função, método ou classe altera variáveis externas, parâmetros passados por referência ou o estado global de maneira imprevisível e descontrolada. Isso pode levar a bugs difíceis de rastrear e viola o princípio de funções puras, onde o comportamento deve ser previsível e sem dependências externas.

#### problema
```typescript
let items: string[] = ['apple', 'banana', 'cherry']; // global default

function addItemToCart(item: string): void {
  items.push(item); // Evite modificar estado global ou externo (side effect)
  console.log(`Item adicionado: ${item}`);
}

addItemToCart('orange');
console.log(items); // ['apple', 'banana', 'cherry', 'orange']
```

#### solução
```typescript
let items: string[] = ['apple', 'banana', 'cherry']; // global default

function addItemToCart(item: string, items: string[]): string[] {
  return  [...items, item]; // Retorne um novo valor em vez de mutar o estado
}

const newItems = addItemToCart('orange', items);
console.log(newItems); // ['apple', 'banana', 'cherry', 'orange']
console.log(items); // ['apple', 'banana', 'cherry'] (estado original)
```

## Default Parameters Misuse

_Também conhecido como: Mutating Parameters._

Similar ao Side Effects mas focado nos parâmetros. Ocorre quando valores padrão são fornecidos para parâmetros de funções, mas esses valores podem criar confusão ou comportamentos inesperados. O uso incorreto de parâmetros padrão pode resultar em valores inesperados, dificultando a leitura e manutenção do código. Isso é particularmente problemático quando os valores padrão são complexos, como objetos ou arrays, ou quando esses valores podem ser alterados acidentalmente durante a execução da função.

#### problema
```typescript
class User {
  constructor(public name: string, age: number){ }
}

updateUser(user: User): void {
  user.age += 1; // Evite modificar o parâmetro recebido
  console.log(`O usuário ${user.name} tem agora ${user.age} anos.`);
}

const user = new User("Alice", 25);
updateUser(user);  // O usuário Alice tem agora 26 anos.
```

#### solução
```typescript
class User {
  constructor(public name: string, public age: number) {}
}

updateUser(user: User): User {
  const updatedUser = new User(user.name, user.age + 1); // Crie uma cópia e modifique a cópia
  console.log(`O usuário ${updatedUser.name} tem agora ${updatedUser.age} anos.`);
  return updatedUser;
}

const user = new User("Alice", 25);
const updatedUser = updateUser(user);  // O usuário Alice tem agora 26 anos.
console.log(user);  // O objeto original não foi alterado: { name: "Alice", age: 25 }
console.log(updatedUser);  // { name: "Alice", age: 26 }
```

## Control Flag

É um padrão de controle de fluxo que usa uma variável booleana para controlar o fluxo de execução em um sistema, geralmente para alternar entre diferentes lógicas ou estados. Embora o uso de uma variável booleana para controle de fluxo não seja um problema em si, o abuso dessa prática pode tornar o código confuso, difícil de entender e difícil de manter.
Esse problema ocorre quando uma variável booleana é usada para controlar o comportamento de diversas lógicas em diferentes pontos do código, criando uma espécie de "bandeira" (flag) para determinar como o código deve se comportar. O uso de um Control Flag pode levar a fluxos de controle complicados, já que o código passa a depender de uma simples variável booleana para mudar sua lógica.

#### problema
```typescript
class OrderProcessor {

  processOrder(orderId: string, isPriority: boolean): void {
    // Evite uma flag booleana para alternar lógicas
    let orderStatus = 'Pending';

    if (isPriority) {
      // lógica de prioridade
      orderStatus = 'Priority Order';
      ...
    } else {
      // lógica normal
      orderStatus = 'Normal Order';
      ...
    }

    console.log(`Order ${orderId} status: ${orderStatus}`);
  }
}
```

#### solução
```typescript
// Use Strategy: uma classe por comportamento, sem flag
interface OrderProcessorStrategy {
  processOrder(orderId: string): void;
}

class PriorityOrderProcessor implements OrderProcessorStrategy {
  processOrder(orderId: string): void {
    console.log(`Processing Priority Order: ${orderId}`);
    ...
  }
}

class NormalOrderProcessor implements OrderProcessorStrategy {
  processOrder(orderId: string): void {
    console.log(`Processing Normal Order: ${orderId}`);
    ...
  }
}

class OrderProcessor {
  constructor(private orderProcessorStrategy: OrderProcessorStrategy) {}

  processOrder(orderId: string): void {
    this.orderProcessorStrategy.processOrder(orderId);
  }
}

// exemplo de uso
const priorityOrderProcessor = new OrderProcessor(new PriorityOrderProcessor());
priorityOrderProcessor.processOrder('1');  // Processing Priority Order: 1

const normalOrderProcessor = new OrderProcessor(new NormalOrderProcessor());
normalOrderProcessor.processOrder('2');  // Processing Normal Order: 2
```

## Leaky Abstraction

Ocorre quando uma abstração (como uma classe ou função que esconde detalhes internos) não esconde completamente a complexidade subjacente ou detalhes de implementação. Em vez disso, esses detalhes "vazam" para o código cliente, fazendo com que o cliente precise entender e lidar com esses detalhes. Isso pode levar a um código mais acoplado e difícil de manter, além de diminuir a flexibilidade da abstração.
O propósito de uma abstração é esconder os detalhes internos, permitindo que o código cliente interaja com uma interface simples e bem definida, sem precisar se preocupar com os detalhes internos de implementação. Quando a abstração "vaza", o código cliente é forçado a lidar com aspectos internos que deveriam ser invisíveis para ele.

#### problema
```typescript
function formatDate(date: Date): string {
  const day = date.getDate();
  const month = date.getMonth() + 1; // Evite vazar detalhes de implementação (getMonth começa em 0)
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}
```

O Vazamento:
Dependência do formato: A função assume que queremos a data no formato DD/MM/AAAA. Se precisarmos mudar para AAAA-MM-DD, teremos que alterar a função.
Conhecimento interno: O código que usa essa função precisa saber que o mês retornado pela função getMonth começa em 0, o que é um detalhe de implementação do objeto Date.

#### solução
```typescript
// Esconda o detalhe atrás de uma abstração estável
interface DateFormatter {
  format(date: Date): string;
}

class BrazilianDateFormatter implements DateFormatter {
  format(date: Date): string {
    return date.toLocaleDateString('pt-BR');
  }
}

class USDateFormatter implements DateFormatter {
  format(date: Date): string {
    return date.toLocaleDateString('en-US');
  }
}

// exemplo de uso
...
displayDate(formatter: DateFormatter, date: Date) {
  const formattedDate = formatter.format(date);
  console.log(formattedDate);
}

const today = new Date();
const brazilianFormatter = new BrazilianDateFormatter();
displayDate(brazilianFormatter, today);
```

**Por que isso é melhor?**

Flexibilidade: Podemos facilmente adicionar novos formatadores para outros locais sem alterar o código que usa a função.
Leiturabilidade: O código fica mais claro, pois a formatação da data está encapsulada em classes específicas.
Manutenibilidade: Se precisarmos mudar a forma como formatamos a data em um determinado local, basta alterar a classe correspondente.

Em resumo:
Ao criar uma interface FormatadorData, abstraímos a lógica de formatação da data, permitindo que o código que utiliza essa interface se preocupe apenas com o resultado final, e não com os detalhes de como a data é formatada.
Outros exemplos de vazamentos de abstração em contextos mais simples:
Função que calcula a área de um círculo: Expor o valor de pi dentro da função, em vez de usar uma constante definida em outro lugar.
Classe que representa um usuário: Expor o ID interno do usuário como uma propriedade pública, em vez de fornecer métodos para obter informações sobre o usuário.
