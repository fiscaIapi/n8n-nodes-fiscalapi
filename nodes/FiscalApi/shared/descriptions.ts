import type { INodeProperties, INodePropertyOptions } from 'n8n-workflow';

type Show = { resource: string[]; operation: string[] };

const STATES = [
	'AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MG', 'MS', 'MT', 'PA',
	'PB', 'PE', 'PI', 'PR', 'RJ', 'RN', 'RO', 'RR', 'RS', 'SC', 'SE', 'SP', 'TO',
];

const stateOptions: INodePropertyOptions[] = STATES.map((uf) => ({ name: uf, value: uf }));

export function stateField(show: Show): INodeProperties {
	return {
		displayName: 'State',
		name: 'uf',
		type: 'options',
		options: stateOptions,
		default: 'MT',
		required: true,
		description: 'Brazilian state (UF) to query',
		displayOptions: { show },
		routing: {
			send: { type: 'query', property: 'uf' },
		},
	};
}

/**
 * Document type selector plus the document number. The value is sent by the
 * `sendDocument` preSend hook as `cpf`, `cnpj` or `ie`.
 */
export function documentFields(show: Show, allowStateRegistration = false): INodeProperties[] {
	const options: INodePropertyOptions[] = [
		{ name: 'CNPJ', value: 'cnpj', description: 'Company tax ID (14 characters)' },
		{ name: 'CPF', value: 'cpf', description: 'Individual tax ID (11 digits)' },
	];
	if (allowStateRegistration) {
		options.push({
			name: 'State Registration (IE)',
			value: 'ie',
			description: 'Inscrição Estadual number',
		});
	}
	return [
		{
			displayName: 'Document Type',
			name: 'documentType',
			type: 'options',
			options,
			default: 'cpf',
			displayOptions: { show },
		},
		{
			displayName: 'Document',
			name: 'document',
			type: 'string',
			default: '',
			required: true,
			placeholder: 'e.g. 123.456.789-09',
			description: 'Document number. Punctuation is accepted.',
			displayOptions: { show },
		},
	];
}

export function secondaryActivitiesField(show: Show): INodeProperties {
	return {
		displayName: 'Include Secondary Activities',
		name: 'secundarias',
		type: 'boolean',
		default: false,
		description:
			'Whether to fetch the secondary activities (CNAE) of each registration. Makes the query slower.',
		displayOptions: { show },
		routing: {
			send: { type: 'query', property: 'secundarias' },
		},
	};
}

export function forceFreshField(show: Show, description: string): INodeProperties {
	return {
		displayName: 'Force Fresh Data',
		name: 'forceFresh',
		type: 'boolean',
		default: false,
		description,
		displayOptions: { show },
		routing: {
			send: { type: 'query', property: 'force_fresh' },
		},
	};
}
