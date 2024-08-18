# Rentry Encryptor

Rentry Encryptor is a browser extension that allows you to encrypt markdown content before posting it to rentry.co.

## Features

- Encrypt markdown content before posting to rentry.co
- Decrypt content when editing existing encrypted entries
- Preview encrypted content before submission
- Supports both Chrome and Firefox browsers

## Development

This project uses Vite for fast development and building, and pnpm as the package manager. Here are the available scripts:

### Setup

1. Clone the repository
2. Install dependencies:
   ```
   pnpm install
   ```

### Development

- For Chrome development:
  ```
  pnpm dev
  ```

- For Firefox development:
  ```
  pnpm dev:firefox
  ```

### Building

- For Chrome:
  ```
  pnpm build
  ```

- For Firefox:
  ```
  pnpm build:firefox
  ```

### Production Build

To create a production-ready web extension package:

```
pnpm prod:build
```

### Adding the Extension to Your Browser

#### Chrome

1. Open Chrome and navigate to `chrome://extensions/`.
2. Enable "Developer mode" by toggling the switch in the top right corner.
3. Click on "Load unpacked" and select the `dist` directory from your project.

Alternatively, you can use the production build:
1. Run `pnpm prod:build` to create a production-ready web extension package.
2. Drag and drop the generated `.zip` file from the `web-ext-artifacts` directory into the Chrome extensions page.

#### Firefox

1. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`.
2. Click on "Load Temporary Add-on..."
3. Select the `manifest.json` file from the `dist` directory in your project.

Alternatively, you can use the production build:
1. Run `pnpm prod:build` to create a production-ready web extension package.
2. In Firefox, go to `about:addons`.
3. Click the gear icon and select "Install Add-on From File..."
4. Choose the `.zip` file from the `web-ext-artifacts` directory.

Now your extension should be loaded and ready to use in your browser.

