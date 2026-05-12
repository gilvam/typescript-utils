# 🧰 Utility Toolkit (TypeScript)
This repository contains a collection of reusable utility functions written in **TypeScript**. These are small, well-organized snippets designed to simplify development across multiple projects — from object and array manipulation to string formatting, date handling, data validation, and more.


## 📦 Purpose
Avoid rewriting common code across different projects by centralizing everything in one place, with simple documentation and test coverage.


## 📁 Project Structure

```text
src/
├── array/
│   └── ArrayUtil.ts         # Utility functions for arrays
├── date/
│   └── DateUtil.ts          # Date and time helpers
├── object/
│   └── ObjectUtil.ts        # Object key transformation, deep merge, etc.
├── string/
│   └── StringUtil.ts        # String normalization, casing, etc.
```


## 🧪 Testing
All utility functions include unit tests powered by **Jest**.

```bash
npm install
npm run test
```


## 🛠️ Technologies
* TypeScript
* Jest
* ts-jest

## 🚀 Usage
You can import any utility function directly into your project:

```typescript
import { convertKeysToCamelCase } from './src/object/ObjectUtil';
```
adicione as pastas .claude/skills e .devin/skills tendo na pasta skills um symbolink de tudo dentro de .agents/skills
