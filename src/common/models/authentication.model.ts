export interface AuthenticationModel {
	keyFile?: string;
	keyFilename?: string;
	autoRetry?: boolean;
	projectId?: string;
	apiEndpoint?: string;
	maxRetries?: number;
	client_id?: string;
	client_secret?: string;
	scope?: string[];
	email?: string;
}
