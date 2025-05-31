import { IProduct } from '../../types';
import { CDN_URL } from '../../utils/constants';
import { cloneTemplate, ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export class ProductPreviewView extends Component<IProduct> {
	protected element: HTMLElement;
	protected events: IEvents;
	protected container: HTMLButtonElement;

	protected image: HTMLImageElement;
	protected title: HTMLElement;
	protected description: HTMLElement;
	protected category: HTMLElement;
	protected addButton: HTMLButtonElement;
	protected price: HTMLElement;
	protected productId: string;
	protected productInCart = false;

	constructor(template: HTMLTemplateElement, events: IEvents) {
		const element = cloneTemplate(template);
		super(element);

		this.events = events;
		this.element = element;

		this.container = this.element as HTMLButtonElement;
		this.category = ensureElement<HTMLElement>('.card__category', this.element);

		this.description = ensureElement<HTMLElement>('.card__text', this.element);
		this.title = ensureElement<HTMLElement>('.card__title', this.element);
		this.image = ensureElement<HTMLImageElement>('.card__image', this.element);
		this.price = ensureElement<HTMLElement>('.card__price', this.element);
		this.addButton = ensureElement<HTMLButtonElement>(
			'.card__button',
			this.element
		);
	}

	setData(data: IProduct, productInCart: boolean) {
		this.productId = data.id;
		this.productInCart = productInCart;
		this.image.src = `${CDN_URL}${data.image}`;
		this.image.alt = data.title;
		this.setText(this.title, data.title);
		this.setText(this.category, data.category);
		this.setText(
			this.price,
			data.price ? `${data.price} синапсов` : `Бесценно`
		);
		this.setText(this.addButton, productInCart ? 'Убрать' : 'В корзину');
		if (data.price === null) {
			this.setDisabled(this.addButton, true);
			this.setText(this.addButton, 'Недоступно');
		} else {
			this.setDisabled(this.addButton, false);
			this.setText(this.addButton, productInCart ? 'Убрать' : 'В корзину');
		}

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

	setAddHandler(product: IProduct): void {
		this.addButton.addEventListener('click', () => {
			if (this.productInCart) {
				this.events.emit('product:remove', { id: product.id });
				this.setText(this.addButton, 'В корзину');
				this.productInCart = false;
			} else {
				this.events.emit('product:add', product);
				this.setText(this.addButton, 'Убрать');
				this.productInCart = true;
			}
		});
	}

	get id() {
		return this.productId;
	}
}
