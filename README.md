Инструкция по запуску проекта на локальной машине

## Сервер (src/backend)

Отвечает за получение от пользователя модели данных, хранение, редактирование + разделение прав доступа.

Для работы необходима Windows 10 или Linux. Тестировалось на англоязычной Windows 10.

**Требуется предустановленный софт:**
- .NET Core 2.2
- PostgreSQL 9.6 и выше

**Запуск:**
1. В файле appsettings.json для ключа belsimDbContextConnection указать строку подключения к базе данных PostgreSQL.
2. Сбилдовать и запустить из Visual Studio 
ИЛИ
открыть папку проекта в консоли (\src\backend\belsim2020\belsim2020) и выполнить команду
`dotnet run`

Если все нормально, будет примерно такой вывод:
```
nikita@DESKTOP-ON5M1VP C:\projects\belsim2020\src\backend\belsim2020\belsim2020
# dotnet run
Controllers\AdminController.cs(123,42): warning CS1998: This async method lacks 'await' operators and will run synchronously. Consider using the 'await' operator to await non-blocking API calls, or 'await Task.Run(...)' to do CPU-bound work on a background thread. [C:\projects\belsim2020\src\backend\belsim2020\belsim2020\belsim2020.csproj]
info: Microsoft.AspNetCore.DataProtection.KeyManagement.XmlKeyManager[0]
      User profile is available. Using 'C:\Users\nikita\AppData\Local\ASP.NET\DataProtection-Keys' as key repository and Windows DPAPI to encrypt keys at rest.
Hosting environment: Development
Content root path: C:\projects\belsim2020\src\backend\belsim2020\belsim2020
Now listening on: https://localhost:3101
Now listening on: http://localhost:3100
Application started. Press Ctrl+C to shut down.
```

3. Для инициализации приложения (выполняется один раз для каждой новой базы данных) требуется сделать POST запрос:
https://localhost:3101/api/admin/init-system
(вернется код 200)

Дефолтный админский аккаунт:
Логин: belsim@bru.by
Пароль: 111111

## Интеграционный сервис (src/integration-app)

Отвечает за получение модели данных от backend, преобразование в формат, понятный вычислительному модулю BelSim, запуск этого модуля с передачей ему модели, получение результатов вычислений и отправку обратно на backend.

Для работы необходима **русскоязычная** Windows. Тестировалось на Windows XP, запущенной в VirtualBox.

**Требуется предустановленный софт:**
- .NET Framework 4
- патч NDP40-KB2600211-x86 (для Windows XP, в более новых системах ошибка должна быть уже пофикшена)

**Запуск:**
1. Сбилдовать приложение belsim2020/src/integration-app/belsim2020.Integration/
 в Visual Studio.
2. В файле belsim2020.Integration.exe.config для ключа ApiBaseUrl установить базовый путь к backend. 
Если интеграционное приложение запускается в виртуальной машине, то путь будет ip хост-машины - обычно http://10.0.2.2:3100/api/experiment.
Если запуск локально, рядом с backend - то http://localhost:3100/api/experiment
3. Запустить из консоли belsim2020.Integration.exe

Если все нормально (+ запущен backend), то будет примерно такой вывод:
```
C:\Belsim2020\Debug>belsim2020.Integration.exe
19:26:06|Info|belsim2020.Integration.Program| Run app
19:26:06|Info|belsim2020.Integration.Application| Waiting for pulling experiment
 from server...
19:26:16|Info|belsim2020.Integration.Application| Getting new experiment from se
rver...
19:26:20|Info|belsim2020.Integration.Application| No new experiments.
19:26:20|Info|belsim2020.Integration.Application| Waiting for pulling experiment
 from server...
```

## Фронтенд (src/frontend)

**Требуется предустановленный софт (для запуска на дев-сервере или билда):**
- NodeJS 10 и выше
- npm 6

Для запуска на дев-сервере, в консоли открываем папку /src/frontend/src и выполняем команды:
`npm i`
`npm start`


Если сервер запустился успешно, то приложение будет доступно по адресу:
http://localhost:3000/

Если требуется собрать для запуска без дев-сервера (для деплоя на apache), то приложение собирается командами:
`npm i`
`npm build`