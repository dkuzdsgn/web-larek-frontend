import { IOrderResult } from '../../types';
import { cloneTemplate, ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export class FormSuccess extends Component<IOrderResult> {
	protected element: HTMLElement;
	protected events: IEvents;

	protected container: HTMLElement;
	protected title: HTMLElement;
	protected description: HTMLElement;
	protected closeButton: HTMLButtonElement;

	constructor(template: HTMLTemplateElement, events: IEvents) {
		const element = cloneTemplate(template);
		super(element);

		this.element = element;
		this.events = events;
		this.container = this.element as HTMLElement;

		this.title = ensureElement<HTMLElement>(
			'.order-success__title',
			this.element
		);
		this.description = ensureElement<HTMLElement>(
			'.order-success__description',
			this.element
		);
		this.closeButton = ensureElement<HTMLButtonElement>(
			'.order-success__close',
			this.element
		);

		this.closeButton.addEventListener('click', () => {
			this.events.emit('modal:close');
		});
	}
	setData(data: IOrderResult) {
		this.setText(this.description, `Списано ${data.total} синапсов`);
	}

	setCloseHandler(): void {
		this.closeButton.addEventListener('click', () => {
			this.events.emit('modal:close');
		});
	}

	render() {
		return this.container;
	}
}
