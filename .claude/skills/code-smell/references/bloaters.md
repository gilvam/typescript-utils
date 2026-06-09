# Bloaters

Código, métodos ou classes que cresceram a ponto de serem difíceis de trabalhar.

## Smells nesta categoria

- [Long Method](#long-method)
- [Large Class](#large-class)
- [Long Parameter List](#long-parameter-list)
- [Primitive Obsession](#primitive-obsession)
- [Data Clumps](#data-clumps)
- [Monolithic Class](#monolithic-class)
- [God Object](#god-object)
- [Deep Nesting](#deep-nesting)
- [Excessive Conditionals](#excessive-conditionals)

---

## Long Method

_Também conhecido como: God Function._

ocorre quando um método realiza muitas tarefas ou tem muitas responsabilidades, dificultando a leitura, manutenção e testes do código.
Viola o Princípio de Responsabilidade Única(SRP) no SOLID.

#### problema
```typescript
class OrderProcessor {
  processOrder(order: any): void {
    // Evite acumular muitas responsabilidades em um único método
    // Validação de dados do pedido
    if (!order.customer || !order.items || order.items.length === 0) {
      throw new Error('Invalid order data');
    }

    // Validação do cliente
    if (!order.customer.email || !order.customer.name) {
      throw new Error('Customer data is invalid');
    }

    // Validação de estoque
    for (const item of order.items) {
      const stock = 100; // Mock de estoque
      if (stock < item.quantity) {
        throw new Error(`Insufficient stock for item ${item.name}`);
      }
    }

    // Cálculo do valor total do pedido
    let total = 0;
    for (const item of order.items) {
      total += item.price * item.quantity;
    }

    // Aplicando desconto
    if (order.discount) {
      total *= 1 - order.discount / 100;
    }

    // Processamento de pagamento
    const paymentSuccess = true; // Mock de processamento de pagamento
    if (!paymentSuccess) {
      throw new Error('Payment failed');
    }

    // Atualização de estoque
    for (const item of order.items) {
      // ...
    }

    // Criação de fatura
    ...

    // Envio de e-mail de confirmação
    ...

    // Log do pedido
    ...

    // msg enviada
    ...
  }
}
```

#### solução
```typescript
class Customer {
    constructor(public name: string, public email: string) {}
}

class OrderItem {
    constructor(public name: string, public quantity: number, public price: number) {}
}

class OrderData {
    constructor(public id: string, public customer: Customer, public items: OrderItem[], public paymentMethod: string, public discount: number) {}
}

class OrderProcessor {
  constructor(
    private paymentValidator: PaymentValidator,
    private inventoryManager: InventoryManager,
    private invoiceService: InvoiceService,
    private emailService: EmailService,
    private logger: Logger
  ) {}

  processOrder(order: OrderData): void {
    // Delegue cada etapa a um método com responsabilidade única
    this.validateOrder(order);
    const total = this.calculateTotal(order);
    this.processPayment(order.paymentMethod, total);
    this.updateInventory(order.items);
    this.createInvoice(order, total);
    this.sendEmail(order.customer.email, total);
    this.logOrder(order);
  }

  private validateOrder(order: OrderData): void {
    this.validateCustomer(order.customer);
    this.validateItems(order.items);
  }

  private validateCustomer(customer: Customer): void { ... }
  private validateItems(items: OrderItem[]): void { ... }
  private checkStock(item: OrderItem): number { ... }
  private calculateTotal(order: OrderData): number { ... }
  private processPayment(paymentMethod: string, total: number): void { ... }
  private paymentSuccess(paymentMethod: string, total: number): boolean { ... }
  private updateInventory(items: OrderItem[]): void { ... }
  private updateStock(item: OrderItem): void { ... }
  private createInvoice(order: OrderData, total: number): void { ... }
  private sendEmail(email: string, total: number): void { ... }
  private logOrder(order: OrderData): void { ... }
}
```

## Large Class

Ocorre quando uma classe se torna muito grande e possui muitas responsabilidades. Isso torna o código difícil de entender, manter e testar. Classes grandes geralmente contêm métodos e propriedades que não estão diretamente relacionadas entre si, tornando a classe complexa e difícil de trabalhar.
Viola o princípio de Responsabilidade Única (Single Responsibility Principle) no SOLID
A classe anterior OrderProcessor resolveu um problema do Long Method e agora vamos melhora-la ainda mais criando várias classes cada uma com sua responsabilidade:

#### solução
```typescript
// Distribua as responsabilidades entre classes coesas
class OrderValidator { ... }
class PaymentProcessor { ... }
class InventoryManager { ... }
class InvoiceCreator { ... }
class EmailSender { ... }
class Logger { ... }

class OrderProcessor {
  constructor(
    private validator = new OrderValidator(),
    private paymentProcessor = new PaymentProcessor(),
    private inventoryManager = new InventoryManager(),
    private invoiceCreator = new InvoiceCreator(),
    private emailSender = new EmailSender(),
    private logger = new Logger
  ) {}

  processOrder(order: OrderData): void {
    this.validator.validateOrder(order);
    const total = this.invoiceCreator.calculateTotal(order);
    this.paymentProcessor.processPayment(order.paymentMethod, total);
    this.inventoryManager.updateInventory(order.items);
    const invoice = this.invoiceCreator.createInvoice(order, total);
    this.emailSender.sendEmail(order.customer.email, total);
    this.logger.logOrder(order);
    console.log('Order processed successfully');
  }
}
```

## Long Parameter List

Ocorre quando uma função ou método tem muitos parâmetros. Isso torna o código difícil de entender, pois é necessário lembrar de todos os parâmetros ao usar ou modificar a função. Além disso, quando há muitas variáveis sendo passadas, pode ser um sinal de que a função está fazendo muitas coisas ou de que o design da aplicação não está bem estruturado.

#### problema
```typescript
class OrderProcessor {
  // Evite longas listas de parâmetros: difíceis de lembrar e ordenar
  processOrder(
    orderId: string,
    customerName: string,
    customerEmail: string,
    itemName: string,
    itemQuantity: number,
    itemPrice: number,
    discount: number,
    paymentMethod: string,
    shippingAddress: string,
    billingAddress: string,
    stock: number,
    ... // mais parametros
  ): void {
    ...
  }
}
```

#### solução
```typescript
// Agrupe parâmetros relacionados em objetos
class Item {
  constructor(
    public name: string,
    public quantity: number,
    public price: number
  ) {}
}

class Address {
  constructor(
    public street: string,
    public city: string,
    public zipCode: string
  ) {}
}

class Customer {
  constructor(
    public name: string,
    public email: string
  ) {}
}

class PaymentDetails {
  constructor(
    public method: string,
    public discount: number
  ) {}
}

class Order {
  constructor(
    public orderId: string,
    public customer: Customer,
    public items: Item[],
    public paymentDetails: PaymentDetails,
    public shippingAddress: Address,
    public billingAddress: Address,
    public stock: number
  ) {}
}

class OrderProcessor {
  processOrder(order: Order): void {
    ...
  }
}
```

## Primitive Obsession

Ocorre quando tipos primitivos (como string, number, boolean) são usados excessivamente para representar conceitos mais complexos. Em vez de utilizar tipos primitivos, é melhor usar classes ou tipos específicos que encapsulam a lógica relacionada e fornecem maior clareza, flexibilidade e segurança para o código.

#### problema
```typescript
class User {
  constructor(
    public name: string,
    public email: string,        // Evite primitivos para conceitos de domínio (Email)
    public phoneNumber: string,  // Evite primitivos para conceitos de domínio (PhoneNumber)
    public age: number
  ) {}

  // Evite validar o primitivo fora de um tipo dedicado
  validateEmail(): boolean {
    return this.email.includes("@");
  }

  // Evite validar o primitivo fora de um tipo dedicado
  validatePhoneNumber(): boolean {
    return this.phoneNumber.length === 10;
  }
}
```

#### solução
```typescript
class Email {
  constructor(private email: string) {
    if (!this.validateEmail()) {
      throw new Error("Invalid email address.");
    }
  }

  private validateEmail(): boolean {
    return this.email.includes("@");
  }

  public getValue(): string {
    return this.email;
  }
}

class PhoneNumber {
  constructor(private phoneNumber: string) {
    if (!this.validatePhoneNumber()) {
      throw new Error("Invalid phone number.");
    }
  }

  private validatePhoneNumber(): boolean {
    return this.phoneNumber.length === 10;
  }

  public getValue(): string {
    return this.phoneNumber;
  }
}

class User {
  constructor(
    public name: string,
    private email: Email,              // Use um tipo dedicado que encapsula a validação
    private phoneNumber: PhoneNumber,  // Use um tipo dedicado que encapsula a validação
    public age: number
  ) {}

  public getEmail(): string {
    return this.email.getValue();
  }

  public getPhoneNumber(): string {
    return this.phoneNumber.getValue();
  }
}

// exemplo de uso
const email = new Email("john.doe@example.com");
const phoneNumber = new PhoneNumber("1234567890");
const user = new User("John Doe", email, phoneNumber, 30);
```

## Data Clumps

Ocorre quando um grupo de dados relacionados é frequentemente passado juntos entre diferentes métodos ou classes. Isso pode indicar que esses dados pertencem a um único objeto ou entidade, mas estão sendo tratados de maneira separada e não encapsulada.

#### problema
```typescript
class Order {
  constructor(
    public productName: string, // Evite passar o mesmo grupo de dados solto
    public quantity: number,
    public price: number
  ) {}

  calculateTotal(): number {
    return this.quantity * this.price;
  }

  printInvoice(): void {
    ...
  }
}

class OrderService {
  // Evite passar o mesmo grupo de dados solto
  processOrder(productName: string, quantity: number, price: number): void {
    // Evite passar o mesmo grupo de dados solto
    const order = new Order(productName, quantity, price);
    order.printInvoice();
  }
}

// exemplo de uso
const orderService = new OrderService();
orderService.processOrder("Laptop", 1, 1500);
```

#### solução
```typescript
class Product { // Use uma classe que encapsula o grupo de dados (nome, quantidade, preço)
  constructor(
    public name: string,
    public quantity: number,
    public price: number
  ) {}

  calculateTotal(): number {
    return this.quantity * this.price;
  }
}

class Order {
  constructor(public product: Product) {}

  printInvoice(): void {
    ...
  }
}

class OrderService {
  processOrder(product: Product): void {
    const order = new Order(product);
    order.printInvoice();
  }
}

// exemplo de uso
const product = new Product("Laptop", 1, 1500);
const orderService = new OrderService();
orderService.processOrder(product);
```

## Monolithic Class

Ocorre quando uma única classe assume muitas responsabilidades ou funções que deveriam estar distribuídas entre várias classes menores. Essa abordagem vai contra o princípio da responsabilidade única do SOLID e torna o código difícil de entender, testar e manter.

#### problema
```typescript
// Evite uma classe que acumula responsabilidades de vários domínios
class OrderManager {
  addProduct() { ... }
  removeProduct() { ... }
  calculateTotal() { ... }
  applyDiscount() { ... }
  processPayment() { ... }
  sendInvoice() { ... }
  trackShipment() { ... }
  notifyCustomer() { ... }
}
```

#### solução
```typescript
// Separe em classes coesas, uma responsabilidade por classe
class ProductManager {
  addProduct() { ... }
  removeProduct() { ... }
}

class PaymentProcessor {
  calculateTotal() { ... }
  applyDiscount() { ... }
  processPayment() { ... }
}

class NotificationService {
  sendInvoice() { ... }
  notifyCustomer() { ... }
}

class ShipmentTracker {
  trackShipment() { ... }
}
```

## God Object

_Também conhecido como: Poor Separation of Concerns._

Ocorre quando uma classe ou objeto assume responsabilidades demais, tornando-se excessivamente complexo e difícil de manter. Este "objeto deus" concentra muitas responsabilidades e, frequentemente, manipula dados de várias outras partes do sistema. Esse tipo de design viola os princípios de coesão e separação de responsabilidades, tornando o código mais difícil de entender e testar.

#### problema
```typescript
// Evite um objeto que centraliza dados e regras de todo o sistema
class System {
  users: any[];
  orders: any[];
  inventory: any[];

  constructor() {
    this.users = [];
    this.orders = [];
    this.inventory = [];
  }

  addUser(user: any) {
    this.users.push(user);
  }

  placeOrder(order: any) {
    this.orders.push(order);
  }

  manageInventory(item: any) {
    this.inventory.push(item);
  }
}

```

#### solução
```typescript

// Separe responsabilidades em serviços coesos
class User { ... }
class Order { ... }
class InventoryItem { ... }

class UserService {
  private users: User[] = [];

  addUser(user: User): void {
    this.users.push(user);
  }
}

class OrderService {
  private orders: Order[] = [];

  placeOrder(order: Order): void {
    this.orders.push(order);
  }
}

class InventoryService {
  private inventory: InventoryItem[] = [];

  manageInventory(item: InventoryItem): void {
    this.inventory.push(item);
  }
}

class System {
  constructor(
    public userService: UserService,
    public orderService: OrderService,
    public inventoryService: InventoryService
  ) {}
}
```

## Deep Nesting

Ocorre quando o código possui muitos níveis de aninhamento (como loops dentro de loops, condicionais dentro de condicionais, etc.). Isso dificulta a leitura e compreensão do código, além de aumentar a complexidade e o risco de erros. O aninhamento profundo pode ser um sinal de que o código está tentando fazer muitas coisas ao mesmo tempo ou que a lógica pode ser simplificada.
...

#### problema
```typescript
processOrder(order: IOrder): string {
  // Evite aninhar muitos níveis de condicionais
  if (order.status === 'pending') {
    if (order.paymentStatus === 'paid') {
      if (order.items && order.items.length > 0) {
        if (order.shippingAddress) {
          return `Order ${order.id} is ready to ship to ${order.shippingAddress}`;
        } else {
          return 'Shipping address is missing';
        }
      } else {
        return 'Order items are missing';
      }
    } else {
      return 'Payment not completed';
    }
  } else {
    return 'Order is not pending';
  }
}
...

// exemplo de uso
const order = {
  id: 123,
  status: 'pending',
  paymentStatus: 'paid',
  items: [{ id: 1, name: 'Laptop' }],
  shippingAddress: '123 Main St'
};
processOrder(order);

```

#### solução
```typescript

function validateOrder(order: IOrder): string {
  // Use guard clauses (early returns) para achatar o aninhamento
  if (order.status !== 'pending') {
    return 'Order is not pending';
  }
  if (order.paymentStatus !== 'paid') {
    return 'Payment not completed';
  }
  if (!order.items || order.items.length === 0) { 
    return 'Order items are missing';
  }
  if (!order.shippingAddress) {
    return 'Shipping address is missing';
  }
  return '';
}

function processOrder(order: IOrder): string {
  const validationError = validateOrder(order);
  if (validationError) {
    return validationError;
  }

  return `Order ${order.id} is ready to ship to ${order.shippingAddress}`;
}

// exemplo de uso
const order: IOrder = {
  id: 123,
  status: 'pending',
  paymentStatus: 'paid',
  items: [{ id: 1, name: 'Laptop' }],
  shippingAddress: '123 Main St'
};

console.log(processOrder(order));
```

A solução oferecida apenas remove o Deep Nesting mas ainda continúa com outro problema de várias condicionais.

## Excessive Conditionals

_Também conhecido como: Too Many Conditionals, Excessive Branching._

Ocorre quando um código possui uma grande quantidade de declarações condicionais (if, else if, switch, etc.). Isso torna o código difícil de ler, manter e testar. Frequentemente, esse problema pode ser resolvido ao substituir condicionais por abordagens mais elegantes, como o uso de polimorfismo, tabelas de busca ou mapeamento de funções.
calculateDiscount(

```typescript
  orderType: string,
  customerType: string,
  orderAmount: number
): number {
  // Evite muitos if/else aninhados por valor ou tipo
  if (orderType === 'regular') {
    if (customerType === 'premium') {
      if (orderAmount > 1000) {
        return orderAmount * 0.2;
      } else {
        return orderAmount * 0.1;
      }
    } else if (customerType === 'regular') {
      if (orderAmount > 1000) {
        return orderAmount * 0.15;
      } else {
        return orderAmount * 0.05;
      }
    }
  } else if (orderType === 'special') {
    if (customerType === 'premium') {
      return orderAmount * 0.25;
    } else if (customerType === 'regular') {
      return orderAmount * 0.2;
    }
  }

  return 0;
}

```typescript

enum OrderType {
  REGULAR = "regular",
  SPECIAL = "special",
}

enum CustomerType {
  PREMIUM = "premium",
  REGULAR = "regular",
}

// Use uma lookup table em vez de condicionais aninhadas
const discountTable: Record<string, (orderAmount: number) => number> = {
  "regular-premium-high": (amount: number) => amount * 0.2,
  "regular-premium-low": (amount: number) => amount * 0.1,
  "regular-regular-high": (amount: number) => amount * 0.15,
  "regular-regular-low": (amount: number) => amount * 0.05,
  "special-premium": (amount: number) => amount * 0.25,
  "special-regular": (amount: number) => amount * 0.2,
};

getKey(
  orderType: OrderType,
  customerType: CustomerType,
  orderAmount: number
): string {
  const level = orderType === OrderType.REGULAR && orderAmount > 1000 ? "high" : "low";
  return `${orderType}-${customerType}-${level}`;
}

calculateDiscount(
  orderType: OrderType,
  customerType: CustomerType,
  orderAmount: number
): number {
  const key = getKey(orderType, customerType, orderAmount);
  return discountTable[key]?.(orderAmount) ?? 0;
}

// exemplos de uso:
calculateDiscount(OrderType.REGULAR, CustomerType.PREMIUM, 1500); // 300
calculateDiscount(OrderType.SPECIAL, CustomerType.REGULAR, 800);  // 160
calculateDiscount(OrderType.REGULAR, CustomerType.REGULAR, 500);  // 25
calculateDiscount(OrderType.REGULAR, CustomerType.PREMIUM, 500);  // 50
```
