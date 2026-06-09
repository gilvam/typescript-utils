# Architecture & Layering

Smells em nível de arquitetura, camadas, dependências e separação de responsabilidades.

## Smells nesta categoria

- [UI Logic in Backend](#ui-logic-in-backend)
- [Database Logic in Code](#database-logic-in-code)
- [Excessive Events](#excessive-events)
- [Overuse of Annotations](#overuse-of-annotations)
- [Overuse of Globals](#overuse-of-globals)
- [Poltergeist](#poltergeist)
- [Static Cling](#static-cling)
- [Overengineering](#overengineering)
- [Dependency Injection Overuse](#dependency-injection-overuse)
- [Improper API Design](#improper-api-design)
- [Excessive Object Creation](#excessive-object-creation)

---

## UI Logic in Backend

Lógica de interface no backend.

#### problema
```typescript
// Evite lógica de UI no backend
function getProductDetails(productId: number) {
  // lógica de negócios para obter o produto
  const product = getProductFromDatabase(productId);

  // Evite formatação de apresentação no backend
  product.price = `$${product.price.toFixed(2)}`;
  // definindo cor com base no estoque
  product.color = product.stock > 0 ? "green" : "red";

  return product;
}

// exemplo de uso
// backend retornando dados formatados para o frontend
const product = getProductDetails(123);
console.log(product.price);  // '$25.00'
console.log(product.color);  // 'green'
```

#### solução
```typescript

// Backend: retorne dados puros, sem formatação
getProductDetails(productId: number) {
  const product = getProductFromDatabase(productId);
  return product;
}

...

// Frontend: faça a formatação e a exibição
formatProductForDisplay(product) {
  product.price = `$${product.price.toFixed(2)}`;
  product.color = product.stock > 0 ? "green" : "red";
  return product;
}

// exemplo de uso
const product = getProductDetails(123);
const formattedProduct = formatProductForDisplay(product);
console.log(formattedProduct.price);  // '$25.00'
console.log(formattedProduct.color);  // 'green'
```

## Database Logic in Code

Ocorre quando a lógica de acesso e manipulação de dados, que deveria estar encapsulada no banco de dados (por exemplo, através de stored procedures, views ou triggers), é implementada diretamente no código da aplicação. Isso pode levar a um acoplamento forte entre o banco de dados e a aplicação, dificultando a manutenção, o teste, e a escalabilidade do sistema.
Esse code smell surge quando operações complexas de banco de dados, como consultas SQL extensas ou manipulação de dados, são diretamente inseridas no código da aplicação. Isso não só pode dificultar a leitura e manutenção do código, mas também pode gerar problemas de desempenho e flexibilidade.

#### problema A
```typescript
...
<body>
    <h1>Lista de Usuários</h1>
    <!-- Evite SQL embutido no HTML/cliente -->
    <script>
        const query = "SELECT * FROM users WHERE role = 'admin'";
        fetch('/execute-query', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query })
        })
        .then(response => response.json())
        .then(data => {
            data.forEach(user => {
                document.body.innerHTML += `<p>${user.name}</p>`;
            });
        });
    </script>
</body>
...
```

#### solução A
```typescript

// arquivo .ts
import express from 'express';
import { Connection } from 'mysql';

const app = express();
app.use(express.json());

const connection: Connection = /* configuração da conexão com o DB */;

app.post('/users', (req, res) => {
    connection.query("SELECT * FROM users WHERE ...", (error, results) => {
        if (error) {
            res.status(500).send('Erro no servidor');
            return;
        }
        res.json(results);        
    });
});

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});

// arquivo .html

...
<h1>Lista de Usuários</h1>
<script>
    fetch('/users')
    .then(response => response.json())
    .then(data => {
        data.forEach(user => {
            document.body.innerHTML += `<p>${user.name}</p>`;
        });
    });
</script>
...
```

#### problema B
```typescript
// Evite lógica de banco de dados na entidade de domínio
class User {
  constructor(public id: number, public name: string) {}

  // Evite acesso a banco de dados dentro da entidade
  static findById(id: number): User | null {
    const query = `SELECT * FROM users WHERE id = ${id}`;
    // simulando a execução de uma consulta SQL
    const result = database.query(query);
    if (!result) {
      return null;
    }
    return new User(result.id, result.name);
  }
}

// exemplo de uso
const user = User.findById(1);
console.log(user);
```

#### solução B
```typescript

// Mantenha a entidade sem lógica de banco de dados
class User {
  constructor(public id: number, public name: string) {}
}

// Isole o acesso a dados em um repositório
class UserRepository {
  findById(id: number): User | null {
    const query = `SELECT * FROM users WHERE id = ?`;
    const result = database.query(query, [id]); // Use prepared statements
    if (result) {
      return new User(result.id, result.name);
    }
    return null;
  }
}

// Use um serviço de aplicação sobre o repositório
class UserService {
  constructor(private userRepository: UserRepository) {}

  getUserById(id: number): User | null {
    return this.userRepository.findById(id);
  }
}

// Simulação de uso
const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const user = userService.getUserById(1);
console.log(user);
```

## Excessive Events

Ocorre quando há um número excessivo de eventos ou listeners registrados, frequentemente desnecessários, que tornam o código difícil de entender, manter e podem impactar o desempenho da aplicação. Isso pode acontecer quando eventos são registrados em excesso, ou em momentos desnecessários, ou ainda, quando a lógica por trás de um evento pode ser mais eficiente.
Eventos devem ser registrados de forma concisa e específica, e sua remoção deve ser feita corretamente para evitar vazamentos de memória. Ter muitos listeners ou um grande número de eventos para interações simples pode resultar em um código difícil de fazer debug e manter.

#### problema
```typescript
 class ButtonComponent {
  constructor() {
    this.button = document.getElementById('myButton');
  }

  // Evite registrar muitos listeners desnecessários
  bindEvents() {
    this.button.addEventListener('click', this.handleClick);
    this.button.addEventListener('click', this.handleAnotherClick);
    this.button.addEventListener('click', this.handleYetAnotherClick);
    this.button.addEventListener('click', this.handleClick);
    // Evite múltiplos handlers para o mesmo evento
  }

  handleClick() { ... }

  handleAnotherClick() { ... }

  handleYetAnotherClick() { ... }
}
```

#### solução
```typescript

class ButtonComponent {
  constructor() {
    this.button = document.getElementById('myButton');
  }

  // Registre apenas o listener necessário
  bindEvents() {
    this.button.addEventListener('click', this.handleClick);
  }

  handleClick() { ... }
}
```

## Overuse of Annotations

Ocorre quando anotações (como tipos ou comentários) são usadas em excesso ou de maneira desnecessária, prejudicando a legibilidade e manutenibilidade do código. Isso geralmente acontece quando se tenta adicionar um nível de detalhamento excessivo em áreas que não requerem explicações ou quando as anotações acabam sendo redundantes.

#### problema
```typescript
// Evite anotações e comentários redundantes
function calc(width, height) {
  let area: number = width * height; // Evite comentar o óbvio
  return area; // Evite comentar o óbvio
}

// Evite anotações e comentários que apenas repetem o código
let result: number = calc(10, 20);
```

Simplifique os métodos e variáveis com os nomes adequados explicando o que cada um deles faz.

#### solução
```typescript

// Prefira nomes claros a anotações e comentários redundantes
calculateRectangleArea(width: number, height: number): number {
  return width * height;
}

let rectangleArea = calculateRectangleArea(10, 20);
```

## Overuse of Globals

Ocorre quando variáveis globais ou objetos globais são utilizados de forma excessiva no código. Isso pode levar a problemas de manutenção, testes e compreensão do sistema, além de aumentar o risco de erros causados por modificações inesperadas de variáveis globais em partes diferentes do código.
Sem exemplos de código.

## Poltergeist

Ocorre quando uma classe tem um ou mais métodos que não fazem sentido dentro dela, ou seja, quando uma classe possui comportamento que não se encaixa no seu propósito. Isso pode ocorrer quando uma classe possui métodos ou funcionalidades que estão ali apenas para interagir com outras partes do sistema, mas não têm um papel próprio.

####problema
```typescript
class Employee {
  private name: string;
  private salary: number;

  constructor(name: string, salary: number) {
    this.name = name;
    this.salary = salary;
  }

  // Evite métodos que não pertencem a esta classe
  generatePayroll() {
    ...
  }

  ...
}

class PayrollService {
  private employees: Employee[];

  constructor(employees: Employee[]) {
    this.employees = employees;
  }

  // Evite depender de um método poltergeist em outra classe
  generatePayroll() {
    for (let employee of this.employees) {
      // Evite chamar um método que não deveria existir na outra classe
      employee.generatePayroll();
    }
  }
}

// exemplo de uso
const employee1 = new Employee('John Doe', 5000);
const employee2 = new Employee('Jane Smith', 6000);
const payrollService = new PayrollService([employee1, employee2]);
payrollService.generatePayroll();  // "John Doe receives a salary of $5000"

```

#### solução
```typescript

class Employee {
  private name: string;
  private salary: number;

  constructor(name: string, salary: number) {
    this.name = name;
    this.salary = salary;
  }

  ...
}

class PayrollService {
  private employees: Employee[];

  constructor(employees: Employee[]) {
    this.employees = employees;
  }

  // Coloque o método na classe a que ele pertence
  generatePayroll() {
    for (let employee of this.employees) {
      console.log(`${employee.getName()} receives a salary of $${employee.getSalary()}`);
    }
  }
}

// exemplo de uso
const employee1 = new Employee('John Doe', 5000);
const employee2 = new Employee('Jane Smith', 6000);
const payrollService = new PayrollService([employee1, employee2]);
payrollService.generatePayroll();  //"John Doe receives a salary of $5000"
```

## Static Cling

Ocorre quando uma classe ou método depende excessivamente de métodos ou dados estáticos, tornando o código difícil de testar, expandir ou modificar. Isso acontece porque os membros estáticos criam um forte acoplamento, removendo a flexibilidade de substituir ou mockar dependências em testes.
Sem exemplos de código.

## Overengineering

Ocorre quando uma solução é mais complexa do que realmente necessita ser, adicionando funcionalidades, abstrações ou características que não são necessárias para o problema atual. Isso pode resultar em código difícil de entender, manter, testar, e geralmente é excessivo, considerando os requisitos reais do sistema.
O principal problema com o Overengineering é que ele pode resultar em um sistema excessivamente complexo, que é difícil de modificar e propenso a erros, enquanto que uma solução mais simples seria suficiente para atender às necessidades do negócio.
Sem exemplos de código.

## Dependency Injection Overuse

Ocorre quando o uso de Dependency Injection (DI) é exagerado ou mal aplicado, levando a um código difícil de manter, entender e testar. Embora DI seja uma boa prática para gerenciar dependências, o excesso pode resultar em configurações complexas e classes que dependem de muitas dependências, algumas das quais podem nem ser usadas.

## Improper API Design

```typescript
Ocorre quando a interface da API (ou a forma como ela é projetada para ser utilizada) não é intuitiva, eficiente ou bem estruturada. Uma API mal projetada pode ser difícil de entender, usar ou manter, resultando em uma experiência ruim para os desenvolvedores que a consomem. Alguns exemplos incluem:
```

APIs que expõem métodos ou endpoints que não fazem sentido ou são difíceis de usar.
Falta de consistência na nomeação de métodos e parâmetros.
Exposição excessiva de detalhes internos.
APIs que não seguem os padrões e melhores práticas, o que dificulta a integração e a manutenção.

#### problema
```typescript
class Product {
    id: number;
    productName: string;
    price: number;
    quantityInStock: number; // Evite expor detalhes internos na API
    isDiscounted: boolean;
    discountPercentage: number; // Evite expor detalhes internos na API
    ...
}

class Product {
    // Evite nomes inconsistentes na API
    async getProductData(productId: number): Promise<Product>;

    // Evite nomes repetitivos, parâmetros sem sentido e retorno sem tipo
    async getAllProducts(time: any): Promise<any>;

    async create(
        name: string,
        price: number,
        quantity: number,
        isOnSale: boolean,
        discount: number
    ): Promise<Product> {
        // Evite parâmetros excessivos e sem significado claro
        // Evite misturar regra de negócio na camada de API
    }

    async updatePrice(productId: number, newPrice: number): Promise<void> {
        // Evite omitir o tratamento de erros
    }
}

```

#### solução
```typescript

// Use DTOs claros, nomes consistentes e retornos tipados
class ProductResponse {
    constructor(public id: number, public name: string, public price: number){}
}

class ProductCreateRequest {
    constructor(public name: string, public price: number, public discount = 0){}
}

class Product {
    async getById(productId: number): Promise<ProductResponse | null> { ... }

    async getAllByDate(date: Date): Promise<ProductResponse[]> { ... }

    async create(request: ProductCreateRequest): Promise<ProductResponse> { ... }

    async updatePrice(productId: number, newPrice: number): Promise<boolean> { ... }
}
```

## Excessive Object Creation

Ocorre quando objetos são criados repetidamente, muitas vezes de forma desnecessária, em vez de serem reutilizados ou otimizados. Esse code smell pode levar a um uso excessivo de memória e processamento, especialmente em sistemas de alta carga.
