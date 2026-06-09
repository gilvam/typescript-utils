# Object-Orientation Abusers

Aplicação incompleta ou incorreta dos princípios de orientação a objetos.

## Smells nesta categoria

- [Switch Statements](#switch-statements)
- [Refused Bequest](#refused-bequest)
- [Temporary Field](#temporary-field)
- [Data Class](#data-class)
- [Overuse of Inheritance](#overuse-of-inheritance)
- [Improper Interface Usage](#improper-interface-usage)
- [Too Many Interfaces](#too-many-interfaces)
- [Overloading Constructors](#overloading-constructors)
- [Excessive Overloading](#excessive-overloading)
- [Excessive Getters/Setters](#excessive-getterssetters)
- [Lack of Encapsulation](#lack-of-encapsulation)
- [Incorrect Access Modifiers](#incorrect-access-modifiers)
- [Excessive Type Casting](#excessive-type-casting)

---

## Switch Statements

Ocorre quando usamos declarações switch ou muitos if-else para realizar a lógica baseada em valores ou tipos. Esse padrão pode levar a dificuldades na manutenção, já que adicionar novos casos frequentemente requer modificar o código existente.
Violação do Open-Closed Principle (OCP) no SOLID.

#### problema
```typescript
class DiscountCalculator {
  calculateDiscount(customerType: string, purchaseAmount: number): number {
    // Evite switch/if-else por tipo: viola Open-Closed (OCP)
    switch (customerType) {
      case "Regular":
        return purchaseAmount * 0.05; // 5% de desconto
      case "Premium":
        return purchaseAmount * 0.1; // 10% de desconto
      case "VIP":
        return purchaseAmount * 0.2; // 20% de desconto
      default:
        return 0; // sem desconto
    }
  }
}

// exemplo de uso
const calculator = new DiscountCalculator();
calculator.calculateDiscount("Regular", 1000); // 50
calculator.calculateDiscount("VIP", 2000);     // 400
calculator.calculateDiscount("Unknown", 500);  // 0
```

**Problemas Identificados**

Fácil de Quebrar: Adicionar ou alterar tipos de clientes requer a modificação do método calculateDiscount, potencialmente introduzindo erros.
Baixa Extensibilidade: O código não é extensível sem editar diretamente o método existente.
Violação do Open-Closed Principle: O método não está fechado para modificações, já que novos casos exigem mudanças na lógica interna.

#### solução
```typescript
interface DiscountStrategy { // Use Strategy: uma classe por caso, aberto a extensão (OCP)
  calculate(purchaseAmount: number): number;
}

// estratégias de desconto específicas
class RegularCustomerDiscount implements DiscountStrategy {
  calculate(purchaseAmount: number): number {
    return purchaseAmount * 0.05; // 5% de desconto
  }
}

class PremiumCustomerDiscount implements DiscountStrategy {
  calculate(purchaseAmount: number): number {
    return purchaseAmount * 0.1; // 10% de desconto
  }
}

class VIPCustomerDiscount implements DiscountStrategy {
  calculate(purchaseAmount: number): number {
    return purchaseAmount * 0.2; // 20% de desconto
  }
}

class NoDiscount implements DiscountStrategy {
  calculate(purchaseAmount: number): number {
    return 0; // Sem desconto
  }
}

// classe principal
class DiscountCalculator {
  private strategies: Record<string, DiscountStrategy> = {
    Regular: new RegularCustomerDiscount(),
    Premium: new PremiumCustomerDiscount(),
    VIP: new VIPCustomerDiscount(),
  };

  calculateDiscount(customerType: string, purchaseAmount: number): number {
    const strategy = this.strategies[customerType] || new NoDiscount();
    return strategy.calculate(purchaseAmount);
  }
}

// exemplo de uso
const calculator = new DiscountCalculator();
calculator.calculateDiscount("Regular", 1000); // 50
calculator.calculateDiscount("VIP", 2000);     // 400
calculator.calculateDiscount("Unknown", 500);  // 0
```

**A solução e os Benefícios da Refatoração**

Alta Extensibilidade: Adicionar um novo tipo de cliente requer apenas a criação de uma nova classe que implemente a interface DiscountStrategy.
Baixo Acoplamento: A lógica de desconto está isolada em classes específicas, melhorando a modularidade.
Adesão ao Open-Closed Principle: A classe DiscountCalculator está fechada para modificações, mas aberta para extensões com novas estratégias.

## Refused Bequest

Ocorre quando uma classe herda de uma classe base, mas rejeita (ou não utiliza) partes da funcionalidade herdada. Isso é um sinal de que a herança pode não ser apropriada, indicando que a relação "é-um" entre a classe base e a classe derivada não é válida.
Violação do Princípio de Substituição de Liskov (LSP) no SOLID.

#### problema
```typescript
// classe base
class Animal {
  eat(): void {
    console.log("O animal está comendo.");
  }

  sleep(): void {
    console.log("O animal está dormindo.");
  }

  fly(): void {
    console.log("O animal está voando.");
  }
}

// subclasse
class Dog extends Animal {
  fly(): void {
    throw new Error("Cachorros não podem voar."); // Evite herdar comportamento que a subclasse não suporta (viola LSP)
  }
}

// exemplo de uso
const dog = new Dog();
dog.eat(); // funciona corretamente
dog.fly(); // lança erro: "Cachorros não podem voar."
```

#### solução
```typescript

// Prefira compor habilidades via interfaces a herdar tudo
interface Eater {
  eat(): void;
}

interface Sleeper {
  sleep(): void;
}

interface Flyer {
  fly(): void;
}

// implementações específicas
class BasicEater implements Eater {
  eat(): void {
    console.log("Está comendo.");
  }
}

class BasicSleeper implements Sleeper {
  sleep(): void {
    console.log("Está dormindo.");
  }
}

class BasicFlyer implements Flyer {
  fly(): void {
    console.log("Está voando.");
  }
}

// classes específicas
class Dog implements Eater, Sleeper {
  constructor(
    public eater: Eater = new BasicEater(),
    public sleeper: Sleeper = new BasicSleeper()
  ) {}

  eat(): void {
    this.eater.eat();
  }

  sleep(): void {
    this.sleeper.sleep();
  }
}

class Bird implements Eater, Sleeper, Flyer {
  constructor(
    public eater: Eater = new BasicEater(),
    public sleeper: Sleeper = new BasicSleeper(),
    public flyer: Flyer = new BasicFlyer()
  ) {}

  eat(): void {
    this.eater.eat();
  }

  sleep(): void {
    this.sleeper.sleep();
  }

  fly(): void {
    this.flyer.fly();
  }
}

// exemplo de uso
const dog = new Dog();
dog.eat(); // "está comendo."
dog.sleep(); // "está dormindo."

const bird = new Bird();
bird.eat(); // "está comendo."
bird.sleep(); // "está dormindo."
bird.fly(); // "está voando."
```

## Temporary Field

Ocorre quando uma classe possui variáveis de instância que são configuradas apenas em situações específicas ou temporárias, mas que nem sempre são necessárias. Esses campos podem confundir quem lê o código, aumentar o uso de memória e tornar o código mais difícil de manter.

#### problema
```typescript
class Order {
  constructor(
    public id: number,
    public customerName: string,
    public total: number,
    public deliveryInstructions?: string // Evite campos usados só em alguns casos (Temporary Field)
  ) {}

  processOrder(): void {
    console.log(`Processando pedido #${this.id} para ${this.customerName}`);
    if (this.deliveryInstructions) {
      console.log(`Instruções de entrega: ${this.deliveryInstructions}`);
    }
  }
}

// exemplo de uso
const deliveryOrder = new Order(1, "João", 100, "Deixar na portaria");
deliveryOrder.processOrder();

const pickupOrder = new Order(2, "Maria", 50);
pickupOrder.processOrder();

```

#### solução
```typescript

// Modele cada variante como sua própria subclasse
abstract class Order {
  constructor(
    public id: number,
    public customerName: string,
    public total: number
  ) {}

  abstract processOrder(): void;
}

class DeliveryOrder extends Order {
  constructor(
    id: number,
    customerName: string,
    total: number,
    public deliveryInstructions: string
  ) {
    super(id, customerName, total);
  }

  processOrder(): void {
    ...
  }
}

class PickupOrder extends Order {
  processOrder(): void {
    ...
  }
}

// exemplo de uso
const deliveryOrder = new DeliveryOrder(1, 'João', 5, 'Deixar na portaria');
deliveryOrder.processOrder();

const pickupOrder = new PickupOrder(2, 'Maria', 50);
pickupOrder.processOrder();
```

## Data Class

Ocorre quando uma classe é usada apenas para armazenar dados e não contém nenhum comportamento ou lógica significativa. Essas classes não têm métodos que realizem ações significativas com os dados, apenas armazenam valores. Isso pode ser problemático, pois uma classe sem comportamento não agrega valor real ao sistema e pode ser substituída por um simples objeto ou estrutura de dados.

#### problema
```typescript
// Evite classes só com dados, sem comportamento
class Product {
  constructor(
    public id: number,
    public name: string,
    public price: number
  ) {}
}

class Order {
  private products: Product[] = [];

  addProduct(product: Product): void {
    this.products.push(product);
  }

  calculateTotal(): number {
    return this.products.reduce((total, product) => total + product.price, 0);
  }
}

// exemplo de uso
const product1 = new Product(1, 'Cadeira Gamer', 500);
const product2 = new Product(2, 'Mesa de Escritório', 300);

const order = new Order();
order.addProduct(product1);
order.addProduct(product2);
console.log(`Total do pedido: $${order.calculateTotal()}`);

```

#### solução
```typescript

class Product {
  constructor(
    public id: number,
    public name: string,
    public price: number
  ) {}

  // Dê comportamento à classe, não apenas dados
  applyDiscount(discount: number): void {
    this.price -= this.price * discount / 100;
  }

  getProductInfo(): string {
    return `${this.name} - $${this.price}`;
  }
}

class Order {
  private products: Product[] = [];

  addProduct(product: Product): void {
    this.products.push(product);
  }

  calculateTotal(): number {
    return this.products.reduce((sum, product) => sum + product.price, 0);
  }
}

// exemplo de uso
const product1 = new Product(1, 'Cadeira Gamer', 500);
const product2 = new Product(2, 'Mesa de Escritório', 300);
product1.applyDiscount(10); // aplica desconto de 10% no produto 1

const order = new Order();
order.addProduct(product1);
order.addProduct(product2);
console.log(`Total do pedido: $${order.calculateTotal()}`);
console.log(product1.getProductInfo());  // exibe as informações do produto
```

## Overuse of Inheritance

Ocorre quando a herança é utilizada de maneira inadequada, frequentemente criando uma hierarquia de classes complexa e difícil de manter. Em vez de aproveitar o polimorfismo e a reutilização de código de maneira eficiente, o uso excessivo de herança pode levar a dependências desnecessárias entre as classes, acoplamento forte e falta de flexibilidade.
O uso de herança é adequado quando há uma relação "é um" clara entre as classes, mas quando as classes se tornam muito especializadas ou a hierarquia de classes se torna muito profunda, o código pode se tornar inflexível, difícil de entender e difícil de modificar.

#### problema
```typescript
// Evite hierarquias quando não há uma relação "é-um" clara
class Shape {
  constructor(public color: string) {}

  draw(): void { ... }
}

class Circle extends Shape {
  constructor(color: string, public radius: number) {
    super(color);
  }

  draw(): void { ... }
}

class Square extends Shape {
  constructor(color: string, public  sideLength: number) {
    super(color);
  }

  draw(): void { ... }
}

class Triangle extends Shape {
  constructor(color: string, public base: number, public height: number) {
    super(color);
  }

  draw(): void { ... }
}

```

#### solução
```typescript

// Prefira composição ou classes independentes a herança desnecessária
class Circle {
  constructor(public color: string, public radius: number) {}

  draw(): void { ... }
}

class Square {
  constructor(public color: string, public sideLength: number) {}

  draw(): void { ... }
}

class Triangle {
  constructor(public color: string, public base: number, public height: number) {}

  draw(): void { ... }
}
```

## Improper Interface Usage

Ocorre quando uma interface é mal projetada ou usada de forma inadequada em um código. Interfaces são definidas para garantir uma estrutura consistente e facilitar a reutilização de código, mas quando usadas de maneira equivocada, podem tornar o código mais confuso, difícil de manter e menos flexível.

#### problema
```typescript
interface Vehicle {
  speed: number; // velocidade do veículo
  fuel: number; // combustível do veículo
  drive: () => void; // método para dirigir o veículo
}

class Car implements Vehicle {
  speed: number;
  fuel: number;

  constructor(speed: number, fuel: number) {
    this.speed = speed;
    this.fuel = fuel;
  }

  drive() {
    console.log("Carro dirigindo");
  }
}

class Bicycle implements Vehicle {
  speed: number;
  fuel: number; // Evite forçar a classe a implementar o que não usa (viola ISP)

  constructor(speed: number) {
    this.speed = speed;
    this.fuel = 0; // Evite valores sem sentido causados por interface inadequada
  }

  drive() {
    console.log("Bicicleta pedalando");
  }
}

```

#### solução
```typescript

// Segregue interfaces por capacidade (ISP)
interface FuelVehicle {
  fuel: number;
  drive: () => void;
}

// interface para qualquer veículo que tenha velocidade
interface SpeedyVehicle {
  speed: number;
}

class Car implements FuelVehicle, SpeedyVehicle {
  constructor(public speed: number, public fuel: number) {}

  drive(): void {
    console.log("Carro dirigindo");
  }
}

class Bicycle implements SpeedyVehicle {
  constructor(public speed: number) {}

  drive(): void {
    console.log("Bicicleta pedalando");
  }
}
```

## Too Many Interfaces

Ocorre quando o design do sistema inclui um número excessivo de interfaces que adicionam complexidade desnecessária sem proporcionar benefícios claros. Isso geralmente resulta em código difícil de entender, navegar e manter.

#### problema
```typescript
// Evite multiplicar interfaces que só adicionam complexidade
interface Item {
  name: string;
  price: number;
}

interface ItemWithDiscount extends Item {
  discount: number;
}

interface ItemWithStock extends Item {
  stock: number;
}

interface DiscountedStockItem extends ItemWithDiscount, ItemWithStock {
  discountedPrice: number;
}

interface TaxableItem extends DiscountedStockItem {
  taxRate: number;
  finalPrice: number;
}

class InventoryManager {
  calculateFinalPrice(item: TaxableItem): number { ... }

  displayItemDetails(item: TaxableItem): void { ... }
}

```

#### solução
```typescript

// Consolide em uma interface coesa quando a divisão não agrega valor
interface InventoryItem {
  name: string;
  price: number;
  discount: number;
  stock: number;
  taxRate: number;
}

class InventoryManager {
  calculateFinalPrice(item: InventoryItem): number { ... }

  displayItemDetails(item: InventoryItem): void { ... }
}
```

## Overloading Constructors

Ocorre quando uma classe tem múltiplos construtores para lidar com diferentes tipos de inicialização de objetos, o que pode levar a complexidade desnecessária. Em TypeScript (e outras linguagens como Java ou C#), um construtor pode ser "sobrecarregado" para aceitar diferentes combinações de parâmetros. No entanto, essa prática pode tornar o código mais difícil de entender e manter, pois pode ser difícil para os desenvolvedores entenderem qual construtor deve ser utilizado em determinado momento.
A sobrecarga de construtores pode ser problemática, pois cria várias versões de um método de inicialização, tornando o código confuso e mais propenso a erros. Além disso, pode violar o princípio de Responsabilidade Única no SOLID, já que cada construtor acaba lidando com várias formas de inicializar a classe.
Sem exemplos de código.

## Excessive Overloading

Ocorre quando uma classe possui muitas versões de métodos sobrecarregados com a mesma assinatura base (várias funções com mesmo nome), mas parâmetros diferentes. Isso pode tornar o código difícil de entender, manter e testar, já que os desenvolvedores podem se confundir com qual método está sendo chamado em um determinado momento.

## Excessive Getters/Setters

Ocorre quando há um uso excessivo de métodos de acesso (getters e setters) em uma classe. Isso pode levar a um design mais rígido, onde as operações em objetos se tornam mais complicadas e menos intuitivas, reduzindo a coesão e violando o princípio de encapsulamento.

#### problema
```typescript
class Product {
  private _name: string;
  private _price: number;

  constructor(name: string, price: number) {
    this._name = name;
    this._price = price;
  }

  // Evite expor todo o estado com getters/setters
  public getName(): string {
    return this._name;
  }

  public setName(name: string): void {
    this._name = name;
  }

  public getPrice(): number {
    return this._price;
  }

  public setPrice(price: number): void {
    this._price = price;
  }
}

// exemplo de uso
const product = new Product("Laptop", 1500);
console.log(product.getName());
console.log(product.getPrice());
product.setPrice(1400);
console.log(product.getPrice());

```

#### solução
```typescript

class Product {
  constructor(private name: string, private price: number) {}

  // Exponha comportamento, não acesso direto ao estado
  public applyDiscount(discount: number): void {
    if (discount < 0 || discount > 1) {
      throw new Error("Discount must be between 0 and 1.");
    }
    this.price = this.price * (1 - discount);
  }

  public getDescription(): string {
    return `Product: ${this.name}, Price: $${this.price.toFixed(2)}`;
  }
}

// exemplo de uso
const product = new Product("Laptop", 1500);
console.log(product.getDescription());
product.applyDiscount(0.1);
console.log(product.getDescription());
```

## Lack of Encapsulation

Ocorre quando uma classe ou objeto expõe seus dados internos diretamente, sem ocultá-los adequadamente. O encapsulamento é um dos princípios fundamentais da programação orientada a objetos e se refere ao ato de esconder o estado interno de um objeto, permitindo acesso e modificação apenas por meio de métodos ou propriedades controladas.
A falta de encapsulação pode causar diversos problemas, como:
Dificuldade de manutenção: Se os dados internos podem ser modificados de qualquer lugar, isso pode levar a mudanças inesperadas e difícil rastreabilidade do que causou a alteração.
Baixa modularidade: Classes que expõem seu estado interno diretamente dificultam a criação de componentes reutilizáveis e isolados.
Dificuldade de validação: Quando não há controle sobre o acesso aos dados, não é possível garantir que eles sempre estejam em um estado válido.

## Incorrect Access Modifiers

Ocorre quando modificadores de acesso (como public, protected, private) são usados de forma inadequada, comprometendo o encapsulamento e a segurança do código. O uso incorreto pode expor dados sensíveis, dificultar a manutenção e levar a comportamentos inesperados em subclasses ou outras partes do código.

#### problema
```typescript
class User {
    // Evite expor dados sensíveis como public
    constructor(public name: string, public password: string) {}

    // Evite getters que expõem dados sensíveis
    getPassword(): string {
        return this.password;
    }
}

// exemplo de uso
const user = new User('Alice', 'secret123');
console.log(user.password);  // Evite acesso direto a dados sensíveis

```

#### solução
```typescript

class User {
    // Use private para dados sensíveis
    constructor(public name: string, private password: string) {}

    // Exponha verificação, não o dado em si
    checkPassword(inputPassword: string): boolean {
        return this.password === inputPassword;  // simples de verificação
    }
}

// exemplo de uso
const user = new User('Alice', 'secret123');
user.checkPassword('secret123'); // true
```

## Excessive Type Casting

Ocorre quando um código realiza muitas conversões de tipos, ou quando há conversões de tipos que não são necessárias, o que pode dificultar a legibilidade e aumentar a complexidade do código. O excesso de castings pode indicar que o código não está bem estruturado e pode ser refatorado para usar tipos mais apropriados ou técnicas que evitem essas conversões.

#### problema
```typescript
calculateDiscount(price: any, discount: any): any {
  // Evite conversões de tipo desnecessárias
  let priceNumeric = <number>price;
  let discountNumeric = <number>discount;

  if (isNaN(priceNumeric) || isNaN(discountNumeric)) {
    throw new Error('Invalid input');
  }

  let discountedPrice = priceNumeric - (priceNumeric * discountNumeric) / 100;

  return <string>discountedPrice.toFixed(2); // Evite converter de volta sem necessidade
}

// exemplo de uso
calculateDiscount('100', '20');  // '80.00'

```

#### solução
```typescript

// Use tipos corretos desde o início e evite casts
calculateDiscount(price: number, discount: number): number {
  if (isNaN(price) || isNaN(discount)) {
    throw new Error('Invalid input');
  }

  const discountedPrice = price - (price * discount) / 100;

  return parseFloat(discountedPrice.toFixed(2));
}

// exemplo de uso
calculateDiscount(100, 20);  // 80.00
```
