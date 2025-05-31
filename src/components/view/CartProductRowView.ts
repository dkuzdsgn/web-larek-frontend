import { TCartItem } from '../../types';
import { cloneTemplate, ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export class CartProductRowView extends Component<TCartItem> {
	protected element: HTMLElement;
	protected events: IEvents;
	protected productId: string;

	protected index: HTMLElement;
	protected title: HTMLElement;
	protected price: HTMLElement;
	protected removeButton: HTMLButtonElement;

	constructor(template: HTMLTemplateElement, events: IEvents) {
		const element = cloneTemplate(template);
		super(element);

		this.events = events;
		this.element = element;

		this.index = ensureElement<HTMLElement>(
			'.basket__item-index',
			this.element
		);
		this.title = ensureElement<HTMLElement>('.card__title', this.element);
		this.price = ensureElement<HTMLElement>('.card__price', this.element);
		this.removeButton = ensureElement<HTMLButtonElement>(
			'.basket__item-delete',
			this.element
		);
	}

	setData(data: TCartItem): void {
		this.productId = data.id;
		this.setText(this.index, `${data.order}`);
		this.setText(this.title, data.title);
		this.setText(
			this.price,
			data.price ? `${data.price} синапсов` : `Бесценно`
		);
	}
	setRemoveHandler(data: TCartItem): void {
		this.removeButton.addEventListener('click', () => {
			this.events.emit('product:remove', { id: data.id });
		});
	}
}
