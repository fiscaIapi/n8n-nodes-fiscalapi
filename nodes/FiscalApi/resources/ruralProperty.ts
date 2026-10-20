import type { INodeProperties } from 'n8n-workflow';
import { documentFields, forceFreshField } from '../shared/descriptions';
import { sendDocument } from '../shared/transport';

const resource = ['ruralProperty'];

export const ruralPropertyDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource } },
		options: [
			{
				name: 'Get CNIR Properties',
				value: 'getCnir',
				action: 'Get rural properties from CNIR',
				description: 'Get the rural properties registered in CNIR/CAFIR for a CPF or CNPJ',
				routing: {
					request: { method: 'GET', url: '/api/consultar-cnir' },
					send: { preSend: [sendDocument] },
				},
			},
			{
				name: 'Get SIGEF Parcel',
				value: 'getSigefParcel',
				action: 'Get a SIGEF parcel by UUID',
				description: 'Get one certified SIGEF parcel with polygon, vertices and neighbors',
				routing: {
					request: { method: 'GET', url: '/api/consultar-sigef-parcela' },
				},
			},
			{
				name: 'Get SIGEF Parcels',
				value: 'getSigefParcels',
				action: 'Get SIGEF parcels by owner',
				description: 'Get the certified SIGEF/INCRA parcels held by a CPF or CNPJ',
				routing: {
					request: { method: 'GET', url: '/api/consultar-sigef' },
					send: { preSend: [sendDocument] },
				},
			},
		],
		default: 'getSigefParcels',
	},
	...documentFields({ resource, operation: ['getCnir', 'getSigefParcels'] }),
	{
		displayName: 'Parcel UUID',
		name: 'uuid',
		type: 'string',
		default: '',
		required: true,
		placeholder: 'e.g. 0f1e2d3c-4b5a-6978-8a9b-0c1d2e3f4a5b',
		description: 'UUID of the SIGEF parcel',
		displayOptions: { show: { resource, operation: ['getSigefParcel'] } },
		routing: {
			send: { type: 'query', property: 'uuid' },
		},
	},
	forceFreshField(
		{ resource, operation: ['getSigefParcel'] },
		'Whether to skip the 24-hour cache and read the parcel again',
	),
];
