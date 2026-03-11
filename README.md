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

## Release Automation

Release workflow runs on git tags in format `v*.*.*`.

What it does:

- Generates release notes with `git-cliff`
- Publishes a GitHub Release
- Sends optional Discord notification
- Builds app and deploys `dist/` to FTP/FTPS via reusable actions

## Reusable CI Modules

To reuse automation across projects, the workflow is split into reusable modules:

- `.github/actions/generate-release-notes` (git-cliff range + generation)
- `.github/actions/notify-discord-release` (Discord webhook notification)
- `.github/actions/build-react-app` (Node setup + install + React build)
- `.github/actions/deploy-ftp` (FTP/FTPS upload only)

You can copy these folders into other repositories with minimal workflow glue.

## Manual FTP Deploy

You can run FTP deploy manually without creating a release tag.

GitHub UI:

- Actions -> `Release` -> Run workflow
- Optional input `ref` (for example `main`, `v1.0.1`, or commit SHA)

GitHub CLI:

```bash
gh workflow run "Release" -f ref=main
```

Required repository secrets for FTP deployment:

- `FTP_HOST`
- `FTP_USERNAME`
- `FTP_PASSWORD`
- `FTP_REMOTE_DIR`

Optional repository secrets:

- `FTP_PORT` (defaults to `21`)
- `FTP_SECURE` (`true` enables FTPS)
- `DISCORD_RELEASE_WEBHOOK_URL`

## Author

**Beo**

## License

This project is licensed under the MIT License.
See the [LICENSE](./LICENSE) file for details.