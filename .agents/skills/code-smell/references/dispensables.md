# Dispensables

Código desnecessário, redundante ou que pode ser removido sem prejuízo.

## Smells nesta categoria

- [Duplicate Code](#duplicate-code)
- [Redundant Code](#redundant-code)
- [Dead Code](#dead-code)
- [Lazy Class](#lazy-class)
- [Speculative Generality](#speculative-generality)
- [Unnecessary Abstraction](#unnecessary-abstraction)
- [Unused Variables](#unused-variables)
- [Unused Imports](#unused-imports)
- [Unreachable Code](#unreachable-code)
- [Over-Commenting](#over-commenting)

---

## Duplicate Code

Ocorre quando o mesmo código é repetido em várias partes do sistema. Isso pode ser problemático porque, se houver a necessidade de modificar esse código, será necessário atualizar todas as instâncias em que ele aparece, o que aumenta o risco de erros. Além disso, a duplicação torna o código mais difícil de manter e menos legível. A solução é abstrair a lógica repetida em uma função ou classe reutilizável.

#### problema
```typescript
class Order {
  constructor(
    public orderId: number,
    public product: string,
    public quantity: number,
    public price: number
  ) {}

  calculateTotal(): number {
    return this.quantity * this.price;
  }

  printOrderSummary(): void {
    const total = this.quantity * this.price;  // Evite duplicar a mesma lógica
    console.log(`Pedido #${this.orderId}: ${this.product} - Total: $${total}`);
  }

  sendOrderConfirmation(): void {
    const total = this.quantity * this.price;  // Evite duplicar a mesma lógica
    console.log(`Confirmação de pedido #${this.orderId}: ${this.product} - Total: $${total}`);
  }
}

// exemplo de uso
const order = new Order(101, 'Cadeira Gamer', 1, 500);
order.printOrderSummary();
order.sendOrderConfirmation();
```

#### solução
```typescript

class Order {
  constructor(
    public orderId: number,
    public product: string,
    public quantity: number,
    public price: number
  ) {}

  private calculateTotal(): number {
    return this.quantity * this.price;
  }

  printOrderSummary(): void {
    const total = this.calculateTotal();  // Extraia a lógica para um método reutilizável
    console.log(`Pedido #${this.orderId}: ${this.product} - Total: $${total}`);
  }

  sendOrderConfirmation(): void {
    const total = this.calculateTotal();  // Extraia a lógica para um método reutilizável
    console.log(`Confirmação de pedido #${this.orderId}: ${this.product} - Total: $${total}`);
  }
}

// exemplo de uso
const order = new Order(101, 'Cadeira Gamer', 1, 500);
order.printOrderSummary();
order.sendOrderConfirmation();
```

## Redundant Code

_Também conhecido como: Duplicate Code, Redundant Variables._

Ocorre quando o mesmo código é repetido em diferentes locais ou quando a variável é repetida dentro e fora do construtor sem nenhum tratamento ou regra de negócio . Isso aumenta a complexidade do sistema e torna a manutenção mais difícil, já que qualquer mudança em um desses trechos de código precisará ser refletida em todos os outros lugares onde a duplicação ocorre. Isso pode resultar em erros e maior esforço de manutenção.ocorre quando o mesmo código é repetido em diferentes locais. Isso aumenta a complexidade do sistema e torna a manutenção mais difícil, já que qualquer mudança em um desses trechos de código precisará ser refletida em todos os outros lugares onde a duplicação ocorre. Isso pode resultar em erros e maior esforço de manutenção.

#### problema A
```typescript
class Project {
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  budget: number;
  clientName: string;
  clientEmail: string;
  manager: string;
  status: string;
  teamMembers: string[];

  constructor(
    name: string,
    description: string,
    startDate: Date,
    endDate: Date,
    budget: number,
    clientName: string,
    clientEmail: string,
    manager: string,
    status: string,
    teamMembers: string[]
  ) {
    this.name = name;                // Evite reatribuição redundante de parâmetros
    this.description = description;  // Evite reatribuição redundante de parâmetros
    this.startDate = startDate;      // Evite reatribuição redundante de parâmetros
    this.endDate = endDate;          // Evite reatribuição redundante de parâmetros
    this.budget = budget;            // Evite reatribuição redundante de parâmetros
    this.clientName = clientName;    // Evite reatribuição redundante de parâmetros
    this.clientEmail = clientEmail;  // Evite reatribuição redundante de parâmetros
    this.manager= manager;  // Evite reatribuição redundante de parâmetros
    this.status = status;            // Evite reatribuição redundante de parâmetros
    this.teamMembers = teamMembers;  // Evite reatribuição redundante de parâmetros
  }

  ...
}
```

#### solução A
```typescript
class Project {
  constructor(
    public name: string,
    public description: string,
    public startDate: Date,
    public endDate: Date,
    public budget: number,
    public clientName: string,
    public clientEmail: string,
    public projectManager: string,
    public status: string,
    public teamMembers: string[]
  ) {}

  ...
}
```

#### problema B
```typescript
class Person {
  constructor(public name: string, public birthDate: Date) {}

  calculateAge() { // Evite repetir a mesma lógica em classes diferentes
    let age = new Date().today.getFullYear() - birthDate.getFullYear();
    ...
    return age;
  }
}

class Animal {
  constructor(public species: string, public birthDate: Date) {}

  calculateAge() { // Evite repetir a mesma lógica em classes diferentes
    let age = new Date().today.getFullYear() - birthDate.getFullYear();
    ...
    return age;
  }
}
```

#### solução B
```typescript
// Extraia a lógica comum para uma superclasse ou utilitário
class LifeSpan {
  protected calculateAge(birthDate: Date): number {
    let age = new Date().today.getFullYear() - birthDate.getFullYear();
    ...
    return age;
  }
}

class Person extends LifeSpan {
  constructor(public name: string, public birthDate: Date) {}

  get age() {
    return this.calculateAge(this.birthDate);
  }
}

class Animal extends LifeSpan {
  constructor(public name: string, public species: string, public birthDate: Date) {}

  get age() {
    return this.calculateAge(this.birthDate);
  }
}
```

## Dead Code

Refere-se a trechos de código que nunca são executados, ou seja, são totalmente inúteis. Isso pode ocorrer quando funções, métodos, variáveis ou classes são criados, mas nunca são utilizados ou chamadas em nenhum lugar do programa. O código morto pode gerar confusão, aumentar o tamanho do código e dificultar a manutenção, pois pode fazer parecer que há mais funcionalidade do que realmente existe.

#### problema
```typescript
class ShoppingCart {
  private items: string[] = [];

  addItem(item: string): void {
    this.items.push(item);
  }

  private printReceipt(): void { ... }

  private unusedMethod(): void { ... } // Evite manter métodos que nunca são chamados

  private checkInStock(): void { ... } // Evite manter métodos que nunca são chamados

  checkout(): void {
    this.printReceipt();
  }
}

// exemplo de uso
const cart = new ShoppingCart();
cart.addItem('Camiseta');
cart.checkout();
```

#### solução
```typescript
class ShoppingCart {
  private items: string[] = [];

  addItem(item: string): void {
    this.items.push(item);
  }

  private printReceipt(): void { ... }

  checkout(): void {
    this.printReceipt();
  }
}

// exemplo de uso
const cart = new ShoppingCart();
cart.addItem('Camiseta');
cart.checkout();
```

## Lazy Class

Ocorre quando uma classe tem tão pouca responsabilidade ou funcionalidade que não justifica sua existência. Ou seja, ela não faz nada de útil ou sua funcionalidade poderia ser facilmente incorporada em outra classe. Esse code smell pode indicar que uma classe foi criada de forma excessiva, fragmentando o código em unidades muito pequenas e desnecessárias.

#### problema
```typescript
class Address {

  constructor(
    private street: string, 
    private zip: string, 
    ...
  ) {}

  // getters and setters 
  ...
}
```

#### solução
```typescript
class Address {

  constructor(
    private street: string = '',
    private zip: string = '',
    ...
  ) {
    this.setZip(this.zip); // Dê responsabilidade real à classe (validação)
  }

  private validateZip(): boolean {
    const zipPattern = /^\d{5}-\d{4}$/;
    return zipPattern.test(this.zip);
  }

  getFullAddress(): string { // Dê comportamento útil à classe (endereço completo)
    return `${this.street}, ${this.city}, ${this.state}, ${this.zip}`;
  }

  setZip(value: string): void {
    this.zip = this.validateZip() ? this.zip : '';
  }

  // getters and setters 
  ...
}
```

## Speculative Generality

Ocorre quando o código é projetado para um cenário que ainda não existe, ou seja, é excessivamente generalizado e projetado com base em suposições de futuras extensões que talvez nunca ocorram. Isso pode resultar em complexidade desnecessária, já que o código é mais genérico do que o necessário no momento. O problema é que a tentativa de prever o futuro frequentemente leva a abstrações que não são usadas, tornando o código mais difícil de entender e manter.

#### problema
```typescript
class PaymentProcessor {
  constructor(public paymentMethod: string) {}

  processPayment(amount: number): void {
    if (this.paymentMethod === 'CreditCard') {
      this.processCreditCardPayment(amount);
      return;
    }

    if (this.paymentMethod === 'PayPal') { // Evite criar ramos para casos que ainda não existem
      this.processPayPalPayment(amount);
      return;
    }

    if (this.paymentMethod === 'BankTransfer') { // Evite criar ramos para casos que ainda não existem
      this.processBankTransferPayment(amount);
      return;
    }

    console.log('Método de pagamento não suportado');
  }

  private processCreditCardPayment(amount: number): void { ... }

  private processPayPalPayment(amount: number): void { ... }

  private processBankTransferPayment(amount: number): void { ... }
}

// exemplo de uso
const paymentProcessor = new PaymentProcessor('CreditCard');
paymentProcessor.processPayment(100);
```

#### solução
```typescript
class PaymentProcessor {
  constructor(public paymentMethod: string) {}

  // Implemente apenas o caso que existe hoje
  processCreditCardPayment(amount: number): void { ... }
}

// exemplo de uso
const paymentProcessor = new PaymentProcessor();
paymentProcessor.processCreditCardPayment(100);
```

## Unnecessary Abstraction

Ocorre quando um sistema ou classe possui abstrações que não são necessárias, ou seja, quando um nível extra de complexidade é introduzido sem trazer valor, resultando em um design mais difícil de entender e manter. Isso geralmente acontece quando você cria classes, interfaces ou métodos para representar algo simples demais, ou quando as abstrações são excessivas para o que está sendo feito.

#### problema
```typescript
// Evite abstrações que não agregam valor
class Engine {
  public start(): void {
    console.log("Engine started");
  }

  public stop(): void {
    console.log("Engine stopped");
  }
}

class Car {
  private engine: Engine;

  constructor(engine: Engine) {
    this.engine = engine;
  }

  public startCar(): void {
    this.engine.start();
  }

  public stopCar(): void {
    this.engine.stop();
  }
}

// exemplo de uso
const engine = new Engine();
const car = new Car(engine);
car.startCar();
car.stopCar();
```

#### solução
```typescript
// Mantenha apenas as abstrações que agregam valor
class Car {
  public start(): void {
    console.log("Car started");
  }

  public stop(): void {
    console.log("Car stopped");
  }
}

// exemplo de uso
const car = new Car();
car.start();
car.stop();
```

## Unused Variables

Ocorre quando variáveis são declaradas no código, mas nunca são usadas. Isso pode ser um indicador de código mal projetado, confuso ou deixado após uma alteração incompleta. Remover variáveis não utilizadas melhora a legibilidade e evita confusões desnecessárias.
Sem exemplos de código.

## Unused Imports

Ocorre quando módulos, bibliotecas ou funções são importados no código, mas nunca são utilizados. Isso pode acontecer durante o desenvolvimento, quando as dependências são adicionadas, mas depois não são usadas, ou quando o código é refatorado e as importações antigas não são removidas.

#### problema
```typescript
import { isEmpty } from 'lodash';  // Evite importar o que não é usado
import { format } from 'date-fns';  // Evite importar o que não é usado
import { add } from 'lodash';  // usado no código

function sum(a: number, b: number): number {
  return add(a, b);  // usando a função 'add'
}

// exemplo de uso
sum(5, 3);
```

#### solução
```typescript
import { add } from 'lodash';  // Use apenas as importações necessárias

function sum(a: number, b: number): number {
  return add(a, b);
}

// exemplo de uso
sum(5, 3);
```

## Unreachable Code

Ocorre quando há partes do código que nunca serão executadas devido à lógica existente ou à estrutura de controle. Isso pode resultar de condicionais mal projetadas, loops que nunca terminam, ou código que segue uma declaração de retorno antecipado.

#### problema A
```typescript
processOrder(order: string): void {
  if (!order) {
    return;
  }

  console.log('Order received'); // este código é alcançável
  return;

  console.log('Processing order'); // Evite código após um return: nunca executa
}
```

#### solução A
```typescript
processOrder(order: string): void {
  if (!order) {
    return;
  }

  console.log('Order received');
}
```

#### problema B
```typescript
processData(data: string[]): void {
  let index = 0;

  while (true) { // Evite loops cuja condição nunca muda
    if (index >= data.length) {
      break; // pode quebrar o loop, mas até lá o código abaixo não é alcançado
    }
    index++;
  }

  console.log('Processing complete'); // Evite deixar código que nunca é alcançado
}
```

#### solução B
```typescript
processData(data: string[]): void {
  let index = 0;

  while (index < data.length) { // Garanta uma condição de saída clara
    console.log(data[index]);
    index++;
  }

  console.log('Processing complete');
}
```

## Over-Commenting

Ocorre quando o código é acompanhado de explicações excessivas ou desnecessárias. Isso pode dificultar a leitura e a manutenção, especialmente quando os comentários se tornam desatualizados ou redundantes devido a alterações no código.

#### problema
```typescript
// Evite comentar o óbvio; deixe o código se explicar
export class OrderService {
  // este método calcula o total de um pedido
  calculate(items: { price: number; quantity: number }[]): number {
    let total = 0; // inicializa o total como zero
    for (const item of items) {
      total += item.price * item.quantity; // soma o preço total de cada item
    }
    return total; // retorna o total do pedido
  }

  // este método verifica se o pedido é elegível para frete grátis
  verify(total: number): boolean {
    if (total > 100) {
      return true; // retorna verdadeiro se o total for maior que 100
    } else {
      return false; // retorna falso caso contrário
    }
  }

  // este método formata o valor total como uma string com um símbolo de moeda
  format(total: number): string {
    return `$${total.toFixed(2)}`; // converte o número para string com duas casas decimais
  }
}

// exemplo de uso
const orderService = new OrderService();
const items = [ { price: 20, quantity: 3 }, { price: 50, quantity: 1 } ];
const total = orderService.calculate(items); // calcula o total
orderService.format(total); // exibe o total formatado
orderService.verify(total); // verifica o frete grátis
```

#### solução
```typescript
// Prefira nomes claros a comentários redundantes
export class OrderService {
  calculateTotal(items: { price: number; quantity: number }[]): number {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  isEligibleForFreeShipping(total: number): boolean {
    return total > 100;
  }

  formatTotal(total: number): string {
    return `$${total.toFixed(2)}`;
  }
}

// exemplo de uso
const orderService = new OrderService();
const items = [ { price: 20, quantity: 3 }, { price: 50, quantity: 1 } ];
const total = orderService.calculateTotal(items);
orderService.formatTotal(total);
orderService.isEligibleForFreeShipping(total);
```
