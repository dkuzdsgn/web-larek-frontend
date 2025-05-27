import { ApiListResponse } from '../base/Api';
import { IApiClient, IProduct, IOrder, IOrderResult } from '../../types';

export class WebLarekApi {
	private _baseApi: IApiClient;

	constructor(baseApi: IApiClient) {
		this._baseApi = baseApi;
	}

	getProductList(): Promise<IProduct[]> {
		return this._baseApi
			.get<ApiListResponse<IProduct>>('/product')
			.then((response) => response.items);
	}

	sendOrder(data: IOrder): Promise<IOrderResult> {
		return this._baseApi.post<IOrderResult>('/order', data);
	}
}
