# План: перенос вёрстки и стилей zoomarket_test → zoomarket (FSD, Next 16)

## 1. Цель
Перенести **только вёрстку и стили** (JSX + Tailwind-классы + custom CSS + шрифты + декоративные анимации) из тестового приложения `C:\Рабочая папка\Проекты\zoomarket_test\zoomarket_test` (Next 15, плоская структура) в проект `C:\Рабочая папка\Проекты\zoomarket` (Next 16), разложив компоненты **сразу по FSD-слайсам и папкам**, ничего не потеряв.

## 2. Принятые решения (зафиксированы с пользователем)
1. **Глубина = только вёрстка и стили, без интерактива.** Весь JSX, все `className`, все визуальные ветки (скелетоны, дропдауны, drawer-разметка) сохраняются 1:1. Логика нейтрализуется:
   - убираются `useState`-хендлеры, `onClick`-логика, `onChange`-мутации, `router.push`, `form submit`, `localStorage`, `useApp()`;
   - вместо глобального `AppContext` — **статические моки** из `entities/*` и `shared/api`, подаваемые через пропсы/дефолтные значения;
   - `useSearchParams`/URL-параметры фильтров не читаются — фильтры рендерятся в дефолтном (пустом) состоянии;
   - `motion/react` **остаётся** (это визуал/анимация = часть «стилей»): сохраняем `initial/animate/exit`, `whileHover`, `whileTap`, `AnimatePresence`.
2. **`app/` = слой роутинга + composition-страниц.** Папку `pages/` НЕ создаём (её нет в скелете). Тонкие route-файлы + page-composition живут в `app/<route>/`; page-specific части, не переиспользуемые нигде, — в `app/<route>/_components/`.
3. **Мёртвый код и неиспользуемые зависимости НЕ переносим:** `hooks/use-mobile.ts`, `hooks/useInfiniteCategories.ts`, `@tanstack/react-virtual`, `@google/genai`, `@hookform/resolvers`, `firebase-tools`, `autoprefixer`, `output:'export'`, `images.remotePatterns`/picsum, `metadata.json`, `.env.example`, `.eslintrc.json` (legacy), старый `postcss.config.mjs`.

## 3. Ограничения Next 16 (ОБЯЗАТЕЛЬНО прочитать перед правками)
Согласно `AGENTS.md`, это НЕ та Next.js из обучения. Перед реализацией открыть и прочитать релевантные гайды в `node_modules/next/dist/docs/` (резолвить от корня `zoomarket`): App Router/`params` (Promise), `generateStaticParams`, `useSearchParams`+Suspense с `cacheComponents`, `next/image`, `next/font`, Tailwind через Turbopack. Эвристические знания из Next 15 могут не совпадать.
- Целевой билд остаётся: `turbopack` + `@tailwindcss/turbopack`, `cacheComponents: true`, `partialPrefetching` (см. `next.config.ts` цели). Static export НЕ включаем.
- `params` уже Promise-подобные в исходниках (`React.use(params)`) — паттерн сохраняется.

## 4. Зависимости и конфиг (шаг 0)
В `package.json` цели ДОБАВИТЬ только реально используемые переносимым кодом зависимости:
- `motion` (анимации), `lucide-react` (иконки), `clsx` + `tailwind-merge` (для `shared/lib/cn`, если оставляем `cn`), `tw-animate-css` (импортируется в globals.css).
НЕ добавлять: `@tanstack/react-virtual`, `@google/genai`, `@hookform/resolvers`, `firebase-tools`, `autoprefixer`.
Установить (`npm install`). Проверить, что Tailwind v4 видит все новые директории-источники (auto-detect от расположения CSS); при необходимости добавить `@source` в `app/globals.css`, чтобы классы из `entities/`, `features/`, `widgets/`, `app/` собирались.
`tsconfig.json`: `paths` `@/* → ./*` уже настроен — FSD-алиасы (`shared/*`, `entities/*`, `features/*`, `widgets/*`) работают через него.

## 5. Целевое FSD-дерево (карта)
```
app/
  layout.tsx                # Comfortaa+Inter, lang=ru, metadata Айболит, <Providers>
  globals.css               # перенос токенов/утилит из теста (см. §7)
  page.tsx                  # redirect → /catalog ('use client')
  not-found.tsx             # + widgets/navbar, widgets/footer, shared/ui/LottiePlayer
  providers/Providers.tsx   # pass-through провайдер (без AppContext)
  catalog/
    page.tsx                # route index → composition CatalogPage
    [...slug]/page.tsx      # route + generateStaticParams → composition
    [...slug]/CatalogPage.tsx        # 'use client' composition (бывш. CatalogClient)
    _components/            # page-specific блоки каталога:
      HeroCarousel, FiltersSidebar, ProductGrid, SortBar,
      SubcategoryPills, Breadcrumbs, ProductDetailView,
      RecentlyViewed, HomePromoDisabled(опц.)
  promotions/  cart/  cart/checkout/  favorites/  delivery/  # route + _components (см. §6)
shared/
  ui/     Logo, ProductIcon, Loader, LottiePlayer, index.ts
  lib/    cn.ts (utils), catalog-slug.ts, index.ts
  api/    (переэкспорт мок-геттеров entities/catalog — опц. façade)
  model/  (общечасовые типы, если потребуются)
  config/ site.ts (контакты, часы, topBarLinks, footerLinks, HOME_FEATURES, слайды, PICKUP_STORES, MOCK_DISTRICTS)
entities/
  product/ model/types.ts (Product), model/mock.ts (MOCK_PRODUCTS), ui/ProductCard.tsx, index.ts
  catalog/ model/types.ts (Category, SubCategory, PetCategoryGroup, Subcategory),
           model/mock.ts (CATALOG_STRUCTURE, ALL_MOCK_CATEGORIES), api/index.ts
           (getSubcategoriesSync, getCachedSubcategories[stub], getSubcategorySkeletonPlan — синхронно), index.ts
  cart/    model/types.ts (CartItem), model/mock.ts (демо-позиции = INITIAL_CART_ITEMS), index.ts
  user/    model/types.ts (UserProfile), index.ts
features/
  catalog/ ui/ VirtualizedCatalogContainer, CategorySection, CatalogNavbar,
           CategorySectionSkeleton, SubcategoryGridSkeleton, HomeCategoryTiles; index.ts
  cart/    ui/CartToast.tsx; index.ts
  auth/    ui/AuthDrawer.tsx; index.ts
  rating/  ui/StarRating.tsx (переиспользуется в ProductDetailView и checkout); index.ts
widgets/
  navbar/  ui/Navbar.tsx (top-bar + logo + search + actions + 3rd-row + mobile menu), model/navItems.ts; index.ts
  footer/  ui/Footer.tsx (+ VkIcon), model/links.ts; index.ts
```
Правило зависимостей FSD соблюдается: `app → widgets → features → entities → shared`; нижние слои не импортируют верхние. Каждую слайс-папку закрывать `index.ts` (public API).

## 6. Полная карта «источник → цель» (проверить, что покрыты ВСЕ файлы)
app-layer:
- `app/layout.tsx` → `app/layout.tsx` (шрифты Comfortaa/Inter вместо Geist, lang=ru, metadata Айболит, обернуть в `<Providers>`, className body `font-inter bg-stone-50/50 text-stone-900 min-h-screen antialiased`).
- `app/globals.css` → `app/globals.css` (см. §7).
- `app/page.tsx` → `app/page.tsx` (redirect на `/catalog`).
- `app/not-found.tsx` → `app/not-found.tsx` (navbar/footer + `shared/ui/LottiePlayer` `sleeping-cat`).
- `app/catalog/page.tsx` → `app/catalog/page.tsx` (route → `CatalogPage` с пустым slug).
- `app/catalog/[...slug]/page.tsx` → тот же + `generateStaticParams` (по `entities/catalog` + `entities/product`); рендерит `CatalogPage`.
- `app/catalog/[...slug]/CatalogClient.tsx` (1628 стр.) → `app/catalog/[...slug]/CatalogPage.tsx` (composition) + вынос блоков в `app/catalog/_components/*` и `features/catalog/*`. Убрать фильтры по `useSearchParams` (рендер дефолтного состояния), убрать скролл-virtualization-логику — `VirtualizedCatalogContainer` рендерит секции статично.
- `app/promotions/page.tsx` → `app/promotions/page.tsx` + `app/promotions/_components/*` (PromoCarousel, HotDeals, PromoBanner, GiftCoupon); `entities/product/ui/ProductCard`, `widgets/*`.
- `app/cart/page.tsx` → `app/cart/page.tsx` + `app/cart/_components/*` (CartList, OrderSummary, DeliveryTermsBlock, Recommendations); `features/cart/ui/CartToast` не монтируется глобально.
- `app/cart/checkout/page.tsx` → `app/cart/checkout/page.tsx` + `_components/*` (CheckoutForm, PickupStores, OrderSuccess, RatePurchased через `features/rating`).
- `app/favorites/page.tsx` → `app/favorites/page.tsx` (grid из `entities/product/ui/ProductCard`; демо-ids из мока favorites).
- `app/delivery/page.tsx` → `app/delivery/page.tsx` + `_components/*` (DeliveryForm, CourierPanel через `shared/ui/LottiePlayer` `courier-scooter`, Benefits, Metrics).
components:
- `components/Navbar.tsx` → `widgets/navbar/ui/Navbar.tsx`; конфиг navItems → `widgets/navbar/model/navItems.ts`. Убрать хендлеры/поиск-фильтр (`useApp`, `router.push`), бейдж корзины — статичное демо-число; `AuthDrawer` не монтировать (или рендер в закрытом состоянии).
- `components/Footer.tsx` → `widgets/footer/ui/Footer.tsx` (+ VkIcon), ссылки/контакты → `widgets/footer/model/links.ts` / `shared/config/site.ts`. Убрать `handleSubscribe` state (рендер idle-формы).
- `components/Logo.tsx` → `shared/ui/Logo.tsx` (motion сохранить).
- `components/Loader.tsx` → `shared/ui/Loader.tsx`.
- `components/LottiePlayer.tsx` (686 стр., 8 SVG/motion-анимаций) → `shared/ui/LottiePlayer.tsx` ПОЛНОСТЬЮ (все ветки: sleeping-cat, happy-tail, bouncing-ball, droplet-preloader, courier-scooter, promotions-confetti, decor-paws, playing-pet-toys). Примечание: домен-иллюстрации в shared — осознанно, т.к. компонент presentational и переиспользуется во многих фичах.
- `components/ProductCard.tsx` → `entities/product/ui/ProductCard.tsx`; экспорт типа `Product` перенести в `entities/product/model/types.ts` (устраняет инверсию lib→components). Хендлеры (`addToCart/toggleFavorite/updateQty`, `useApp`) убрать; показать дефолтные визуальные состояния (размер выбран, сердце без активного).
- `components/ProductIcon.tsx` → `shared/ui/ProductIcon.tsx` (через `shared/lib/cn`).
- `components/HomeCategoryTiles.tsx` → `features/catalog/ui/HomeCategoryTiles.tsx`.
- `components/AuthDrawer.tsx` → `features/auth/ui/AuthDrawer.tsx` (всю форму+профиль-разметку сохранить; хендлеры/`useApp` убрать).
- `components/CartToast.tsx` → `features/cart/ui/CartToast.tsx` (данные тоста = демо-моки).
components/virtualCatalog:
- `VirtualizedCatalogContainer.tsx` → `features/catalog/ui/VirtualizedCatalogContainer.tsx` (убрать IntersectionObserver/scroll-spy/`history.replaceState`; статично отрендерить все `CategorySection`).
- `CategorySection.tsx` → `features/catalog/ui/CategorySection.tsx` (без `useEffect`-загрузки; данные синхронно из `entities/catalog/api`; ветки brands/subcategories/загрузка-скелетон сохранить).
- `CatalogNavbar.tsx` → `features/catalog/ui/CatalogNavbar.tsx` (без auto-scroll логики; активный таб — статично первый/по индексу).
- `CategorySectionSkeleton.tsx`, `SubcategoryGridSkeleton.tsx` → `features/catalog/ui/` (сохранить).
lib:
- `lib/AppContext.tsx` → НЕ переносить как store. `Product/CartItem/UserProfile`-типы → в `entities`; демо-данные (`INITIAL_CART_ITEMS`, prefilled favorites) → `entities/*/model/mock.ts`; `CartToast`-разметка → `features/cart`. Toast/recommendation-логику убрать.
- `lib/data.ts` → `entities/catalog/model/mock.ts` (CATALOG_STRUCTURE) + `entities/product/model/mock.ts` (MOCK_PRODUCTS) + `shared/config/site.ts` (MOCK_DISTRICTS). Тип `Product` импортировать из `entities/product/model/types` (чиним инверсию).
- `lib/catalogSlug.ts` → `shared/lib/catalog-slug.ts`.
- `lib/utils.ts` → `shared/lib/cn.ts`.
- `lib/types/virtualCatalog.ts` → `entities/catalog/model/types.ts` (Category/SubCategory; Paginated* — не нужны без api-хуков, опустить).
- `lib/api/virtualCatalogApi.ts` → `entities/catalog/api/index.ts` (синхронные геттеры из моков; `fetch*`/latency/`fetchCategoriesPage` убрать).
hooks / public:
- `hooks/use-mobile.ts`, `hooks/useInfiniteCategories.ts` → НЕ переносим (dead).
- `public/logo_aibolit.jpg` → `public/logo_aibolit.jpg` (копировать). Все `/logo_aibolit.jpg` src сохранить.
Служебные (`package-lock/bun.lock`, `next-env.d.ts`, `tsconfig.tsbuildinfo`, `metadata.json`, `.env.example`, `.eslintrc.json`, `.gitlab-ci.yml`, README) → не переносим.

## 7. Стили / шрифты (критично для паритета)
Перенести `app/globals.css` цели на набор из теста:
```css
@import "tailwindcss";
@import "tw-animate-css";
@theme {
  --font-comfortaa: var(--font-comfortaa), 'Comfortaa', cursive, sans-serif;
  --font-inter: var(--font-inter), 'Inter', sans-serif;
}
body { font-family: var(--font-inter), sans-serif; }
.shadow-aibolit { box-shadow: 0 4px 20px rgba(0,0,0,0.04); }
.shadow-aibolit-lg { box-shadow: 0 10px 30px rgba(0,0,0,0.06); }
.font-comfortaa { font-family: var(--font-comfortaa); }
```
Шрифты: в `app/layout.tsx` заменить Geist на `Comfortaa`+`Inter` (subsets latin+cyrillic, variable `--font-comfortaa`/`--font-inter`, weights как в тесте), `lang="ru"`.
НЕ «чинить» нестандартные классы: `stone-150`, `orange-650`, `green-150/650/850`, `stone-450`, `no-scrollbar`, `scrollbar-none`, inline `boxShadow` и т.п. В тесте они НЕ определены → инертны; сохраняя как есть, достигаем идентичного рендера. Не добавлять их в `@theme`.
Целевой pipeline CSS = Turbopack (`@tailwindcss/turbopack` через `next.config.ts`), postcss.config НЕ переносим.

## 8. Правила нейтрализации интерактива (чтобы вёрстка не сломалась)
- Удалить: `'use context'`-логика не нужна; `import { useApp }` → заменить на константы/моки; `onClick/onSubmit/onChange`-мутации → no-op или убрать атрибут; `useState`-переключатели → фиксировать representative-состояние; `useEffect`/`useLayoutEffect`/`IntersectionObserver`/`ResizeObserver`/`localStorage`/`window.scrollTo`/`history.replaceState`/`dispatchEvent` → убрать.
- Сохранить как визуал: `motion` (initial/animate/exit/whileHover/whileTap), `AnimatePresence` (с статичным содержимым), `className`, `style`, `id`/`data-*` атрибуты, `title`/`aria-*`.
- Условно-рендерящиеся ветки (`if (liked)`, `user ? ... : ...`, `showDropdown && ...`, `cart.length===0 ? ...`) — сохранить ОБЕ ветки как компоненты/условия с дефолтным значением из мока (например `user=null` → аноним-форма, но закрытая; `showDropdown` не рендерим по умолчанию). Цель: весь JSX и стили присутствуют в коде.
- Динамические url (`detailUrl`, `/catalog/...`) — строить тем же `catalog-slug` из моков, чтобы ссылки соответствовали разметке.
- `params: Promise` в `CatalogPage` разворачивать `React.use` (оставить обёртку Suspense там, где нужен `useParams`-поток; `useSearchParams` убрать → Suspense-зависимость уменьшается).

## 9. Порядок выполнения (по фазам, каждая — коммит-пригодный шаг)
1. **Фаза 0 — фундамент:** добавить deps, установить; настроить `next.config`/`tsconfig` под `@/*` (уже ок); скопировать `public/logo_aibolit.jpg`. Прочитать `node_modules/next/dist/docs` (App Router, images, font, tailwind/turbopack).
2. **Фаза 1 — shared:** `shared/lib/cn`, `catalog-slug`; `shared/config/site`; `shared/ui/{Logo,ProductIcon,Loader,LottiePlayer}`; `shared/ui/index.ts`.
3. **Фаза 2 — entities:** типы+моки `product`/`catalog`/`cart`/`user`; `entities/catalog/api`; синхронизировать геттеры; `ProductCard` в `entities/product/ui`. Убедиться, что исчезла инверсия (ни один файл shared/entities не импортирует components/lib-верх).
4. **Фаза 3 — features:** `catalog/*`, `cart/CartToast`, `auth/AuthDrawer`, `rating/StarRating`; нейтрализовать интерактив.
5. **Фаза 4 — widgets:** `navbar`, `footer`.
6. **Фаза 5 — app:** `layout`+`globals.css`+шрифты+`Providers`; route-файлы и `_components` для catalog, promotions, cart, cart/checkout, favorites, delivery, not-found, index-redirect. Разбить `CatalogPage`.
7. **Фаза 6 — public API + линты:** `index.ts` в слайсах; `npm run lint`; `tsc`/`next build` для поиска потерянных импортов.

## 10. Валидация
- `npm run lint` и сборка типов (`tsc --noEmit` / `next build`): ловим оборванные импорты и инверсии слоёв.
- `npm run dev`, обойти все роуты: `/` (→/catalog), `/catalog`, `/catalog/<animal>`, `/catalog/<animal>/<sub>/<section>/<id>` (карточка), `/catalog/brands`, `/promotions`, `/cart`, `/cart/checkout`, `/favorites`, `/delivery`, 404.
- Визуальный паритет против теста: проверить hero-carousel, бейджи/скидки на `ProductCard`, sizes-пилюли, фильтры-сайдбар (дефолт), virtualized-секции каталога + skeleton-разметку, `LottiePlayer`-анимации, drawer/toast-разметку (как компоненты), footer-колонки, fonts (Comfortaa/Inter), тени `.shadow-aibolit*`.
- Счётчик покрытия: после миграции grep по классам-источникам → все исходные `components/*`/`lib/*`/`app/*` имеют целевой FSD-адрес (см. §6 чек-лист). Ничего из §6 не осталось без переноса (кроме явно помеченных dead).

## 11. Открытые вопросы / риски (не блокируют)
- `LottiePlayer` (домен-иллюстрации) размещён в `shared/ui` ради переиспользования; строгая FSD-альтернатива — `widgets/mascot-animations`. Решить при ревью.
- `generateStaticParams`: оставить для паритета/SEO; без `output:'export'` deep-links обслуживает сервер Next 16 — подтвердить деплой-сценарий цели при необходимости.
- Если потребуется интерактив позже — `features/*/model` (Zustand/Context) добавляются в эти же слайсы, public API уже готов.
