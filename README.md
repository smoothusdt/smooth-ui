# Smooth UI

**Helping everyday people access USDT on Tron by removing the need to buy TRX tokens to pay for transactions. Live on Tron mainnet.**

This is a web application which provides a simple, [diamo](https://daimo.com/) / [venmo](https://venmo.com/)-like experience to move USDT on Tron. This is done by accessing the [SmoothUSDT API](https://info.smoothusdt.com/). Live at [app.smoothusdt.com](https://app.smoothusdt.com/).

This project was built for [Backdrop Build v4](https://backdropbuild.com/builds/v5/smooth-usdt-9bha). You can mint our launch on [Forage](https://forage.xyz/p/01HZFS5B2Q10SKC66K4A4MEDJP).

<p align="center">
   <a href="https://youtu.be/IigIIiMYoXc?si=1Cfj4Ap3hfKm13a0" target="_blank" " align="center">
      <img src="https://img.youtube.com/vi/IigIIiMYoXc/hqdefault.jpg" alt="Video Demo of SmoothUSDT" width="300">
   </a>
</p>

## Development

Read the following to understand how to develop this project.

### Quickstart

1. `git clone https://github.com/smoothusdt/smooth-ui.git`
2. `npm i`
3. `npm run dev`

### Deployment

`main` is the current stable release and is continuously deployed to [app.smoothusdt.com](https://app.smoothusdt.com/) on Netlify.

`develop` is a staging environment to test new features in a producation-like environment and is continuously deployed to [app-shasta.smoothusdt.com](https://app-shasta.smoothusdt.com) on Netlify. Note that this deployment is configured to operate on the shasta testnet.

### Updating the logo

The source of truth for the logo is `public/logo.svg`. This is a logo designed elsewhere and exported. To update the logo, update `public/logo.svg` and run `npm run generate-pwa-assets`. Make sure to copy the output to the web app manifest in `vite.config.ts` if names changed. [Learn more](https://vite-pwa-org.netlify.app/assets-generator/cli.html).

Note: Looks like there is a bug where you need to rename `apple-touch-icon-180x180.png` to `apple-touch-icon.png` so that it is referenced correctly in the built `index.html`.

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
