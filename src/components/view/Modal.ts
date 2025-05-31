import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export class Modal<T> extends Component<T> {
	protected modal: HTMLElement;
	protected events: IEvents;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);
		this.events = events;

		const modalClose = ensureElement<HTMLElement>(
			'.modal__close',
			this.container
		);

		modalClose.addEventListener('click', this.close.bind(this));

		this.container.addEventListener('mousedown', (evt) => {
			if (evt.target === evt.currentTarget) {
				this.close();
			}
		});
		this.handleEscUp = this.handleEscUp.bind(this);
	}

	open() {
		this.toggleClass(this.container, 'modal_active', true);
		document.addEventListener('keyup', this.handleEscUp);
	}

	close() {
		this.toggleClass(this.container, 'modal_active', false);
		document.removeEventListener('keyup', this.handleEscUp);
	}

	handleEscUp(evt: KeyboardEvent) {
		if (evt.key === 'Escape') {
			this.close();
		}
	}

	setContent(content: HTMLElement): void {
		const contentContainer = ensureElement<HTMLElement>(
			'.modal__content',
			this.container
		);
		contentContainer.replaceChildren(content);
		this.open();
	}
}
