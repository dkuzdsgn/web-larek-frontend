import { ICartData } from '../../types';
import { cloneTemplate } from '../../utils/utils';
import { IEvents } from '../base/Events';
import { CartProductRowView } from './CartProductRowView';
const productRowTemplate: HTMLTemplateElement = document.querySelector(
	'#card-basket'
) as HTMLTemplateElement;

export class CartView {
	protected element: HTMLElement;
	protected events: IEvents;

	protected list: HTMLElement;
	protected submitButton: HTMLButtonElement;
	protected total: HTMLElement;

	constructor(template: HTMLTemplateElement, events: IEvents) {
		this.events = events;
		this.element = cloneTemplate(template);
		this.list = this.element.querySelector('.basket__list');
		this.submitButton = this.element.querySelector('.basket__button');
		this.total = this.element.querySelector('.basket__price');
	}

	setData(data: ICartData) {
		if (data.items.length === 0) {
			this.total.style.display = 'none';
			this.setDisabled(this.submitButton, true);
		} else {
			this.total.style.display = 'block';
			this.total.textContent = data.total
				? `${data.total} синапсов`
				: `Бесценно`;
			this.setDisabled(this.submitButton, false);
		}
		const items = data.items.map((item) => {
			const row = new CartProductRowView(productRowTemplate, this.events);
			row.setData(item);
			row.setRemoveHandler(item);
			return row.render();
		});

		this.list.replaceChildren(...items);
	}

	setDisabled(element: HTMLButtonElement, state: boolean): void {
		element.disabled = state;
	}

	setSubmitHandler(): void {
		this.submitButton.addEventListener('click', () => {
			this.events.emit('cart:submit');
		});
	}

	render() {
		return this.element;
	}
}
