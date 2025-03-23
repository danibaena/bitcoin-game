# Bitcoin game web app

## Technologies

This app is built as a Single Page Application using React 19 + Vite + Typescript

Other technologies used:

- Tailwind for styling
- ShadCN components
- React Query for state mananagement
- Vitest, Testing Library and MSW for testing

## Decisions

This project follows the [colocation principle](https://kentcdodds.com/blog/colocation) by putting related code/styles/tests closer to their implementation.
Also another decision made has been using barrel exports. Due to the size of the project its benefits for code maintainability

## Folder structure

This is a basic breakdown with the more relevant files/folders and its description:

```bash
.
├── components.json -> Configuration used by ShadCN
├── index.html -> Entrypoint for the SPA
├── package.json -> Project config and dependencies
├── public -> Favicon and other resources
│   ├── ...
├── src
│   ├── components -> All presentational components for the app,
│   │   ├── ...
│   │   └── ui -> Reusable UI components, both from ShadCN or custom made
│   │       └── ...
│   ├── constants -> It's honest, it includes constants :)
│   │   └── ...
│   ├── hooks -> Include every hook with the business logic
│   │   ├── ...
│   ├── index.css -> Global styles
│   ├── lib
│   │   ├── providers -> React context providers for the app
│   │   │   └── ...
│   │   └── utils.ts -> ShadCN util for dealing with classnames
│   ├── main.tsx -> Main component with all needed wiring
│   ├── mocks -> Testing mocks and utils
│   │   └── ...
│   ├── types -> Custom types for the app
│   │   └── ...
```

## Useful commands

- `npm test` Run tests
- `npm run build` Build the app
- `npm run dev` Start dev server, the http requests to API will be mocked with MSW
