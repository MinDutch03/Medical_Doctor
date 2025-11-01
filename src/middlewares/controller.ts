export type RequestContext = {
	body?: any;
	extra?: Record<string, any>;
};

export type Middleware = (ctx: RequestContext) => Promise<void> | void;

export function controller<T extends any[]>(
	middlewares: Middleware[],
	handler: (ctx: RequestContext, ...args: T) => Promise<any> | any
) {
	return async (ctx: RequestContext, ...args: T) => {
		for (const mw of middlewares) {
			await mw(ctx);
		}
		return await handler(ctx, ...args);
	};
}


