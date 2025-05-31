import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import { ICartData } from '../../types';

interface IPage {
	counter: number;
	catalog: HTMLElement[];
	locked: boolean;
}

export class Page extends Component<IPage> {
	protected counterElement: HTMLElement;
	protected catalogElement: HTMLElement;
	protected wrapperElement: HTMLElement;
	protected basketButton: HTMLButtonElement;

	constructor(
		container: HTMLElement,
		protected events: IEvents,
		private getCart: () => ICartData
	) {
		super(container);

		this.counterElement = ensureElement<HTMLElement>(
			'.header__basket-counter',
			container
		);
		this.wrapperElement = ensureElement<HTMLElement>(
			'.page__wrapper',
			container
		);
		this.basketButton = ensureElement<HTMLButtonElement>(
			'.header__basket',
			container
		);

		this.basketButton.addEventListener('click', () => {
			this.events.emit('cart:open', this.getCart());
		});
	}

	set counter(value: number) {
		this.setText(this.counterElement, String(value));
	}

	set locked(value: boolean) {
		this.toggleClass(this.wrapperElement, 'page__wrapper_locked', value);
	}
}
