
import { Category, Product, User } from '../types';

export const MOCK_USER: User = {
  id: 123456,
  name: "Алексей Смирнов",
  avatarUrl: "https://picsum.photos/id/64/200/200",
  points: 340,
  lifetimePoints: 420, // Прогресс за все время
  level: "Бариста-Шеф", // Исправлено для соответствия списку
  nextLevelPoints: 500,
  referralCode: "COFFEE123"
};

export const CATEGORIES: Category[] = [
  { id: 'coffee', name: 'Кофе' },
  { id: 'seasonal', name: 'Сезонное' },
  { id: 'tea', name: 'Чай и Матча' },
  { id: 'food', name: 'Десерты' },
  { id: 'beans', name: 'Зерно' },
];

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Капучино",
    description: "Идеальный баланс: много пышной молочной пенки и мягкий кофейный вкус. Самый популярный выбор для тех, кто любит классику с молоком.",
    price: 250,
    categoryId: "coffee",
    imageUrl: "https://png.pngtree.com/png-clipart/20230927/original/pngtree-cup-of-cappuccino-coffee-png-image_13144396.png",
    modifiers: {
      sizes: [
        { id: 's', name: 'S (200мл)', price: 0 },
        { id: 'm', name: 'M (300мл)', price: 50 },
        { id: 'l', name: 'L (400мл)', price: 90 },
      ],
      milks: [
        { id: 'reg', name: 'Обычное', price: 0 },
        { id: 'oat', name: 'Овсяное', price: 40 },
        { id: 'almond', name: 'Миндальное', price: 40 },
      ],
      syrups: [
        { id: 'vanilla', name: 'Ваниль', price: 30 },
        { id: 'caramel', name: 'Карамель', price: 30 },
      ]
    }
  },
  {
    id: 7,
    name: "Флэт Уайт",
    description: "Для тех, кто хочет чувствовать кофе: здесь меньше молока, чем в капучино, поэтому вкус более бодрящий, терпкий и насыщенный.",
    price: 280,
    categoryId: "coffee",
    imageUrl: "https://www.coca-cola.com/content/dam/onexp/in/en/home-page-test-img/brands/costa/costa-resized/cortado.png",
    modifiers: {
      sizes: [{ id: 'm', name: '250мл', price: 0 }],
      milks: [
        { id: 'reg', name: 'Обычное', price: 0 },
        { id: 'coconut', name: 'Кокосовое', price: 50 },
      ],
      syrups: []
    }
  },
  {
    id: 8,
    name: "Раф Классический",
    description: "Настоящий кофейный десерт: готовится не на молоке, а на густых сливках. Очень нежный, сладковатый и сытный, как тающее мороженое.",
    price: 310,
    categoryId: "coffee",
    imageUrl: "https://i.pinimg.com/736x/6e/df/1f/6edf1fad94b93988d705f6cf24179ee3.jpg",
    modifiers: {
      sizes: [
        { id: 'm', name: '300мл', price: 0 },
        { id: 'l', name: '400мл', price: 60 },
      ],
      milks: [{ id: 'cream', name: 'Сливки 10%', price: 0 }],
      syrups: [{ id: 'lavender', name: 'Лаванда', price: 40 }]
    }
  },
  {
    id: 9,
    name: "Бамбл",
    description: "Необычный микс: холодный напиток из апельсинового сока, карамели и эспрессо. Освежающий, кисло-сладкий и очень бодрящий.",
    price: 340,
    categoryId: "seasonal",
    imageUrl: "https://avatars.mds.yandex.net/i?id=78b9a555dda691ed2a7b2b435ad41abd92cacff6-4079583-images-thumbs&n=13",
  },
  {
    id: 2,
    name: "Тыквенный Латте",
    description: "Осеннее настроение в кружке: сладкий, пряный и согревающий напиток с ароматом запеченной тыквы, корицы и нежной пенкой.",
    price: 320,
    categoryId: "seasonal",
    imageUrl: "https://png.pngtree.com/png-vector/20241204/ourmid/pngtree-creamy-pumpkin-spice-latte-with-whipped-cream-png-image_14433818.png",
  },
  {
    id: 3,
    name: "Матча Латте",
    description: "Это не кофе! Взбитый в пену японский зеленый чай с молоком. Дарит спокойную энергию без кофеиновых скачков и очень полезен.",
    price: 290,
    categoryId: "tea",
    imageUrl: "https://avatars.mds.yandex.net/i?id=bcd6d8090826702e2ae9883fae5cbdbc1537c7c2-10805353-images-thumbs&n=13",
  },
  {
    id: 10,
    name: "Чизкейк Нью-Йорк",
    description: "Тот самый классический десерт: плотный, сливочный, на тонком коржике из песочного печенья. Совсем не приторный и очень нежный.",
    price: 240,
    categoryId: "food",
    imageUrl: "https://avatars.mds.yandex.net/i?id=f8db665b9c74b69fb4936b7b4d9b9e41_l-7085252-images-thumbs&n=13",
  },
  {
    id: 11,
    name: "Шоколадный Брауни",
    description: "Мечта шоколадоголика: насыщенный шоколадный вкус, влажная текстура внутри и хрустящие кусочки грецкого ореха.",
    price: 190,
    categoryId: "food",
    imageUrl: "https://avatars.mds.yandex.net/i?id=dc67497213b3d401a9580eb06897c1233a90b2bd-4078231-images-thumbs&n=13",
  },
  {
    id: 12,
    name: "Синнабон",
    description: "Ароматная горячая булочка с корицей, щедро политая тающим кремом из сливочного сыра. Идеальный антистресс.",
    price: 210,
    categoryId: "food",
    imageUrl: "https://avatars.mds.yandex.net/i?id=8b7026ea64ea5e31cf1808a02e6f667473fe8367-5869402-images-thumbs&n=13",
  },
  {
    id: 4,
    name: "Миндальный круассан",
    description: "Хрустящая французская выпечка, внутри которой много сладкого миндального крема. Идеальная пара к чашке кофе.",
    price: 180,
    categoryId: "food",
    imageUrl: "https://avatars.mds.yandex.net/i?id=a5100439e3713bad1e8635e32d2bce9faca88da9-5235063-images-thumbs&n=13",
  },
  {
    id: 6,
    name: "Фильтр-кофе",
    description: "Чистый черный кофе без молока и сахара. Легкий, ароматный, как хороший чай, но с сильным бодрящим эффектом. Сорт дня: Эфиопия.",
    price: 190,
    categoryId: "coffee",
    imageUrl: "https://avatars.mds.yandex.net/i?id=c413caddbd05069649d901104f1f2924e23fe7c2-5092559-images-thumbs&n=13",
  }
];
