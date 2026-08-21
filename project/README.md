Gemini AI Generator
Это Micro-SaaS приложение для генерации контента на основе API Google Gemini.

🚀 Live Demo
Посмотреть проект в действии можно по ссылке: https://gemini-ai-generator.vercel.app

💡 Как пользоваться приложением
Откройте сайт https://gemini-ai-generator.vercel.app.

В поле ввода на главной странице опишите задачу или вопрос, на который хотите получить ответ от AI (например, «Напиши план тренировок на неделю» или «Составь письмо для рассылки»).

Нажмите кнопку отправки (обычно «Generate» или иконка стрелки).

Подождите несколько секунд, пока AI обрабатывает запрос, и результат появится на карточке вывода.

Вы можете просматривать историю ваших предыдущих запросов на боковой панели (если эта функция активна).

🛠 Стек технологий
Framework: Next.js (App Router)

Language: TypeScript

Styling: Tailwind CSS

UI Components: Shadcn/UI

AI Integration: Google Generative AI (Gemini API)

Deployment: Vercel

⚙️ Для разработчиков: локальный запуск
Если вы хотите запустить проект локально:

Клонируйте репозиторий: git clone [https://github.com/negboimahmudov1993-creator/gemini-ai-generator.git](https://github.com/negboimahmudov1993-creator/gemini-ai-generator.git)

Установите зависимости: npm install

Создайте файл .env.local в корне проекта и добавьте ваш ключ: GOOGLE_GENERATIVE_AI_API_KEY=ваш_ключ_здесь

Запустите сервер: npm run dev