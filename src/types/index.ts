// Типов данных

export type Product = {
	id: number;
	category: string;
	description: string;
	name: string;
	price: number;
	currency: string;
	image: string;
};

export type ProductList = Product[];

export type CartItem = {
	id: number;
	order: number;
	name: string;
	price: number;
	currency: string;
};

export type PaymentMethod = 'online' | 'on-receive';

export type OrderInfo = {
	paymentMethod: PaymentMethod;
	address: string;
	email: string;
	phone: string;
};

export type OrderResult = {
	price: number;
	currency: string;
};

export type ButtonOptions = {
	text?: string;
	icon?: string;
	onClick: () => void;
	type?: 'primary' | 'secondary' | 'icon';
	disabled?: boolean;
};

export type FormItemOptions = {
	label: string;
	name: string;
	type: 'text' | 'email' | 'tel';
	error?: string;
};

// Интерфейс API-клиента

export interface IApiClient {
	getProductList(): Promise<Product[]>;
	sendOrder(data: OrderInfo): Promise<OrderResult>;
}

// Интерфейсы модели данных

export interface ICartModel {
	addProduct(product: Product): void;
	removeProduct(id: number): void;
	getItems(): CartItem[];
	clear(): void;
}

export interface IOrderModel {
	setOrderInfo(data: OrderInfo): void;
	getOrderInfo(): OrderInfo;
	clear(): void;
}

export interface IProductModel {
	setProductList(products: ProductList): void;
	getProductList(): ProductList;
	getProductById(id: number): Product | undefined;
}

// Интерфейсы отображений

export interface ICartView {
	renderCart(items: CartItem[]): void;
	onRemove(handler: (id: number) => void): void;
}

export interface ICheckoutView {
	renderStep1(): void;
	renderStep2(): void;
	getFormData(): OrderInfo;
	onSubmit(handler: (data: OrderInfo) => void): void;
}

export interface IModalView {
	open(): void;
	close(): void;
	renderContent(content: Element): void;
	onClose(handler: () => void): void;
}

export interface IProductDetailView {
	render(product: Product): void;
	onAddToCart(handler: (productId: number) => void): void;
}

export interface IProductsView {
	renderProductList(products: ProductList): void;
	onCardClick(handler: (id: number) => void): void;
}

// Интерфейсы базовых классов

export interface ICartPresenter {
  init(): void;
  handleRemove(id: number): void;
}

export interface ICheckoutPresenter {
  init(): void;
  handleSubmit(data: OrderInfo): void;
}

export interface IProductPresenter {
  init(): void;
  handleCardClick(id: number): void;
  handleAddToCart(id: number): void;
}