# Unit Golf

Unit Golf is a small React + Vite tool for converting and comparing CSS length units.
It helps you find compact alternatives with low pixel offset for a given input value and font context.

## Features

- Convert a value (for example `20px`) into multiple CSS units
- Sort results by compactness and pixel offset
- Click a unit value to copy it to the clipboard
- Theme support: `System`, `Light`, `Dark`
- Static build works in subfolders (relative asset paths)

## Tech Stack

- React 19
- Vite 7
- react-frame-component

## Requirements

- Node.js `>=24 <25`
- npm

## Getting Started

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Preview production build locally:

```bash
npm run preview
```

## Author

**Beo**

## License

This project is licensed under the MIT License.
See the [LICENSE](./LICENSE) file for details.
