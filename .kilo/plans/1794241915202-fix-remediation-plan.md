# План исправления проблем (по итогам код-ревью 2026-11-09)

**Стек:** Next 16.4.3 (App Router), React 19, Tailwind v4.3 CSS-first, motion 12, FSD.
**Договорённости:** 5 фаз; фаза 1 — upgrade-tool с ручной зачисткой (инструмент может not-op'нуть: проект уже на v4-зависимостях — тогда только ручной чек-лист); auth — только механические фиксы (редизайн логина — за скоупом, вместе с реальным бэкендом).
**Порядок строгий:** 1 → 2 → 3 → 4 → 5. Каждая фаза — отдельная ветка/коммиты, после каждой: `npm run lint`, `npm run test`, `npm run build`.

---

## Фаза 1 — Tailwind v3→v4 (сломанное и «ругань»)

### 1.1 Сломанные классы (CSS не генерируется — вёрстка ломается уже сейчас)
| Найти | Заменить | Где |
|---|---|---|
| `flex-shrink-0` | `shrink-0` | 15 мест: `Header.tsx:89,154,177`, `CartItemRow.tsx:36,83`, `RatePurchased.tsx:122`, `Logo.tsx:19`, `LoginForm.tsx:84`, `AddressSection.tsx:156,164`, `DeliveryPage.tsx:46`, `CheckoutSummary.tsx:44,87`, `PickupStoresSection.tsx:38` |
| `flex-grow` (голый) | `grow` | `app/cart/page.tsx:70`, `app/cart/checkout/page.tsx:82`, `app/favorites/page.tsx:29`, `DeliveryPage.tsx:12` |
| `scrollbar-none` | добавить в `app/globals.css` `@utility scrollbar-none { scrollbar-width:none; &::-webkit-scrollbar{display:none} }` | `Navbar.tsx:27`, `RecentlyViewed.tsx:40` |
| `transform ` (в строке классов) | удалить токен, `scale-90` оставить | `shared/config/slides.tsx:25,56,76` |
| `bg-gradient-to-*` | `bg-linear-to-*` | `LottiePlayer.tsx:167,484`, `ProfileSummaryCard.tsx:12` |

### 1.2 Сдвиг масштабов — принять стандарт (v3-вид = v4-имена)
- **Правило:** то, что в v3 называлось `*-sm`, в v4 писать `*-xs`; голый `shadow/rounded/blur` → `shadow-sm/rounded-sm/blur-sm`.
- `shadow-sm` → `shadow-xs` (~25 мест) + `rounded` (6×, `LottiePlayer.tsx:261–268`) → `rounded-sm`; `backdrop-blur-sm` → `backdrop-blur-xs` (`Header.tsx:208,246`, `AuthDrawer.tsx:51`); `drop-shadow-sm` → `drop-shadow-xs` (`Logo.tsx:28`).
- Где рядом уже стоит `shadow-xs` (`QuantityStepper.tsx`, `PickupStoresSection.tsx`) — унифицировать в ту же сторону; итог: в проекте не остаётся `shadow-sm`/`rounded-sm`, кроме случаев явного «среднего»elevations.
- Полная локация каждого `shadow-sm` — grep-чеклист ниже (строки из отчёта: `OrderSummary.tsx:61,73,148`, `EmptyCart.tsx:14`, `CartList.tsx:20`, `OrderSuccess.tsx:66,86`, `RatePurchased.tsx:57`, `favorites/page.tsx:59`, `PromoCarousel.tsx:84,118`, `HotDealsSection.tsx:46`, `GiftCoupon.tsx:17`, `ProductCard.tsx:49,54,65,176`, `CartToast.tsx:100`, `CheckoutSummary.tsx:26`, `OrderForm.tsx:77,96`, `Header.tsx:245`, `EmptyState.tsx:15`, `ProductImagePanel.tsx:15,20` и прочие из grep).
- **Исключение:** `orange-650`, `stone-150`, `shadow-aibolit*`, `rounded-4xl`, `ring-3`, дробные `h-110/w-5.5` — валидные v4-токены (`app/globals.css:4–25`), не трогать.

### 1.3 Focus-видимость (a11y + предупреждения)
- Все `outline-none` / `focus:outline-none` (~19 мест: `fieldStyles.ts:5,8,11,14`, `FiltersSidebar.tsx:87,92`, `ProductPurchaseBox.tsx:55,65`, `Footer.tsx:63,67`, `AuthInput.tsx:46`, `Header.tsx:123`, `OrderSummary.tsx:114`, `SortBar.tsx:19`, `ProductDetailTopBar.tsx:22`, `ProductCard.tsx:142`, `HomeCategoryTiles.tsx:96`, `PromoCarousel.tsx:117`, `AddressSection.tsx:23`) → `focus:outline-hidden focus-visible:ring-2 focus-visible:ring-orange-500/40 focus-visible:ring-offset-1`.
- Иконки-кнопки и точки каруселей: добавить `focus-visible:ring` там, где сейчас вообще нет индикатора (`ProductPurchaseBox` steppers, `PromoCarousel` dots).

### 1.4 Прочее
- `min-h-screen` → `min-h-dvh` (`app/layout.tsx:30,32`); там же снять мёртвый `bg-stone-50/50` с body (перекрывается inner-div).
- `Header.tsx:85` `bg-transparent hover:bg-white/95`: на тач-устройствах `hover:` не срабатывает (v4 гейтит `@media (hover:hover)`) → сделать непрозрачность базовой (`bg-white/95 backdrop-blur-md`), hover оставить косметикой.
- Шрифты: в `app/layout.tsx:11,18` загружаются Inter/Comfortaa 400–700, а UI требует `font-black/extrabold` → добавить weights 800/900 в `next/font` (или понизить классы до `font-bold` — выбрать первое).
- Миграция данных-градиентов: `slides.tsx` `bgGradient`/`title` — мёртвые поля, удалить; `bannerGradient`-строки в `entities/catalog/model/mock.ts` оставить до фазы 4 (переедут в UI-маппинг).

**Верификация:** grep-нули по: `flex-shrink`, `flex-grow(?!-)`, `bg-gradient-to`, `shadow-sm`, `rounded\s"`, `outline-none`, `scrollbar-none` (кроме новой @utility), `max-w-screen`, `shadow-inner`, `(-opacity-`, `overflow-ellipsis`, `min-h-screen`. Прогон тестов + визуальный чек: `/catalog`, товар, корзина, checkout, `/`, 404, `delivery`.

---

## Фаза 2 — Функциональные баги и «мёртвый» UI

### 2.1 Корзина/чекаут
- **NaN-промо:** `app/cart/page.tsx:56`, `CartProvider.tsx:103,128` — `in PROMO_CODES` → общий хелпер `getPromo(code)` с `Object.hasOwn` (в `shared/config/commerce.ts`), возвращающий `undefined` для ключей прототипа. Плюс `selectors.ts` — guard на `NaN`.
- **RatePurchased:** ключ рейтинга = `productId|size` (`:17,31,43`), иначе оценка одного размера засчитывается другому.
- **Промо после reload:** либо восстанавливать UI-состояние из сохранённого кода (`promoSuccess` вывод), либо не персистить код. Единый источник — `usePromo` (фаза 4), сейчас — минимальная согласованность: показывать баннер при восстановленном коде.
- `page.tsx:59–61`: не затирать валидное промо при ошибке ввода (только точечный cancel).
- `checkout/page.tsx:123` + `OrderSuccess.tsx:52`: `key` переставить на элемент `<OrderSuccess>`; добавить ранний return при пустой корзине до рендера формы (`:36–40` — вспышка).
- `void updateAddress(...)` (`:73`) — ловить ошибку и показывать в `CheckoutSummary`/тост; `OrderSuccess.tsx:159–168` — убрать ложные утверждения про email/SMS (или пометить «демо»); `:48` — фолбэк часов магазина: матчинг по адресу, иначе `null` (не `PICKUP_STORES[0]`).
- `GiftCoupon.tsx:18` код `AIBOLIT2026` — см. Open questions.

### 2.2 Каталог/hero
- `useHeroAutoplay.ts:66–95` — останавливать планирование кадров при `!enabled` (effekт на `[enabled]`), clamp `dt` (`:71–76`); поправить врал-комментарий в `HeroCarouselProvider.tsx:80–82`.
- Убрать `setTimeout(280ms)`-костыль (`HeroCarousel.tsx:64–66`): скролл-компенсация в `useCatalogViewModel` (на смену slug — `scrollTo(0)` / `scrollIntoView` в `useEffect`, не в карусели).
- `useLayoutEffect` при SSG (`HeroCarousel.tsx:42`) → `useEffect`.
- **Подключить мёртвые контролы (client-side, моки):**
  - `SortBar.tsx:18` — controlled `value/onChange` → состояние сортировки → `applySort` (уже есть в `catalogView.ts`).
  - `FiltersSidebar` — toggle/бренды/цена с onChange → общее `filters`-состояние viewModel вместо `DEMO_FILTERS`-константы.
  - Всё состояние фильтров/сортировки/поиска синхронизировать с URL (`?sort=&min=&max=&brands=&onSale=&search=`) — это же контракт для бэкенда (фаза 5). `?search=` должен фильтровать список, а не только паузить карусель.
  - `ProductGrid.tsx:38` — передать `onAction` (сброс фильтров); стрелки `RecentlyViewed.tsx:22–35` — `scrollBy` + `tabIndex`; «Показать все» (`Header.tsx:185–190`) и Enter в поиске (`:109`) — переход в каталог с `?search=`.
- `CatalogListView.tsx:63–96` — AnimatePresence с constant key: либо ключ по slug, либо удалить мёртвую анимацию.
- `generateStaticParams` (`[...slug]/page.tsx:34–41`) — кодировать бренды через `encodeCatalogSlugSegment`; убрать дубль `…/all` (`:21–22`); `getProductById` miss → `notFound()` вместо списка (`catalogView.ts:21–24`).
- `PromoCarousel` — реальный state: точки с `onClick`, автоплей с cleanup, `aria-current`; `currentSlide` не константа (`:8`).
- `favorites/page.tsx:17–21` — счётчик = длина отображаемого списка.

### 2.3 Auth (только механика)
- `AuthProvider.tsx:165–178` — `catch` в `logout` (401 от mock-logout = успех), убрать unhandled rejection из `AuthDrawer.tsx:78`.
- Ветвление по `AuthApiError.status`: 401 → принудительный локальный logout; не показывать «session error» без статуса.
- `role` из localStorage не доверять: при restore брать из ответа mock-api (заглушка `fetchCurrentUser`), не из storage (`:83`).
- `LoginForm.tsx:86` — убрать ложную фразу «Данные сеанса шифруются локально» (или «данные демо-сеанса хранятся локально»).
- `AuthDrawer` a11y: `role="dialog"`, `aria-modal`, `aria-label`, ESC-to-close, начальный фокус внутрь, возврат фокуса на closing-элемент; scroll-lock через счётчик (не перезапись `overflow`).
- `AddressSection.tsx:55–58` — при внешнем изменении адреса во время редактирования пересобирать `draft`; добавить «Очистить адрес» (mock `removeAddress` → сброс к демо-значению).
- `formatAddress.ts:13` — `(street ?? '').trim()`.
- `CartProvider`: `removeFromCart(id)` без `size` для размерных позиций — удалять все размеры (или бросать ошибку, не silent no-op) (`cart.ts:61–62`); `setToastData` updater без `Math.random` — сидировать рандом при addToCart (`:218–229`, `recommendations.ts:15`).
- `app/page.tsx:9–11` — серверный `redirect('/catalog')` вместо клиентского replace.
- `/delivery` (`page.tsx:3–4`): раздать `DeliveryPage` по роуту (UI уже есть) и направить туда ссылки Header/Footer вместо `#`. `#callback` (`Header.tsx:74`) — см. Open questions.

### 2.4 Данные (moки)
- `product/mock.ts`: `salePct:25`→20 (`:74–79`), кроличий корм из `rodent-cage` (`:553–567`), «для собак собак» (`:243`); подкатегории из строк (`:22,26,27,28,29`) добавить в `CATALOG_STRUCTURE` или убрать из товаров.
- Гигиена: удалить `ShieldCheck` импорт (`OrderSummary.tsx:5`), `CartListProps.pickupAddress`; `ProductIcon.tsx:8,13` — prop `type` либо реализовать маппинг иконок, либо удалить (сейчас молча игнорируется).

### 2.5 Тесты
- `addressSync.test.tsx` — убрать `submitOrder!(...)` вне `act()`, заменить `setTimeout(50)`-sleeps на `waitFor` позитивных условий.
- `OrderForm.test.tsx` — submit через `userEvent`/нативную валидацию, добавить негативные тесты (пустой phone); либо снять `required` до wiring-а — выбрать userEvent.
- `AuthDrawer.test.tsx` — сброс `mockUserStore` в `beforeEach` (тесты не должны зависеть от порядка).
- `HeroCarousel.test.tsx:31` — `vi.spyOn(performance,'now')` вместо подмены объекта.
- Новые unit-тесты: `getPromo` (prototype keys), sort/filters URL-state (см. 2.2).

**Верификация:** тесты зелёные; smoke: корзина с промо + F5, checkout с двумя размерами, фильтры/сортировка/поиск меняют URL и выдачу, hero не жрёт CPU на товарной странице (Performance panel), drawer закрывается по ESC, заказы исчезают... (история — см. фазу 5).

---

## Фаза 3 — Производительность

1. **Контексты:** AuthProvider — разрезать значение: `AuthSessionContext` (user/token, меняется редко) + `AuthActionsContext` (стабильные колбэки через refs, deps `[token]`/`[user]` убрать) + `AuthStatusContext` (isSubmitting/error) — по прецеденту `CartProvider` (`:18`). То же Favorites (actions stable, data-Set) и Rating (или хук `useProductRating(id)` со selector-подпиской).
2. **Гидрация хранилищ:** один общий `usePersistentState` (фаза 4, здесь — предвестник): убрать 4× `setTimeout(0)`; добавить флаг `isHydrated`, которым gate'ятся dependent UI (бедж корзины, лайки) — без вспышки demo-состояния.
3. **Header:** вынести search-блок (`Header.tsx:108–201`) в `widgets/header/ui/SearchBox.tsx` (свой client-остров, своя стейт-область); `useDeferredValue(query)`; `React.memo` на Navbar; onBlur — закрытие дропдауна (чинит и баг из отчёта).
4. **Cart:** `MOCK_PRODUCTS.find` → Map-селектор `entities/product/model/selectors` (`productById`); `useMemo` на CartRecommendations (`:18–29`); `React.memo` CartItemRow; `ProductCard` — qty через Map-селектор + memo (убрать `cart.find` на карточку).
5. **Каталог:** `useCatalogViewModel` — считать производные только для активного view (list vs detail), пока без передела API (сплит — фаза 4).
6. **motion:** `<MotionConfig reducedMotion="user">` в `app/providers/Providers.tsx` (покрывает LottiePlayer/Loader/carousel одним местом); в LottiePlayer — `whileInView={{once:true}}` для декоративных сцен, убрать лишние бесконечные петли где уместно.
7. **Барели:** убрать `ProductCard` и моки из `entities/product/index.ts` (UI/mock — deep-импортами или отдельными `ui`/`mock` суб-барелами); `useHeaderSearch` → `getAllProducts()` вместо прямого мока; `CategorySection.tsx:6` — импорт из `@/entities/catalog`, не из корня.
8. `FavoritesProvider.isFavorite` — `Set` в memo. `HomeCategoryTiles.tsx:63–78` — counts в memo.
9. Опционально: динамический импорт сцен LottiePlayer по `type`.

**Верификация:** React Profiler до/после на `/catalog` и `/cart`; `npm run build` — проверить, что mock-данные больше не в chunk'ах header/footer (`.next` analyze опц.).

---

## Фаза 4 — UI-примитивы и рефакторинг

1. **`shared/ui` primitives:** `Button` (variants: orange-pill, black-pill, ghost, danger, link; фикс `cursor-pointer` centrally), `Chip/Pill` (активная/пассивная строки из `SubcategoryPills` ×5 копий), `QuantityStepper` (унификация 3 мест: `ProductPurchaseBox`, `QuantityStepper.tsx`, `ProductCard`), `BackLink` (5 копий), `PageContainer` (`max-w-7xl mx-auto px-…`), поля: один источник input-строк — merge `fieldStyles.ts` + `AuthInput` + `AddressSection.INPUT` в `shared/ui/Field` (variant иконки).
2. **Feature-хуки:** `useCartTotals()` (убрать дубль `cart/page.tsx:41–46` ≡ `checkout:42–45`), `usePromo()` (стейт + валидация промо в `features/cart`, убрать triple-implementation), `TotalsBreakdown`-компонент для `OrderSummary`+`CheckoutSummary` (единый `formatPrice`!).
3. **`shared/lib/storage.ts`** — `readJson/writeJson/remove` c try/catch + квota-log; `shared/config/storageKeys.ts` — реестр ключей; `createSafeContext` helper; `usePersistentState(key, parse)` — перевести Cart/Favorites/Rating/Auth.
4. **Единый роут-конфиг:** `ROUTES` + типизированные группы ссылок; `links.ts:55` → `CONTACT_PHONE_HREF`; navItems — `matchPaths: string[]` вместо closure-субстрингов; удалить дубли hrefs из TOP_BAR_LINKS/links.ts.
5. **useCatalogViewModel:** сплит на `useCatalogList` / `useProductDetail` / `useCatalogMeta`; константы `SLUG_DEPTH`, id `large-catalog`, тайминги (280/650/900) — в `features/catalog/model/catalogView.ts`; `CatalogPage`/viewModel переезжают из `[...slug]/` в `app/catalog/model/` (FSD: страница не импортирует из dynamic-route-папки).
6. **Данные из компонентов в слой:** `entities/promotion/model/promotions.ts` (слайды PromoCarousel, баннеры HotDeals, купон, метрики DeliveryMetrics); `bannerGradient`-классы из моков каталога → UI-маппинг по id; `STATUS_BADGE_CLASSES` (`OrderCard.tsx:7`) → `entities/order/model/labels.ts`; `normalizePhone` → `shared/lib`.
7. **checkout/page.tsx** — 5 useState заказа → один `order: Order | null`.
8. `ProductCard.tsx:44` — inline boxShadow удалить, hover через `hover:shadow-aibolit` (v4 @utility поддерживает варианты); привести все «карточные» тени к `shadow-aibolit*`.
9. Опционально: переименовать/разбить `LottiePlayer` (по сценам); политика имён `MOCK_*/INITIAL_*/DEMO_*`.

**Верификация:** diff grep — ноль продублированных class-строк (чек-лист из пп. 1); визуальный регресс-прогон всех страниц; тесты.

---

## Фаза 5 — Подготовка к бэкенду

1. **Хранилище по пользователям:** ключи `aibolit_*` → `aibolit_${scope}_${name}` (scope = userId | 'anon'), миграция legacy-ключей при чтении.
2. **Async API-швы:** `entities/product/api`, `entities/catalog/api` → `Promise`-сигнатуры (`getAllProducts(): Promise<Product[]>` и т.п.) с сохранением mock-источника и latency-симуляцией (прецедент: `features/auth/api`). Все 6+ вызовов в `useCatalogViewModel`/`CategorySection`/`useHeaderSearch` — через `useFetch`/`useEffect`, добавить loading-скелетоны (`CatalogSkeleton` расширить) и error-состояния.
3. **Контракт:** `shared/api/contract.ts` (или `docs/api.md`) — карта эндпоинтов + DTO: `GET /products[/:id]`, `GET /categories`, `GET /search?q=`, `POST /auth/login`, `POST /orders`, `GET /orders`, `PATCH /users/me/address`, `DELETE /users/me/address`, `PUT /users/me/favorites`, `POST /products/:id/rating`, `POST /promotions/validate`. Решения по данным зафиксировать: цены — целые рубли + `currency:'RUB'` на Order; ID — серверные строки; `Product.images: string[]` (пока заглушки `/logo_aibolit.jpg`); cart line = `{productId, size, quantity}` + снимок цены с ревалидацией при загрузке.
4. **Заказы:** mock `POST /orders` генерит id (убрать клиентский `'AB-'+Math.random`), чекаут ждёт ответ до `clearCart()` (сейчас удаление корзины до подтверждения — риск потери), кнопка submit с pending/disabled, идемпотентный ключ (client-UUID попытки); fetchOrders мержит созданные заказы (фикс «исчезающих заказов»).
5. **Серверные правила в mock-api:** промо-валидация и ценообразование (`PROMO_CODES`, пороги доставки) уходят из клиентского бандла в `entities/promotion/api` (async); `grandTotal` — результат api-расчёта на submit (UI показывает, не считает final); рейтинги — api возвращает агрегат, провайдер хранит только оценку юзера (+rollback при ошибке).
6. **Auth-транспорт (подготовка):** `useFetch` — опция `credentials:'include'` / `Authorization`; документировать httpOnly-cookie схему; register-mode и пароль/OTP — вне скоупа (решение по фазе 2).
7. **Error/SEO-инфра:** `error.tsx` для `app/catalog` и `app/cart/checkout` (+retry); `generateMetadata`/`generateMetadata` для каталога по slug; canonical без `…/all`.

**Верификация:** `npm run build`; все моки reachable только через `Promise`-api (grep: `MOCK_` импорты — только внутри `*/api/*` и `model/mock`); тесты контрактов (типы DTO компилируются, async-тесты провайдера с fake timers); smoke: быстрый переход между страницами каталога не роняет гонки запросов (abort работает).

---

## Открытые вопросы (нужен ответ пользователя перед/в ходе фазы 2)
1. `AIBOLIT2026` на купоне: добавить код в `PROMO_CODES` (с реальным процентом) или убрать купон/сменить код на существующий?
2. `#callback` в Header («Заказать звонок»): сделать tel-ссылкой/модалкой или удалить до появления бэкенда?
3. География: районы Москвы (`site.ts:65`) при СПб-магазинах — унифицировать город?
4. Голосуй за: автоплей PromoCarousel нужен, или достаточно ручных точек?

## Риски
- `@tailwindcss/upgrade` рассчитан на v3-проекты: на наших v4-зависимостях может смолчить или тронуть CSS-конфиг — запускать в отдельной ветке, смотреть diff, фолбэк — ручная таблица 1.1–1.3.
- Смена синхронного API на async (фаза 5) задевает все memo в viewModel — поэтому сплит viewModel сделан заранее в фазе 4.
- Изменение focus/тени — визуальные регрессии; держать скриншоты до/после по 7 маршрутам.

## Критерии готовности
Гrep-чека-listы фаз 1–2 пусты; `lint/test/build` зелёные; ни один кликабельный элемент не является no-op; mock-данные не импортируются из UI поверх api-слоя; AuthProvider-перерисовки не касаются дерева при вводе в промо-поле (Profiler).
