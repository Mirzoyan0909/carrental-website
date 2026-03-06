# PremiumAuto - Deployment Guide 🚀

## Бесплатный Хостинг

### 1️⃣ Backend на Render.com

1. Зарегистрируйтесь на [Render.com](https://render.com)
2. Создайте новый **Web Service**
3. Подключите ваш GitHub репозиторий
4. Настройки:
   - **Name**: `premiumauto-backend`
   - **Region**: `Oregon (US West)` или ближайший
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn server:app --host 0.0.0.0 --port $PORT`
   - **Instance Type**: `Free`

5. **Environment Variables** (добавьте в Render):
   ```
   MONGO_URL=<ваш MongoDB Atlas URL>
   DB_NAME=car_marketplace
   JWT_SECRET=my-super-secret-key-12345
   BACKEND_URL=<ваш Render URL после деплоя>
   CORS_ORIGINS=*
   ```

6. Нажмите **Create Web Service**

### 2️⃣ Frontend на Netlify

1. Зарегистрируйтесь на [Netlify.com](https://netlify.com)
2. Перейдите в Sites → **Add new site** → **Import from Git**
3. Подключите ваш GitHub репозиторий
4. Настройки:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build` или `yarn build`
   - **Publish directory**: `frontend/build`

5. **Environment Variables** (добавьте в Netlify):
   ```
   REACT_APP_BACKEND_URL=<ваш Render backend URL>
   ```

6. Нажмите **Deploy site**

### 3️⃣ База Данных на MongoDB Atlas

1. Зарегистрируйтесь на [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Создайте **Free Cluster** (M0 Sandbox)
3. Настройте:
   - **Cloud Provider**: AWS
   - **Region**: Ближайший к вам
   - Создайте Database User (сохраните username и password)
   - **Network Access**: Add IP Address → Allow Access from Anywhere (0.0.0.0/0)

4. Получите Connection String:
   - Нажмите **Connect** → **Connect your application**
   - Скопируйте строку подключения
   - Замените `<password>` на ваш пароль
   - Используйте эту строку как `MONGO_URL` в Render

---

## 📝 Пошаговая Инструкция

### Шаг 1: MongoDB Atlas
```
1. Создайте аккаунт на MongoDB Atlas
2. Создайте бесплатный кластер
3. Создайте пользователя базы данных
4. Разрешите доступ со всех IP (0.0.0.0/0)
5. Скопируйте Connection String
```

### Шаг 2: Backend на Render
```
1. Создайте Web Service на Render
2. Подключите GitHub репозиторий
3. Укажите папку backend
4. Добавьте environment variables (включая MONGO_URL из Атласа)
5. Дождитесь деплоя и скопируйте URL
```

### Шаг 3: Frontend на Netlify
```
1. Создайте новый сайт на Netlify
2. Подключите GitHub репозиторий
3. Укажите папку frontend
4. Добавьте REACT_APP_BACKEND_URL (URL из Render)
5. Задеплойте
```

---

## 🔑 Данные для Входа в Админ Панель

- **URL**: `ваш-netlify-url.netlify.app/admin`
- **Логин**: `Autorent`
- **Пароль**: `Rentauto`

---

## ⚙️ Конфигурационные Файлы

### render.yaml (для Render)
```yaml
services:
  - type: web
    name: premiumauto-backend
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn server:app --host 0.0.0.0 --port $PORT
    envVars:
      - key: MONGO_URL
        sync: false
      - key: DB_NAME
        value: car_marketplace
      - key: JWT_SECRET
        sync: false
      - key: BACKEND_URL
        sync: false
```

### netlify.toml (для Netlify)
```toml
[build]
  base = "frontend"
  command = "npm run build"
  publish = "build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## 🎯 После Деплоя

1. Зайдите на ваш сайт
2. Нажмите на золотую иконку админа внизу справа
3. Войдите с данными: **Autorent** / **Rentauto**
4. Добавьте ваши автомобили!

---

## 🆘 Поддержка

Если возникли проблемы:
- Проверьте логи в Render Dashboard
- Проверьте Deploy logs в Netlify
- Убедитесь что MongoDB Atlas разрешает подключения

---

## 🎨 Особенности

✨ **Красивая плавающая админ кнопка** - золотая иконка внизу справа
✨ **Загрузка фото с ПК** - не только URL, но и файлы с компьютера
✨ **Премиум дизайн** - анимации, градиенты, современный UI
✨ **Готов к продакшну** - оптимизирован для бесплатного хостинга

Удачи! 🚀
