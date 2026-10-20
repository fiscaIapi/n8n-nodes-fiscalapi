# n8n-nodes-fiscalapi

This is an n8n community node. It lets you use [FiscalAPI](https://fiscalapi.com.br) in your n8n workflows.

FiscalAPI is a Brazilian REST API for tax and registration lookups: state registrations (Inscrição Estadual) in all 27 states, company data by CNPJ, tax clearance certificates, NF-e XML by access key and rural property records (SIGEF and CNIR).

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/sustainable-use-license/) workflow automation platform.

- [Installation](#installation)
- [Operations](#operations)
- [Credentials](#credentials)
- [Compatibility](#compatibility)
- [Usage](#usage)
- [Example workflows](#example-workflows)
- [Resources](#resources)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation. The package name is `n8n-nodes-fiscalapi`.

## Operations

| Resource | Operation | Endpoint |
|---|---|---|
| State Registration | Get by State | `GET /api/consultar` |
| State Registration | Get in All States | `GET /api/consultar-ie-todos` |
| Company | Get (by CNPJ) | `GET /api/consultar-cnpj` |
| Certificate | Get State CND | `GET /api/consultar-cnd` |
| Certificate | Get State CND in All States | `GET /api/consultar-cnd-todos` |
| Certificate | Get Federal CND | `GET /api/consultar-cnd-federal` |
| Certificate | Get CNDT (Labor Debts) | `GET /api/consultar-cndt` |
| Certificate | Get FGTS CRF | `GET /api/consultar-crf-fgts` |
| Certificate | Get All Certificates | `GET /api/certidoes-todas` |
| NFe | Get XML | `POST /api/consultar-nfe-xml` |
| Rural Property | Get SIGEF Parcels | `GET /api/consultar-sigef` |
| Rural Property | Get SIGEF Parcel (by UUID) | `GET /api/consultar-sigef-parcela` |
| Rural Property | Get CNIR Properties | `GET /api/consultar-cnir` |
| Producer Profile | Get | `GET /api/perfil-produtor` |

Each operation returns the JSON response of the API as one item. The node can also be used as a tool by AI agents.

## Credentials

1. Create an account at [app.fiscalapi.com.br](https://app.fiscalapi.com.br) and copy your API key from the dashboard.
2. In n8n, create a **FiscalAPI API** credential and paste the key. The key is sent in the `X-API-Key` header.
3. **API usage requires an active plan or credits.** The free monthly queries are available in the dashboard only; through the API, an account without a plan gets HTTP `402`. See [plans and limits](https://docs.fiscalapi.com.br/docs/referencia/plans-and-limits).

Testing the credential calls a free endpoint and does not consume credits.

## Compatibility

Built with `@n8n/node-cli` and n8n nodes API version 1. Targets n8n 1.x and later. No runtime dependencies.

## Usage

- **Documents.** Choose the document type (CPF, CNPJ or, for state registrations, the IE number) and type the number. Punctuation is accepted.
- **Source status.** A successful response may include `source_status.status` other than `success` (for example `timeout` when a government service did not answer in time). Check this field before concluding that a document has no record. In "Get in All States", `complete: false` means at least one state failed.
- **Certificates.** `result.status` is one of `negativa`, `positiva`, `positiva_com_efeitos_de_negativa`, `nao_contribuinte`, `sem_certidao` or `erro`. When available, the certificate PDF comes in `result.pdf_base64`. Use the **Convert to File** node to turn it into a file.
- **NF-e XML.** Requires the A1 certificate (.pfx/.p12) of a party to the invoice (issuer, recipient, carrier or authorized party) and its password. Load the certificate with **Read/Write Files from Disk** or an HTTP download and keep the default *Binary Property* source, or paste it as Base64. The certificate is not stored by FiscalAPI. You are only charged when the XML is returned.
- **Long queries.** NF-e and SIGEF queries can take up to 3 minutes. The node waits up to 200 seconds.
- **Errors.** `402` means no active plan or no credits left. `429` means the per-minute limit of your plan was reached; enable **Retry On Fail** in the node settings to retry automatically.

## Example workflows

**Check a supplier before paying an invoice**

1. *Webhook* receives a CNPJ.
2. *FiscalAPI* → Company → Get.
3. *FiscalAPI* → Certificate → Get All Certificates.
4. *IF* every certificate (`certidoes_federais[].result.status` and `cnd_estaduais.results[].result.status`) is `negativa`, `positiva_com_efeitos_de_negativa` or (for state CNDs) `nao_contribuinte` → continue the payment flow; otherwise notify the finance team.

**Download NF-e XML files from a spreadsheet of access keys**

1. *Read/Write Files from Disk* reads `certificate.pfx` into the `data` binary property.
2. *Google Sheets* (or *Spreadsheet File*) returns one item per access key.
3. *Merge* combines the certificate with each item.
4. *FiscalAPI* → NFe → Get XML, Access Key `{{ $json.chave }}`.
5. *Convert to File* saves `{{ $json.resultados[0].xml }}` as `{{ $json.resultados[0].chave }}.xml`.

**Find the state registrations of a rural producer**

1. *Manual Trigger* with a CPF.
2. *FiscalAPI* → State Registration → Get in All States.
3. *Split Out* `results`, then *Split Out* `results` again to get one item per registration.

## Resources

- [FiscalAPI documentation](https://docs.fiscalapi.com.br)
- [Authentication](https://docs.fiscalapi.com.br/docs/getting-started/authentication)
- [Error handling](https://docs.fiscalapi.com.br/docs/referencia/error-handling)
- [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)

## License

[MIT](LICENSE.md)
