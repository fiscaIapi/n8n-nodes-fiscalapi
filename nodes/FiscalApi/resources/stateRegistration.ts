import type { INodeProperties } from 'n8n-workflow';
import { documentFields, secondaryActivitiesField, stateField } from '../shared/descriptions';
import { sendDocument } from '../shared/transport';

const resource = ['stateRegistration'];

export const stateRegistrationDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource } },
		options: [
			{
				name: 'Get by State',
				value: 'getByState',
				action: 'Get state registrations in one state',
				description: 'Get the state registrations (IE) of a CPF, CNPJ or IE in one state',
				routing: {
					request: { method: 'GET', url: '/api/consultar' },
					send: { preSend: [sendDocument] },
				},
			},
			{
				name: 'Get in All States',
				value: 'getAllStates',
				action: 'Get state registrations in all states',
				description: 'Search the state registrations (IE) of a CPF, CNPJ or IE in every state',
				routing: {
					request: { method: 'GET', url: '/api/consultar-ie-todos' },
					send: { preSend: [sendDocument] },
				},
			},
		],
		default: 'getByState',
	},
	stateField({ resource, operation: ['getByState'] }),
	...documentFields({ resource, operation: ['getByState', 'getAllStates'] }, true),
	secondaryActivitiesField({ resource, operation: ['getByState', 'getAllStates'] }),
];
