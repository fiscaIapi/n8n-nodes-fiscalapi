import type { INodeProperties } from 'n8n-workflow';
import { forceFreshField } from '../shared/descriptions';

const resource = ['company'];

export const companyDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource } },
		options: [
			{
				name: 'Get',
				value: 'get',
				action: 'Get a company by CNPJ',
				description: 'Get public registration data of a CNPJ from Receita Federal',
				routing: {
					request: { method: 'GET', url: '/api/consultar-cnpj' },
				},
			},
		],
		default: 'get',
	},
	{
		displayName: 'CNPJ',
		name: 'cnpj',
		type: 'string',
		default: '',
		required: true,
		placeholder: 'e.g. 12.345.678/0001-95',
		description: 'Company tax ID. Punctuation is accepted.',
		displayOptions: { show: { resource, operation: ['get'] } },
		routing: {
			send: { type: 'query', property: 'cnpj' },
		},
	},
	forceFreshField(
		{ resource, operation: ['get'] },
		'Whether to skip the cache and fetch the current data. Slower and consumes more credits.',
	),
];
