# Состав проекта

Исправление тестового задания на React 18, TypeScript и Vite.

## Запуск

Требуется Node.js 22.12+ (проверено на Node.js 24).

```sh
git clone https://github.com/VladimirEscolta/void-test.git
cd void-test
npm ci
npm run dev
```

Откройте адрес, показанный Vite в терминале (обычно http://127.0.0.1:5173).

```sh
npm test
npm run build
```

Причины ошибок и принятые решения описаны в [BUGFIX.md](BUGFIX.md).

`node_modules` и `dist` исключены из Git.
