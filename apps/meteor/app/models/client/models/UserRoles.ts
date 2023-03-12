import { Mongo } from 'meteor/mongo';
import type { IRole } from '@rocket.chat/core-typings';

/** @deprecated */
export const UserRoles = new Mongo.Collection<{
	_id: string;
	_updatedAt?: Date;
	roles?: IRole['_id'][];
}>(null);
