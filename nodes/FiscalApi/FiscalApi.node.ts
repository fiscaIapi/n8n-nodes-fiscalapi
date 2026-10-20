import { NodeConnectionTypes, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
import {
	certificateDescription,
	companyDescription,
	nfeDescription,
	producerProfileDescription,
	ruralPropertyDescription,
	stateRegistrationDescription,
} from './resources';

export class FiscalApi implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'FiscalAPI',
		name: 'fiscalApi',
		icon: { light: 'file:../../icons/fiscalapi.svg', dark: 'file:../../icons/fiscalapi.dark.svg' },
		group: ['input'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description:
			'Query Brazilian state registrations (IE), CNPJ, tax clearance certificates, NF-e XML and rural properties',
		defaults: {
			name: 'FiscalAPI',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'fiscalApiApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: 'https://api.fiscalapi.com.br',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			// Some queries (NF-e, SIGEF) can take up to 180 seconds on the server.
			timeout: 200000,
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Certificate',
						value: 'certificate',
						description: 'Tax clearance certificates: state CND, federal CND, CNDT and FGTS CRF',
					},
					{
						name: 'Company',
						value: 'company',
						description: 'Company registration data by CNPJ',
					},
					{
						name: 'NF-e',
						value: 'nfe',
						description: 'Electronic invoice (NF-e) XML by access key',
					},
					{
						name: 'Producer Profile',
						value: 'producerProfile',
						description: 'Consolidated rural producer profile',
					},
					{
						name: 'Rural Property',
						value: 'ruralProperty',
						description: 'Rural properties in SIGEF and CNIR',
					},
					{
						name: 'State Registration',
						value: 'stateRegistration',
						description: 'State registrations (Inscrição Estadual) in the 27 Brazilian states',
					},
				],
				default: 'stateRegistration',
			},
			...certificateDescription,
			...companyDescription,
			...nfeDescription,
			...producerProfileDescription,
			...ruralPropertyDescription,
			...stateRegistrationDescription,
		],
	};
}
