# Naming & Readability

Nomes confusos, comentários ruins e formatação inconsistente que prejudicam a leitura do código.

## Smells nesta categoria

- [Inconsistent Naming](#inconsistent-naming)
- [Confusing Method Signatures](#confusing-method-signatures)
- [Boolean Trap](#boolean-trap)
- [Boolean Variable Naming](#boolean-variable-naming)
- [Non-Descriptive Names](#non-descriptive-names)
- [Imperative Comments](#imperative-comments)
- [Outdated Comments](#outdated-comments)
- [Inconsistent Indentation](#inconsistent-indentation)
- [Poor Error Messages](#poor-error-messages)

---

## Inconsistent Naming

_Também conhecido como: Repetitive Naming._

Inconsistência nos nomes ou repetição desnecessária do nome da classe nos seus próprios membros (propriedades, parâmetros e métodos), causando redundância e dificultando a leitura e a manutenção do código.

A regra vale para **qualquer classe**: o contexto da classe já está implícito ao acessar seus membros (`entidade.metodo()`), então prefixar membros com o nome da classe é redundante. Em vez de `Entidade.getEntidadeNome()`, prefira `Entidade.getNome()`.

#### problema
```typescript
// Evite repetir o nome da classe em cada membro

class Entity {
  // Evite prefixar parâmetros e propriedades com o nome da classe
  constructor(public entityName: string, public entityValue: number) {
    this.entityName = entityName;
    this.entityValue = entityValue;
  }

  getEntityName(): string {  // Evite repetir 'Entity' no nome do método
    return this.entityName;
  }

  getEntityValue(): number {  // Evite repetir 'Entity'
    return this.entityValue;
  }

  setEntityName(entityName: string): void {  // Evite repetir 'Entity'
    this.entityName = entityName;
  }

  setEntityValue(entityValue: number): void {  // Evite repetir 'Entity'
    this.entityValue = entityValue;
  }
}

// exemplo de uso
const entity = new Entity('foo', 10);
entity.getEntityName(); // Evite o prefixo 'Entity': o tipo do objeto já dá o contexto
```

#### solução
```typescript
// Nomeie membros pelo papel, sem repetir o nome da classe
class Entity {
  constructor(public name: string, public value: number) {}

  getName(): string {
    return this.name;
  }

  getValue(): number {
    return this.value;
  }

  setName(name: string): void {
    this.name = name;
  }

  setValue(value: number): void {
    this.value = value;
  }
}

// exemplo de uso
const entity = new Entity('foo', 10);
entity.getName(); // Use nomes curtos: o tipo do objeto já deixa claro o contexto
```

## Confusing Method Signatures

Similar ao Long Parameter List, ocorre quando os métodos de uma classe têm assinaturas que são difíceis de entender, seja por serem muito longas, terem parâmetros mal nomeados, ou uma ordem de parâmetros confusa. Isso torna o código difícil de usar e compreender, aumentando a chance de erros e dificultando a manutenção.

#### problema
```typescript
class ProductService {

  // 1. Evite listas longas de parâmetros sem clareza
  addProduct(id: number, name: string, price: number, stock: number, category: string, discount: number, color: string, weight: number, size: string, brand: string): void { ... }

  // 2. Evite ordem de parâmetros confusa
  calculateDiscount(price: number, discount: number, quantity: number, category: string, customerType: string, promoCode: string): number {
      // lógica para calcular o desconto
      return price * (1 - discount) * quantity;
  }

  // 3. Evite nomes de parâmetros genéricos (a, b, c)
  processOrder(a: number, b: string, c: boolean, d: any, e: string): void { ... }

  // 4. Evite muitos parâmetros soltos, sem contexto
  updateProduct(id: string, price: number, availability: boolean, date: Date, description: string): void { ... }

  // 5. Evite muitos parâmetros; agrupe o que é coeso
  handleTransaction(transactionId: number, userId: number, amount: number, transactionType: string, paymentMethod: string, status: string, date: Date): void { ... }

  // 6. Evite vários booleanos como parâmetros (boolean trap)
  createAccount(userId: string, active: boolean, verified: boolean, subscription: boolean): void { ... }

  // 7. Evite abreviações obscuras nos nomes
  setOrderStatus(orderTId: number, flg: boolean, ste: string, ttamp: Date): void { ... }

  // 8. Evite muitos parâmetros para um cálculo simples
  calculateTotalCost(price: number, taxRate: number, shippingCost: number, promoCode: string, discountRate: number, isGift: boolean, membershipStatus: string, quantity: number): number {
      return price * quantity + shippingCost + (price * taxRate) - discountRate;
  }

  // 9. Evite juntar parâmetros não relacionados
  generateReport(startDate: Date, endDate: Date, format: string, includeCharts: boolean, userId: string, reportType: string): void { ... }

  // 10. Evite parâmetros sem contexto claro
  updateUserSettings(userId: string, settings: any, type: string, active: boolean, saveImmediately: boolean): void { ... }
}
```

#### solução
```typescript
class ProductDetails { ... }
class Details { ... }
class Transaction { ... }
class AccountStatus { ... }
class Order { ... }
class ReportDetails { ... }
class Settings { ... }

class ProductService {

  // 1. Agrupe parâmetros coesos em um objeto
  addProduct(product: ProductDetails): void { ... }

  // 2. Mantenha apenas os parâmetros essenciais
  calculateDiscount(price: number, discount: number, quantity: number): number {
      // lógica para calcular o desconto
      return price * (1 - discount) * quantity;
  }

  // 3. Use nomes descritivos para os parâmetros
  processOrder(orderId: number, customerName: string, isUrgent: boolean, orderDetails: any): void { ... }

  // 4. Agrupe os detalhes em um objeto
  updateProduct(productId: string, updatedDetails: Details): void { ... }

  // 5. Use um objeto para representar a transação
  handleTransaction(transaction: Transaction): void { ... }

  // 6. Use um objeto de status em vez de vários booleanos
  createAccount(userId: string, accountStatus: AccountStatus): void { ... }

  // 7. Use nomes claros e completos
  setOrderStatus(orderId: number, status: string, timestamp: Date): void { ... }

  // 8. Agrupe os parâmetros de custo em um objeto
  calculateTotalCost(order: Order): number {
    // lógica para calcular o custo total
    return order.price * order.quantity + order.shippingCost + (order.price * order.taxRate) - order.discountRate;
  }

  // 9. Agrupe os parâmetros do relatório em um objeto
  generateReport(reportDetails: ReportDetails): void { ... }

  // 10. Use um objeto para as configurações do usuário
  updateUserSettings(userId: string, settings: Settings): void { ... }
}
```

## Boolean Trap

Ocorre quando se usa uma variável booleana de forma inadequada, levando a um código confuso, redundante ou propenso a erros. Esse problema ocorre, principalmente, quando a variável booleana é usada em expressões ou condições complexas de maneira que causa ambiguidades ou torna o código difícil de entender.
A principal questão aqui é que, ao usar variáveis booleanas de maneira inadequada, pode-se criar armadilhas lógicas, onde o comportamento do código não é claro ou é inesperado.

#### problema
```typescript
class User {
    constructor(private isActive: boolean, private isSuspended: boolean) {}

    checkUserStatus(): boolean {
        // Evite negação dupla: ela ofusca a intenção da condição
        return !(this.isActive && !this.isSuspended); 
    }
}

// exemplo de uso
const user = new User(true, false);
console.log(user.checkUserStatus());
```

#### solução
```typescript
class User {
    constructor(private isActive: boolean, private isSuspended: boolean) {}

    public isUserActive(): boolean {
        // Prefira condições afirmativas e diretas
        return this.isActive && !this.isSuspended;
    }
}

// exemplo de uso
const user = new User(true, false);
console.log(user.isUserActive());
```

## Boolean Variable Naming

_Também conhecido como: Boolean Method Naming._

Ocorre quando uma variável booleana ou um método booleano não segue a convenção de nomenclatura esperada, o que pode causar confusão no código. Para tornar o código mais legível, é recomendado que variáveis e métodos booleanos comecem com os prefixos is, has, can, ou outros prefixos semelhantes, para indicar que o valor ou a operação é do tipo booleano e para expressar claramente o que está sendo verificado ou afirmado.

#### problema
```typescript
class User {
    // Evite nomes genéricos como 'flag' para booleanos
    constructor(private flag: boolean) {}

    checkStatusActive(): boolean {
        return this.flag;
    }
}

const user = new User(true);
console.log(user.checkStatusActive()); // Evite nomes que não revelam que o valor é booleano
```

#### solução
```typescript
class User {
    // Use prefixo is/has/can em variáveis booleanas
    constructor(private isActive: boolean) {}

    isActive(): boolean {
        return this.isActive;
    }
}

const user = new User(true);
console.log(user.isActive());  // Use prefixo is/has/can: o nome revela que é booleano
```

## Non-Descriptive Names

Ocorre quando nomes de variáveis, funções, classes ou outros elementos do código são vagos, confusos ou não representam claramente sua finalidade. Isso torna o código difícil de entender, mantendo e propenso a erros.

#### problema
```typescript
// Evite nomes vagos como 'A', 'x', 'y' e 'doThing'
class A {
  private x: number;
  private y: number;

  constructor(a: number, b: number) {
    this.x = a;
    this.y = b;
  }

  public doThing(): number {
    return this.x + this.y;
  }
}

// exemplo de uso
const obj = new A(5, 10);
console.log(obj.doThing()); // Evite nomes que não revelam o que o código faz
```

#### solução
```typescript
// Use nomes que revelam a intenção de cada elemento
class Point {
  private xCoordinate: number;
  private yCoordinate: number;

  constructor(xCoordinate: number, yCoordinate: number) {
    this.xCoordinate = xCoordinate;
    this.yCoordinate = yCoordinate;
  }

  public calculateSum(): number {
    return this.xCoordinate + this.yCoordinate;
  }
}

// exemplo de uso
const point = new Point(5, 10);
console.log(`Sum of coordinates: ${point.calculateSum()}`);
```

## Imperative Comments

Ocorre quando os comentários no código são usados para instruir como o código deve funcionar em vez de simplesmente explicar ou documentar. Isso é um problema porque os comentários podem se tornar desatualizados ou desnecessários, especialmente quando o código é alterado. Além disso, um código bem escrito deve ser claro por si só, com comentários sendo usados apenas para explicar o "porquê", e não o "como".
Sem exemplos de código.

## Outdated Comments

Ocorre quando os comentários no código não refletem mais o comportamento ou o propósito do código. Isso pode causar confusão, levar a suposições erradas e dificultar a manutenção. Geralmente, isso acontece quando o código é alterado, mas os comentários não são atualizados.
Sem exemplos de código.

## Inconsistent Indentation

Ocorre quando o código tem indentação inconsistente, o que torna o código difícil de ler, entender e manter. Isso pode acontecer por várias razões, como misturar espaços e tabulações, usar diferentes estilos de indentação (por exemplo, 2 espaços em alguns lugares e 4 espaços em outros), ou simplesmente não seguir um padrão claro para toda a base de código.

#### problema
```typescript
class User {
   name: string;
 age: number;

  constructor(name: string,age: number) {
          this.name = name;
 age = age;
}
    getName():string {
 return this.name;
  }
    }
```

#### solução
```typescript
class User {
  name: string;
  age: number;

  constructor(name: string, age: number) {
    this.name = name;
    age = age;
  }

  getName(): string {
    return this.name;
  }
}
```

## Poor Error Messages

São aquelas que fornecem informações insuficientes, vagas ou confusas sobre o que deu errado em uma aplicação. Isso dificulta a depuração e a solução de problemas, tanto para desenvolvedores quanto para usuários finais.
Problemas principais:
Dificuldade para identificar a causa raiz do erro: Mensagens vagas ou incompletas não ajudam os desenvolvedores a entender rapidamente o problema.
Frustração do usuário: Se um usuário encontra uma mensagem de erro incompreensível, isso pode gerar frustração e dificultar a resolução do problema.
Aumento no tempo de resolução de problemas: Erros com mensagens imprecisas podem levar mais tempo para serem diagnosticados e corrigidos.

#### problema
```typescript
calculatePrice(price: number, tax: number): number {
  if (price < 0 || tax < 0) {
    throw new Error('Error'); // Evite mensagens genéricas como 'Error'
  }
  return price + (price * tax);
}

// exemplo de uso
try {
  const total = calculatePrice(-10, 0.15); // valor negativo, o que gera erro
} catch (error) {
  console.log(error.message); // Evite mensagens sem contexto: dificultam o diagnóstico
}
```

#### solução
```typescript
calculatePrice(price: number, tax: number): number {
  // Use mensagens que dizem o valor inválido e a regra violada
  if (price < 0) {
    throw new Error(`Invalid price: ${price}. Price must be a non-negative number.`);
  }
  if (tax < 0) {
    throw new Error(`Invalid tax: ${tax}. Tax must be a non-negative number.`);
  }
  return price + (price * tax);
}

// exemplo de uso
try {
  const total = calculatePrice(-10, 0.15); // valor negativo, o que gera erro
} catch (error) {
  console.log(error.message); // Use mensagens específicas: facilitam o diagnóstico
}
```