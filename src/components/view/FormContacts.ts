import { TContactInfo } from '../../types';
import { cloneTemplate, ensureElement } from '../../utils/utils';
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

		this.emailInput = ensureElement<HTMLInputElement>(
			'input[name="email"]',
			form
		);
		this.phoneInput = ensureElement<HTMLInputElement>(
			'input[name="phone"]',
			form
		);
		this.submitButton = ensureElement<HTMLButtonElement>(
			'button[type="submit"]',
			form
		);
		this.errorText = ensureElement<HTMLElement>('.form__errors', form);

		this.setChangeHandler();
		this.setSubmitHandler();
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

	setChangeHandler(): void {
		const handler: () => void = () => {
			const isEmailFilled = this.emailInput.value.trim() !== '';
			const isPhoneFilled = this.phoneInput.value.trim() !== '';

			this.setDisabled(this.submitButton, !(isEmailFilled && isPhoneFilled));
		};

		this.emailInput.addEventListener('input', handler);
		this.phoneInput.addEventListener('input', handler);
	}

	private setSubmitHandler(): void {
		this.submitButton.addEventListener('click', (e) => {
			e.preventDefault();
			if (this.validateForm()) {
				this.events.emit('order-contact:submit');
			}
		});
	}

	reset(): void {
		this.emailInput.value = '';
		this.phoneInput.value = '';
		this.setText(this.errorText, '');
		this.setDisabled(this.submitButton, true);
	}
	render() {
		return this.container;
	}
}
