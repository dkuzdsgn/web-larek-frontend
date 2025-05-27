import { IOrderResult } from '../../types';
import { cloneTemplate } from '../../utils/utils';
import { IEvents } from '../base/Events';

export class FormSuccess {
	protected element: HTMLElement;
	protected events: IEvents;

	protected container: HTMLElement;
	protected title: HTMLElement;
	protected description: HTMLElement;
	protected closeButton: HTMLButtonElement;

	constructor(template: HTMLTemplateElement, events: IEvents) {
		this.events = events;
		this.element = cloneTemplate(template);
		this.container = this.element as HTMLElement;
		this.title = this.element.querySelector('.order-success__title');
		this.description = this.element.querySelector(
			'.order-success__description'
		);
		this.closeButton = this.element.querySelector('.order-success__close');

		this.closeButton.addEventListener('click', () => {
			this.events.emit('modal:close');
		});
	}
	setData(data: IOrderResult) {
		this.description.textContent = `Списано ${data.total} синапсов`;
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
