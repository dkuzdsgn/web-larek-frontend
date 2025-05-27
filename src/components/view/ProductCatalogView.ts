interface IProductsContainer {
	catalog: HTMLElement[];
}

export class ProductCatalogView {
	protected _catalog: HTMLElement;
	protected container: HTMLElement;

	constructor(container: HTMLElement) {
		this.container = container;
	}

	set catalog(items: HTMLElement[]) {
		this.container.replaceChildren(...items);
	}

	render(data: Partial<IProductsContainer>) {
		Object.assign(this, data);
		return this.container;
	}
}
