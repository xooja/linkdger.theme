# Orbit: the LINKDGER example theme

A dark, 3D and animated theme for a shop's own LINKDGER website. Change it, or use it to learn, then upload it in the LINKDGER app.
The full guide: https://linkdger.com/themes/guide

## What is inside

| File | What it is |
|---|---|
| `index.html` | The home page: a 3D scene, a running strip, a product in 3D, ordering steps, the shop's products, numbers, visit |
| `story.html` | An extra page at `/story`: typewriter, parallax, a scroll scrub, a pinned 3D scene, pointer layers, clip reveals |
| `product.html` | Every product's page (`/p/...`) |
| `products.html` | Shop all (`/products`) |
| `category.html` | A category's page (`/c/...`) |
| `404.html` | The page for an address the theme does not have |
| `style.css` | The whole design. The colours are its first lines |
| `theme.json` | Colours and fonts, also used on LINKDGER's own pages of your site (cart, checkout, Your orders) |
| `3d/*.glb` | 3D models (a bottle and a gift box) |
| `3d/*.json` | 3D scenes for `<lk-scene>` |
| `anim/*.json` | Lottie animations for `<lk-lottie>` |
| `img/*.webp` | Pictures shown while 3D loads, and on phones in light mode |
| `fonts/inter.woff2` | The Inter font (SIL Open Font License 1.1, see `fonts/LICENSE.txt`) |

`{{ shop.name }}` and the other `{{ ... }}` values, and the `<lk-...>` parts (products, cart, sign in, chat, search), are filled with
your shop's live data by LINKDGER. A theme has no JavaScript: animation comes from LINKDGER's kit through `data-lk-*` attributes and
the `<lk-scene>`, `<lk-model>`, `<lk-rive>` and `<lk-lottie>` tags.

## Upload it

1. Zip this folder (the zip may have the folder inside it, or the files at its top).
2. In the LINKDGER app: My shop → Edit shop → Website and theme → Your own theme → Upload a theme (.zip). Pro, Max and VIP.
3. Open the preview link, check every page, then tap Make live.

README and LICENSE files are skipped when you upload; they never show on your site.
