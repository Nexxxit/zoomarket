import type { Category, PetCategoryGroup } from './types';

export const CATALOG_STRUCTURE: Record<string, PetCategoryGroup> = {
  cat: {
    name: 'Кошки',
    icon: '🐱',
    subcategories: [
      {
        id: 'cat-food',
        name: 'Корм',
        type: 'food',
        subSections: ['Сухой корм', 'Влажный корм', 'Лечебный и диетический корм', 'Холистик', 'Заменитель молока']
      },
      {
        id: 'cat-flea',
        name: 'Защита от блох, клещей, гельминтов',
        type: 'medicine',
        subSections: ['Капли на холку', 'Ошейники от паразитов', 'Спреи', 'Таблетки комплексные']
      },
      {
        id: 'cat-litter',
        name: 'Наполнители для кошачьего туалета',
        type: 'accessory',
        subSections: ['Древесный', 'Силикагелевый', 'Комкующийся', 'Впитывающий']
      },
      {
        id: 'cat-treat',
        name: 'Лакомства',
        type: 'food',
        subSections: ['Мясные колбаски', 'Подушечки с начинкой', 'Жидкие крем-лакомства', 'Сушеные вкусняшки']
      },
      {
        id: 'cat-litterbox',
        name: 'Лотки и туалеты',
        type: 'accessory',
        subSections: ['Открытые лотки', 'Закрытые туалеты-био', 'Совки и коврики', 'Средства для приучения']
      },
      {
        id: 'cat-bed',
        name: 'Лежанки и домики',
        type: 'accessory',
        subSections: ['Мягкие лежаки', 'Закрытые домики', 'Гамаки на батарею', 'Матрасы ортопедические']
      },
      {
        id: 'cat-scratcher',
        name: 'Когтеточки и игровые комплексы',
        type: 'toy',
        subSections: ['Столбики', 'Комплексы с домиком', 'Картонные когтеточки', 'Угловые навесные']
      },
      {
        id: 'cat-clothes',
        name: 'Одежда и аксессуары',
        type: 'accessory',
        subSections: ['Комбинезоны', 'Свитера', 'Шлейки и поводки', 'Миски металлические']
      },
      {
        id: 'cat-smart',
        name: 'Умные товары',
        type: 'toy',
        subSections: ['Автопоилки-фонтаны', 'Автоматические кормушки', 'Лазерные роботы', 'Смарт-лабиринты']
      },
      {
        id: 'cat-toys',
        name: 'Игрушки',
        type: 'toy',
        subSections: ['Мышки и мячики', 'Удочки-дразнилки', 'Туннели шуршащие', 'Игрушки с кошачьей мятой']
      }
    ]
  },
  dog: {
    name: 'Собаки',
    icon: '🐶',
    subcategories: [
      {
        id: 'dog-food',
        name: 'Корм',
        type: 'food',
        subSections: ['Сухой корм', 'Влажные консервы', 'Лечебное питание', 'Холистик меню', 'Заменители молока']
      },
      {
        id: 'dog-flea',
        name: 'Защита от блох, клещей, гельминтов',
        type: 'medicine',
        subSections: ['Таблетки комплексные', 'Капли от внешних паразитов', 'Ошейники защитные', 'Шампуни гигиенические']
      },
      {
        id: 'dog-accessories',
        name: 'Ошейники, шлейки, поводки',
        type: 'accessory',
        subSections: ['Кожаные ошейники', 'Поводки и рулетки', 'Анатомические шлейки', 'Намордники мягкие']
      },
      {
        id: 'dog-litter',
        name: 'Пеленки и туалеты',
        type: 'accessory',
        subSections: ['Одноразовые пеленки', 'Многоразовые пеленки', 'Туалеты со столбиком']
      },
      {
        id: 'dog-bed',
        name: 'Лежанки и домики',
        type: 'accessory',
        subSections: ['Ортопедические диваны', 'Непромокаемые коврики', 'Будки в квартиру']
      },
      {
        id: 'dog-toys',
        name: 'Игрушки для питомцев',
        type: 'toy',
        subSections: ['Прочные мячи и пуллеры', 'Канаты для перетягивания', 'Развивающие игры', 'Мягкие пищалки']
      },
      {
        id: 'dog-groom',
        name: 'Гигиена и уход',
        type: 'accessory',
        subSections: ['Шампуни для мытья лап', 'Когтерезы', 'Пуходерки и расчески', 'Лосьоны для ушей']
      },
      {
        id: 'dog-treat',
        name: 'Лакомства',
        type: 'food',
        subSections: ['Сушеные легкие и рубец', 'Жевательные рога оленя', 'Дрессировочные дропсы']
      }
    ]
  },
  bird: {
    name: 'Птицы',
    icon: '🦜',
    subcategories: [
      {
        id: 'bird-food',
        name: 'Корм для птиц',
        type: 'food',
        subSections: ['Отборные зерносмеси', 'Лакомые палочки с медом', 'Минеральные подкормки']
      },
      {
        id: 'bird-toys',
        name: 'Игрушки и качели',
        type: 'toy',
        subSections: ['Качели деревянные', 'Зеркала с колокольчиком', 'Развивающие подвесы']
      },
      {
        id: 'bird-cage',
        name: 'Клетки и вольеры',
        type: 'accessory',
        subSections: ['Металлические клетки', 'Деревянные вольеры', 'Кормушки навесные']
      }
    ]
  },
  rodent: {
    name: 'Грызуны',
    icon: '🐹',
    subcategories: [
      {
        id: 'rodent-food',
        name: 'Питание грызунов',
        type: 'food',
        subSections: ['Травяное сено горное', 'Ореховые кормосмеси', 'Лакомства-дропсы']
      },
      {
        id: 'rodent-cage',
        name: 'Домики и лабиринты',
        type: 'accessory',
        subSections: ['Двухэтажные домики', 'Беговые колеса 20см', 'Пластиковые туннели']
      }
    ]
  },
  fish: {
    name: 'Рыбки',
    icon: '🐟',
    subcategories: [
      {
        id: 'fish-food',
        name: 'Корма для рыб',
        type: 'food',
        subSections: ['Сухие хлопья', 'Тонущие гранулы', 'Корм для макроподов']
      },
      {
        id: 'fish-accessory',
        name: 'Аквариумы и декор',
        type: 'accessory',
        subSections: ['Керамические замки', 'Светодиодные светильники', 'Навесные фильтры']
      }
    ]
  },
  vet: {
    name: 'Ветаптека',
    icon: '💊',
    subcategories: [
      {
        id: 'vet-flea',
        name: 'Защита от блох, клещей, гельминтов',
        type: 'medicine',
        subSections: ['Капли на холку', 'Ошейники от паразитов', 'Спреи', 'Таблетки комплексные']
      },
      {
        id: 'vet-vitamins',
        name: 'Витамины и минеральные добавки',
        type: 'medicine',
        subSections: ['Для шерсти и кожи', 'Для суставов и костей', 'Для пищеварения', 'Мультивитамины']
      },
      {
        id: 'vet-care',
        name: 'Гигиена и уход',
        type: 'medicine',
        subSections: ['Лосьоны для глаз и ушей', 'Заживляющие мази', 'Антисептики', 'Уход за зубами']
      }
    ]
  }
};

export const ALL_MOCK_CATEGORIES: Category[] = [
  {
    id: 'cat',
    slug: 'cat',
    name: 'Кошки',
    icon: '🐱',
    description: 'Все для замурчательного комфорта: полнорационные корма, наполнители, игровая мебель и ветаптека.',
    bannerGradient: 'from-orange-500 to-amber-600',
    subcategoriesCount: CATALOG_STRUCTURE.cat?.subcategories?.length || 10
  },
  {
    id: 'dog',
    slug: 'dog',
    name: 'Собаки',
    icon: '🐶',
    description: 'Профессиональные рационы, надежные поводки и шлейки, амуниция и игрушки для активных прогулок.',
    bannerGradient: 'from-amber-600 to-yellow-600',
    subcategoriesCount: CATALOG_STRUCTURE.dog?.subcategories?.length || 8
  },
  {
    id: 'bird',
    slug: 'bird',
    name: 'Птицы',
    icon: '🦜',
    description: 'Зерновые смеси премиум-класса, минеральные камни, качели, поилки и комфортные вольеры.',
    bannerGradient: 'from-emerald-500 to-teal-600',
    subcategoriesCount: CATALOG_STRUCTURE.bird?.subcategories?.length || 6
  },
  {
    id: 'rodent',
    slug: 'rodent',
    name: 'Грызуны',
    icon: '🐹',
    description: 'Альпийское сено, лакомства-палочки, беговые колеса и многоярусные клетки для хомяков и шиншилл.',
    bannerGradient: 'from-sky-500 to-blue-600',
    subcategoriesCount: CATALOG_STRUCTURE.rodent?.subcategories?.length || 5
  },
  {
    id: 'fish',
    slug: 'fish',
    name: 'Рыбки',
    icon: '🐠',
    description: 'Аквариумы, компрессоры, фильтрация, кондиционеры воды и сбалансированные хлопья.',
    bannerGradient: 'from-blue-600 to-indigo-700',
    subcategoriesCount: CATALOG_STRUCTURE.fish?.subcategories?.length || 6
  },
  {
    id: 'vet',
    slug: 'vet',
    name: 'Ветаптека',
    icon: '💊',
    description: 'Сертифицированные препараты от паразитов, пробиотики, хондропротекторы и диеты.',
    bannerGradient: 'from-rose-500 to-red-600',
    subcategoriesCount: CATALOG_STRUCTURE.vet?.subcategories?.length || 3
  },
  {
    id: 'brands',
    slug: 'brands',
    name: 'Бренды',
    icon: '🏷️',
    description: 'Производители кормов, лакомств и зоотоваров в ассортименте Айболита.',
    bannerGradient: 'from-stone-600 to-stone-800',
    subcategoriesCount: 1
  }
];
