# FulcrumSoftwareTest

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.11.

## Development server

To start a local development server, run:

```bash
npm run start
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`

## Functionality

### Initial data

- The app starts with sample book data already loaded in the store.
- You can upload a book XML file using the import button.

### Import

- Imported XML files must use the following structure:

```xml
<books>
  <book>
    <id>87f0fd10-682e-483c-8f2d-2ef9219e9bc3</id>
    <author>Hans Christian Andersen</author>
    <title>The Emperor's New Clothes</title>
  </book>
  <book>
    <id>1ee68934-dea0-4f52-9013-f84c151693e5</id>
    <author>Hans Christian Andersen</author>
    <title>The Little Match Girl</title>
  </book>
</books>
```

- If the XML format is invalid, the import reports an error.
- If a book with the same `id` already exists, it is ignored.

### Export

- Export uses the current table state, including any active search filter or sort order.

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store build artifacts in the `dist/` directory.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```
