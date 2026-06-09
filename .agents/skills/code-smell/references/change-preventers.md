# Change Preventers

Smells que fazem com que uma única mudança força modificações em muitos pontos do código.

## Smells nesta categoria

- [Divergent Change](#divergent-change)
- [Shotgun Surgery](#shotgun-surgery)
- [Parallel Inheritance Hierarchies](#parallel-inheritance-hierarchies)
- [Circular Dependencies](#circular-dependencies)
- [Circular Logic](#circular-logic)
- [Improper Dependency Management](#improper-dependency-management)

---

## Divergent Change

Ocorre quando uma única classe ou módulo precisa ser alterado por vários motivos diferentes. Isso significa que a classe ou módulo está lidando com responsabilidades múltiplas, violando o Princípio da Responsabilidade Única (SRP) no SOLID. Esse tipo de code smell pode dificultar a manutenção e aumentar o risco de introdução de bugs.

#### problema
```typescript
class CustomerService {
  getCustomerDetails(customerId: string): string {
    ...
    return `Detalhes do cliente para ${customerId}`;
  }

  updateCustomerDetails(customerId: string, details: any): void {
   ...
  }

  // Evite responsabilidades de outro domínio nesta classe (processar pedido)
  processOrder(orderId: string): void {
    ...
  }

  // Evite responsabilidades de outro domínio nesta classe (envio de notificação)
  sendNotification(customerId: string, message: string): void {
    ...
  }
}

// exemplo de uso
const service = new CustomerService();
service.getCustomerDetails("123");
service.updateCustomerDetails("123", { name: "João Silva" });
service.processOrder("456");
service.sendNotification("123", "Seu pedido foi enviado!");
```

#### solução
```typescript
// Separe cada motivo de mudança em sua própria classe
class CustomerDetails { ... }

class CustomerService {
  getCustomerDetails(customerId: string): string {
    ...
  }

  updateCustomerDetails(customerId: string, details: CustomerDetails): void {
    ...
  }
}

class OrderService {
  processOrder(orderId: string): void {
    ...
  }
}

class NotificationService {
  sendNotification(customerId: string, message: string): void {
    ...
  }
}

// exemplo de uso
const customerService = new CustomerService();
customerService.getCustomerDetails("123");
customerService.updateCustomerDetails("123", { name: "João Silva" });

const orderService = new OrderService();
orderService.processOrder("456");

const notificationService = new NotificationService();
notificationService.sendNotification("123", "Seu pedido foi enviado!");
```

## Shotgun Surgery

Ocorre quando uma única mudança no sistema exige que você modifique várias classes ou módulos ao mesmo tempo. Isso indica que a lógica está espalhada, violando o princípio de alta coesão e dificultando a manutenção do código.

#### problema
```typescript
class Order {
  calculateOrderValue(baseValue: number): number {
    const tax = baseValue * 0.1; // Evite espalhar a mesma regra (imposto 10%) por várias classes
    return baseValue + tax;
  }
}

class Invoice {
  generateInvoice(baseValue: number): string {
    const tax = baseValue * 0.1; // Evite espalhar a mesma regra (imposto 10%) por várias classes
    const total = baseValue + tax;
    return `Valor da Fatura: ${total}`;
  }
}

class Report {
  generateReport(baseValue: number): string {
    const tax = baseValue * 0.1; // Evite espalhar a mesma regra (imposto 10%) por várias classes
    const total = baseValue + tax;
    return `Relatório: Total com imposto: ${total}`;
  }
}

// exemplo de uso
const order = new Order();
console.log(order.calculateOrderValue(100));

const invoice = new Invoice();
console.log(invoice.generateInvoice(100));

const report = new Report();
console.log(report.generateReport(100));
```

#### solução
```typescript
class TaxCalculator {
  private static readonly TAX_RATE = 0.1; // Centralize a regra em um único ponto

  static calculateTax(baseValue: number): number {
    return baseValue * this.TAX_RATE;
  }
}

class Order {
  calculateOrderValue(baseValue: number): number {
    const tax = TaxCalculator.calculateTax(baseValue);
    return baseValue + tax;
  }
}

class Invoice {
  generateInvoice(baseValue: number): string {
    const tax = TaxCalculator.calculateTax(baseValue);
    const total = baseValue + tax;
    return `Valor da Fatura: ${total}`;
  }
}

class Report {
  generateReport(baseValue: number): string {
    const tax = TaxCalculator.calculateTax(baseValue);
    const total = baseValue + tax;
    return `Relatório: Total com imposto: ${total}`;
  }
}

// exemplo de uso
const order = new Order();
console.log(order.calculateOrderValue(100));

const invoice = new Invoice();
console.log(invoice.generateInvoice(100));

const report = new Report();
console.log(report.generateReport(100));
```

## Parallel Inheritance Hierarchies

Ocorre quando duas ou mais hierarquias de classes crescem juntas, ou seja, para cada classe criada em uma hierarquia, é necessário criar uma classe correspondente em outra. Isso indica um design acoplado e rígido, o que dificulta a manutenção e a evolução do código.

#### problema
```typescript
// Hierarquia 1: Produtos
abstract class Product {
  constructor(public name: string, public price: number) {}
}

class Electronics extends Product {}
class Clothing extends Product {}
class Groceries extends Product {}

// Evite hierarquias paralelas: cada Produto exige um Desconto correspondente
abstract class Discount {
  abstract calculate(product: Product): number;
}

class ElectronicsDiscount extends Discount {
  calculate(product: Electronics): number {
    return product.price * 0.9; // 10%
  }
}

class ClothingDiscount extends Discount {
  calculate(product: Clothing): number {
    return product.price * 0.8; // 20%
  }
}

class GroceriesDiscount extends Discount {
  calculate(product: Groceries): number {
    return product.price; // 0%
  }
}

// exemplo de uso
const electronics = new Electronics("Smartphone", 1000);
const electronicsDiscount = new ElectronicsDiscount();
console.log(electronicsDiscount.calculate(electronics)); // 900

const clothing = new Clothing("Camisa", 50);
const clothingDiscount = new ClothingDiscount();
console.log(clothingDiscount.calculate(clothing)); // 40
```

#### solução
```typescript
// Una as hierarquias: o comportamento vive no próprio produto
abstract class Product {
  constructor(public name: string, public price: number) {}

  abstract calculateDiscount(): number;
}

// Implementações específicas de Produtos
class Electronics extends Product {
  calculateDiscount(): number {
    return this.price * 0.9; // 10%
  }
}

class Clothing extends Product {
  calculateDiscount(): number {
    return this.price * 0.8; // 20%
  }
}

class Groceries extends Product {
  calculateDiscount(): number {
    return this.price; // 0%
  }
}

// exemplo de uso
const electronics = new Electronics("Smartphone", 1000);
console.log(`${electronics.name} | ${electronics.calculateDiscount()}`);

const clothing = new Clothing("Camisa", 50);
console.log(`${clothing.name} | ${clothing.calculateDiscount()}`);

const groceries = new Groceries("Maçã", 5);
console.log(`${groceries.name} | ${groceries.calculateDiscount()}`);
```

## Circular Dependencies

Ocorrem quando dois ou mais módulos (ou classes) dependem diretamente ou indiretamente uns dos outros, criando um ciclo de dependências. Esse tipo de dependência pode tornar o sistema difícil de entender, testar e manter, além de introduzir problemas de performance e dificuldade na inicialização do código. Em muitas linguagens de programação, a presença de dependências circulares pode causar problemas como erros de importação ou loops infinitos.

#### problema
```typescript
class Author {
  private name: string;
  private books: Book[] = [];

  constructor(name: string) {
    this.name = name;
  }

  getName(): string {
    return this.name;
  }

  addBook(book: Book): void {
    this.books.push(book);
  }

  listBooks(): string[] {
    return this.books.map((book) => book.getTitle());
  }
}

class Book {
  private title: string;
  private author: Author;

  constructor(title: string, author: Author) {
    this.title = title;
    this.author = author;
    this.author.addBook(this); // Evite dependência circular: Book conhece Author que conhece Book
  }

  getTitle(): string {
    return this.title;
  }

  getAuthorName(): string {
    return this.author.getName();
  }
}

// exemplo de uso
const author = new Author('J.K. Rowling');
const book = new Book('Harry Potter', author);
console.log(book.getAuthorName()); // J.K. Rowling
console.log(author.listBooks());  // ['Harry Potter']
```

#### solução
```typescript
class Author {
  private name: string;

  constructor(name: string) {
    this.name = name;
  }

  getName(): string {
    return this.name;
  }
}

class Book {
  private title: string;

  constructor(title: string) {
    this.title = title;
  }

  getTitle(): string {
    return this.title;
  }

  getAuthorName(): string {
    return this.author.getName();
  }
}

// Quebre o ciclo com um mediador que conhece ambos os lados
class LibraryService {
  private authorBooksMap: Map<Author, Book[]> = new Map();

  addBook(author: Author, book: Book): void {
    if (!this.authorBooksMap.has(author)) {
      this.authorBooksMap.set(author, []);
    }
    this.authorBooksMap.get(author).push(book);
  }

  getBooksByAuthor(author: Author): string[] {
    return this.authorBooksMap.get(author).map((book) => book.getTitle()) || [];
  }
}

// exemplo de uso
const libraryService = new LibraryService();
const author = new Author('J.K. Rowling');
const book = new Book('Harry Potter', author);

libraryService.addBook(author, book);

console.log(book.getAuthorName()); // J.K. Rowling
console.log(libraryService.getBooksByAuthor(author)); // ['Harry Potter']
```

## Circular Logic

Ocorre quando a lógica de um programa ou função depende de si mesma de maneira redundante ou infinita, criando um ciclo que não permite que o sistema evolua ou termine de maneira adequada. Esse code smell pode resultar em loops infinitos ou em um comportamento inesperado onde a solução de um problema depende de uma condição que só pode ser resolvida após uma outra ser completada, criando um ciclo sem fim.
A principal característica da lógica circular é que ela tende a criar dependências cíclicas, onde uma condição depende de outra que, por sua vez, depende da primeira..

#### problema
```typescript
class BankAccount {
  balance: number;

  constructor(balance: number) {
    this.balance = balance;
  }

  withdraw(amount: number): void {
    if (this.balance < 0) {
      this.balance = this.checkBalance();
    }

    if (this.balance >= amount) {
      this.balance -= amount;
      console.log("Saque realizado com sucesso!");
    } else {
      console.log("Saldo insuficiente.");
    }
  }

  checkBalance(): number {
    // Evite que um método dependa de outro que depende dele de volta
    this.withdraw(0); // Evite a chamada que recria o ciclo
    return this.balance;
  }
}

// exemplo de uso
const account = new BankAccount(100);
account.withdraw(50); // O código entra em um ciclo de chamadas
```

#### solução
```typescript
class BankAccount {
  balance: number;

  constructor(balance: number) {
    this.balance = balance;
  }

  // Mantenha cada método com um fluxo linear, sem recorrer a si mesmo
  withdraw(amount: number): void {
    if (this.balance >= amount) {
      this.balance -= amount;
      console.log("Saque realizado com sucesso!");
      return;
    }

    console.log("Saldo insuficiente.");    
  }

  checkBalance(): number {
    return this.balance;
  }
}

// exemplo de uso
const account = new BankAccount(100);
console.log("Saldo atual:", account.checkBalance()); // "Saldo atual: 100"
account.withdraw(50); // "Saque realizado com sucesso!"
console.log("Saldo atual:", account.checkBalance()); // "Saldo atual: 50"
```

## Improper Dependency Management

ocorre quando um projeto tem dependências mal gerenciadas, o que pode incluir:
Dependências desnecessárias: Quando o projeto inclui pacotes ou bibliotecas que não são utilizados, aumentando o tamanho do projeto e dificultando a manutenção.
Dependências não declaradas: Quando as dependências de um projeto não estão claramente especificadas, o que pode causar problemas ao tentar configurar ou rodar o projeto em outro ambiente.
Dependências desatualizadas: Quando o projeto depende de versões desatualizadas de bibliotecas que podem ter falhas de segurança ou bugs corrigidos em versões mais recentes.
Dependências incorretas: Quando o projeto inclui bibliotecas que não são compatíveis ou que têm versões conflitantes, o que pode resultar em erros de execução.

Problemas principais:
Aumento de complexidade: Dependências desnecessárias tornam o projeto mais pesado e difícil de gerenciar.
Falhas de segurança: Bibliotecas desatualizadas podem conter vulnerabilidades.
Erros de execução: Dependências incompatíveis ou mal gerenciadas podem causar falhas em tempo de execução.
Dificuldade de manutenção: Ao não controlar corretamente as dependências, torna-se difícil saber qual versão de uma biblioteca deve ser usada ou como configurar o projeto corretamente..

#### problema
```typescript
// package.json com dependências desnecessárias e versões conflitantes
{
  "name": "my-app",
  "dependencies": {
    "lodash": "^4.17.21",
    "axios": "^0.21.1",
    "moment": "^2.29.1", // Evite dependências não utilizadas
    "axios": "^0.18.1" // Evite versões conflitantes da mesma dependência
    "example_only": "^0.2.3", // Evite dependências desatualizadas
  }
}
```

#### solução
```typescript
{
  "name": "my-app",
  "dependencies": {
    "lodash": "^4.17.21",
    "axios": "^0.21.1"  // Use uma única versão, atualizada, de cada dependência
  }
}
```
