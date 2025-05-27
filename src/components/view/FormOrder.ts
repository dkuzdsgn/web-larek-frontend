import { TDeliveryInfo, PaymentMethod } from '../../types';
import { cloneTemplate } from '../../utils/utils';
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

		this.cardButton = form.querySelector('button[name="card"]')!;
		this.cashButton = form.querySelector('button[name="cash"]')!;
		this.addressInput = form.elements.namedItem('address') as HTMLInputElement;
		this.submitButton = form.querySelector('.order__button')!;
		this.errorText = form.querySelector('.form__errors')!;

		this.cardButton.addEventListener('click', () => {
			this.selectedPayment = 'online';
			this.updatePaymentSelection();
			this.changeHandler?.();
		});

		this.cashButton.addEventListener('click', () => {
			this.selectedPayment = 'on-receive';
			this.updatePaymentSelection();
			this.changeHandler?.();
		});

		this.addressInput.addEventListener('input', () => {
			this.changeHandler?.();
		});
	}

	private updatePaymentSelection() {
		this.cardButton.classList.toggle(
			'button_alt-active',
			this.selectedPayment === 'online'
		);
		this.cashButton.classList.toggle(
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

	setDisabled(element: HTMLButtonElement, state: boolean): void {
		element.disabled = state;
	}

	setChangeHandler(): void {
		this.addressInput.addEventListener('input', () => {
			this.validateForm();
		});

		[this.cardButton, this.cashButton].forEach((btn) => {
			btn.addEventListener('click', () => {
				this.updatePaymentSelection();
				this.validateForm();
			});
		});
	}

	public validateForm(): boolean {
		const isValidInputs = super.validateForm();
		const isPaymentValid = this.selectedPayment !== null;

		if (!isValidInputs) {
			this._submit.disabled = true;
			return false;
		}

		if (!isPaymentValid) {
			this._errors.textContent = 'Выберите способ оплаты';
			this._submit.disabled = true;
			return false;
		}

		this._errors.textContent = '';
		this._submit.disabled = false;
		return true;
	}

	setSubmitHandler(): void {
		this.submitButton.addEventListener('click', () => {
			if (this.validateForm()) {
				this.events.emit('order-delivery:submit');
			}
		});
	}

	render(): HTMLFormElement {
		return this.element;
	}
}
