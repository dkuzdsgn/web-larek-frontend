// #### Класс ProductCardView
// **Наследуется от:** `abstract class Component<T>`\
// Отображает карточку товара в каталоге. При клике открывает модальное окно `ProductPreviewView` с подробной информацией о товаре.

// **Поля класса:**

// - `container`: HTMLButtonElement — корневой элемент карточки и кнопка, при нажатии которой, открывается превью товара
// - `category`: HTMLElement — категория товара
// - `title`: HTMLElement — название товара
// - `image`: HTMLImageElement — изображение товара
// - `price`: HTMLElement — отображает цену
// - `events`: IEvents — брокер событий

// **Методы:**

// - `render(data: TProductCard): HTMLElement` - Заполняет карточку данными о товаре
// - `setClickHandler(handler: () => void): void` - Назначает обработчик на клик по карточке. Используется для открытия ProductPreviewView с полной информацией о товаре.

import { IProduct, TProductCard } from '../../types';
import { CDN_URL } from '../../utils/constants';
import { cloneTemplate } from '../../utils/utils';
import { IEvents } from '../base/Events';

export class ProductCardView {
	protected element: HTMLElement;
	protected events: IEvents;
	protected container: HTMLButtonElement;
	protected category: HTMLElement;
	protected title: HTMLElement;
	protected image: HTMLImageElement;
	protected price: HTMLElement;
	protected productId: string;

	constructor(template: HTMLTemplateElement, events: IEvents) {
		this.events = events;
		this.element = cloneTemplate(template);

		this.container = this.element as HTMLButtonElement;

		this.category = this.element.querySelector('.card__category');
		this.title = this.element.querySelector('.card__title');
		this.image = this.element.querySelector('.card__image');
		this.price = this.element.querySelector('.card__price');
	}

	setData(data: TProductCard) {
		this.productId = data.id;
		this.image.src = `${CDN_URL}${data.image}`;
		this.image.alt = data.title;
		this.title.textContent = data.title;
		this.category.textContent = data.category;
		this.price.textContent = data.price ? `${data.price} синапсов` : `Бесценно`;

		const categoryMap: Record<string, string> = {
			'софт-скил': '_soft',
			'хард-скил': '_hard',
			другое: '_other',
			дополнительное: '_additional',
			кнопка: '_button',
		};

		const key = data.category.toLowerCase().trim();
		const modifier = categoryMap[key];

		if (modifier) {
			this.category.classList.add(`card__category${modifier}`);
		}
	}

	setClickHandler(product: IProduct): void {
		this.container.addEventListener('click', () => {
			this.events.emit('product:select', product);
		});
	}

	get id() {
		return this.productId;
	}

	render() {
		return this.element;
	}
}
