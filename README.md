# Orbit: the LINKDGER example theme

Orbit is a dark, 3D and animated website theme for a shop on [LINKDGER](https://linkdger.com). Use it to learn how themes work, or as the
start of your own.

- **Guide:** https://linkdger.com/themes/guide
- **Websites made on LINKDGER:** https://linkdger.com/themes

## Use it

1. Download this repository (Code → Download ZIP) or clone it.
2. Change the files in `linkdger-orbit/`: HTML, CSS, `theme.json`, `products.json`, pictures and 3D models.
3. Zip the `linkdger-orbit` folder.
4. In the LINKDGER app: My shop → Settings → Website and theme → Your own theme → Upload a theme (.zip). For shops on Pro, Max and VIP.
5. Open the preview link, check every page on a phone and a computer, then tap Make live.

A page opened from your computer shows the `{{ values }}` as written and no animation. Upload it and open the preview link to see it with your
shop's data and LINKDGER's animation kit.

## What is inside

| Path | What it is |
|---|---|
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

The theme's files are under the MIT License (see `LICENSE`). The Inter font is under the SIL Open Font License 1.1
(`linkdger-orbit/fonts/LICENSE.txt`).
