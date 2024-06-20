# Smooth PWA

[![Netlify Status](https://api.netlify.com/api/v1/badges/f16f0d2d-8bf1-4289-a098-5b2a735f6944/deploy-status)](https://app.netlify.com/sites/smoothusdt/deploys)

>[!WARNING]
> This project is not actively mantained as of `2024-06-20`.

**Helping everyday people access USDT on Tron by removing the need to buy TRX tokens to pay for transactions. Live on Tron mainnet.**

This is a PWA which provides a simple, [diamo](https://daimo.com/) / [venmo](https://venmo.com/)-like experience to move USDT on Tron. This is done by accessing the [SmoothUSDT API](https://info.smoothusdt.com/). Live at [app.smoothusdt.com](https://app.smoothusdt.com/).

This project was built for [Backdrop Build v4](https://backdropbuild.com/builds/v5/smooth-usdt-9bha). You can mint our launch on [Forage](https://forage.xyz/p/01HZFS5B2Q10SKC66K4A4MEDJP).

## Development

Read the following to understand how to develop this project.

### Quickstart

1. `git clone https://github.com/smoothusdt/smooth-pwa.git`
2. `npm i`
3. `npm run dev`

### Deployment
`main` is the current stable release and is continuously deployed to [app.smoothusdt.com](https://app.smoothusdt.com/) on Netlify.

`develop` is a staging environment to test new features in a producation-like environment and is continuously deployed to [app-shasta.smoothusdt.com](https://app-shasta.smoothusdt.com) on Netlify. Note that this deployment is configured to operate on the shasta testnet.

### Updating the logo

The source of truth for the logo is `public/logo.svg`. This is a logo designed elsewhere and exported. To update the logo, update `public/logo.svg` and run `npm run generate-pwa-assets`. Make sure to copy the output to the web app manifest in `vite.config.ts` if names changed. [Learn more](https://vite-pwa-org.netlify.app/assets-generator/cli.html).

### Expanding the ESLint configuration

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

### Quirks

The `package.json` currently has

```json
"overrides": {
   "@ledgerhq/errors": "6.16.3"
}
```

to overcome [this issue](https://github.com/anza-xyz/wallet-adapter/pull/949).
