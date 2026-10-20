import type { INodeProperties } from 'n8n-workflow';
import { documentFields, stateField } from '../shared/descriptions';
import { sendDocument } from '../shared/transport';

const resource = ['certificate'];
const allOperations = ['getAllCertificates', 'getCndt', 'getFederalCnd', 'getFgtsCrf', 'getStateCnd', 'getStateCndAllStates'];

export const certificateDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource } },
		options: [
			{
				name: 'Get All Certificates',
				value: 'getAllCertificates',
				action: 'Get all certificates',
				description: 'Get state CNDs, CNDT, federal CND and FGTS CRF in one call',
				routing: {
					request: { method: 'GET', url: '/api/certidoes-todas' },
					send: { preSend: [sendDocument] },
				},
			},
			{
				name: 'Get CNDT (Labor Debts)',
				value: 'getCndt',
				action: 'Get a labor debt clearance certificate',
				description: 'Get the labor debt clearance certificate (CNDT)',
				routing: {
					request: { method: 'GET', url: '/api/consultar-cndt' },
					send: { preSend: [sendDocument] },
				},
			},
			{
				name: 'Get Federal CND',
				value: 'getFederalCnd',
				action: 'Get a federal tax clearance certificate',
				description: 'Get the federal tax clearance certificate (Receita Federal and PGFN)',
				routing: {
					request: { method: 'GET', url: '/api/consultar-cnd-federal' },
					send: { preSend: [sendDocument] },
				},
			},
			{
				name: 'Get FGTS CRF',
				value: 'getFgtsCrf',
				action: 'Get an FGTS regularity certificate',
				description: 'Get the FGTS regularity certificate (CRF)',
				routing: {
					request: { method: 'GET', url: '/api/consultar-crf-fgts' },
					send: { preSend: [sendDocument] },
				},
			},
			{
				name: 'Get State CND',
				value: 'getStateCnd',
				action: 'Get a state tax clearance certificate',
				description: 'Get the state tax (ICMS) clearance certificate in one state, with PDF',
				routing: {
					request: { method: 'GET', url: '/api/consultar-cnd' },
					send: { preSend: [sendDocument] },
				},
			},
			{
				name: 'Get State CND in All States',
				value: 'getStateCndAllStates',
				action: 'Get state tax clearance certificates in all states',
				description: 'Get the state tax (ICMS) clearance certificate in every available state',
				routing: {
					request: { method: 'GET', url: '/api/consultar-cnd-todos' },
					send: { preSend: [sendDocument] },
				},
			},
		],
		default: 'getStateCnd',
	},
	stateField({ resource, operation: ['getStateCnd'] }),
	...documentFields({ resource, operation: allOperations }),
	{
		displayName: 'Issue New Certificate',
		name: 'emitirNova',
		type: 'boolean',
		default: false,
		description:
			'Whether to always issue a new certificate. By default a valid certificate (more than 3 days left) is returned.',
		displayOptions: { show: { resource, operation: ['getFederalCnd'] } },
		routing: {
			send: { type: 'query', property: 'emitir_nova' },
		},
	},
	{
		displayName: 'Skip State Certificates',
		name: 'skipEstaduais',
		type: 'boolean',
		default: false,
		description: 'Whether to return only the federal certificates',
		displayOptions: { show: { resource, operation: ['getAllCertificates'] } },
		routing: {
			send: { type: 'query', property: 'skip_estaduais' },
		},
	},
];
