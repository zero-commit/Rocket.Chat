import type { IMessage, IRoom } from '@rocket.chat/core-typings';

import { settings } from '../../../settings/server';

export const isTheLastMessage = (room: IRoom, message: Pick<IMessage, '_id'>) =>
	settings.get<boolean>('Store_Last_Message') && (!room.lastMessage || room.lastMessage._id === message._id);
