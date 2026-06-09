# Constants & Magic Values

Valores literais espalhados pelo código ou constantes mal gerenciadas.

## Smells nesta categoria

- [Magic Numbers](#magic-numbers)
- [Magic Strings](#magic-strings)
- [Hard-Coded Values](#hard-coded-values)
- [Hardcoded Paths](#hardcoded-paths)
- [Failure to Use Constants](#failure-to-use-constants)
- [Reused Constants](#reused-constants)
- [Mutable Constants](#mutable-constants)

---

## Magic Numbers

refere-se a valores numéricos literais usados diretamente no código sem uma explicação clara do que representam. Esses números "mágicos" podem ser confusos, difíceis de entender e difíceis de manter, pois não é claro por que um determinado número foi escolhido ou qual é seu significado.
A principal questão com o uso de Magic Numbers é que, ao ver um número diretamente no código, fica difícil para os desenvolvedores entenderem rapidamente o seu propósito sem procurar por um comentário ou documentação adicional. Se o valor precisar ser alterado, pode ser fácil cometer erros, já que o número pode ser usado em várias partes do código sem um contexto claro.

#### problema
```typescript
class ShippingCalculator {
  calculateShippingCost(weight: number, distance: number): number {
    // Evite números mágicos: extraia para uma constante nomeada
    return weight * distance * 5;
  }
}
```

#### solução
```typescript
class ShippingCalculator {
  // Use uma constante nomeada para dar significado ao valor
  private static readonly BASE_SHIPPING_COST = 5;

  calculateShippingCost(weight: number, distance: number): number {
    return weight * distance * ShippingCalculator.BASE_SHIPPING_COST;
  }
}
```

## Magic Strings

Muito semelhante ao Magic Numbers, mas no caso, se refere ao uso de strings literais no código sem contexto claro. Assim como os Magic Numbers, as Magic Strings são difíceis de entender, manter e modificar, pois não possuem um significado explícito que explique seu propósito no código.

#### problema
```typescript
class UserService {

  getUserStatus(userId: string): string {
    // Evite strings mágicas espalhadas pelo código
    if (userId === "ad") {
      return "ad";
    } 

    if (userId === "gst") {
      return "gst";
    } 

    return "unknown";    
  }
}
```

#### solução
```typescript
class UserService {

  // Use constantes nomeadas para strings de domínio
  private static readonly ADMIN_STATUS = "ad";
  private static readonly GUEST_STATUS = "gst";
  private static readonly UNKNOWN_STATUS = "unknown";

  getUserStatus(userId: string): string {
    if (userId === UserService.ADMIN_STATUS) {
      return UserService.ADMIN_STATUS;
    } 

    if (userId === UserService.GUEST_STATUS) {
      return UserService.GUEST_STATUS;
    } 

    return UserService.UNKNOWN_STATUS;
  }
}
```

## Hard-Coded Values

São valores fixos inseridos diretamente no código, como strings, números ou caminhos. Isso dificulta a manutenção, reutilização e escalabilidade do código. Se esses valores precisarem ser alterados, você terá que modificar múltiplas partes do código.

#### problema
```typescript
class DiscountService {
  calculateDiscount(price: number): number {
    if (price > 1000) {
      return price * 0.1; // Evite valores fixos no código; configure-os externamente
    } else if (price > 500) {
      return price * 0.05; // Evite valores fixos no código; configure-os externamente
    } else {
      return 0; // sem desconto
    }
  }

  getCurrencySymbol(): string {
    return '$'; // Evite hard-coding de configurações (moeda)
  }
}

// exemplo de uso
const discountService = new DiscountService();
console.log(discountService.calculateDiscount(1200)); // 120
console.log(discountService.getCurrencySymbol() + 1200); // $1200
```

#### solução
```typescript
// arquivo discount-threshold.ts
export class DiscountThreshold {
  constructor(public price: number, public discount: number) {}
}

// arquivo config.ts
import { DiscountThreshold } from './discount-threshold';

// Centralize os valores em configuração
export const discountThresholds: DiscountThreshold[] = [
  new DiscountThreshold(1000, 0.1), // 10%
  new DiscountThreshold(500, 0.05), // 5%
];

export const currencySymbol: string = '$';

// arquivo discount.service.ts
import * as config from './config';
import { DiscountThreshold } from './discount-threshold';

class DiscountService {
  private readonly discountThresholds: DiscountThreshold[] = config.discountThresholds;
  private readonly currencySymbol: string = config.currencySymbol;

  calculateDiscount(price: number): number {
    for (const threshold of this.discountThresholds) {
      if (price > threshold.price) {
        return price * threshold.discount;
      }
    }
    return 0;
  }

  getCurrencySymbol(): string {
    return this.currencySymbol;
  }
}
```

## Hardcoded Paths

ocorre quando caminhos (diretórios ou URLs) são codificados diretamente no código-fonte, tornando o sistema inflexível e propenso a erros. Isso acontece especialmente quando os caminhos para arquivos, diretórios ou recursos são fixados diretamente no código, em vez de serem parametrizados ou configurados externamente.
Os problemas de hardcoding incluem:
Manutenção difícil: Se o caminho precisar mudar, o código precisa ser editado em vários lugares, o que pode ser suscetível a erros.

#### problema
```typescript
Falta de flexibilidade: O sistema fica preso a um caminho específico e não pode ser facilmente movido ou configurado para diferentes ambientes (desenvolvimento, teste, produção).
Portabilidade comprometida: O código pode depender de caminhos específicos do sistema operacional (ex: caminhos absolutos no Windows vs. Linux).

const fs = require('fs');

function readDataFromFile() {
  const filePath = '/Users/username/Documents/data.txt';  // Evite caminhos fixos no código
  const data = fs.readFileSync(filePath, 'utf-8');
  console.log(data);
}

// exemplo de uso
readDataFromFile();
```

#### solução
```typescript
const fs = require('fs');

function readDataFromFile() {
  // Use variável de ambiente com fallback
  const filePath = process.env.DATA_FILE_PATH || './data.txt';
  const data = fs.readFileSync(filePath, 'utf-8');
  console.log(data);
}

// exemplo de uso
readDataFromFile();
```

## Failure to Use Constants

Está intimamente relacionado aos conceitos de Magic Numbers e Magic Strings, mas há uma leve diferença de ênfase. É um conceito mais amplo, que inclui a falha em definir qualquer tipo de valor fixo como uma constante, não apenas números ou strings.

## Reused Constants

Ocorre quando constantes são usadas de forma inconsistente ou inadequada em diferentes partes do código. Por exemplo, uma constante definida para um propósito específico acaba sendo usada em situações que não refletem sua intenção original. Isso pode levar a confusão, bugs e dificulta a manutenção do código.

#### problema
```typescript
const DISCOUNT_PERCENTAGE = 10; // usada para representar desconto de produtos

class Product {
  constructor(public name: string, public price: number) {}

  public applyDiscount(): number {
    return this.price - (this.price * DISCOUNT_PERCENTAGE) / 100;
  }
}

class TaxCalculator {
  // Evite reusar uma constante para um propósito diferente
  public calculateTax(price: number): number {
    return (price * DISCOUNT_PERCENTAGE) / 100; // Evite dar novo significado a uma constante existente
  }
}
```

#### solução
```typescript
// Defina uma constante por propósito
const PRODUCT_DISCOUNT_PERCENTAGE = 10;
const TAX_PERCENTAGE = 15;

class Product {
  constructor(public name: string, public price: number) {}

  public applyDiscount(): number {
    return this.price - (this.price * PRODUCT_DISCOUNT_PERCENTAGE) / 100;
  }
}

class TaxCalculator {
  public calculateTax(price: number): number {
    return (price * TAX_PERCENTAGE) / 100;
  }
}
```

## Mutable Constants

Ocorre quando uma variável ou constante que deveria ser imutável é alterada durante a execução do programa. Isso vai contra o propósito de constantes, que são valores que, uma vez definidos, não devem ser modificados. Alterar um valor de uma constante pode levar a comportamentos imprevisíveis, dificuldade em rastrear o fluxo do código e aumentar a chance de erros, especialmente em sistemas grandes.
No TypeScript, o uso de const cria uma variável de referência imutável, mas não impede que objetos e arrays referenciados sejam modificados. Isso significa que, embora o valor de uma variável declarada com const não possa ser reatribuído, os dados internos (como propriedades de objetos ou elementos de arrays) podem ser modificados.

#### problema
```typescript
class DiscountCalculator {
  private readonly discountRates: { [key: string]: number } = {
    "standard": 0.1,
    "premium": 0.2,
    "gold": 0.3,
  };

  applyDiscount(customerType: string, amount: number): number {
    if (this.discountRates[customerType]) {
      // Evite modificar o que deveria ser imutável
      this.discountRates[customerType] = 0.5; // Evite alterar o conteúdo de uma constante
      return amount * (1 - this.discountRates[customerType]);
    }
    return amount;
  }
}
```

#### solução
```typescript
class DiscountCalculator {
  // Use Object.freeze para tornar o conteúdo realmente imutável
  private readonly discountRates: { [key: string]: number } = Object.freeze({
      "standard": 0.1,
      "premium": 0.2,
      "gold": 0.3,
    });

  applyDiscount(customerType: string, amount: number): number {
    const discountRate = this.discountRates[customerType];
    if (discountRate) {
      return amount * (1 - discountRate);
    }
    return amount;
  }
}
```
