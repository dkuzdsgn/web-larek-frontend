# Проектная работа "Веб-ларек"

## Используемый стек

**Языки:** HTML, TypeScript  
**Стилизация:** SCSS  
**Сборка:** Webpack  
**Линтинг и автоформатирование:** ESLint, Prettier

## Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Инструкция по сборке и запуску

### Установка
Для установки зависимостей выполните одну из команд

```bash
npm install
```
или

```bash
yarn
```
### Запуск
Для запуска проекта в режиме разработки выполните одну из команд

```bash
npm run start
```
или

```bash
yarn start
```

### Сборка проекта
Для сборки проекта в продакшн-режиме выполните одну из команд

```bash
npm run build
```
или

```bash
yarn build
```
## Данные и типы данных используемые в приложении

**Данные о продукте**
```
export interface IProduct {
  id: number;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}
```

**Данные пользователя**
```
export interface IUserInfo {
  payment: PaymentMethod;
  address: string;
  email: string;
  phone: string;
}
```
**Данные для окна успешно оформленного заказа**
```
export interface IOrderResult {
  id: string;
  total: number;
}
```
**Интерфейс для описания типа заказа**
```
interface IOrder extends IUserInfo { 
    items: string[]; 
    total: number;
}
```
**Интерфейс для модели данных корзины**
```
export interface ICartData {
  items: TCartItem[];
  total: number;
}
```

**Данные о продукте, используемые в карточке продукта**
```
export type TProductCard = Omit<IProduct, 'description'>;
```
 
**Данные о продукте, используемые в корзине**
```
export type TCartItem = Pick<IProduct, 'id' | 'title' | 'price'> & {
  order: number;
};
```

 **Данные о способах оплаты**
```
export type PaymentMethod = 'online' | 'on-receive';
```

 **Данные в модальном окне ”Информация о способе оплаты и доставке”**
```
export type TDeliveryInfo = Pick<IUserInfo, 'paymentMethod' | 'address' >
```

 **Данные в модальном окне “Контактная информация”**
```
export type TContactInfo = Pick<IUserInfo, 'email' | 'phone' >
```

 **Данные для валидации формы оформления заказа**
```
export type TOrderStep = 'deliveryInfo' | 'contactInfo' | 'finalCheck';
```

**Ошибка Продукт не найден**
```
export interface IProductError {
  error: string;
}
```

 **Данные о возможных ошибках заказа**
```
export type TOrderError = "WrongTotal" | "WrongAddress" | "ProductNotFound";
```

**Ошибка заказа**
```
export interface IOrderError {
  error: TOrderError;
}
```

## Архитектура приложения

Проект построен по архитектурному паттерну **MVP**, где логика разделена на 3 слоя:

### 1. Model
Слой данных, отвечающий за хранение данных, а также за предоставление методов для их изменения и валидации. 

### 2. View
Слой представления, отвечающий за отображение данных и взаимодействие с пользователем.

### 3. Presenter
Слой Presenter, отвечающий за связь между моделью и отображением.

### Базовый код

#### Класс API
Содержит в себе базовую логику отправки запросов. В конструктор передаётся базовый адрес сервера и необязательный объект с заголовками запроса.

```
constructor(baseUrl: string, options?: RequestInit): Api
```
`baseUrl` — базовый адрес сервера (например, https://api.example.com)

`options` — необязательный объект настроек запроса (RequestInit)

**Методы класса**

**GET -** 
Выполняет GET-запрос на переданный в параметрах endpoint и возвращает промис с объектом, которым ответил сервер.
```
get(uri: string): Promise<object>
```
`uri` — путь к ресурсу (например, /products)

Возвращает: `Promise<object>` — промис с объектом-ответом

**POST -**
Принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на endpoint, переданный как параметр при вызове метода. По умолчанию выполняется POST-запрос, но метод запроса может быть переопределён заданием третьего параметра при вызове.
```
post(uri: string, data: object, method?: ApiPostMethods): Promise<object>
```
`uri` — путь к ресурсу
`data` — объект, который будет отправлен в теле запроса
`method?` — HTTP-метод запроса: 'POST' | 'PUT' | 'DELETE' (по умолчанию 'POST')

Возвращает: `Promise<object>` — промис с объектом-ответом

#### Класс EventEmitter
Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе. Класс используется в презентере для обработки событий и в слоях приложения для генерации событий.

```
constructor(): EventEmitter
```
**Основные методы, реализуемые классом, описаны интерфейсом IEvents:**

**on — подписка на событие**
```
on<T extends object>(event: EventName, callback: (data: T) => void): void;
```
- `eventName` — имя события
- `callback` — функция, вызываемая при наступлении события
- Возвращает: `void`

**emit — инициализация события**
```
emit<T extends object>(event: eventName, data?: T): void;
```
- `eventName` — имя события
- `data?` — объект данных, передаваемых подписчикам
- Возвращает: `void`

**trigger — возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие**
```
trigger<T extends object>(event: eventName, context?: Partial<T>): (data: T) => void;
```

- `eventName` — имя события
- `context?` — заранее заданный набор данных, который будет объединён с event
- Возвращает: `функцию (event?: object) => void`, которая вызывает emit

#### Абстрактный класс Component<T>
Базовый класс для всех визуальных компонентов слоя View.\
Обеспечивает общую структуру и набор вспомогательных методов для работы с DOM.
Используется в архитектуре MVP для упрощения разработки компонентов.

**Свойства**
 - protected readonly container: HTMLElement\
Корневой DOM-элемент компонента, в который вставляется разметка и контент.

**Конструктор**
```
protected constructor(container: HTMLElement)
```
- container — DOM-элемент, в который компонент будет рендериться.

**Методы**
- `toggleClass` - Добавляет или убирает CSS-класс у элемента. Если передан force, явно устанавливает состояние.
```
toggleClass(element: HTMLElement, className: string, force?: boolean): void
```
- `setText` - Устанавливает текстовое содержимое для элемента. Если value пустой, очищает текст. 
```
protected setText(element: HTMLElement, value: unknown): void
```
- `setDisabled` - Включает или отключает элемент формы (input, button, и т.п.).
```
setDisabled(element: HTMLElement, state: boolean): void
```
- `setHidden` - Скрывает элемент, добавляя hidden.
```
protected setHidden(element: HTMLElement): void
```
- `setVisible` - Отображает ранее скрытый элемент, убирая hidden.
```
protected setVisible(element: HTMLElement): void
```
- `setImage` - Устанавливает src и alt для изображения.
```
protected setImage(element: HTMLImageElement, src: string, alt?: string): void
```
- `render` - Возвращает корневой DOM-элемент компонента.
```
render(data?: Partial<T>): HTMLElement
```

### Слой данных

#### Класс ProductModel

Класс управляет списком продуктов, полученных с сервера.\
Поддерживает методы получения списка и поиска по ID.

В полях данных хранятся следующие данные:

- `_products: IProduct[]` — массив всех продуктов.

**Методы класса:**

- `set products(products: IProduct[])` — сохраняет список продуктов.
- `getProductList(): IProduct[]` — возвращает весь список продуктов.
- `getProductById(id: number): IProduct | undefined` — возвращает продукт по ID или undefined, если не найден.

#### Класс CartModel

Класс отвечает за хранение и управление товарами, добавленными в корзину.
Поддерживает методы добавления, удаления, подсчёта и очистки товаров.

В полях данных хранятся следующие данные:

- `_items: TCartItem[]` — массив товаров в корзине.
- `events: IEvents` — экземпляр класса `EventEmitter` для инициации событий при изменении данных.

**Методы класса:**

- `addProduct(product: IProduct): void` — добавляет товар в корзину. 
- `removeProduct(id: number): void` — удаляет товар из корзины по ID.
- `getItems(): TCartItem[]` — возвращает массив всех товаров в корзине.
- `getTotalCount(): number` — возвращает общее количество товаров.
- `hasProduct(id: number): boolean` — проверяет наличие товара в корзине.
- `clear(): void` — очищает корзину.
- `getCart(): ICartData` — возвращает данные о заказе.

#### Класс OrderModel

Класс управляет пользовательскими данными, введёнными при оформлении заказа.
Также содержит встроенную валидацию каждого шага формы.

В полях данных хранятся следующие данные:

- `_orderInfo: IUserInfo` — объединённые данные из всех шагов формы.
- `events: IEvents` — экземпляр класса `EventEmitter` для инициации событий при изменении данных.

**Методы класса:**

- `setDeliveryInfo(data: TDeliveryInfo): void` — сохраняет способ оплаты и адрес доставки.
- `setContactInfo(data: TContactInfo): void` — сохраняет контактные данные пользователя.
- `getOrderInfo() : IUserInfo` — возвращает полный объект с информацией о заказе.
- `checkValidation() : Record<TOrderStep, boolean>` — выполняет поэтапную валидацию формы (deliveryInfo, contactInfo, finalCheck).
- `clear(): void` — сбрасывает все сохранённые данные.

### Слой представления

Все классы слоя представления отвечают за отображение внутри контейнера (DOM-элемент) передаваемых в них данных.


#### Класс ProductCardView 
**Наследуется от:** `abstract class Component<T>`\
Отображает карточку товара в каталоге. При клике открывает модальное окно `ProductPreviewView` с подробной информацией о товаре.

**Поля класса:**

- `container`: HTMLElement — корневой элемент карточки
- `category`: HTMLElement — категория товара 
- `title`: HTMLElement — название товара
- `image`: HTMLImageElement — изображение товара
- `price`: HTMLElement — отображает цену
- `events`: IEvents — брокер событий

**Методы:**

- `render(data: TProductCard): HTMLElement` - Заполняет карточку данными о товаре
- `setClickHandler(handler: () => void): void` - Назначает обработчик на клик по карточке. Используется для открытия ProductPreviewView с полной информацией о товаре.

#### Класс ProductCatalogView
**Наследуется от:** `abstract class Component<T>`\
Контейнер для карточек товаров. Отвечает за отображение блока карточек `ProductCardView` на главной странице. Класс не хранит карточки, а динамически создаёт экземпляры `ProductCardView` на основе входного массива данных. 

**Поля класса:**

- `container: HTMLElement` — DOM-элемент, в который вставляются карточки
- `events: IEvents` — брокер событий

**Методы:**

- `render(data: IProduct[]): HTMLElement` - рендер карточек

#### Класс ProductPreviewView
Класс карточки с подробной информацией о товаре. Используется для показа описания, изображения, категории, названия и кнопки «В корзину» перед оформлением покупки.

**Поля класса:**

- `image: HTMLImageElement` — изображение товара.
- `title: HTMLElement` — название товара.
- `description: HTMLElement` — описание товара.
- `category: HTMLElement` — отображает категорию.
- `price: HTMLElement` — отображает цену.
- `addButton: HTMLButtonElement` — кнопка «В корзину».
- `events: IEvents` — брокер событий

**Методы:**

- `render(data: IProduct): HTMLElement` — отображает данные о товаре
- `setAddHandler(handler: () => void): void` — задаёт обработчик кнопки

#### Класс Modal
**Наследуется от:** `abstract class Component<T>`\
Базовый компонент для модальных окон. Управляет открытием и закрытием модального окна, содержит кнопку закрытия. Используется как родительский класс для всех модальных компонентов.
- `constructor(selector: string, events: IEvents)` Конструктор принимает селектор, по которому в разметке страницы будет идентифицировано модальное окно и экземпляр класса `EventEmitter` для возможности инициации событий.

**Поля класса:**

- `modal: HTMLElement` - элемент модального окна
- `closeButton: HTMLButtonElement` — кнопка закрытия
- `events: IEvents` - брокер событий

**Методы:**

- `open(): void` — делает модальное окно видимым
- `close(): void` — скрывает модальное окно
-	`setContent(content: HTMLElement): void` - устанавливает контент в модальном окне

#### Класс Form
**Наследуется от:** `abstract class Component<T>`\
Базовый компонент для работы с формами. Реализует автоматическую валидацию, отправку формы и отображение ошибок. Используется как родительский класс для FormOrder, FormContacts и FormSuccess

- `constructor(container: HTMLFormElement, events: IEvents)` Конструктор инициализирующий форму и экземпляр класса `EventEmitter` для возможности инициации событий.

**Поля класса:**

- `container: HTMLFormElement` — HTML-элемент формы
- `_submit: HTMLButtonElement` — кнопка отправки формы
- `_errors: HTMLElement` — контейнер для отображения текстовых ошибок
- `events: IEvents` - брокер событий

**Методы:**

- `validateForm(): boolean` - Выполняет встроенную валидацию всех <input> в форме. Учитывает required, pattern, tooShort, а также кастомные сообщения через data-* атрибуты.
- `set valid(value: boolean)` - Управляет состоянием доступности кнопки отправки (disabled).
- `set errors(value: string)` - Устанавливает текст ошибки в _errors.
- `render(state: Partial<T> & IFormState): HTMLElement` - Обновляет внутреннее состояние формы и перерисовывает поля на основе полученных данных.

#### Класс FormOrder

**Наследуется от:** `Form`\
Отображает первый шаг оформления заказа: выбор способа оплаты и ввод адреса доставки.

**Поля класса:**

- `form: HTMLFormElement` — форма заказа
- `cardButton: HTMLButtonElement` — кнопка «Онлайн»
- `cashButton: HTMLButtonElement` — кнопка «При получении»
- `addressInput: HTMLInputElemen` — поле ввода адреса
- `submitButton: HTMLButtonElement` — кнопка «Далее»
- `errorText: HTMLElement` — блок ошибок
- `events: IEvents` — брокер событий

**Методы:**

- `render(data?: TDeliveryInfo): void` — заполняет поля формы (опционально)
- `getData(): TDeliveryInfo` — возвращает введённые данные
- `setDisabled(state: boolean): void` — блокирует/разблокирует кнопку отправки
- `setChangeHandler(handler: () => void): void` — обработчик изменения полей

#### Класс FormContacts

**Наследуется от:** `Form`\
Отображает второй шаг оформления заказа — контактная информация: email и телефон.

**Поля класса:**

- `form: HTMLFormElement` — форма ввода
- `emailInput: HTMLInputElement` — поле email
- `phoneInput: HTMLInputElement` — поле телефона
- `submitButton: HTMLButtonElement` — кнопка «Оплатить»
- `errorText: HTMLElement` — блок ошибок
- `events: IEvents` — брокер событий

**Методы:**

- `render(data?: TContactInfo): void` — подставляет данные в форму
- `getData(): TContactInfo` — возвращает введённые данные
- `setDisabled(state: boolean): void` — активирует/деактивирует кнопку
- `setChangeHandler(handler: () => void): void` — обработчик изменения

#### Класс FormSuccess
**Наследуется от:** `Form`\
Отображает информацию об успешном оформлении заказа.

**Поля класса:**

- `title: HTMLElement` — заголовок («Заказ оформлен»)
- `description: HTMLElement` — текст с итоговой суммой
- `closeButton: HTMLButtonElement` — кнопка «За новыми покупками!»
- `events: IEvents` — брокер событий

**Методы:**

- `render(data: IOrder): void` — подставляет сумму и ID заказа
- `setCloseHandler(handler: () => void): void` — обработчик кнопки закрытия

#### Класс CartView

**Наследуется от:** ModalView\
Модальное окно, отображающее содержимое корзины: список товаров, итоговую сумму и кнопку оформления.

**Поля класса:**

- `list: HTMLElement` — контейнер для CartProductRowView
- `submitButton: HTMLButtonElement` — кнопка «Оформить»
- `total: HTMLElement` — сумма корзины
- `events: IEvents` — брокер событий

**Методы:**

- `render(data: ICartData): void` — отрисовывает список товаров и итог
- `setSubmitHandler(handler: () => void): void` — обработчик кнопки оформления
- `clear(): void` — очищает список товаров в корзине


#### Класс CartProductRowView
**Наследуется от:** `abstract class Component<T>`\
Представляет одну строку товара в корзине. Показывает номер, название, цену и кнопку удаления.

**Поля класса:**

- `indexEl: HTMLElement` — порядковый номер
- `titleEl: HTMLElement` — название товара
- `priceEl: HTMLElement` — цена
- `removeButton: HTMLButtonElement` — кнопка удаления
- `events: IEvents` — брокер событий

**Методы:**

- `render(data: TCartItem): HTMLElement` — вставляет данные товара в строку
- `setRemoveHandler(handler: () => void): void` — обработчик кнопки удаления

### Слой коммуникации

#### Класс WebLarekApi
Принимает в конструктор экземпляр класса Api и предоставляет методы, реализующие взаимодействие с бекэндом сервиса.

**Методы:**

- `getProductList(): Promise<IProduct[]>` — получает список всех продуктов
- `sendOrder(data: IOrder): Promise<IOrderResult>` — отправляет заказ и получает результат

## Взаимодействие компонентов

Код, описывающий взаимодействие представления и данных между собой находится в файле `index.ts`, который выполняет роль презентера.\
Взаимодействие осуществляется за счет событий генерируемых с помощью брокера событий и обработчиков этих событий, описанных в `index.ts`\
В `index.ts` сначала создаются экземпляры всех необходимых классов, а затем настраивается обработка событий.

**Список событий в приложении:**

События изменения данных (генерируются классами моделями данных)
- `cart:changed` - обновление содержимого корзины и иконку корзины (указывает номер с кол-вом товара в корзине)
- `order:changed` - обновление данных заказа
- `cart:cleared`- очистка корзины
- `order:cleared` - очистка данных заказа 

События, возникающие при взаимодействии пользователя с интерфейсом (генерируются классами, отвечающими за представление)

- `product:select` — выбор карточки товара для отображения в модальном окне
- `product:add-to-cart` — добавление товара в корзину из модального окна
- `product:close-preview` — закрытие модального окна с информацией о продукте
- `cart:open` — открытие модального окна с корзиной
- `cart:close` — закрытие модального окна с корзиной
- `cart:item-remove` — удаление товара из корзины
- `cart:submit` — клик по кнопке «Оформить» в корзине
- `edit-delivery:change` — изменение данных об адресе и способе оплаты
- `edit-delivery:validation` — событие, сообщающее о необходимости валидации формы
- `edit-contact:change` — изменение контактных данных
- `edit-contact:validation` — событие, сообщающее о необходимости валидации формы
- `order-delivery:submit` — сохранение данных об оплате и доставке
- `order-contact:submit` — сохранение контактных данных и отправка заказа
- `order:close` — закрытие формы заказа
- `order:restart` — клик по кнопке «За новыми покупками!» — закрывает окно и возвращает в каталог