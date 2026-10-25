# План: устранение результатов код-ревью (zoomarket)

## Принятые решения (подтверждены пользователем)
- Неисправный интерактив (поиск, мобильное меню, `{false && ...}`) — **сохранить разметку и связать состояние**, мёртвые ветки не удалять, а **заккомментировать**.
- `AuthDrawer` и `CartToast` — **подключить** к UI (кнопка профиля, добавление в корзину).
- Из инструментов — только **Vitest + RTL**. Prettier, route-group layout, CI-скрипты — вне рамок этого плана.
- `CatalogNavbar` остаётся как есть (неудаляемый, неиспользуемый — трогать не нужно).

## Контракт: чего НЕ менять
- Собираемые URL `/catalog/...` (использует `generateStaticParams` в `app/catalog/[...slug]/page.tsx` — 236 SSG-маршрутов должны остаться идентичными).
- Реальные мутации корзины (badge-счётчик в Header остаётся демо-константой до появления состояния корзины — осознанно вне scope).
- Формы: submit остаётся no-op (демо-режим).
- Перед правками Next-API прочитать `node_modules/next/dist/docs/` (AGENTS.md).

## Этап 0 — baseline (спросить подтверждение пользователя)
- `git add -A` + коммит текущего состояния: 95% кода (app/, entities/, features/, shared/, widgets/) не отслеживается git. Без этого рефакторинг небезопасен. Дальше коммитить по этапам.

## Этап 1 — конфиги и утилиты
1. `shared/config/commerce.ts`: `FREE_SHIPPING_THRESHOLD = 1500`, `DELIVERY_COST = 290`, `LOYALTY_BONUS_PCT = 10`.
   - Применить: `app/cart/page.tsx:29`, `app/cart/checkout/page.tsx:40`, `CartList.tsx:115`, `DeliveryTermsBlock.tsx:21`, `DeliveryBenefits.tsx:17`.
   - Исправить расхождение: `site.ts:22` «Бесплатно от 1000 ₽» → 1500 ₽ (и текст `DeliveryTermsBlock/DeliveryBenefits` брать из конфига).
2. `shared/config/navigation.ts`: `ROUTES` + `productHref(product)` (собирает `/catalog/{animal}/{sub}/{subSection}/{id}` c `encodeCatalogSlugSegment`).
   - Применить: `entities/product/ui/ProductCard.tsx:30`, дропдаун поиска в `widgets/header/ui/Header.tsx:139`, хлебные крошки/ссылки где уместно. Результат сборки URL сверить моки-тестом (этап 5).
3. `shared/lib/format.ts`: `formatPrice(n)` → Intl ru-RU + « ₽». Применить во всех `{x} ₽`: ProductCard (:115,:119), Header дропдаун (:167), CartList, OrderSummary, ProductDetailView, CartRecommendations.
4. `entities/cart/model/selectors.ts`: `selectCartCount(items)`, `selectSubtotal(items)`, `selectOldSubtotal(items)`; реэкспорт через `entities/cart/index.ts`. Применить: `Header.tsx:21`, `cart/page.tsx:25-26`, `checkout/page.tsx:39`.
5. `entities/user/model/mock.ts` (+экспорт из barrel): `export const DEMO_USER: UserProfile | null = null`. Заменить `null as UserProfile | null` (`Header.tsx:30`, `checkout/page.tsx:20`).

## Этап 2 — рефакторинг CatalogPage (вынос логики в model)
Новые файлы в `features/catalog/model/` (экспорт через barrel `features/catalog/index.ts`):
1. `types.ts`: `CatalogSection = 'cat'|'dog'|'bird'|'rodent'|'fish'|'vet'|'brands'`, `FilterCriteria` (searchQuery, priceMin/Max, brands, onSaleOnly, badgeOnly, sortType — поля обязательны, значения демо задаёт страница).
2. `parseCatalogSlug.ts`: разбор `slug: string[]` → `{ section: CatalogSection|null, subcategoryId, subSection, productId, isBrands, isVet }` со строгой проверкой (убрать `slug[0] as PetType`, `CatalogPage.tsx:36`).
3. `catalogFilter.ts`: `filterProducts`, `sortProducts`, `matchesVetSubcategory`, `matchesVetSubSection` (алиасы `aliasesByPill` — вынести в конфиг этого модуля), `buildBrandFacets`, `countOnSale`. Поиск-ветка (`name/brand/category/animal-синонимы`, `CatalogPage.tsx:116-127`) сохраняется как параметр `searchQuery`.
4. `catalogTitle.ts`: IIFE из `CatalogPage.tsx:334-368` → чистая функция `getCatalogTitle(state)` (использует имя секции из `CATALOG_STRUCTURE`, убирает неиспользуемую `animalName:335`).
5. В `CatalogPage.tsx`: оставить ~150 строк — разбор slug через `parseCatalogSlug`, затем `useMemo` для `filteredProducts`, `categoryBaseProducts`, `availableBrandsInSubcategory`, `onSaleCount`, `recentlyViewedProducts`, заголовок. Демо-значения фильтров (`priceMin=''` и пр., строки 76-95, 112-113) собрать в один объект `DEMO_FILTERS` (тип `FilterCriteria`).
6. Разметку не менять. `{true && <FiltersSidebar/>}` (:378) → без обёртки.

## Этап 3 — связывание интерактива Header/Navbar + AuthDrawer + CartToast
1. **Мобильное меню** (один источник состояния — Header):
   - `Header.tsx`: `useState(false)` вместо `mobileMenuOpen=false`; гамбургер: `type="button"`, `onClick` toggle, `aria-expanded`, `aria-label="Меню каталога"`; рендер `<Navbar mobileMenuOpen={...} onCloseMenu={...} />`.
   - `Navbar.tsx`: принять props `{ mobileMenuOpen?: boolean; onCloseMenu?: () => void }`, убрать локальную заглушку (строка 12), `useEffect` на `pathname` → `onCloseMenu()`.
2. **Поиск**: `widgets/header/model/useHeaderSearch.ts` — `query`, `results` (фильтр `MOCK_PRODUCTS` по name/brand/category/subSection, top 5), `total`, `isOpen` (query.trim() и фокус), `close()`. В Header: controlled input (`value/onChange/onFocus`), кнопка X → сброс, дропдаун рендерится от `isOpen`, overlay-клик и `Escape` → close; submit формы остаётся no-op. Мёртвые заглушки `searchQuery='' / showDropdown=false / allSearchResults=[]` удалить (заменены хуком).
3. **AuthDrawer**: `Header.tsx` — `authOpen` state; кнопка профиля (motion.button, `type="button"`) открывает; `<AuthDrawer open={authOpen} user={DEMO_USER} onClose={() => setAuthOpen(false)} />` в конце дерева Header. В `features/auth/ui/AuthDrawer.tsx` добавить prop `onClose` и повесить на X-кнопку (:45) и overlay (:23-28). Внутренние формы не трогать.
4. **CartToast**: новый `features/cart/model/CartToastProvider.tsx` — context с `showToast(product)` / `hide()`, авто-скрытие через `setTimeout` (cleanup), внутри провайдера рендер `<CartToast data={...} recommendation={null} />`. Подключить в `app/providers/Providers.tsx`. Хуки-триггеры `useCartToast()`: кнопка «В корзину» (`ProductCard.tsx:150`) и «Добавить» в `ProductDetailView` — по клику вызывают `showToast(product)` (без мутации корзины). `features/cart/index.ts` — реэкспорт провайдера и хука.
5. **Комментирование мёртвых кусков** (по решению пользователя, с префиксом `// TODO(интерактив):`):
   - `{false && <PromoSectionDisabled .../>}` (`CatalogPage.tsx:298`) → закомментировать вместе с импортом.
   - Неиспользуемые импорты `AnimatePresence` (`shared/ui/Loader.tsx:4`, `shared/ui/LottiePlayer.tsx:4`) — удалить (не комментарий, иначе lint не почистится).
   - Ничего из удалённого состояния (этап 3 п.2) не терять ветками JSX — разметка дропдауна/меню остаётся рабочей.

## Этап 4 — a11y-доводка
- `aria-label` + `type="button"`: поиск (input в Header), heart/plus/minus/«В корзину» (`ProductCard.tsx:52,133,142,150`), profile/hamburger (Header — из этапа 3), close-кнопки CartToast/AuthDrawer.
- `Navbar.tsx:32`: добавить `aria-current={isActive ? 'page' : undefined}` (data-active-nav оставить — проверит использование в `globals.css` до удаления).
- Эмодзи-иконки (`😿` Header, `🐾` AuthDrawer и т.п.) — `aria-hidden="true"`.
- Кнопкам размеров в `ProductCard.tsx:95` — `aria-pressed={isActive}`.

## Этап 5 — Vitest + RTL
1. dev-зависимости: `vitest`, `@vitejs/plugin-react`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`.
2. `vitest.config.ts`: environment jsdom, alias `@` → `.` (tsconfig paths), setup `vitest.setup.ts`; в package.json: `"test": "vitest run"`, `"test:watch": "vitest"`.
3. Тесты (рядом с модулями, `__tests__/`):
   - `shared/lib`: `catalog-slug` — encode/decode, защита от двойного encode, `getAllCategoryPillLabel` словоформы.
   - `shared/config`: `navigation.productHref` совпадает с форматом URL из `generateStaticParams` (регрессия маршрутов).
   - `entities/cart`: selectors (count/subtotal/oldSubtotal, пустая корзина).
   - `features/catalog/model`: filter/sort/facets — animal, vet+алиасы subSection, brands, onSale, price-диапазон, поиск; `getCatalogTitle` по уровням slug.
   - RTL: `ProductCard` (цена через formatPrice, бейджи, disabled-состояние); `Header` — клик гамбургера открывает меню Navbar, клик профиля открывает AuthDrawer (мок `next/navigation`, `next/image`).

## Порядок и проверки после каждого этапа
1..5 этапа строго по одному; после каждого: `npx tsc --noEmit` → `npm run lint` → `npm run test` (с этапа 5) → коммит.
Финально: `npm run build` (ожидание: 236 маршрутов как сейчас; `git diff` не должен менять generateStaticParams-выход), ручная проверка `npm run dev`: /catalog (десктоп+375px), карточка товара, /cart (тост при добавлении), поиск в шапке, Escape/оверлей.

## Риски
- onBlur поиска vs клик по дропдауну — закрывать по overlay-onMouseDown, не по blur (иначе результат клика теряется).
- Providers становится носителем клиентского контекста — дети остаются серверными (провайдер сам 'use client', ок).
- Комментирование JSX: `{/* ... */}` нельзя вложенно — закомментировать строковые `//`-префиксы? Для JSX-блока `{false && ...}` — обернуть в `{/* */}` после проверки, что внутри нет `*/`.
- Любое изменение class/href может задеть 236 SSG-страниц — финальный build как guard.

## Вне scope (зафиксировать в backlog)
Prettier/.editorconfig; route-group layout `(shop)`; перевод страниц на серверные компоненты; реальное состояние корзины; вынос LottiePlayer-данных; веса шрифтов 800/900; `loading.tsx`/`error.tsx`; удаление `suppressHydrationWarning`; README/FSD-доки.
