type Checker = (source: any, path: string) => any;

const readPath = (obj: any, path: string) => path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);

export const body: Checker = (source, path) => readPath(source?.body, path);

function ensure(condition: boolean, message: string) {
	if (!condition) {
		throw new Error(message);
	}
}

export const validate = {
	required(field: string, { checker = body, trim = false }: { checker?: Checker; trim?: boolean } = {}) {
		return (ctx: any) => {
			let value = checker(ctx, field);
			if (typeof value === 'string' && trim) value = value.trim();
			ensure(value !== undefined && value !== null && value !== '', `Field '${field}' is required`);
		};
	},
	array(field: string, { checker = body, optional = false }: { checker?: Checker; optional?: boolean } = {}) {
		return (ctx: any) => {
			const value = checker(ctx, field);
			if (optional && (value === undefined || value === null)) return;
			ensure(Array.isArray(value), `Field '${field}' must be an array`);
		};
	},
};

export type GenericOpts = {
	actorId?: string;
	ipAddress?: string;
	deferEvents?: boolean;
};


