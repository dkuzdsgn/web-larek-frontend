import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export class Modal<T> extends Component<T> {
	protected modal: HTMLElement;
	protected events: IEvents;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);
		this.events = events;

		const modalClose = this.container.querySelector('.modal__close');

		modalClose.addEventListener('click', this.close.bind(this));

		this.container.addEventListener('mousedown', (evt) => {
			if (evt.target === evt.currentTarget) {
				this.close();
			}
		});
		this.handleEscUp = this.handleEscUp.bind(this);
	}

	open() {
		this.container.classList.add('modal_active');
		document.addEventListener('keyup', this.handleEscUp);
	}

	close() {
		this.container.classList.remove('modal_active');
		document.removeEventListener('keyup', this.handleEscUp);
	}

	handleEscUp(evt: KeyboardEvent) {
		if (evt.key === 'Escape') {
			this.close();
		}
	}

	setContent(content: HTMLElement): void {
		this.container.querySelector('.modal__content')?.replaceChildren(content);
		this.open();
	}
}
