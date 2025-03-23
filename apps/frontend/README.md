# Bitcoin game web app

## Technologies

This app is built as a Single Page Application using React 19 + Vite + Typescript

Other technologies used:

- Tailwind for styling
- ShadCN components
- React Query for state mananagement
- Vitest, Testing Library and MSW for testing

## Decisions

- This project follows the [colocation principle](https://kentcdodds.com/blog/colocation), keeping related code, styles, and tests close to their implementation
  for better maintainability and developer experience.

- Barrel exports are used to simplify and centralize module imports. Given the size of the project, the maintainability benefits outweigh the potential
  trade-offs.

- The app uses polling for the price API. Since guesses are resolved every 60 seconds, implementing a real-time API was deemed unnecessary at this stage—though
  it’s certainly something that could be added in the future.

- The game logic is managed through a single React context: This approach allows presentational components to access only the data they need, while also making
  the logic easier to test. The trade-off here is that, although some logic has been split into smaller custom hooks, the `useGameState` hook remains quite
  large, which may affect maintainability. A possible improvement would be to move most of the game logic to the backend, keeping the frontend as "dumb" as
  possible.

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

- `npm test` - Run tests
- `npm run build` - Build the app
- `npm run dev` - Start dev server, the http requests to API will be mocked with MSW
