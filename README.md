# Сайт недвижимости
[ссылка на сайт](https://estate-market.onrender.com/)

## Описание
Простой сайт где можно разместить объявления. На сайте есть возможность авторизации через google или через форму
Авторизованный пользователь может размещать объявления. Можно просматривать объявления, искать их через форму поиска. Можно написать владельцу объявления.

## Ссылка на проект и публикация в сети

Для публикации проекта в сети используется сервис [Render.com](https://render.com/). 
Сервис доступен в по ссылке [сайт недвижимости](https://estate-market.onrender.com/)

## Запуск проекта
```
npm install - устанавливаем зависимости в корневой папке
npm run dev - запуск сервера проекта для разработки
cd client - переходим в папку клиентской части
npm run dev - запуск клиента для разработки.
Так же для запуска проекта нужно создать файл `.env` где нужно добавить API ключи
`API_URL=<ссылка на базу mongodb с логином и паролем>`
`JWT_SECRET=<секретная фраза для JWT>`
В папке client
`VITE_FIREBASE_API_KEY=<секретный api ключ для FIREBASE>`
```

## Скрипты
#### Сервер
- `npm run dev` - Запуск dev server для разработки
- `npm run start` - Запуск server
- `npm run build` - Запуск сервера и сборка проекта для работы в сети
`"npm install && npm install --prefix client && npm run build --prefix client"` - работа в сети
#### Клиент
- `npm run dev` - Запуск frontend dev server для разработки
- `npm run build` - Сборка frontend
- `npm run lint` - Линтер для проверки кода и линтинга
- `npm run format` - Преттир для правил кода
- `npm run preview` - Vite preview

## Технологии
Для работы сервиса используется mongodb где хранятся объявления для сервиса так же данные о пользователях.
Так же используется google firebase для хранения фото объявлений и пользователя.
Firebase используется для авторизации пользователей через google аккаунт. 
