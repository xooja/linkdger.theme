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
| `products.json` | Two sample products the theme brings (a bottle and a gift box). After you upload, the app lists them for you to check and add |
| `products/*.webp` | The sample products' photos |

## Products and bundles

- `<lk-products>` shows your shop's live products in this theme's own card.
- `<lk-product sku="ORBIT-BOTTLE">` shows one product by its SKU (or `code="…"`, the 8 letters at the end of its address). It shows
  nothing until your shop has that product.
- A bundle is a set in `theme.json` (`"sets": {"starter": {"title": "Starter set", "items": ["ORBIT-BOTTLE", "ORBIT-GIFT"]}}`).
  `<lk-set name="starter">` shows its section only when your shop has its products; `<lk-add-all set="starter">` puts every product in
  the cart, each at its own price.
- `products.json` lists products the theme brings, with their SKU, name, price (in your shop's currency), unit, category id, description
  and photos. To show on your website, a product needs 2 photos, a category and a description. Change the samples to your own products,
  or delete the file.

`{{ shop.name }}` and the other `{{ ... }}` values, and the `<lk-...>` parts (products, cart, sign in, chat, search), are filled with
your shop's live data by LINKDGER. A theme has no JavaScript: animation comes from LINKDGER's kit through `data-lk-*` attributes and
the `<lk-scene>`, `<lk-model>`, `<lk-rive>` and `<lk-lottie>` tags.

## Upload it

1. Zip this folder (the zip may have the folder inside it, or the files at its top).
2. In the LINKDGER app: My shop → Edit shop → Website and theme → Your own theme → Upload a theme (.zip). Pro, Max and VIP.
3. Open the preview link, check every page, then tap Make live.

README and LICENSE files are skipped when you upload; they never show on your site.
