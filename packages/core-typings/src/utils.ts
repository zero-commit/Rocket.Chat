export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<T>;

export type ExtractKeys<T, K extends keyof T, U> = T[K] extends U ? K : never;

export type ValueOf<T> = T[keyof T];

export type UnionToIntersection<T> = (T extends any ? (x: T) => void : never) extends (x: infer U) => void ? U : never;

export type Awaited<T> = T extends PromiseLike<infer U> ? Awaited<U> : T;

// `T extends any` is a trick to apply a operator to each member of a union
export type KeyOfEach<T> = T extends any ? keyof T : never;

// Taken from https://effectivetypescript.com/2020/04/09/jsonify/
export type Jsonify<T> = T extends Date
	? string
	: T extends object
	? {
			[k in keyof T]: Jsonify<T[k]>;
	  }
	: T;

export type AtLeast<T, K extends keyof T> = Partial<T> & Pick<T, K>;

export type RequiredField<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type DeepWritable<T> = T extends (...args: any) => any
	? T
	: {
			-readonly [P in keyof T]: DeepWritable<T[P]>;
	  };

type ResultType<T, K> = K extends `${infer H}.${infer R}`
	? H extends keyof NonNullable<T>
		? { [P in H]: ResultType<NonNullable<T>[P], R> }
		: never
	: K extends keyof NonNullable<T>
	? T
	: never;

type ActualPick<T, K> = K extends keyof T ? { [A in K]: T[K] } : K extends `${string}.${string}` ? ResultType<T, K> : never;

type MongoDocument = Record<string, any>;

/*
 * PickNested<{ a: { b: { c: string } } }, 'a.b.c'> = { a: { b: { c: string } } }
 * PickNested<{ a: number, b: string }, 'a'> = { a: number }
 * PickNested<{ a: number, b: string }, 'a' | 'b'> = { a: number } & { b: string }
 * PickNested<{ a: number, b: { c: string } }, 'a' | 'b.c'> = { a: number } & { b: { c: string } }
 */
export type PickNested<T extends MongoDocument, K> = UnionToIntersection<ActualPick<T, K>>;

type Primitive = string | Function | number | boolean | symbol | undefined | null | Date | any[];

export type OmitNested<T, K extends string | number | symbol> = {
	[P in keyof T as P extends K ? never : P]: T[P] extends infer TP
		? TP extends Primitive
			? TP
			: OmitNested<T[P], K extends `${Exclude<P, symbol>}.${infer R}` ? R : never>
		: never;
};
