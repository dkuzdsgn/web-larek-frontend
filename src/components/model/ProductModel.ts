import { IProduct } from '../../types';
import { IEvents } from '../base/Events';

export class ProductModel {
	protected _products: IProduct[];
	protected events: IEvents;

	constructor(events: IEvents) {
		this.events = events;
	}

	set products(products: IProduct[]) {
		this._products = products;
		this.events.emit('products:changed');
	}

	getProductList(): IProduct[] {
		return this._products;
	}

	getProductById(id: string) {
		return this._products.find((product) => product.id === id);
	}
}
