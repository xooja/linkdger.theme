# LINKDGER themes: the theme tool and Orbit, the example theme

Make your shop's website theme on [LINKDGER](https://linkdger.com) from your own computer. This repository has **the theme tool** (a dev copy
that updates as you save, the app's check, new versions) and **Orbit**, a dark, 3D and animated example theme to learn from or start with.

- **Guide:** https://linkdger.com/themes/guide
- **Websites made on LINKDGER:** https://linkdger.com/themes

## The theme tool

You need [Node.js](https://nodejs.org/) 18 or newer and Git. Nothing else to install.

```sh
npx github:xooja/linkdger.theme login            # allow this computer on linkdger.com/themes/cli
npx github:xooja/linkdger.theme init my-theme    # a new folder from Orbit
cd my-theme
npx github:xooja/linkdger.theme dev              # your dev copy: it reloads by itself each time you save
npx github:xooja/linkdger.theme push             # a new version, checked as in the app (--live makes it live)
```

| Command | What it does |
|---|---|
| `login` | Opens linkdger.com/themes/cli: sign in with your LINKDGER number, check the code, tap Allow |
| `init [folder]` | A new folder from Orbit |
| `dev [folder]` | Your dev copy at its own address; only changed files are sent; the same check as an upload; `--once` sends it one time |
| `check [folder]` | The app's check; nothing is saved |
| `push [folder]` | A new version; `--live` makes it live, `--yes` without asking |
| `versions` | Your versions and their preview links |
| `whoami` | Your shop, plan, space and dev copy |
| `dev-remove` | Removes the dev copy now |
| `logout` | This computer can no longer change your theme |

- The tool can change your theme only: never your ledger, orders, chats or money. Its sign-in lasts 90 days and stays on your computer
  (`.linkdger/theme-tool.json` in your home folder). Remove a computer at any time on linkdger.com/themes/cli.
- The dev copy is never live and never in Google; it is gone 7 days after your last save. A problem (a password field, no `index.html`)
  shows in the terminal and the last good copy stays.
- For shops on Pro, Max and VIP. The tool's code is in `cli/linkdger-theme.mjs`.

## Make it with AI

Any AI coding tool (Claude Code, Codex, Cursor, GitHub Copilot, Gemini CLI, Windsurf and others) can make a theme with you through the tool.
`AGENTS.md` (here, and in every folder made with `init`) is the whole reference for the AI, also at https://linkdger.com/themes/llms.txt;
`CLAUDE.md`, `GEMINI.md` and `.github/copilot-instructions.md` point to it. The steps and a prompt to copy: https://linkdger.com/themes/ai.
The AI makes a version live only when you say so.

## Use Orbit without the tool

1. Download this repository (Code → Download ZIP) or clone it.
2. Change the files in `linkdger-orbit/`: HTML, CSS, `theme.json`, `products.json`, pictures and 3D models.
3. Zip the `linkdger-orbit` folder.
4. In the LINKDGER app: My shop → Settings → Website and theme → Your own theme → Upload a theme (.zip). For shops on Pro, Max and VIP.
5. Open the preview link, check every page on a phone and a computer, then tap Make live.

A page opened from your computer shows the `{{ values }}` as written and no animation. Use the tool's dev copy, or upload it and open the
preview link, to see it with your shop's data and LINKDGER's animation kit.

## What is inside

| Path | What it is |
|---|---|
| `cli/linkdger-theme.mjs` | The theme tool (`package.json` makes it the `npx` command) |
| `AGENTS.md`, `linkdger-orbit/AGENTS.md` | The reference for AI coding tools (with `CLAUDE.md`, `GEMINI.md` and `.github/copilot-instructions.md` pointing to it) |
| `linkdger-orbit/index.html` | The home page: a 3D scene, a product in 3D, ordering steps, the shop's products, a bundle, numbers, visit |
| `linkdger-orbit/story.html` | An extra page at `/story`: typewriter, parallax, a scroll scrub, a pinned 3D scene, pointer layers |
| `linkdger-orbit/product.html`, `products.html`, `category.html`, `404.html` | A product's page, Shop all, a category's page, not found |
| `linkdger-orbit/style.css` | The whole design. The colours are its first lines |
| `linkdger-orbit/theme.json` | Colours, fonts and the "starter" bundle |
| `linkdger-orbit/products.json` | Two sample products the theme brings; the app lists them for you to check and add |
| `linkdger-orbit/3d/`, `anim/`, `img/`, `products/`, `fonts/` | 3D models and scenes, Lottie animations, pictures, the sample products' photos, the Inter font |

A theme has no JavaScript: `{{ shop.name }}` and the other values, and the `<lk-…>` parts (products, cart, sign in, chat, search, bundles),
are filled with the shop's live data by LINKDGER, and animation comes from LINKDGER's kit through `data-lk-*` attributes and the
`<lk-scene>`, `<lk-model>`, `<lk-rive>` and `<lk-lottie>` tags.

## License

The theme tool and the theme's files are under the MIT License (see `LICENSE`). The Inter font is under the SIL Open Font License 1.1
(`linkdger-orbit/fonts/LICENSE.txt`).
