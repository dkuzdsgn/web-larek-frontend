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
import { ensureElement } from './utils/utils';
import { Page } from './components/view/Page';

const events: IEvents = new EventEmitter();
const baseApi: IApiClient = new Api(API_URL, settings);
const api: WebLarekApi = new WebLarekApi(baseApi);

const modalContainer = ensureElement<HTMLElement>('#modal-container');
const gallery = ensureElement<HTMLElement>('.gallery');

const productCardTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const productPreviewTemplate =
	ensureElement<HTMLTemplateElement>('#card-preview');
const cartViewTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderFormTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactFormTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successFormTemplate = ensureElement<HTMLTemplateElement>('#success');
const productRowTemplate = ensureElement<HTMLTemplateElement>('#card-basket');

const page = new Page(document.body, events, () => cartModel.getCart());
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
	const cartOpen = new CartView(cartViewTemplate, events, productRowTemplate);
	cartOpen.setData(cart);
	cartOpen.setSubmitHandler();

	const cartElement = cartOpen.render();
	modal.setContent(cartElement);
});

events.on('product:add', (product: IProduct) => {
	cartModel.addProduct(product);
});

events.on('product:remove', (data: { id: string }) => {
	cartModel.removeProduct(data.id);
});

events.on('cart:changed', (items: TCartItem[]) => {
	page.counter = items.length;
	if (modalContainer.querySelector('.basket')) {
		events.emit('cart:open', cartModel.getCart());
	}
});

events.on('cart:submit', () => {
	const orderElement = orderForm.render();
	modal.setContent(orderElement);
});

events.on('order-delivery:submit', () => {
	const contactElement = contactForm.render();
	modal.setContent(contactElement);
});

events.on('order-contact:submit', () => {
	const orderData: IOrder = {
		...orderForm.getData(),
		...contactForm.getData(),
		items: cartModel.getItems().map((item) => item.id),
		total: cartModel.getCart().total,
	};

	page.locked = true;

	api
		.sendOrder(orderData)
		.then((result) => {
			cartModel.clear();
			orderForm.reset();
			contactForm.reset();
			successForm.setData(result);
			const successElement = successForm.render();
			modal.setContent(successElement);
		})
		.catch((error) => {
			console.error('Ошибка при отправке заказа:', error);
		})
		.finally(() => {
			page.locked = false;
		});
});

events.on('modal:close', () => modal.close());
