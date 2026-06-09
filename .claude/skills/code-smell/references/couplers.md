# Couplers

Smells que indicam acoplamento excessivo entre classes/módulos.

## Smells nesta categoria

- [Feature Envy](#feature-envy)
- [Inappropriate Intimacy](#inappropriate-intimacy)
- [Message Chains](#message-chains)
- [Middle Man](#middle-man)
- [Tight Coupling](#tight-coupling)
- [Low Cohesion](#low-cohesion)
- [Hidden Dependencies](#hidden-dependencies)

---

## Feature Envy

ocorre quando um método de uma classe está mais interessado nos dados de outra classe do que nos dados de sua própria classe. Esse comportamento sugere que a responsabilidade do método não está bem definida, e ele deveria estar na outra classe, que tem os dados necessários. Isso pode aumentar o acoplamento entre as classes e diminuir a coesão, o que torna o código mais difícil de entender e manter.

#### problema
```typescript
class Employee {
  constructor(
    public name: string,
    public salary: number,
    public hoursWorked: number
  ) {}

  getSalary(): number { // retornar o salário base
    return this.salary;
  }

  getHoursWorked(): number { // retorna horas trabalhadas
    return this.hoursWorked;
  }
}

class Payroll {
  constructor(private employee: Employee) {}

  // Evite operar sobre dados de outra classe (Feature Envy)
  calculatePay(): number {
    return this.employee.getSalary() * this.employee.getHoursWorked();
  }
}

// exemplo de uso
const employee = new Employee('John Doe', 50, 160);
const payroll = new Payroll(employee);
console.log(`Employee's Pay: $${payroll.calculatePay()}`);
```

#### solução
```typescript
class Employee {
  constructor(
    public name: string,
    public salary: number,
    public hoursWorked: number
  ) {}

  getSalary(): number { // retorna o salário base
    return this.salary;
  }

  getHoursWorked(): number { // retorna as horas trabalhadas
    return this.hoursWorked;
  }

  calculatePay(): number { // Coloque o comportamento na classe dona dos dados
    return this.salary * this.hoursWorked;
  }
}

class Payroll {
  constructor(private employee: Employee) {}

  processPayroll(): number {
    return this.employee.calculatePay();
  }
}

// exemplo de uso
const employee = new Employee('John Doe', 50, 160);
const payroll = new Payroll(employee);
console.log(`Employee's Pay: $${payroll.processPayroll()}`);
```

## Inappropriate Intimacy

Ocorre quando duas classes têm uma relação muito estreita, acessando diretamente os detalhes internos uma da outra de maneira que quebra o encapsulamento. Esse tipo de acoplamento pode tornar o código difícil de manter e evoluir, além de criar dependências desnecessárias.

#### problema
```typescript
class BankAccount {
  private balance: number;

  constructor(initialBalance: number) {
    this.balance = initialBalance;
  }

  getBalance(): number {
    return this.balance;
  }

  setBalance(newBalance: number): void {
    this.balance = newBalance;
  }
}

class Transaction {
  processDeposit(account: BankAccount, amount: number): void {
    // Evite manipular o estado interno de outra classe
    const currentBalance = account.getBalance();
    account.setBalance(currentBalance + amount);
    console.log(`Depósito de ${amount} realizado. Saldo: ${account.getBalance()}`);
  }

  processWithdrawal(account: BankAccount, amount: number): void {
    // Evite manipular o estado interno de outra classe
    const currentBalance = account.getBalance();
    if (currentBalance >= amount) {
      account.setBalance(currentBalance - amount);
      console.log(`Saque de ${amount} realizado. Saldo: ${account.getBalance()}`);
    } else {
      console.log("Saldo insuficiente.");
    }
  }
}

// exemplo de uso
const account = new BankAccount(1000);
const transaction = new Transaction();

transaction.processDeposit(account, 500); // Saldo atual: 1500
transaction.processWithdrawal(account, 200); // Saldo atual: 1300
transaction.processWithdrawal(account, 2000); // Saldo insuficiente.
```

#### solução
```typescript
class BankAccount {
  private balance: number;

  constructor(initialBalance: number) {
    this.balance = initialBalance;
  }

  // Encapsule a regra na classe dona do estado
  deposit(amount: number): void {
    if (amount <= 0) {
      console.log("O valor do depósito deve ser positivo.");
      return;
    }
    this.balance += amount;
    console.log(`Depósito de ${amount} realizado. Saldo: ${this.balance}`);
  }

  withdraw(amount: number): void {
    if (amount <= 0) {
      console.log("O valor do saque deve ser positivo.");
      return;
    }
    if (this.balance >= amount) {
      this.balance -= amount;
      console.log(`Saque de ${amount} realizado. Saldo: ${this.balance}`);
    } else {
      console.log("Saldo insuficiente.");
    }
  }

  getBalance(): number {
    return this.balance;
  }
}

class Transaction {
  processDeposit(account: BankAccount, amount: number): void {
    account.deposit(amount);
  }

  processWithdrawal(account: BankAccount, amount: number): void {
    account.withdraw(amount);
  }
}

// exemplo de uso
const account = new BankAccount(1000);
const transaction = new Transaction();

transaction.processDeposit(account, 500); // Saldo atual: 1500
transaction.processWithdrawal(account, 200); // Saldo atual: 1300
transaction.processWithdrawal(account, 2000); // Saldo insuficiente.
```

## Message Chains

Ocorre quando uma classe depende de várias chamadas de métodos encadeadas para acessar funcionalidades de outra classe. Esse tipo de acoplamento pode tornar o código frágil e difícil de manter, pois mudanças em uma classe intermediária podem quebrar toda a cadeia.

#### problema
```typescript
class Address {
  constructor(public street: string, public city: string) {}
}

class Customer {
  constructor(public name: string, public address: Address) {}
}

class Order {
  constructor(public id: number, public customer: Customer) {}

  printDeliveryAddress(): void {
    // Evite cadeias longas de acesso (a.b.c.d)
    console.log(
      `${this.customer.address.street}, ${this.customer.address.city}`
    );
  }
}

// exemplo de uso
const address = new Address("Rua A, 123", "São Paulo");
const customer = new Customer("João", address);
const order = new Order(1, customer);

order.printDeliveryAddress(); // Saída: Rua A, 123, São Paulo
```

#### solução
```typescript
class Address {
  constructor(private street: string, private city: string) {}

  // Exponha um método que esconde a navegação interna
  getFullAddress(): string {
    return `${this.street}, ${this.city}`;
  }
}

class Customer {
  constructor(private name: string, private address: Address) {}

  getDeliveryAddress(): string {
    return this.address.getFullAddress();
  }
}

class Order {
  constructor(private id: number, private customer: Customer) {}

  printDeliveryAddress(): void {
    console.log(`Endereço: ${this.customer.getDeliveryAddress()}`);
  }
}

// exemplo de uso
const address = new Address("Rua A, 123", "São Paulo");
const customer = new Customer("João", address);
const order = new Order(1, customer);

order.printDeliveryAddress(); // saída: Endereço: Rua A, 123, São Paulo
```

## Middle Man

Ocorre quando uma classe ou método atua como um intermediário desnecessário, simplesmente delegando responsabilidades para outra classe ou método sem adicionar valor significativo. Isso cria uma camada extra de complexidade e dificulta a manutenção do código.

#### problema
```typescript
class Order {
  constructor(
    public id: number,
    public customerName: string,
    public total: number
  ) {}

  getOrderDetails(): string {
    return `Order #${this.id} for ${this.customerName}, Total: $${this.total}`;
  }
}

class OrderManager {
  private order: Order;

  constructor(order: Order) {
    this.order = order;
  }

  // Evite uma classe que só repassa chamadas sem agregar valor
  getOrderDetails(): string {
    return this.order.getOrderDetails();
  }

  getTotal(): number {
    return this.order.total;
  }
}
```

#### solução
```typescript
class Order {
  constructor(
    public id: number,
    public customerName: string,
    public total: number
  ) {}

  getOrderDetails(): string {
    return `Order #${this.id} for ${this.customerName}, Total: $${this.total}`;
  }

  getTotal(): number {
    return this.total;
  }
}

// exemplo de uso
// Acesse a classe diretamente, sem intermediário
const order = new Order(1, 'John Doe', 150.0);
console.log(order.getOrderDetails());
console.log(`Total: $${order.getTotal()}`);
```

## Tight Coupling

_Também conhecido como: High Coupling._

Ocorre quando as classes ou módulos estão fortemente dependentes uns dos outros, ou seja, quando uma classe depende fortemente de outra. Isso torna o código mais difícil de entender, testar e manter, pois mudanças em uma classe podem afetar várias outras. Isso também pode dificultar a reutilização de componentes.

#### problema
```typescript
interface User { ... }

class UserService {
  private database: Database;

  constructor() {
    this.database = new Database(); // Evite instanciar a dependência concreta dentro da classe
  }

  createUser(name: string, email: string): void {
    this.database.save(name, email); // Evite acoplar a classe a uma implementação concreta
  }

  getUser(id: string): User {
    return this.database.get(id); // Evite acoplar a classe a uma implementação concreta
  }
}

class Database {
  save(name: string, email: string): void { ... }
  get(id: string): User { ... }
}
```

#### solução
```typescript
interface User { ... }

interface Database {
  save(user: User): void;
  get(id: string): User;
}

class UserService {
  private database: Database;

  constructor(database: Database) {
    this.database = database; // Use injeção de dependência via abstração (interface)
  }

  createUser(user: User): void {
    this.database.save(user);
  }

  getUser(id: string): User {
    return this.database.get(id);
  }
}

class MongoDatabase implements Database {
  save(user: User): void { ... }
  get(id: string): User { ... }
}

class PostgreSQLDatabase implements Database {
  save(user: User): void { ... }
  get(id: string): User { ... }
}

// exemplo de uso
const mongoDb = new MongoDatabase();
const userService = new UserService(mongoDb);
userService.createUser("Alice", "alice@example.com");

const postgresqlDb = new PostgreSQLDatabase();
const userServicePostgres = new UserService(postgresqlDb);
userServicePostgres.createUser("Bob", "bob@example.com");
```

## Low Cohesion

Ocorre quando uma classe ou módulo tem muitas responsabilidades não relacionadas entre si. Em outras palavras, ela realiza tarefas que não têm uma relação clara entre si, o que torna a classe difícil de entender, testar e manter. Classes com baixa coesão tendem a ter métodos e variáveis que fazem coisas muito diferentes, o que dificulta a reutilização e a modificação de código.
Classes com alta coesão, por outro lado, devem ter um conjunto de responsabilidades que estão intimamente relacionadas entre si. Isso facilita a manutenção, a clareza e os testes, já que cada classe faz uma coisa bem definida.

#### problema
```typescript
class UtilityService {
  // Evite agrupar métodos sem relação entre si
  logToConsole(message: string): void { ... }

  saveToDatabase(data: any): void { ... }

  sendEmail(email: string, subject: string, body: string): void { ... }

  generateReport(data: any): void { ... }
}
```

#### solução
```typescript
// Agrupe na mesma classe apenas responsabilidades relacionadas
class Report { ... }
class Database { ... }

class Logger {
  logToConsole(message: string): void { ... }
}

class DatabaseService {
  saveToDatabase(data: Database): void { ... }
}

class EmailService {
  sendEmail(email: string, subject: string, body: string): void { ... }
}

class ReportService {
  generateReport(data: Report): void { ... }
}
```

## Hidden Dependencies

Ocorre quando uma classe ou módulo depende de outro recurso ou classe de maneira implícita, ou seja, o recurso ou classe necessária não é explicitamente declarada como dependência. Isso dificulta a manutenção, os testes e a compreensão do código, pois fica difícil para um desenvolvedor perceber todas as dependências que uma classe ou módulo realmente possui.
Essa prática pode resultar em código difícil de testar, pois as dependências não estão claramente definidas ou injetadas. Além disso, isso pode levar a efeitos colaterais inesperados se a classe ou módulo dependente for alterado sem que sua dependência seja visível.

#### problema
```typescript
class OrderProcessor {
  processOrder(orderId: string): void {
    // Evite criar dependências ocultas dentro do método
    const inventoryService = new InventoryService();
    const isAvailable = inventoryService.checkAvailability(orderId);

    if (isAvailable) {
      ...
    } 
    ...
  }
}
```

#### solução
```typescript
class InventoryService {
  checkAvailability(orderId: string): boolean {
    // Verificação de disponibilidade (exemplo simples)
    return orderId === 'available';
  }
}

class OrderProcessor {
  private inventoryService: InventoryService;

  // Declare a dependência explicitamente no construtor
  constructor(inventoryService: InventoryService) {
    this.inventoryService = inventoryService;
  }

  processOrder(orderId: string): void {
    const isAvailable = this.inventoryService.checkAvailability(orderId);

    if (isAvailable) {
      ...
    } 
    ...
  }
}
```
