import { IProduct, TProductCard } from '../../types';
import { CDN_URL } from '../../utils/constants';
import { cloneTemplate, ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export class ProductCardView extends Component<TProductCard> {
	protected element: HTMLElement;
	protected events: IEvents;
	protected container: HTMLButtonElement;
	protected category: HTMLElement;
	protected title: HTMLElement;
	protected image: HTMLImageElement;
	protected price: HTMLElement;
	protected productId: string;

	constructor(template: HTMLTemplateElement, events: IEvents) {
		const element = cloneTemplate(template);
		super(element);

		this.events = events;
		this.element = element;

		this.container = this.element as HTMLButtonElement;
		this.category = ensureElement<HTMLElement>('.card__category', this.element);
		this.title = ensureElement<HTMLElement>('.card__title', this.element);
		this.image = ensureElement<HTMLImageElement>('.card__image', this.element);
		this.price = ensureElement<HTMLElement>('.card__price', this.element);
	}

	setData(data: TProductCard) {
		this.productId = data.id;
		this.image.src = `${CDN_URL}${data.image}`;
		this.image.alt = data.title;
		this.setText(this.title, data.title);
		this.setText(this.category, data.category);
		this.setText(
			this.price,
			data.price ? `${data.price} синапсов` : `Бесценно`
		);

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
			this.toggleClass(this.category, `card__category${modifier}`, true);
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
}
