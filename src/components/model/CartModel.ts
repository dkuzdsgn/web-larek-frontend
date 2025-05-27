import { TCartItem, IProduct, ICartData } from '../../types';
import { IEvents } from '../base/Events';

export class CartModel {
	protected _items: TCartItem[] = [];
	protected events: IEvents;

	constructor(events: IEvents) {
		this.events = events;
	}

	addProduct(product: IProduct): void {
		const order = this._items.length + 1;
		if (!this.hasProduct(product.id)) {
			this._items.push({ ...product, order });
			this.events.emit('cart:changed', this._items);
		}
	}

	removeProduct(id: string): void {
		this._items = this._items.filter((item) => item.id !== id);
		this.events.emit('cart:changed', this._items);
	}

	getItems() {
		return this._items;
	}

	getTotalCount(): number {
		return this._items.length;
	}

	hasProduct(id: string): boolean {
		return this._items.some((item) => item.id === id);
	}

	clear() {
		this._items = [];
		this.events.emit('cart:changed', this._items);
	}

	getCart(): ICartData {
		return {
			items: this._items,
			total: this._items.reduce((sum, item) => sum + (item.price ?? 0), 0),
		};
	}
}
