import type {
	BulkWriteOptions,
	ChangeStream,
	Collection,
	DeleteOptions,
	DeleteResult,
	Document,
	EnhancedOmit,
	Filter,
	FindCursor,
	FindOneAndUpdateOptions,
	FindOptions,
	InsertManyResult,
	InsertOneOptions,
	InsertOneResult,
	ModifyResult,
	OptionalId,
	UpdateFilter,
	UpdateOptions,
	UpdateResult,
	WithId,
} from 'mongodb';
import type { RocketChatRecordDeleted, PickNested, OmitNested } from '@rocket.chat/core-typings';

export type DefaultFields<Base> = Record<keyof Base, 1> | Record<keyof Base, 0> | void;
export type ResultFields<Base, Defaults> = Defaults extends void
	? Base
	: Defaults[keyof Defaults] extends 1
	? Pick<Defaults, keyof Defaults>
	: Omit<Defaults, keyof Defaults>;

export type InsertionModel<T> = EnhancedOmit<OptionalId<T>, '_updatedAt'> & {
	_updatedAt?: Date;
};

export type FindPaginated<C> = {
	cursor: C;
	totalCount: Promise<number>;
};

export interface IBaseModel<
	T extends { _id: string },
	C extends DefaultFields<T> = undefined,
	TDeleted extends RocketChatRecordDeleted<T> = RocketChatRecordDeleted<T>,
> {
	col: Collection<T>;

	getCollectionName(): string;

	findOneAndUpdate(query: Filter<T>, update: UpdateFilter<T> | T, options?: FindOneAndUpdateOptions): Promise<ModifyResult<T>>;

	findOneById<
		const E extends FindOptions<T>,
		K extends E extends { projection: any }
			? E['projection'] extends { [k: string]: 1 }
				? PickNested<WithId<T>, '_id' | keyof E['projection']>
				: OmitNested<WithId<T>, keyof E['projection']>
			: T,
	>(
		_id: T['_id'],
		options?: E,
	): Promise<K | null>;
	findOneById<P extends Document = T>(_id: T['_id']): Promise<P | null>;
	findOneById(_id: T['_id'], options?: FindOptions<T>): Promise<T | null>;

	findOne<
		const E extends FindOptions<T>,
		K extends E extends { projection: any }
			? E['projection'] extends { [k: string]: 1 }
				? PickNested<WithId<T>, '_id' | keyof E['projection']>
				: OmitNested<WithId<T>, keyof E['projection']>
			: T,
	>(
		_id: T['_id'] | Filter<T>,
		options?: E,
	): Promise<K | null>;
	findOne<P extends Document = T>(query: Filter<T> | T['_id']): Promise<P | null>;
	findOne(query: Filter<T> | T['_id'], options?: FindOptions<T>): Promise<WithId<T> | null>;

	find<E extends T>(query: Filter<T>, options?: FindOptions<E>): FindCursor<E>;

	find<
		const E extends FindOptions<T>,
		K extends E extends { projection: any }
			? E['projection'] extends { [k: string]: 1 }
				? PickNested<WithId<T>, '_id' | keyof E['projection']>
				: OmitNested<WithId<T>, keyof E['projection']>
			: T,
	>(
		query: Filter<T>,
		options?: E,
	): FindCursor<K>;
	find(query?: Filter<T>): FindCursor<ResultFields<T, C>>;
	find<P extends Document = T>(query: Filter<T>): FindCursor<P>;
	find(query: Filter<T> | undefined, options?: FindOptions<T>): FindCursor<ResultFields<T, C>> | FindCursor<WithId<T>>;

	findPaginated<E extends T>(query: Filter<T>, options?: FindOptions<E>): FindPaginated<FindCursor<E>>;

	findPaginated<
		const E extends FindOptions<T>,
		K extends E extends { projection: any }
			? E['projection'] extends { [k: string]: 1 }
				? PickNested<WithId<T>, '_id' | keyof E['projection']>
				: OmitNested<WithId<T>, keyof E['projection']>
			: T,
	>(
		query: Filter<T>,
		options?: E,
	): FindPaginated<FindCursor<K>>;

	findPaginated<P extends Document = T>(query: Filter<T>): FindPaginated<FindCursor<WithId<P>>>;
	findPaginated(query: Filter<T>, options?: FindOptions<T>): FindPaginated<FindCursor<WithId<T>>>;

	update(
		filter: Filter<T>,
		update: UpdateFilter<T> | Partial<T>,
		options?: UpdateOptions & { multi?: true },
	): Promise<UpdateResult | Document>;

	updateOne(filter: Filter<T>, update: UpdateFilter<T> | Partial<T>, options?: UpdateOptions): Promise<UpdateResult>;

	updateMany(filter: Filter<T>, update: UpdateFilter<T> | Partial<T>, options?: UpdateOptions): Promise<Document | UpdateResult>;

	insertMany(docs: InsertionModel<T>[], options?: BulkWriteOptions): Promise<InsertManyResult<T>>;

	insertOne(doc: InsertionModel<T>, options?: InsertOneOptions): Promise<InsertOneResult<T>>;

	removeById(_id: T['_id']): Promise<DeleteResult>;

	deleteOne(filter: Filter<T>, options?: DeleteOptions & { bypassDocumentValidation?: boolean }): Promise<DeleteResult>;

	deleteMany(filter: Filter<T>, options?: DeleteOptions): Promise<DeleteResult>;

	// Trash
	trashFind<P extends TDeleted>(
		query: Filter<TDeleted>,
		options?: FindOptions<P extends TDeleted ? TDeleted : P>,
	): FindCursor<WithId<TDeleted>> | undefined;

	trashFindOneById(_id: TDeleted['_id']): Promise<TDeleted | null>;

	trashFindOneById<P extends Document>(_id: TDeleted['_id'], options: FindOptions<P extends TDeleted ? TDeleted : P>): Promise<P | null>;

	trashFindOneById<P extends TDeleted>(
		_id: TDeleted['_id'],
		options?: FindOptions<P extends TDeleted ? TDeleted : P>,
	): Promise<WithId<RocketChatRecordDeleted<P> | TDeleted> | null>;

	trashFindDeletedAfter(deletedAt: Date): FindCursor<WithId<TDeleted>>;

	trashFindDeletedAfter<P extends Document = TDeleted>(
		deletedAt: Date,
		query?: Filter<TDeleted>,
		options?: FindOptions<P extends TDeleted ? TDeleted : P>,
	): FindCursor<WithId<TDeleted>>;

	trashFindPaginatedDeletedAfter<P extends Document = TDeleted>(
		deletedAt: Date,
		query?: Filter<TDeleted>,
		options?: FindOptions<P extends TDeleted ? TDeleted : P>,
	): FindPaginated<FindCursor<WithId<TDeleted>>>;

	watch(pipeline?: object[]): ChangeStream<T>;
	estimatedDocumentCount(): Promise<number>;
	countDocuments(query: Filter<T>): Promise<number>;
}
