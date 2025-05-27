import {
	IUserInfo,
	TDeliveryInfo,
	TContactInfo,
	TOrderStep,
} from '../../types';
import { IEvents } from '../base/Events';

export class OrderModel {
	protected _orderInfo: Partial<IUserInfo> = {};
	protected events: IEvents;

	constructor(events: IEvents) {
		this.events = events;
	}
	setDeliveryInfo(data: TDeliveryInfo): void {
		this._orderInfo = { ...this._orderInfo, ...data };
		this.events.emit('order:changed', this._orderInfo);
	}

	setContactInfo(data: TContactInfo): void {
		this._orderInfo = { ...this._orderInfo, ...data };
		this.events.emit('order:changed', this._orderInfo);
	}

	getOrderInfo() {
		return this._orderInfo as IUserInfo;
	}

	checkValidation(): Record<TOrderStep, boolean> {
		const keys = ['address', 'payment', 'email', 'phone'] as const;

		const isFilled = (key: string) =>
			Boolean(this._orderInfo[key as keyof IUserInfo]);

		const allValid = keys.every(isFilled);

		return {
			deliveryInfo: Boolean(this._orderInfo.address && this._orderInfo.payment),
			contactInfo: Boolean(this._orderInfo.email && this._orderInfo.phone),
			finalCheck: allValid,
		};
	}

	clear(): void {
		this._orderInfo = {};
		this.events.emit('order:changed', this._orderInfo);
	}
}
