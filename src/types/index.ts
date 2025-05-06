export interface IProduct {
	id: number;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}

export interface IUserInfo {
	paymentMethod: PaymentMethod;
	address: string;
	email: string;
	phone: string;
}

export interface IOrderResult {
	id: string;
	total: number;
}

export interface ICartData {
  items: TCartItem[];
  total: number;
}

export interface IOrderData {
  items: TCartItem[];
  deliveryInfo: TDeliveryInfo;
  contactInfo: TContactInfo;
}

export interface IProductError {
  error: string;
}

export interface IOrderError {
	error: TOrderError;
}

export interface IProductModel {
  setProductList(products: IProduct[]): void;
  getProductList(): IProduct[];
  getProductById(id: number): IProduct | undefined;
}

export interface ICartModel {
  addProduct(product: IProduct): void;
  removeProduct(id: number): void;
  getItems(): TCartItem[];
	getTotalCount(): number;
  hasProduct(id: number): boolean;
  clear(): void;
}

export interface IOrderModel {
  setDeliveryInfo(data: TDeliveryInfo): void;
  setContactInfo(data: TContactInfo): void;
  getOrderInfo(): IUserInfo;
	checkValidation(): Record<TOrderStep, boolean>;
  clear(): void;
}

export interface IComponent<T> {
  render(data: Partial<T>): HTMLElement;
}

export interface IEvents {
  on<T extends object>(event: string, callback: (data: T) => void): void;
  emit<T extends object>(event: string, data?: T): void;
  trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void;
} 

export interface IApiClient {
	getProductList(): Promise<IProduct[]>;
	sendOrder(data: IUserInfo): Promise<IOrderResult>;
}

// Типы данных

export type TProductCard = Pick<IProduct, 'image' | 'title' | 'category' | 'price'>
 
export type TCartItem = Pick<IProduct, 'id' | 'title' | 'price'> & {
  order: number;
};

export type PaymentMethod = 'online' | 'on-receive';

export type TDeliveryInfo = Pick<IUserInfo, 'paymentMethod' | 'address' >

export type TContactInfo = Pick<IUserInfo, 'email' | 'phone' >

export type TOrderStep = 'deliveryInfo' | 'contactInfo' | 'finalCheck';

export type TOrderError = "WrongTotal" | "WrongAddress" | "ProductNotFound";

