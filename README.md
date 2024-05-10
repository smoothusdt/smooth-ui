# Smooth PWA

[![Netlify Status](https://api.netlify.com/api/v1/badges/f16f0d2d-8bf1-4289-a098-5b2a735f6944/deploy-status)](https://app.netlify.com/sites/smoothusdt/deploys)

This is a PWA built in React which provides access to the [SmoothUSDT API](https://info.smoothusdt.com/) for the everyday person.

Live at [app.smoothusdt.com](https://app.smoothusdt.com/).

## Quickstart

1. `git clone https://github.com/smoothusdt/smooth-pwa.git`
2. `npm i`
3. `npm run dev`

## Expanding the ESLint configuration

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
   parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
   },
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list

## Quirks

The `package.json` currently has

```json
"overrides": {
   "@ledgerhq/errors": "6.16.3"
}
```

to overcome [this issue](https://github.com/anza-xyz/wallet-adapter/pull/949).
