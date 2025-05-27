import { IProduct } from '../../types';
import { CDN_URL } from '../../utils/constants';
import { cloneTemplate } from '../../utils/utils';
import { IEvents } from '../base/Events';

export class ProductPreviewView {
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
		this.events = events;
		this.element = cloneTemplate(template);
		this.container = this.element as HTMLButtonElement;
		this.category = this.element.querySelector('.card__category');
		this.description = this.element.querySelector('.card__text');
		this.title = this.element.querySelector('.card__title');
		this.image = this.element.querySelector('.card__image');
		this.price = this.element.querySelector('.card__price');
		this.addButton = this.element.querySelector('.card__button');
	}

	setData(data: IProduct, productInCart: boolean) {
		this.productId = data.id;
		this.productInCart = productInCart;
		this.image.src = `${CDN_URL}${data.image}`;
		this.image.alt = data.title;
		this.title.textContent = data.title;
		this.category.textContent = data.category;
		this.price.textContent = data.price ? `${data.price} синапсов` : `Бесценно`;
		this.addButton.textContent = productInCart ? 'Убрать' : 'В корзину';
		if (data.price === null) {
			this.addButton.disabled = true;
			this.addButton.textContent = 'Недоступно';
		} else {
			this.addButton.disabled = false;
			this.addButton.textContent = this.productInCart ? 'Убрать' : 'В корзину';
		}
	}

	setAddHandler(product: IProduct): void {
		this.addButton.addEventListener('click', () => {
			if (this.productInCart) {
				this.events.emit('product:remove', { id: product.id });
				this.addButton.textContent = 'В корзину';
				this.productInCart = false;
			} else {
				this.events.emit('product:add', product);
				this.addButton.textContent = 'Убрать';
				this.productInCart = true;
			}
		});
	}

	get id() {
		return this.productId;
	}

	render() {
		return this.element;
	}
}
