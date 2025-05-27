import { TContactInfo } from '../../types';
import { cloneTemplate } from '../../utils/utils';
import { IEvents } from '../base/Events';
import { Form } from './Form';

export class FormContacts extends Form<TContactInfo> {
	protected events: IEvents;
	protected element: HTMLFormElement;

	protected emailInput: HTMLInputElement;
	protected phoneInput: HTMLInputElement;
	protected submitButton: HTMLButtonElement;
	protected errorText: HTMLElement;

	constructor(template: HTMLTemplateElement, events: IEvents) {
		const form = cloneTemplate<HTMLFormElement>(template);
		super(form, events);
		this.element = form;
		this.events = events;

		this.emailInput = form.querySelector('input[name="email"]');
		this.phoneInput = form.querySelector('input[name="phone"]');
		this.submitButton = form.querySelector('button[type="submit"]');
		this.errorText = form.querySelector('.form__errors')!;
	}

	set email(value: string) {
		(this.container.elements.namedItem('email') as HTMLInputElement).value =
			value;
	}

	set phone(value: string) {
		(this.container.elements.namedItem('phone') as HTMLInputElement).value =
			value;
	}

	getData(): TContactInfo {
		return {
			email: this.emailInput.value.trim(),
			phone: this.phoneInput.value.trim(),
		};
	}

	setDisabled(element: HTMLButtonElement, state: boolean): void {
		element.disabled = state;
	}

	setChangeHandler(): void {
		const handler: () => void = () => {
			const isEmailFilled = this.emailInput.value.trim() !== '';
			const isPhoneFilled = this.phoneInput.value.trim() !== '';

			this.setDisabled(this.submitButton, !(isEmailFilled && isPhoneFilled));
		};

		this.emailInput.addEventListener('input', handler);
		this.phoneInput.addEventListener('input', handler);
	}

	setSubmitHandler(): void {
		this.submitButton.addEventListener('click', () => {
			this.events.emit('order-contact:submit');
		});
	}

	render() {
		return this.container;
	}
}
