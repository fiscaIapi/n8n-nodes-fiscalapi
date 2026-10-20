import type {
	IAuthenticateGeneric,
	Icon,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class FiscalApiApi implements ICredentialType {
	name = 'fiscalApiApi';

	displayName = 'FiscalAPI API';

	icon: Icon = { light: 'file:../icons/fiscalapi.svg', dark: 'file:../icons/fiscalapi.dark.svg' };

	documentationUrl = 'https://docs.fiscalapi.com.br/docs/getting-started/authentication';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description:
				'API key from the FiscalAPI dashboard (app.fiscalapi.com.br). API usage requires an active plan or credits.',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'X-API-Key': '={{$credentials.apiKey}}',
			},
		},
	};

	// Free, authenticated endpoint: validates the key without consuming credits.
	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.fiscalapi.com.br',
			url: '/api/v1/sefaz/status',
			method: 'GET',
		},
	};
}
