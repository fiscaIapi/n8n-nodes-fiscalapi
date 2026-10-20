import type { INodeProperties } from 'n8n-workflow';
import { documentFields } from '../shared/descriptions';
import { sendDocument } from '../shared/transport';

const resource = ['producerProfile'];

export const producerProfileDescription: INodeProperties[] = [
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
				action: 'Get a rural producer profile',
				description:
					'Get a consolidated rural producer profile: state registrations, certificates and company data',
				routing: {
					request: { method: 'GET', url: '/api/perfil-produtor' },
					send: { preSend: [sendDocument] },
				},
			},
		],
		default: 'get',
	},
	...documentFields({ resource, operation: ['get'] }),
];
