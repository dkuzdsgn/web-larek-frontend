import { TDeliveryInfo, PaymentMethod } from '../../types';
import { cloneTemplate, ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';
import { Form } from './Form';

export class FormOrder extends Form<TDeliveryInfo> {
	protected events: IEvents;
	protected element: HTMLFormElement;

	protected cardButton: HTMLButtonElement;
	protected cashButton: HTMLButtonElement;
	protected addressInput: HTMLInputElement;
	protected submitButton: HTMLButtonElement;
	protected errorText: HTMLElement;

	private selectedPayment: PaymentMethod | null = null;
	private changeHandler: (() => void) | null = null;

	constructor(template: HTMLTemplateElement, events: IEvents) {
		const form = cloneTemplate<HTMLFormElement>(template);
		super(form, events);
		this.element = form;
		this.events = events;

		this.cardButton = ensureElement<HTMLButtonElement>(
			'button[name="card"]',
			form
		);
		this.cashButton = ensureElement<HTMLButtonElement>(
			'button[name="cash"]',
			form
		);
		this.addressInput = ensureElement<HTMLInputElement>(
			'input[name="address"]',
			form
		);
		this.submitButton = ensureElement<HTMLButtonElement>(
			'.order__button',
			form
		);
		this.errorText = ensureElement<HTMLElement>('.form__errors', form);

		this.setSubmitHandler();
		this.setChangeHandler();
	}

	private updatePaymentSelection() {
		this.toggleClass(
			this.cardButton,
			'button_alt-active',
			this.selectedPayment === 'online'
		);
		this.toggleClass(
			this.cashButton,
			'button_alt-active',
			this.selectedPayment === 'on-receive'
		);
	}

	setData(data: Partial<TDeliveryInfo>): void {
		if (data.address) {
			this.addressInput.value = data.address;
		}

		if (data.payment) {
			this.selectedPayment = data.payment;
			this.updatePaymentSelection();
		}
	}

	hasValidData(): boolean {
		return (
			this.addressInput.value.trim().length > 0 && this.selectedPayment !== null
		);
	}

	getData(): TDeliveryInfo {
		const address = this.addressInput.value.trim();
		const payment: PaymentMethod = this.selectedPayment;

		return {
			payment,
			address,
		};
	}

	setChangeHandler(): void {
		this.addressInput.addEventListener('input', () => {
			this.validateForm();
		});

		this.cardButton.addEventListener('click', () => {
			this.selectedPayment = 'online';
			this.updatePaymentSelection();
			this.validateForm();
		});

		this.cashButton.addEventListener('click', () => {
			this.selectedPayment = 'on-receive';
			this.updatePaymentSelection();
			this.validateForm();
		});
	}

	public validateForm(): boolean {
		const isValidInputs = super.validateForm();
		const isPaymentValid = this.selectedPayment !== null;

		if (!isValidInputs) {
			this.setDisabled(this._submit, true);
			return false;
		}

		if (!isPaymentValid) {
			this.setText(this._errors, 'Выберите способ оплаты');
			this.setDisabled(this._submit, true);
			return false;
		}
		this.setText(this._errors, '');
		this.setDisabled(this._submit, false);
		return true;
	}

	private setSubmitHandler(): void {
		this.submitButton.addEventListener('click', (e) => {
			e.preventDefault();
			if (this.validateForm()) {
				this.events.emit('order-delivery:submit');
			}
		});
	}

	reset(): void {
		this.addressInput.value = '';
		this.selectedPayment = null;
		this.updatePaymentSelection();
		this.setText(this.errorText, '');
		this.setDisabled(this.submitButton, true);
	}

	render(): HTMLFormElement {
		return this.element;
	}
}
