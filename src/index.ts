import './scss/styles.scss';

import { WebLarekApi } from './components/services/WebLarekApi';
import { IApiClient, ICartData, IOrder, IProduct, TCartItem } from './types';
import { API_URL, settings } from './utils/constants';
import { Api } from './components/base/Api';
import { EventEmitter, IEvents } from './components/base/Events';
import { ProductModel } from './components/model/ProductModel';
import { CartModel } from './components/model/CartModel';
import { ProductCardView } from './components/view/ProductCardView';
import { ProductCatalogView } from './components/view/ProductCatalogView';
import { ProductPreviewView } from './components/view/ProductPreviewView';
import { Modal } from './components/view/Modal';
import { CartView } from './components/view/CartView';
import { FormOrder } from './components/view/FormOrder';
import { FormContacts } from './components/view/FormContacts';
import { FormSuccess } from './components/view/FormSuccess';

const events: IEvents = new EventEmitter();
const baseApi: IApiClient = new Api(API_URL, settings);
const api: WebLarekApi = new WebLarekApi(baseApi);

const modalContainer = document.querySelector(
	'#modal-container'
) as HTMLElement;

const gallery = document.querySelector('.gallery') as HTMLElement;

const cartButton = document.querySelector(
	'.header__basket'
) as HTMLButtonElement;

const productCardTemplate: HTMLTemplateElement = document.querySelector(
	'#card-catalog'
) as HTMLTemplateElement;

const productPreviewTemplate: HTMLTemplateElement = document.querySelector(
	'#card-preview'
) as HTMLTemplateElement;

const cartViewTemplate: HTMLTemplateElement = document.querySelector(
	'#basket'
) as HTMLTemplateElement;

const orderFormTemplate: HTMLTemplateElement = document.querySelector(
	'#order'
) as HTMLTemplateElement;
const contactFormTemplate: HTMLTemplateElement = document.querySelector(
	'#contacts'
) as HTMLTemplateElement;
const successFormTemplate: HTMLTemplateElement = document.querySelector(
	'#success'
) as HTMLTemplateElement;

const productsModel = new ProductModel(events);
const cartModel: CartModel = new CartModel(events);
const modal: Modal<ICartData> = new Modal(modalContainer, events);
const productCatalogView = new ProductCatalogView(gallery);
const orderForm = new FormOrder(orderFormTemplate, events);
const contactForm = new FormContacts(contactFormTemplate, events);
const successForm = new FormSuccess(successFormTemplate, events);

api
	.getProductList()
	.then((products) => {
		productsModel.products = products;
		const items = products.map((product) => {
			const card = new ProductCardView(productCardTemplate, events);
			card.setData(product);
			card.setClickHandler(product);
			return card.render();
		});
		productCatalogView.catalog = items;
	})
	.catch(console.error);

events.on('product:select', (product: IProduct) => {
	const productInCart = cartModel.hasProduct(product.id);
	const productPreview: ProductPreviewView = new ProductPreviewView(
		productPreviewTemplate,
		events
	);
	productPreview.setData(product, productInCart);
	const productElement = productPreview.render();
	productPreview.setAddHandler(product);

	modal.setContent(productElement);
});

events.on('cart:open', (cart: ICartData) => {
	const cartOpen = new CartView(cartViewTemplate, events);
	cartOpen.setData(cart);
	cartOpen.setSubmitHandler();

	const cartElement = cartOpen.render();
	modal.setContent(cartElement);
});

cartButton.addEventListener('click', () => {
	events.emit('cart:open', cartModel.getCart());
});

events.on('product:add', (product: IProduct) => {
	cartModel.addProduct(product);
});

function updateCartCounter(count: number): void {
	const counter = document.querySelector('.header__basket-counter');
	if (counter) {
		counter.textContent = String(count);
	}
}

events.on('product:remove', (data: { id: string }) => {
	cartModel.removeProduct(data.id);
});

events.on('cart:changed', (items: TCartItem[]) => {
	updateCartCounter(items.length);
	if (modalContainer.querySelector('.basket')) {
		events.emit('cart:open', cartModel.getCart());
	}
});

events.on('cart:submit', () => {
	const orderElement = orderForm.render();
	modal.setContent(orderElement);
	orderForm.setSubmitHandler();
});

orderForm.setChangeHandler();

events.on('order-delivery:submit', () => {
	const contactElement = contactForm.render();
	modal.setContent(contactElement);
	contactForm.setChangeHandler();
	contactForm.setSubmitHandler();
});

events.on('order-contact:submit', () => {
	const orderData: IOrder = {
		...orderForm.getData(),
		...contactForm.getData(),
		items: cartModel.getItems().map((item) => item.id),
		total: cartModel.getCart().total,
	};

	api
		.sendOrder(orderData)
		.then((result) => {
			cartModel.clear();
			successForm.setData(result);
			const successElement = successForm.render();
			modal.setContent(successElement);
		})
		.catch((error) => {
			console.error('Ошибка при отправке заказа:', error);
		});
});

events.on('modal:close', () => modal.close());
