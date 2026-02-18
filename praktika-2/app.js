// app.js
// Практика 2: API на Node.js + Express
// Требование: CRUD для товаров (id, название, стоимость)
// Комментарии добавлены специально по условию

const express = require('express'); // Подключаем Express (фреймворк для API) [file:49]
const app = express();
const port = 3000; // Порт, как в примерах методички [file:49]

// Middleware для парсинга JSON, чтобы в запросах работал req.body [file:49]
app.use(express.json());

// Собственное middleware: выводим метод и URL каждого запроса (как пример в методичке) [file:49]
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// "База" в памяти (без БД). Можно менять, пока работает сервер.
let products = [
  { id: 1, title: 'Наушники A1', price: 2990 },
  { id: 2, title: 'Клавиатура K2', price: 4590 },
  { id: 3, title: 'Мышь M3', price: 1990 },
];

// Главная страница (проверка, что сервер жив)
app.get('/', (req, res) => {
  res.send('Products API is running');
});

// ===== READ: получить все товары =====
app.get('/products', (req, res) => {
  res.json(products);
});

// ===== READ: получить товар по id (id берём из req.params) ===== [file:49]
app.get('/products/:id', (req, res) => {
  const id = Number(req.params.id); // req.params — URL-параметры [file:49]
  const product = products.find(p => p.id === id);

  if (!product) {
    return res.status(404).json({ message: 'Товар не найден' });
  }

  res.json(product);
});

// ===== CREATE: добавить товар (данные берём из req.body) ===== [file:49]
app.post('/products', (req, res) => {
  const { title, price } = req.body; // req.body доступен из-за express.json() [file:49]

  // Мини-валидация
  if (typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ message: 'Поле title обязательно (строка)' });
  }
  if (typeof price !== 'number' || Number.isNaN(price) || price < 0) {
    return res.status(400).json({ message: 'Поле price обязательно (число >= 0)' });
  }

  // Генерируем новый id (просто max + 1)
  const maxId = products.length ? Math.max(...products.map(p => p.id)) : 0;

  const newProduct = {
    id: maxId + 1,
    title: title.trim(),
    price,
  };

  products.push(newProduct);

  res.status(201).json(newProduct);
});

// ===== UPDATE: полное редактирование товара по id (PUT) =====
app.put('/products/:id', (req, res) => {
  const id = Number(req.params.id);
  const { title, price } = req.body;

  const product = products.find(p => p.id === id);
  if (!product) {
    return res.status(404).json({ message: 'Товар не найден' });
  }

  // В PUT обычно передают оба поля
  if (typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ message: 'Поле title обязательно (строка)' });
  }
  if (typeof price !== 'number' || Number.isNaN(price) || price < 0) {
    return res.status(400).json({ message: 'Поле price обязательно (число >= 0)' });
  }

  product.title = title.trim();
  product.price = price;

  res.json(product);
});

// ===== UPDATE: частичное редактирование товара по id (PATCH) ===== [file:49]
app.patch('/products/:id', (req, res) => {
  const id = Number(req.params.id);
  const { title, price } = req.body;

  const product = products.find(p => p.id === id);
  if (!product) {
    return res.status(404).json({ message: 'Товар не найден' });
  }

  // Обновляем только то, что передали
  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ message: 'title должен быть непустой строкой' });
    }
    product.title = title.trim();
  }

  if (price !== undefined) {
    if (typeof price !== 'number' || Number.isNaN(price) || price < 0) {
      return res.status(400).json({ message: 'price должен быть числом >= 0' });
    }
    product.price = price;
  }

  res.json(product);
});

// ===== DELETE: удалить товар по id =====
app.delete('/products/:id', (req, res) => {
  const id = Number(req.params.id);

  const exists = products.some(p => p.id === id);
  if (!exists) {
    return res.status(404).json({ message: 'Товар не найден' });
  }

  products = products.filter(p => p.id !== id);

  res.send('Ok'); // В методичке в примере удаления тоже возвращают "Ok" [file:49]
});

// Запуск сервера (обязательно, иначе node app.js сразу завершится) [file:49]
app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});
