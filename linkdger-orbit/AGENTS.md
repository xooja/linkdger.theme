# LINKDGER themes: the reference for AI coding tools

> A shop on LINKDGER (https://linkdger.com) with the Pro, Max or VIP plan can give its website (`<shop>.linkdger.com`, and its own domain on Max and VIP) its own theme: plain HTML and CSS pages that LINKDGER fills with the shop's live data and animates with LINKDGER's kit. This file is the whole method for an AI coding tool (Claude Code, Codex, Cursor, GitHub Copilot, Gemini CLI, Windsurf and others): the rules, the theme tool's commands, every value, part and animation, and the limits.

- Updated: 25 Nov 2026 (theme tool 1.0.x)
- This file: https://linkdger.com/themes/llms.txt (a theme made with `init` has the same text as AGENTS.md)
- The guide for people, with live demos: https://linkdger.com/themes/guide
- Making a theme with AI, for people: https://linkdger.com/themes/ai
- The theme tool and the example theme Orbit: https://github.com/xooja/linkdger.theme

## 1. Rules for the AI (read first)

1. **A theme has no JavaScript.** No `<script>`, no `on…` attributes (`onclick` and the like), no `javascript:` links, no forms or text fields (`<form>`, `<input>`, `<textarea>`, `<select>`). The check takes them out. Movement, 3D and interaction come from LINKDGER's kit: `data-lk-*` attributes and the `<lk-…>` tags (section 8).
2. **Never a password or code field.** A page with one is refused: sign-in is always LINKDGER's.
3. **Never type the shop's data into the files.** The name, phone, address, hours, products, prices and photos come from values (`{{ shop.name }}`) and parts (`<lk-products>`), always live. Prices arrive formatted in the shop's currency.
4. **Everything a page loads lives in the theme folder:** pictures, video, fonts, 3D models, Lottie and Rive files. Outside addresses do not load; the only outside things allowed are Google Fonts and YouTube, Vimeo and Google Maps embeds. Product photos come through the values.
5. **Commands you may run yourself:** `whoami`, `init`, `dev`, `dev --once`, `check`, `push` (a new version, not live) and `versions`.
6. **A version goes live only when the seller asks.** Never run `push --live` (or make a version live in any other way) unless the seller asked for it in this conversation. Otherwise tell them the version is ready and that they can make it live in the LINKDGER app (My shop → Settings → Website and theme) or ask you to.
7. **Sign-in is the seller's.** `login` prints a link and a code: show both to the seller and wait while they sign in on linkdger.com and tap Allow. Never sign in for them, never type a password or a code, and never print, copy or move the key or its file (`.linkdger/theme-tool.json` in the home folder).
8. Run `logout` or `dev-remove` only when the seller asks.
9. Write the theme's words in the seller's language, make every page work on a phone first, and keep it fast (section 9).

## 2. The theme tool

It needs Node.js 18 or newer and Git; nothing to install. Every command is `npx github:xooja/linkdger.theme <command>` (the first run downloads it from GitHub, a few seconds).

| Command | What it does |
|---|---|
| `login` | Prints a link (`https://linkdger.com/themes/cli?code=…`) and a code, then waits up to 10 minutes while the seller signs in and taps Allow. Then this computer can change that shop's theme (and nothing else) for 90 days. |
| `whoami` | The shop, its website, its plan, the theme space used and the dev copy. |
| `init [folder]` | A new folder from Orbit, the example theme (3D, scroll effects, products, a bundle). The folder must be new or empty (default `my-theme`). |
| `dev [folder]` | Sends the folder as the shop's **dev copy**, prints its address, then keeps watching and sends each save (only the changed files). `--once` sends one time and stops. |
| `check [folder]` | The upload's check without saving anything: the pages, what it would change, the size. |
| `push [folder]` | Uploads a new version and waits for its check: Ready (with a preview address for 7 days) or the problem. `--live` also makes it live (it asks first; `--yes` does not ask). |
| `versions` | Every version: its number, status (LIVE, Ready, Old, Checking, Problem), date and preview address. |
| `dev-remove` | Removes the dev copy now. |
| `logout` | This computer can no longer change the theme. |

Without `[folder]` the command works in the current folder. Exit code 0 is success. A line starting with `×` (and exit code 1) is a problem: read it, fix it, run the command again.

### The dev copy

- Its address is `https://lkp-….linkdger.com/`: the theme with the shop's real data, a strip "Dev copy · updates as you save · not live" at the top, never in Google, seen only by people who have the link.
- A page left open **reloads by itself** a few seconds after each send, at the same scroll place.
- Each send runs the same check as an upload. The terminal shows `Revision N · K files sent` and what the check changed. A problem (for example no `index.html`) shows with `×`, and the dev copy keeps its last good version.
- It is never live, and it is removed 7 days after its last change.
- `dev` keeps running. If your tool waits for each command to end, start `dev` in the background, or run `dev --once` after each set of edits.
- A page opened from the disk shows the `{{ values }}` as written and no animation: always look at the dev copy's address.

## 3. A typical session

1. `node -v` (18 or newer), then `npx github:xooja/linkdger.theme whoami`. If it says "Sign in first", run `login` and give the seller the link and the code.
2. A new theme: `npx github:xooja/linkdger.theme init my-theme` and work in `my-theme`. Or work in the seller's own folder.
3. Start `npx github:xooja/linkdger.theme dev` in the theme folder (in the background) and give the seller the dev copy's address. On a phone it shows the phone layout.
4. Make the pages (sections 4 to 8). After each set of edits, read the check's lines and fix what it removed.
5. `npx github:xooja/linkdger.theme check`, then `npx github:xooja/linkdger.theme push`. Tell the seller the version's number and its preview address.
6. Live only when the seller says so: `npx github:xooja/linkdger.theme push --live --yes`, or the seller taps Make live in the app.

## 4. Folder and pages

| File | Opens at | What it is |
|---|---|---|
| `index.html` | `/` | The home page. **Needed**, at the folder's top. |
| `story.html`, `lookbook.html`, … | `/story`, `/lookbook` | Any page you add; `gallery/index.html` opens at `/gallery`. |
| `product.html` | `/p/…` | Every product's page, with the `{{ product.* }}` values. Without it: LINKDGER's product page in the theme's colours. |
| `products.html` | `/products` | Shop all, and search results (`/products?q=…`). |
| `category.html` | `/c/…` | A category's page. Without it: LINKDGER's, in the theme's colours. |
| `404.html` | any other address | The "not found" page. |
| `theme.json` | (not a page) | Colours, fonts and sets (section 7). |
| `products.json` | (not a page) | Products the theme brings (section 6). Read by the check, never served. |
| `preview.webp` (or `.mp4`, `.png`, `.jpg`, `.gif`) | (not a page) | An optional picture of the theme. |

- These addresses are always LINKDGER's, in the theme's colours, and theme files there are skipped: `/cart` (cart and checkout), `/orders` (Your orders and sign-in), `/chats`, `/auth`, `/checkout`, `/o/…`, `/web/…`, `/l/…`, `robots.txt`, `sitemap.xml`, `manifest.json`, `favicon…`, `apple-touch-icon…`, `brand.svg`, `og-image.jpg`. `/reviews` and `/about` are LINKDGER's unless the theme has a page with that name.
- Link pages with plain links: `<a href="/story">Our story</a>`, `<a href="/products">Shop all</a>`, `<a href="/cart">Cart</a>`.
- Write each page as a whole document: `<!doctype html>`, `<html lang="…">`, a `<head>` with `<meta charset="utf-8">`, `<meta name="viewport" content="width=device-width,initial-scale=1">`, `<title>`, `<meta name="description">` and `<link rel="stylesheet" href="/style.css">`.
- Use addresses from the site's root (`/style.css`, `/img/hero.webp`): a page can open at a deeper address such as `/p/…` or `/c/…`.
- LINKDGER adds to every page: its own script, the kit's loader, the cart's message, a small "Powered by LINKDGER" line at the bottom, and on preview and dev addresses a strip at the top.

## 5. Values

Write `{{ name }}` anywhere in a page, also inside attributes (`alt="{{ shop.name }}"`). LINKDGER writes the value as text (never as HTML). A name it does not know becomes empty.

### Every page

| Value | What it is |
|---|---|
| `{{ shop.name }}` | The shop's name |
| `{{ shop.about }}` | The shop's "about" text |
| `{{ shop.kind }}` | The shop's category |
| `{{ shop.city }}` | The shop's city and area (`{{ shop.place }}` is the same) |
| `{{ shop.address }}` | The address |
| `{{ shop.phone }}` | The shop's public phone number |
| `{{ shop.open }}` | "Open now" or "Closed now", from its hours |
| `{{ shop.rating }}`, `{{ shop.reviews }}` | The rating out of 10 and the number of reviews |
| `{{ shop.products }}` | How many products the website shows |
| `{{ shop.logo }}`, `{{ shop.cover }}` | Addresses of the logo and the cover photo (for `<img src>`) |
| `{{ shop.initials }}` | The shop's initials, for a logo without a picture |
| `{{ shop.url }}` | The website's address |
| `{{ shop.directions }}`, `{{ shop.map }}` | Directions to the shop, and its place on a map |
| `{{ year }}` | This year, for © |
| `{{ page.title }}` | This page's title |

### On product.html

| Value | What it is |
|---|---|
| `{{ product.name }}` | The product's name |
| `{{ product.price }}`, `{{ product.unit }}` | Its price with the currency, and its unit or pack |
| `{{ product.description }}` | Its description (`{{ product.about }}` is the same) |
| `{{ product.category }}` | Its category |
| `{{ product.image }}` | Its first photo |
| `{{ product.rating }}` | Its rating |
| `{{ product.stock }}` | "In stock", "Out of stock" or empty |

### On products.html and category.html

| Value | What it is |
|---|---|
| `{{ category.name }}` | The category's name, or "All products" |
| `{{ list.count }}` | How many products the page lists |
| `{{ list.page }}`, `{{ list.pages }}` | This page's number and the number of pages |
| `{{ list.q }}` | What the visitor searched for |

### Inside a product card (`<lk-products>`, `<lk-product>`)

| Value | What it is |
|---|---|
| `{{ item.name }}` | The product's name |
| `{{ item.price }}` | Its price |
| `{{ item.old }}` | Its price before a discount, or empty |
| `{{ item.pack }}` | Its pack or unit |
| `{{ item.image }}` | Its photo (a product without a photo gets its category's icon) |
| `{{ item.url }}` | Its page on the website |
| `{{ item.rating }}` | Its rating |
| `{{ item.sku }}` | Its SKU |

### Sets (bundles)

Inside `<lk-set>`: `{{ set.title }}`, `{{ set.count }}`, `{{ set.total }}` (the products' prices together). Anywhere on a page: `{{ sets.<name>.title }}`, `{{ sets.<name>.count }}`, `{{ sets.<name>.total }}`.

## 6. Parts

Parts are LINKDGER's working pieces. Place them where you like; each comes with a plain look that the theme's CSS changes through its class.

| Part | Settings | Makes (style these classes) |
|---|---|---|
| `<lk-products>` | `limit` (1 to 48; 8 by default, 24 on products.html and category.html), `category` (a big category's id such as `drinks`, the word after `/c/` in its page's address; or `current` on category.html), `set` (a set from theme.json) | The shop's products in `.lk-products`. Its inside is the theme's own card, repeated for each product; empty, it is LINKDGER's card `.lk-card`. |
| `<lk-add-to-cart>` | `text` | An Add to cart button `.lk-add-to-cart`, inside a card or on product.html |
| `<lk-product>` | `sku` or `code` | One product in the theme's design (its inside) in `.lk-product`, or nothing when the shop does not have it |
| `<lk-set>` | `name` | A set's section: its inside only when the shop has the set's products, with `{{ set.* }}` |
| `<lk-add-all>` | `set`, `text` | Puts every product of a set in the cart, one each, at its own price: `.lk-add-all` |
| `<lk-categories>` | none | Links to the shop's categories: `.lk-categories` with `.lk-category` |
| `<lk-search>` | `placeholder`, `text` | A search box that opens Shop all: `.lk-search` |
| `<lk-cart-button>` | `text` | The cart link with its count: `.lk-cart-button`, `.lk-count` |
| `<lk-signin-button>` | `text` | Sign in and Your orders: `.lk-signin-button` |
| `<lk-chat-button>` | `text` | Chat with the shop: `.lk-chat-button` |
| `<lk-product-gallery>` | none | The product's photos, on product.html: `.lk-gallery` |
| `<lk-shop-logo>` | none | The logo, or the initials: `.lk-logo` |
| `<lk-rating>` | none | "★ rating · reviews", linking to the reviews: `.lk-rating` (nothing before the first review) |
| `<lk-hours>` | none | The opening hours: `.lk-hours` |
| `<lk-directions>` | `text` | Directions to the shop: `.lk-directions` |

Write every part with its closing tag: `<lk-cart-button text="Bag"></lk-cart-button>`.

A theme's own product card:

```html
<lk-products limit="8">
  <article class="card" data-lk-animate="rise" data-lk-tilt="7" data-lk-glare>
    <a class="card-img" href="{{ item.url }}"><img src="{{ item.image }}" alt="{{ item.name }}" loading="lazy"></a>
    <a class="card-name" href="{{ item.url }}">{{ item.name }}</a>
    <p class="card-price"><b>{{ item.price }}</b> <s>{{ item.old }}</s> <small>{{ item.pack }}</small></p>
    <lk-add-to-cart text="Add to cart"></lk-add-to-cart>
  </article>
</lk-products>
```

### One product anywhere

`<lk-product sku="…">` shows one product by its SKU (the "SKU (optional)" field of a product in the app; capital or small letters both match), or `<lk-product code="…">` by its link code: the 8 letters at the end of its address, as in `/p/basmati-rice-aaaa0001`. Inside it: the theme's design with `{{ item.* }}` and `<lk-add-to-cart>`; empty, LINKDGER's card. When the shop does not have the product it shows nothing.

```html
<lk-product sku="ORBIT-BOTTLE">
  <div class="buy">
    <a href="{{ item.url }}">{{ item.name }}</a> <b>{{ item.price }}</b>
    <lk-add-to-cart text="Add to cart"></lk-add-to-cart>
  </div>
</lk-product>
```

### Bundles (sets)

A set lives in theme.json: a name (small letters, digits and `_`, up to 30) with its products by SKU or `"code:…"` (up to 48, in order), or a category with a limit. Up to 20 sets.

```json
{
  "sets": {
    "starter": { "title": "Starter set", "items": ["ORBIT-BOTTLE", "ORBIT-GIFT"] },
    "drinks":  { "title": "Cold drinks", "category": "drinks", "limit": 8 }
  }
}
```

```html
<lk-set name="starter">
  <h2>{{ set.title }}</h2>
  <p>{{ set.count }} products · {{ set.total }} together</p>
  <lk-add-all set="starter" text="Add all to cart"></lk-add-all>
  <lk-products set="starter"> … the card … </lk-products>
</lk-set>
```

A set a page uses but theme.json does not have shows nothing, and the check says `Not found: set "…"`.

### products.json: products the theme brings

Put `products.json` next to index.html, with its photos inside the theme. After a push, the version in the app lists them: **found** (the shop has the SKU), **new** (in products.json, not in the shop) and **missing** (a page uses it, but it is in neither). The seller checks the new ones in the app and adds them; the AI cannot add products. The plan's product limit counts.

```json
{
  "products": [
    {
      "sku": "ORBIT-BOTTLE",
      "name": "Glass Bottle 1 L",
      "price": 1250,
      "unit": "piece",
      "category": "home.kitchenware",
      "description": "A clear 1 litre glass bottle with a black metal cap.",
      "photos": ["products/bottle-1.webp", "products/bottle-2.webp"],
      "packs": [{ "name": "Set of 3", "price": 3500 }]
    }
  ]
}
```

| Key | What it is |
|---|---|
| `sku` | Needed. Letters, digits and `. _ / -` (up to 100); each product its own |
| `name` | Needed, up to 200 characters |
| `price` | Needed: a number, in the shop's currency |
| `unit` | Up to 20 characters: piece, kg, box… |
| `category` | A category id from the list below |
| `description` | Up to 2,000 characters |
| `photos` | Files of the theme (`.webp`, `.png` or `.jpg`), up to 20 |
| `packs` | Other packs, each with its `name` and `price` |

Up to 200 products. To show on the website a product needs **2 photos, a category and a description** (LINKDGER's rule for every product on the web).

Category ids: products.json takes the whole id (`<category>.<type>`, such as `drinks.soft`). The first word alone (such as `drinks`) is the big category, used by `/c/<id>` pages, `<lk-products category="…">` and a set's `category` (a set also takes a whole id).

- **Grocery & staples**: `grocery.rice` Rice, `grocery.flour` Flour & atta, `grocery.pulses` Pulses & daal, `grocery.oil` Cooking oil & ghee, `grocery.sugar` Sugar, salt & gur, `grocery.spices` Spices & masala, `grocery.tea` Tea & coffee, `grocery.dryfruit` Dry fruits & nuts, `grocery.other` Other grocery
- **Fresh food & dairy**: `fresh.fruit` Fruit, `fresh.vegetables` Vegetables, `fresh.meat` Meat & chicken, `fresh.fish` Fish, `fresh.dairy` Milk, yogurt & cheese, `fresh.eggs` Eggs, `fresh.other` Other fresh food
- **Drinks & snacks**: `drinks.soft` Soft drinks, `drinks.juice` Juices, `drinks.water` Water, `drinks.biscuits` Biscuits & rusk, `drinks.chips` Chips & nimko, `drinks.sweets` Chocolates & sweets, `drinks.bakery` Bakery & bread, `drinks.mithai` Mithai, `drinks.other` Other drinks & snacks
- **Food & catering**: `food.meals` Meals & tiffin, `food.fastfood` Fast food, `food.catering` Catering & deg, `food.frozen` Frozen food, `food.other` Other food
- **Household & cleaning**: `household.detergent` Detergent & washing, `household.soap` Soap & dishwash, `household.cleaners` Floor & toilet cleaners, `household.tissue` Tissue & paper, `household.plastic` Plastic & bins, `household.pest` Pest control, `household.other` Other household
- **Beauty & personal care**: `beauty.skin` Skin care, `beauty.hair` Hair care, `beauty.makeup` Makeup, `beauty.perfume` Perfume & attar, `beauty.shaving` Shaving & grooming, `beauty.baby` Baby care, `beauty.other` Other beauty & care
- **Health & medical**: `health.medicines` Medicines, `health.devices` Medical devices, `health.surgical` Surgical items, `health.firstaid` First aid, `health.supplements` Vitamins & supplements, `health.other` Other health
- **Stationery & books**: `stationery.paper` Paper & notebooks, `stationery.pens` Pens & writing, `stationery.school` School supplies, `stationery.office` Office supplies, `stationery.books` Books, `stationery.printing` Printing & photocopy, `stationery.other` Other stationery
- **Mobiles & computers**: `mobiles.phones` Mobile phones, `mobiles.accessories` Mobile accessories, `mobiles.laptops` Laptops & computers, `mobiles.parts` Computer parts, `mobiles.tablets` Tablets, `mobiles.network` Networking & internet, `mobiles.other` Other mobiles & computers
- **Electronics & appliances**: `electronics.tv` TV & audio, `electronics.kitchen` Kitchen appliances, `electronics.fridge` Fridges & washing machines, `electronics.cooling` AC & air coolers, `electronics.small` Irons, heaters & small appliances, `electronics.cameras` Cameras & CCTV, `electronics.other` Other electronics
- **Electrical & solar**: `electrical.wires` Wires & cables, `electrical.switches` Switches & sockets, `electrical.lights` Lights & LED, `electrical.fans` Fans, `electrical.ups` UPS & batteries, `electrical.solar` Solar panels & inverters, `electrical.other` Other electrical
- **Hardware & building**: `hardware.cement` Cement & sand, `hardware.bricks` Bricks & blocks, `hardware.steel` Steel & iron, `hardware.paint` Paint, `hardware.sanitary` Sanitary & plumbing, `hardware.tiles` Tiles & marble, `hardware.tools` Tools, `hardware.wood` Wood & doors, `hardware.other` Other hardware
- **Clothes & fashion**: `clothes.men` Men, `clothes.women` Women, `clothes.kids` Kids, `clothes.fabric` Fabric & unstitched, `clothes.shoes` Shoes, `clothes.bags` Bags & wallets, `clothes.jewellery` Jewellery & watches, `clothes.other` Other clothes & fashion
- **Home & furniture**: `home.furniture` Furniture, `home.bedding` Bedding & curtains, `home.carpets` Carpets & rugs, `home.kitchenware` Kitchenware & crockery, `home.decor` Home decor, `home.other` Other home
- **Auto parts & vehicles**: `auto.carparts` Car parts, `auto.bikeparts` Bike parts, `auto.tyres` Tyres & tubes, `auto.batteries` Batteries, `auto.oil` Engine oil, `auto.accessories` Accessories, `auto.vehicles` Cars & bikes, `auto.other` Other auto
- **Farming & animals**: `farming.seeds` Seeds, `farming.fertilizer` Fertilizer, `farming.sprays` Sprays & pesticides, `farming.feed` Animal feed, `farming.tools` Farm tools & machines, `farming.animals` Animals & livestock, `farming.other` Other farming
- **Packaging & industrial**: `packaging.cartons` Cartons & boxes, `packaging.bags` Shopping bags & plastic, `packaging.disposables` Disposables, `packaging.chemicals` Chemicals, `packaging.raw` Raw materials, `packaging.machinery` Machinery & parts, `packaging.other` Other packaging & industrial
- **Services**: `services.repair` Repair & maintenance, `services.transport` Transport & delivery, `services.printing` Printing & design, `services.construction` Construction & labour, `services.cleaning` Cleaning, `services.tailoring` Tailoring, `services.events` Events & decoration, `services.other` Other services
- **Toys, gifts & sports**: `toys.toys` Toys, `toys.gifts` Gifts & party, `toys.sports` Sports goods, `toys.hobby` Hobby & crafts, `toys.other` Other toys & gifts
- **Other**: `other.other` Other

## 7. theme.json

```json
{
  "colors": { "accent": "#FF7A45", "background": "#0E0F13", "surface": "#171A21", "text": "#F5F6F8", "muted": "#A0A6B1" },
  "fonts": {
    "body":    { "family": "Inter", "file": "fonts/inter.woff2" },
    "heading": { "family": "Inter", "file": "fonts/inter.woff2" }
  },
  "sets": { }
}
```

- LINKDGER's pages on the website (cart, checkout, Your orders, chat, and the product and category pages a theme does not have) take these colours and fonts, so the whole site looks like one.
- Colours are `#RGB` or `#RRGGBB`. A font is a file of the theme (`.woff2`, `.woff`, `.ttf` or `.otf`). Pages may also load Google Fonts with `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?…">`.

## 8. The animation kit

No JavaScript: tags and `data-lk-*` attributes, and LINKDGER's kit (three.js, Google's model-viewer, Lottie, Rive and Motion inside) does the rest. A page loads only the parts of the kit it uses.

### Reveal on scroll

`data-lk-animate="<preset>"` shows an element with a movement as it comes on screen. Presets: `fade`, `fade-up`, `fade-down`, `fade-left`, `fade-right`, `zoom-in`, `zoom-out`, `flip-up`, `flip-left`, `blur-in`, `rise`, `pop`, `spin-in`, `clip-up`, `clip-left`, `clip-circle`, `skew-up`.

- `data-lk-delay` and `data-lk-duration`: milliseconds.
- `data-lk-repeat`: plays again each time it comes back on screen.
- `data-lk-stagger="80"` on a parent: its children come one after another (ms between them).

```html
<h2 data-lk-animate="fade-up">New this week</h2>
<div class="grid" data-lk-stagger="80">
  <div class="tile" data-lk-animate="rise">One</div>
  <div class="tile" data-lk-animate="rise">Two</div>
</div>
```

### Text and numbers

- `data-lk-split="words"` (or `chars`) with `data-lk-animate`: words or letters come in one after another.
- `data-lk-typewriter="45"`: types the line (ms a letter).
- `data-lk-counter="12500"`: counts up when on screen; with `data-lk-from`, `data-lk-prefix`, `data-lk-suffix`, `data-lk-decimals`.

```html
<h1 data-lk-split="chars" data-lk-animate="fade-up">{{ shop.name }}</h1>
<p data-lk-typewriter="45">Fresh every morning.</p>
<b data-lk-counter="{{ shop.products }}">{{ shop.products }}</b> products
```

### Scroll effects

- `data-lk-scroll="y 80 -80; opacity 0 1"`: moves values with the scroll while the element crosses the screen. Properties: `x`, `y`, `scale`, `rotate`, `rotateX`, `rotateY`, `opacity`, `blur`.
- `data-lk-parallax="0.3"`: moves slower than the page (negative: the other way).
- `data-lk-pin`: a tall section whose first child stays on screen while the section scrolls (give the section a height, such as `250vh`).
- Each of these sets the CSS variable `--lk-progress` (0 to 1) for the theme's own CSS; `data-lk-progress` gives only that.

```html
<section class="steps" data-lk-pin style="height:250vh">
  <div class="stage">
    <div class="bar" style="width: calc(var(--lk-progress) * 100%)"></div>
  </div>
</section>
```

### Mouse and finger

- `data-lk-tilt="12"`: a card turns toward the pointer (degrees); `data-lk-glare` adds a light.
- `data-lk-magnetic="0.35"`: a button is pulled toward the pointer.
- `data-lk-pointer`: gives `--lk-mx` and `--lk-my` (-1 to 1) for layers that follow the pointer.
- `<body data-lk-cursor="ring">` (or `dot`): a drawn cursor on computers.
- `data-lk-hover="lift"` (or `grow`, `glow`, `shine`): hover effects that work even without the kit.
- `data-lk-marquee="60"`: a strip that runs sideways forever (pixels a second; negative: the other way); it stops while the mouse is over it.

```html
<div class="scene" data-lk-pointer>
  <img class="layer" src="/img/planet.webp" alt="">
</div>
<style>
  .layer { transform: translate(calc(var(--lk-mx) * 30px), calc(var(--lk-my) * 30px)); }
</style>
```

### 3D models: `<lk-model>`

Shows a `.glb` (or `.gltf`) model: turn it by mouse or finger, zoom, and see it in a room on a phone (`ar`). `<lk-hotspot>` pins a label to a point of the model.

```html
<lk-model src="/3d/bottle.glb" poster="/img/bottle-poster.webp" alt="A glass bottle with a black cap"
          ar ios-src="/3d/bottle.usdz" camera-orbit="25deg 75deg auto" exposure="1.05">
  <lk-hotspot position="0 0.95 0.25" normal="0 0 1">Metal cap</lk-hotspot>
</lk-model>
```

| Setting | What it does |
|---|---|
| `src`, `poster`, `alt` | The model, its picture while it loads (and on weak phones), and words for screen readers |
| `auto-rotate` | Turns by itself (on unless `auto-rotate="false"`) |
| `camera-controls` | Turn and zoom by mouse or finger (on unless `camera-controls="false"`) |
| `ar`, `ios-src` | View in a room on phones; `ios-src` is a `.usdz` for iPhones |
| `animation-name`, `autoplay` | Plays an animation saved in the model |
| `camera-orbit`, `camera-target`, `field-of-view` | Where the camera starts |
| `exposure`, `shadow-intensity`, `shadow-softness`, `environment-image` | Light (`environment-image`: `neutral` or `legacy`) |
| `disable-zoom`, `disable-pan`, `interaction-prompt`, `rotation-per-second` | More of model-viewer's settings, as they work there |

Words the kit shows can be in the page's language: `<html lang="fr" data-lk-text-view-3d="Voir en 3D">`.

### 3D scenes: `<lk-scene>`

Draws a whole 3D scene from a JSON file of the theme (data, never code): models and shapes, lights, particles, a camera that moves with the scroll, things that follow the pointer.

```html
<lk-scene src="/3d/hero.json" poster="/img/hero-poster.webp" alt="A bottle and a gift box"></lk-scene>
```

```json
{
  "background": "transparent",
  "environment": "studio",
  "camera": { "fov": 32, "position": [0, 0.25, 7.4], "target": [0, -0.45, 0] },
  "lights": [ { "type": "directional", "position": [3, 5, 4], "intensity": 1.5, "shadow": true },
              { "type": "point", "position": [-1.6, 1.4, -1.5], "intensity": 26, "color": "#FF7A45" } ],
  "objects": [
    { "model": "/3d/bottle.glb", "fit": 2.3, "position": [1.05, 0.15, 0], "spin": [0, 0.3, 0], "follow": 0.25, "shadow": true },
    { "shape": "torusknot", "size": [0.32], "tube": 0.1, "position": [0.35, 1.45, -1.6],
      "material": { "color": "#FF7A45", "metalness": 0.7, "roughness": 0.18 }, "float": { "height": 0.12, "speed": 0.7 } }
  ],
  "particles": { "count": 500, "size": 0.022, "color": "#FFB08A" },
  "pointer": { "camera": 0.35 },
  "scroll": [
    { "at": 0, "camera": { "position": [0, 0.25, 7.4] } },
    { "at": 1, "camera": { "position": [3.4, 1.5, 3.9], "target": [1.3, -0.1, 0] }, "objects": { "0": { "rotation": [0, 6.28, 0] } } }
  ]
}
```

| Key | What it is |
|---|---|
| `background` | `"transparent"` (the page shows behind) or a colour |
| `environment`, `exposure` | `"studio"` light for shiny things, or `"none"`; brightness |
| `fog` | `{ "color", "near", "far" }` |
| `camera` | `fov`, `position`, `target`; on a tall phone screen the scene keeps its width (`"portrait": "crop"` keeps its height) |
| `lights` (up to 8) | `type`: `ambient`, `hemisphere`, `directional`, `point`, `spot`; `color`, `intensity`, `position`, `shadow` |
| `objects` (up to 40) | A `model` (`.glb`; `fit` = its size) or a `shape`: `sphere`, `box`, `torus`, `torusknot`, `cylinder`, `cone`, `plane`, `icosahedron`, `ring`, `capsule` |
| each object | `position`, `rotation` (radians), `scale`, `spin` (turns a second), `float`, `follow` (follows the pointer), `animation`, `shadow`, `receiveShadow` |
| `material` | `color`, `metalness`, `roughness`, `emissive`, `emissiveIntensity`, `opacity`, `wireframe`, `clearcoat`, `transmission`, `flat` |
| `particles` | `count`, `size`, `color`, `area`, `speed` |
| `pointer` | `{ "camera": 0.35 }`: the camera follows the mouse or finger |
| `scroll` | Keyframes at `"at"` 0 to 1 of the scroll (or of its `data-lk-pin` section): `camera`, and `objects` by their number |

### Lottie: `<lk-lottie>`

Plays a Lottie animation (`.json` from After Effects with Bodymovin, or LottieFiles). `play`: `auto` (on screen; add `loop`), `hover`, `click` or `scroll` (follows the scroll); `speed`. Expressions are not played.

```html
<lk-lottie src="/anim/sun.json" loop alt="A sun"></lk-lottie>
<lk-lottie src="/anim/order.json" play="scroll" alt="Order done"></lk-lottie>
```

### Rive: `<lk-rive>`

Plays a Rive file (`.riv`) with its state machine: buttons, characters and icons that react to hover and clicks as made in the Rive editor. A number input of the state machine can follow the scroll (`data-lk-scroll-input`, 0 to 100) or the pointer (`data-lk-pointer-x`, `data-lk-pointer-y`). `fit`: `contain`, `cover`, `fill`, `fit-width`, `fit-height`, `none`, `layout`. Give the tag a height in CSS (320px by default).

```html
<lk-rive src="/anim/button.riv" state-machine="State Machine 1" artboard="Main" fit="contain"
         alt="A button that bounces" data-lk-scroll-input="Progress"></lk-rive>
```

## 9. Fast on every phone

- **"Reduce motion"** (a phone or computer setting): everything shows as it ends, without movement; 3D scenes show one still picture.
- **Light mode** (data saver, a slow network, or a phone with little memory): shorter reveals, no scroll or pointer effects, 3D models show their poster with a View in 3D button, scenes draw with fewer pixels, no shadows and fewer particles.
- **Off screen**, 3D, Lottie and Rive stop drawing.
- The theme's CSS can do the same: `html[data-lk-lite="1"]` is light mode, `html[data-lk-reduce]` is reduce motion.
- Keep a `.glb` under 5 MB (Draco or meshopt compression; KTX2 textures are not supported); give every 3D model and scene a `poster`; use `.webp` or `.avif` pictures with `width` and `height`; one or two fonts as `.woff2`; a video background as `.mp4` with `muted loop playsinline autoplay` and a `poster`.

## 10. What the check allows

| What | Limit |
|---|---|
| Files | `.html .htm .css .json`, pictures `.png .jpg .jpeg .gif .webp .avif .svg .ico`, fonts `.woff2 .woff .ttf .otf`, video and sound `.mp4 .webm .mp3 .ogg`, 3D `.glb .gltf .bin .usdz`, Rive `.riv`. Scripts and server files (`.js`, `.php` and the like) are never used; other kinds are skipped. README and LICENSE files, `AGENTS.md`, `CLAUDE.md`, `GEMINI.md` and anything starting with a dot are left out quietly. |
| One file | Up to 25 MB |
| Files in a theme | Up to 2,000 |
| Space for all versions together | Pro 100 MB · Max 500 MB · VIP 500 MB |
| Folders | Up to 12 deep; names without quotes and `< > { } \| # ? % * :` |

- **HTML:** the usual page tags, inline SVG, and LINKDGER's `<lk-…>` tags. Taken out with what is inside them: `script`, `noscript`, `object`, `embed`, `iframe` (except YouTube, Vimeo and Google Maps embed addresses), `textarea`, `select`, `math`. Taken out, the inside kept: `form`, `input`, `option`, `base`. A `<meta http-equiv>` is taken out.
- **Attributes:** `id`, `class`, `style`, `title`, `lang`, `dir`, `hidden`, `tabindex`, `role`, `aria-*`, `data-*` and each tag's own (`href`, `src`, `srcset`, `alt`, `width`, `height`, `loading`…). Taken out: every `on…`, `srcdoc`, `action`, `formaction`.
- **Links:** `https:`, `http:`, `mailto:`, `tel:`, `sms:`, `whatsapp:` and the theme's own paths. `target="_blank"` gets `rel="noopener"`. `<link>` only for `stylesheet`, `icon`, `apple-touch-icon`, `preload` and `preconnect`, to the theme's files or Google Fonts.
- **CSS:** `@import` and `url()` only to the theme's files, `data:` pictures and fonts, and Google Fonts; no `expression()` or bindings.
- **JSON:** every `.json` file must parse.

## 11. Problems and their fixes

| The tool says | Fix |
|---|---|
| `Sign in first` / `This key has ended or was revoked` | Run `login`; the seller allows it on linkdger.com |
| `Your own theme comes with Pro, Max and VIP.` | The seller upgrades the plan in the app |
| `No index.html: the theme needs its home page at the top of the .zip.` | Put `index.html` at the folder's top |
| `… has a password or code field. Sign in is LINKDGER's: take the field out.` | Remove the field |
| `Removed: a script in …` / `a script in an attribute` | Use the kit (section 8) instead |
| `Removed: a form` / `a form field` | Use `<lk-search>`, the cart and the other parts |
| `Removed: an outside link in …` / `an outside file link` | Put the file in the theme, or use Google Fonts |
| `Removed: an embed (only YouTube, Vimeo and Google Maps show)` | Use one of those embed addresses |
| `Removed: an unknown tag in …` | Use a usual HTML tag |
| `Not found: set "…"` | Add the set to theme.json's `sets` |
| `This theme needs N MB; your plan has M MB free.` | The seller deletes an old version in the app |
| `… is N MB. A file can be up to 25 MB.` | Make the file smaller |
| `Some files changed while they were sent. Save again.` | Run the command again |
| `Could not reach LINKDGER.` | Check the internet and run it again |

## 12. A small complete theme

`index.html`:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>{{ shop.name }}</title>
  <meta name="description" content="{{ shop.about }}">
  <link rel="stylesheet" href="/style.css">
</head>
<body>
  <header class="top">
    <a class="brand" href="/"><lk-shop-logo></lk-shop-logo> {{ shop.name }}</a>
    <nav><a href="/products">Shop</a> <lk-cart-button text="Cart"></lk-cart-button> <lk-signin-button text="Sign in"></lk-signin-button></nav>
  </header>
  <main>
    <section class="hero">
      <h1 data-lk-split="words" data-lk-animate="fade-up">{{ shop.name }}</h1>
      <p data-lk-animate="fade-up" data-lk-delay="200">{{ shop.about }}</p>
      <lk-search placeholder="Search {{ shop.name }}"></lk-search>
    </section>
    <section class="grid">
      <lk-products limit="8">
        <article class="card" data-lk-animate="rise">
          <a href="{{ item.url }}"><img src="{{ item.image }}" alt="{{ item.name }}" loading="lazy"></a>
          <a class="name" href="{{ item.url }}">{{ item.name }}</a>
          <b>{{ item.price }}</b>
          <lk-add-to-cart text="Add to cart"></lk-add-to-cart>
        </article>
      </lk-products>
    </section>
  </main>
  <footer>© {{ year }} {{ shop.name }} · {{ shop.city }} · <lk-directions text="Find us"></lk-directions></footer>
</body>
</html>
```

`style.css` (the parts are styled through their classes):

```css
:root { --accent: #FF7A45; --bg: #0E0F13; --ink: #F5F6F8; }
body { margin: 0; background: var(--bg); color: var(--ink); font-family: Inter, system-ui, sans-serif; }
.top { display: flex; justify-content: space-between; align-items: center; padding: 16px; }
.grid .lk-products { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 16px; padding: 16px; }
.card img { width: 100%; aspect-ratio: 1; object-fit: cover; border-radius: 12px; }
.lk-add-to-cart { background: var(--accent); color: #fff; border: 0; border-radius: 10px; padding: 10px 14px; font-weight: 700; }
```

`theme.json`:

```json
{ "colors": { "accent": "#FF7A45", "background": "#0E0F13", "surface": "#171A21", "text": "#F5F6F8", "muted": "#A0A6B1" } }
```

## 13. More

- The example theme Orbit (`init`) uses every part above: read its `index.html`, `story.html`, `product.html`, `products.html` and `style.css` before you start.
- The guide for people, with live demos of the kit: https://linkdger.com/themes/guide
- Websites made on LINKDGER: https://linkdger.com/themes
- The theme tool's code: https://github.com/xooja/linkdger.theme
