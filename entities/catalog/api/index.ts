import type { Category, SubCategory } from '../model/types';
import { ALL_MOCK_CATEGORIES, CATALOG_STRUCTURE } from '../model/mock';

export { ALL_MOCK_CATEGORIES };

export function getAllCategories(): Category[] {
  return ALL_MOCK_CATEGORIES;
}

const subcategoriesCache = new Map<string, SubCategory[]>();

function getCachedSubcategories(categoryId: string): SubCategory[] | null {
  return subcategoriesCache.get(categoryId) ?? null;
}

function resolveSubcategories(categoryId: string): SubCategory[] {
  if (categoryId === 'brands') {
    return [];
  }

  const existingGroup = CATALOG_STRUCTURE[categoryId];

  if (existingGroup && existingGroup.subcategories.length > 0) {
    return existingGroup.subcategories.map((sub, idx) => ({
      id: sub.id,
      name: sub.name,
      icon: getSubcategoryIcon(sub.type, idx),
      type: sub.type,
      itemCount: 12 + ((idx * 7) % 40),
      subSections: sub.subSections || ['Все товары'],
      badge: idx % 3 === 0 ? 'Хит' : idx % 5 === 0 ? 'Скидка' : undefined
    }));
  }

  return generateGenericSubcategories(categoryId);
}

export function getSubcategoriesSync(categoryId: string): SubCategory[] {
  const cached = getCachedSubcategories(categoryId);
  if (cached) {
    return cached;
  }

  const subcats = resolveSubcategories(categoryId);
  subcategoriesCache.set(categoryId, subcats);
  return subcats;
}

function getSubcategoryIcon(type: string, idx: number): string {
  const icons = {
    food: ['🥣', '🥫', '🍖', '🥩'],
    toy: ['🪀', '🎾', '🐁', '🪵'],
    medicine: ['💊', '💧', '🩺', '🛡️'],
    accessory: ['🧺', '🛏️', '🧴', '✂️']
  };
  const list = icons[type as keyof typeof icons] || ['📦', '✨', '🐾', '🎯'];
  return list[idx % list.length];
}

function generateGenericSubcategories(categoryId: string): SubCategory[] {
  const map: Record<string, SubCategory[]> = {
    ferret: [
      { id: 'ferret-food', name: 'Высокопротеиновый корм', icon: '🥩', type: 'food', itemCount: 18, subSections: ['Сухой корм', 'Консервы'] },
      { id: 'ferret-hammock', name: 'Подвесные гамаки и трубы', icon: '🧺', type: 'accessory', itemCount: 24, subSections: ['Гамаки', 'Тоннели'] },
      { id: 'ferret-toys', name: 'Интерактивные лабиринты', icon: '🪀', type: 'toy', itemCount: 12, subSections: ['Мячики', 'Шуршалки'] },
      { id: 'ferret-hygiene', name: 'Шампуни для хорьков', icon: '🧴', type: 'accessory', itemCount: 15, subSections: ['Шампуни', 'Спреи от запаха'] }
    ],
    horse: [
      { id: 'horse-food', name: 'Мюсли, сено и подкормки', icon: '🌾', type: 'food', itemCount: 32, subSections: ['Мюсли', 'Соль-лизанец'] },
      { id: 'horse-hoof', name: 'Средства для ухода за копытами', icon: '👞', type: 'accessory', itemCount: 20, subSections: ['Мази', 'Деготь'] },
      { id: 'horse-gear', name: 'Амуниция и недузги', icon: '🎗️', type: 'accessory', itemCount: 45, subSections: ['Вальтрапы', 'Уздечки'] },
      { id: 'horse-vet', name: 'Мази для суставов и ветаптека', icon: '💊', type: 'medicine', itemCount: 16, subSections: ['Охлаждающие гели', 'Витамины'] }
    ],
    reptile: [
      { id: 'reptile-terrarium', name: 'Террариумы и декорации', icon: '🏞️', type: 'accessory', itemCount: 28, subSections: ['Стеклянные', 'Коряги'] },
      { id: 'reptile-lamp', name: 'УФ-лампы и обогрев', icon: '💡', type: 'accessory', itemCount: 22, subSections: ['УФB 10.0', 'Термоковрики'] },
      { id: 'reptile-food', name: 'Корма, насекомые и кальций', icon: '🦗', type: 'food', itemCount: 19, subSections: ['Кальций D3', 'Консервированные сверчки'] },
      { id: 'reptile-soil', name: 'Субстраты и кокосовая стружка', icon: '🪵', type: 'accessory', itemCount: 14, subSections: ['Кокос', 'Песок'] }
    ],
    vet: [
      { id: 'vet-flea', name: 'Капли и таблетки от клещей', icon: '🛡️', type: 'medicine', itemCount: 42, subSections: ['Симпарика', 'Бравекто', 'Инспектор'], badge: 'Важно' },
      { id: 'vet-diet', name: 'Лечебные диеты (Urinary, Gastro)', icon: '🩺', type: 'food', itemCount: 38, subSections: ['Gastrointestinal', 'Renal', 'Urinary'] },
      { id: 'vet-vitamins', name: 'Витаминные комплексы', icon: '💊', type: 'medicine', itemCount: 29, subSections: ['Для шерсти', 'Для суставов'] },
      { id: 'vet-calm', name: 'Успокаивающие средства', icon: '🌿', type: 'medicine', itemCount: 17, subSections: ['Капли', 'Диффузоры'] }
    ],
    hygiene: [
      { id: 'hygiene-shampoo', name: 'Шампуни и кондиционеры', icon: '🧴', type: 'accessory', itemCount: 35, subSections: ['Для смывки грязи', 'Гипоаллергенные'] },
      { id: 'hygiene-tools', name: 'Пуходерки и фурминаторы', icon: '✂️', type: 'accessory', itemCount: 26, subSections: ['Фурминаторы', 'Когтерезы'] },
      { id: 'hygiene-wipes', name: 'Влажные салфетки и лосьоны', icon: '🧻', type: 'accessory', itemCount: 21, subSections: ['Для ушей', 'Для глаз'] },
      { id: 'hygiene-odor', name: 'Устранение запахов и меток', icon: '✨', type: 'accessory', itemCount: 18, subSections: ['Спреи-энзимы', 'Поглотители'] }
    ]
  };

  return map[categoryId] || [
    { id: `${categoryId}-gen-1`, name: 'Основной уход и питание', icon: '🐾', type: 'food', itemCount: 20, subSections: ['Популярное'] },
    { id: `${categoryId}-gen-2`, name: 'Аксессуары и забавы', icon: '🪀', type: 'toy', itemCount: 15, subSections: ['Новинки'] }
  ];
}
