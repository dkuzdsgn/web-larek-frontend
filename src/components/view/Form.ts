import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

interface IFormState {
	valid: boolean;
	errors: string[];
}

export class Form<T> extends Component<IFormState> {
	protected _submit: HTMLButtonElement;
	protected _errors: HTMLElement;

	constructor(protected container: HTMLFormElement, protected events: IEvents) {
		super(container);

		this._submit = ensureElement<HTMLButtonElement>(
			'button[type=submit]',
			this.container
		);
		this._errors = ensureElement<HTMLElement>('.form__errors', this.container);

		this.container.addEventListener('input', () => {
			this.validateForm();
		});

		this.container.addEventListener('submit', (e: Event) => {
			e.preventDefault();
			this.events.emit(`${this.container.name}:submit`);
		});
	}

	protected validateForm(): boolean {
		const inputs = this.container.querySelectorAll<HTMLInputElement>('input');

		for (const input of inputs) {
			input.setCustomValidity('');

			if (input.validity.valueMissing && input.dataset.errorMessage) {
				input.setCustomValidity(input.dataset.errorMessage);
			} else if (
				input.validity.patternMismatch &&
				input.dataset.errorRulesMessage
			) {
				input.setCustomValidity(input.dataset.errorRulesMessage);
			} else if (input.validity.tooShort) {
				input.setCustomValidity(input.dataset.errorLengthMessage);
			}
			if (!input.validity.valid) {
				this.setText(this._errors, input.validationMessage);
				this.setDisabled(this._submit, true);
				return false;
			}
		}

		this.setText(this._errors, '');
		this.setDisabled(this._submit, false);

		return true;
	}

	set valid(value: boolean) {
		this.setDisabled(this._submit, !value);
	}

	set errors(value: string) {
		this.setText(this._errors, value);
	}

	render(state: Partial<T> & IFormState) {
		const { valid, errors, ...inputs } = state;
		super.render({ valid, errors });
		Object.assign(this, inputs);
		return this.container;
	}
}
