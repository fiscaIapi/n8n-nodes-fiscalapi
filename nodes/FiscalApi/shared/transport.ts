import {
	NodeOperationError,
	type IDataObject,
	type IExecuteSingleFunctions,
	type IHttpRequestOptions,
} from 'n8n-workflow';

/**
 * Adds the selected document (cpf, cnpj or ie) as a query string parameter.
 */
export async function sendDocument(
	this: IExecuteSingleFunctions,
	requestOptions: IHttpRequestOptions,
): Promise<IHttpRequestOptions> {
	const documentType = this.getNodeParameter('documentType') as string;
	const document = String(this.getNodeParameter('document') ?? '').trim();
	if (!document) {
		throw new NodeOperationError(this.getNode(), 'The document number is required');
	}
	requestOptions.qs = { ...((requestOptions.qs as IDataObject) ?? {}), [documentType]: document };
	return requestOptions;
}

/**
 * Builds the JSON body of the NF-e XML request. The A1 certificate can come
 * from a binary property of the input item or from a Base64 string.
 */
export async function sendNfeBody(
	this: IExecuteSingleFunctions,
	requestOptions: IHttpRequestOptions,
): Promise<IHttpRequestOptions> {
	const accessKey = String(this.getNodeParameter('accessKey') ?? '').replace(/\D/g, '');
	if (accessKey.length !== 44) {
		throw new NodeOperationError(this.getNode(), 'The access key must have 44 digits');
	}

	const source = this.getNodeParameter('certificateSource') as string;
	let certificate: string;
	if (source === 'binary') {
		const binaryPropertyName = this.getNodeParameter('binaryPropertyName') as string;
		this.helpers.assertBinaryData(binaryPropertyName);
		const buffer = await this.helpers.getBinaryDataBuffer(binaryPropertyName);
		certificate = buffer.toString('base64');
	} else {
		certificate = String(this.getNodeParameter('certificateBase64') ?? '').replace(/\s+/g, '');
	}
	if (!certificate) {
		throw new NodeOperationError(this.getNode(), 'The A1 certificate is required');
	}

	requestOptions.body = {
		chave: accessKey,
		certificado: certificate,
		senha: this.getNodeParameter('certificatePassword') as string,
		manifestar: this.getNodeParameter('manifest', true) as boolean,
	};
	return requestOptions;
}
