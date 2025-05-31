import { ICartData } from '../../types';
import { cloneTemplate, ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { CartProductRowView } from './CartProductRowView';

export class CartView extends Component<ICartData> {
	protected element: HTMLElement;
	protected events: IEvents;
	protected productRowTemplate: HTMLTemplateElement;

	protected list: HTMLElement;
	protected submitButton: HTMLButtonElement;
	protected total: HTMLElement;

	constructor(
		template: HTMLTemplateElement,
		events: IEvents,
		productRowTemplate: HTMLTemplateElement
	) {
		const element = cloneTemplate(template);
		super(element);

		this.events = events;
		this.element = element;
		this.productRowTemplate = productRowTemplate;
		this.list = ensureElement<HTMLElement>('.basket__list', this.element);
		this.submitButton = ensureElement<HTMLButtonElement>(
			'.basket__button',
			this.element
		);
		this.total = ensureElement<HTMLElement>('.basket__price', this.element);
	}

	setData(data: ICartData) {
		if (data.items.length === 0) {
			this.total.style.display = 'none';
			this.setDisabled(this.submitButton, true);
		} else {
			this.total.style.display = 'block';
			this.setText(
				this.total,
				data.total ? `${data.total} синапсов` : `Бесценно`
			);
			this.setDisabled(this.submitButton, false);
		}
		const items = data.items.map((item) => {
			const row = new CartProductRowView(this.productRowTemplate, this.events);
			row.setData(item);
			row.setRemoveHandler(item);
			return row.render();
		});

		this.list.replaceChildren(...items);
	}

	setSubmitHandler(): void {
		this.submitButton.addEventListener('click', () => {
			this.events.emit('cart:submit');
		});
	}
}
