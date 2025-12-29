
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
  { id: 'coffee', name: 'Кофе и напитки' },
  // { id: 'tea', name: 'Чай и Матча' },
  { id: 'breakfast', name: 'Завтраки' },
  { id: 'main', name: 'Основные блюда' },
  { id: 'dessert', name: 'Десерты' },
];

export const PRODUCTS: Product[] = [
  // --- COFFEE & DRINKS ---
  {
    id: 20,
    name: "Латте с соленой карамелью",
    description: "Бежевый латте с миндальными хлопьями и завитком карамели. Идеальный баланс сладкого и соленого.",
    price: 300,
    categoryId: "coffee",
    imageUrl: "https://i.postimg.cc/gnTkgZdD/image.jpg",
    modifiers: {
      sizes: [{ id: 'm', name: 'M (300мл)', price: 0 }, { id: 'l', name: 'L (400мл)', price: 60 }],
      milks: [{ id: 'reg', name: 'Обычное', price: 0 }, { id: 'alt', name: 'Альтернативное', price: 50 }],
      syrups: []
    }
  },
  {
    id: 18,
    name: "Малиновый латте",
    description: "Нежный розовый латте с посыпкой из сублимированной малины. Ягодная нежность в каждом глотке.",
    price: 300,
    categoryId: "coffee",
    imageUrl: "https://i.postimg.cc/pm3rLn10/image.jpg",
    modifiers: {
      sizes: [{ id: 'm', name: '300мл', price: 0 }],
      milks: [{ id: 'reg', name: 'Обычное', price: 0 }, { id: 'coconut', name: 'Кокосовое', price: 50 }],
      syrups: []
    }
  },
  {
    id: 19,
    name: "Горячий шоколад",
    description: "Чашка густого горячего шоколада с бархатистой пенкой. Согревает и поднимает настроение.",
    price: 250,
    categoryId: "coffee",
    imageUrl: "https://i.postimg.cc/F1hRzvDv/image.jpg",
    modifiers: {
      sizes: [{ id: 's', name: '200мл', price: 0 }],
      milks: [],
      syrups: [{ id: 'marshmallow', name: 'Маршмеллоу', price: 30 }]
    }
  },

  // --- TEA & MATCHA ---
  {
    id: 17,
    name: "Матча латте",
    description: "Зеленый матча латте с красивым латте-артом на пенке. Подается в широкой чашке на блюдце.",
    price: 300,
    categoryId: "coffee",
    imageUrl: "https://i.postimg.cc/TpRWzmzf/image.jpg",
    modifiers: {
      sizes: [{ id: 'm', name: '300мл', price: 0 }],
      milks: [{ id: 'reg', name: 'Обычное', price: 0 }, { id: 'oat', name: 'Овсяное', price: 50 }],
      syrups: []
    }
  },

  // --- BREAKFAST ---
  {
    id: 14,
    name: "Авокадо-тост с лососем",
    description: "Хрустящий тост с кремом из авокадо, ломтиками лосося, яйцом пашот и микрозеленью.",
    price: 450,
    categoryId: "breakfast",
    imageUrl: "https://i.postimg.cc/wttN5fYF/image.jpg",
  },
  {
    id: 6,
    name: "Круассан с овощами",
    description: "Свежий круассан, щедро наполненный огурцом, помидором, листьями салата и нежным сыром.",
    price: 250,
    categoryId: "breakfast",
    imageUrl: "https://i.postimg.cc/nsZ8B5mb/image.jpg",
  },
  {
    id: 13,
    name: "Фруктовая каша",
    description: "Питательная овсянка с клубникой, черникой, бананом, йогуртом, орехами и ломтиками сливы.",
    price: 250,
    categoryId: "breakfast",
    imageUrl: "https://i.postimg.cc/4HRpxzM4/image.jpg",
  },

  // --- MAIN DISHES ---
  {
    id: 3,
    name: "Говядина с овощами",
    description: "Сочные кусочки жареной говядины с картофелем, помидорами черри, болгарским перцем и спаржей в фирменном соусе.",
    price: 500,
    categoryId: "main",
    imageUrl: "https://i.postimg.cc/KRRm8dPt/image.jpg",
  },
  {
    id: 5,
    name: "Креветки в карри с рисом",
    description: "Рассыпчатый рис с ароматным соусом карри и кусочками креветок, украшенный свежей зеленью.",
    price: 450,
    categoryId: "main",
    imageUrl: "https://i.postimg.cc/qgZdSjPd/image.jpg",
  },
  {
    id: 16,
    name: "Креветки в остром соусе",
    description: "Тигровые креветки в пикантном оранжевом соусе с зеленым луком и лавровым листом.",
    price: 500,
    categoryId: "main",
    imageUrl: "https://i.postimg.cc/Q9GFQjbM/image.jpg",
  },
  {
    id: 7,
    name: "Курица гриль с соусом",
    description: "Аппетитная нарезанная курица на гриле, подается с насыщенным красным соусом и легким салатом.",
    price: 400,
    categoryId: "main",
    imageUrl: "https://i.postimg.cc/vx4CGwJb/image.jpg",
  },
  {
    id: 8,
    name: "Салат Цезарь",
    description: "Хрустящие листья романо с куриным филе, домашними сухариками, пармезаном и помидорами черри.",
    price: 400,
    categoryId: "main",
    imageUrl: "https://i.postimg.cc/jDHmxXFQ/image.jpg",
  },
  {
    id: 4,
    name: "Салат с курицей",
    description: "Легкий салат с кусочками курицы в кунжуте, свежими помидорами, зеленью, огурцом и белым сыром.",
    price: 400,
    categoryId: "main",
    imageUrl: "https://i.postimg.cc/JycLFm8R/image.jpg",
  },
  {
    id: 21,
    name: "Салат с киноа и курицей",
    description: "Куриное филе в сливочном соусе с киноа, огурцом, помидором и миксом салатных листьев.",
    price: 450,
    categoryId: "main",
    imageUrl: "https://i.postimg.cc/mzBbP33S/image.jpg",
  },

  // --- DESSERTS ---
  {
    id: 2,
    name: "Шоколадный чизкейк",
    description: "Роскошный кусок чизкейка с карамельным слоем, нежной кремовой серединой и шоколадным верхом.",
    price: 350,
    categoryId: "dessert",
    imageUrl: "https://i.postimg.cc/vgbQ8ThF/image.jpg",
  },
  {
    id: 1,
    name: "Фруктовый тарт",
    description: "Прямоугольный тарт с заварным кремом и шапкой из свежих ягод: клубники, малины и черники.",
    price: 300,
    categoryId: "dessert",
    imageUrl: "https://i.postimg.cc/KKcLKGJd/image.jpg",
  },
  {
    id: 9,
    name: "Малиновый медовик",
    description: "Авторский слоеный торт с тонкими медовыми коржами, сливочным кремом и ярким верхом из малины.",
    price: 350,
    categoryId: "dessert",
    imageUrl: "https://i.postimg.cc/c6vzgZzy/image.jpg",
  },
  {
    id: 11,
    name: "Торт с арахисовым маслом",
    description: "Торт в глянцевой шоколадной глазури с насыщенным кремом из арахисового масла, украшен золотом.",
    price: 350,
    categoryId: "dessert",
    imageUrl: "https://i.postimg.cc/JsxxYdFp/image.jpg",
  },
  {
    id: 10,
    name: "Карамельный эклер",
    description: "Воздушный эклер, покрытый карамельной глазурью, с дроблеными орехами и декоративными хлопьями.",
    price: 250,
    categoryId: "dessert",
    imageUrl: "https://i.postimg.cc/SXZZRt7N/image.jpg",
  },
  {
    id: 12,
    name: "Лимонный пирог с меренгой",
    description: "Маленький тарт с яркой лимонной начинкой и поджаренными пиками воздушной меренги.",
    price: 300,
    categoryId: "dessert",
    imageUrl: "https://i.postimg.cc/QHrq83GR/image.jpg",
  },
  {
    id: 15,
    name: "Шоколадно-арахисовое печенье",
    description: "Большое домашнее печенье с шоколадными чипсами, арахисовой посыпкой и шоколадной глазурью.",
    price: 200,
    categoryId: "dessert",
    imageUrl: "https://i.postimg.cc/hfS7ZPqP/image.jpg",
  }
];
