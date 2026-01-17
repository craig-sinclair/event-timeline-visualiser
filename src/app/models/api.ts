export type ApiResponseBase<TData> =
	| ({
			success: true;
			message: string;
			timestamp: string;
	  } & TData)
	| {
			success: false;
			error: string;
			details?: string;
			timestamp: string;
	  };
