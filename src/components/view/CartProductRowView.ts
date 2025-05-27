import { TCartItem } from '../../types';
import { cloneTemplate } from '../../utils/utils';
import { IEvents } from '../base/Events';

export class CartProductRowView {
	protected element: HTMLElement;
	protected events: IEvents;
	protected productId: string;

	protected index: HTMLElement;
	protected title: HTMLElement;
	protected price: HTMLElement;
	protected removeButton: HTMLButtonElement;

	constructor(template: HTMLTemplateElement, events: IEvents) {
		this.events = events;
		this.element = cloneTemplate(template);

		this.index = this.element.querySelector('.basket__item-index');
		this.title = this.element.querySelector('.card__title');
		this.price = this.element.querySelector('.card__price');
		this.removeButton = this.element.querySelector('.basket__item-delete');
	}

	setData(data: TCartItem): void {
		this.productId = data.id;
		this.index.textContent = `${data.order}`;
		this.title.textContent = data.title;
		this.price.textContent = data.price ? `${data.price} синапсов` : `Бесценно`;
	}
	setRemoveHandler(data: TCartItem): void {
		this.removeButton.addEventListener('click', () => {
			this.events.emit('product:remove', { id: data.id });
		});
	}

	render() {
		return this.element;
	}
}
