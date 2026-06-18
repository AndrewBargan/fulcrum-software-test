# Development server

To start a local development server, run:

```bash
npm run start
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`

# Development tools

- This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.11.
- Zoneless approach
- Signals for reactivity
- Signal Form for "Add/Edit Book" form
- NgRx SignalStore for state management
- RxJs for debouncing search input
- Angular Material for UI/UX
- Vitest for unit tests. To execute unit tests, run:

```bash
npm run test:unit
```

- Playwright for end-to-end tests. To execute e2e tests, run:

```bash
npm run test:e2e
```

# Functionality

## Books Library data

- The app starts with sample book data already loaded in the store.
- You can upload a book XML file using the import button.
- Data, search keyword, and sorting are persisted even after page refresh.

## Import

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

## Export

- Export uses the current table state, including any active search filter or sort order.
