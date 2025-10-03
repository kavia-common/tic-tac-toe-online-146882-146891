# Tic Tac Toe – Ocean Professional (React)

A modern, minimal Tic Tac Toe game built with React and styled using the Ocean Professional theme (blue & amber accents, subtle shadows, rounded corners, smooth transitions).

## Features

- Two modes: Player vs Player and Player vs AI (basic strategy)
- Clean separation of components: Board, Square, Controls, Game Mode Selector, Status
- Visual emphasis for:
  - Winning state (highlighted line)
  - Player turn (accent pill)
  - Reset action (gradient accent button)
- Accessible: ARIA roles/labels, status updates via aria-live
- Responsive layout and fluid typography

## Quick Start

- Install dependencies: `npm install`
- Start dev server: `npm start` (http://localhost:3000)
- Run tests: `npm test`
- Build for production: `npm run build`

## Structure

- `src/App.js` – Main app, game state and components
- `src/App.css` – Theme variables and modern UI styling
- `src/index.js`, `src/index.css` – Entry and base styles

## Customization

Theme colors defined in `App.css` under `:root` with variables:
- `--primary` (blue), `--secondary` (amber), `--error` (red), `--bg`, `--surface`, `--text`, `--text-subtle`, `--border`, `--focus`

You can tweak spacing, border radii, and shadow values for a sharper or softer aesthetic.

## Notes

No backend integration required. All logic is client-side.
