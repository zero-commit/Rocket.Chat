import type { IMessage, IUser, ISubscription, IRoom, SettingValue, Serialized, ITranslatedMessage } from '@rocket.chat/core-typings';
import type { Icon } from '@rocket.chat/fuselage';
import type { TranslationKey } from '@rocket.chat/ui-contexts';
import mem from 'mem';
import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';
import { Tracker } from 'meteor/tracker';
import type { ComponentProps, ContextType, UIEvent } from 'react';

import { Messages, Rooms, Subscriptions } from '../../app/models/client';
import { APIClient } from '../../app/utils/client';
import type { AutoTranslateOptions } from '../views/room/MessageList/hooks/useAutoTranslate';
import type { ChatContext } from '../views/room/contexts/ChatContext';
import type { ToolboxContextValue } from '../views/room/contexts/ToolboxContext';
import { roomCoordinator } from './rooms/roomCoordinator';

const findMessage = async (msgId: string): Promise<Serialized<IMessage> | null> => {
	try {
		const { message } = await APIClient.get('/v1/chat.getMessage', { msgId });
		return message;
	} catch {
		return null;
	}
};

type MessageToolboxActionGroup = 'message' | 'menu';

export type MessageToolboxActionContext =
	| 'message'
	| 'threads'
	| 'message-mobile'
	| 'pinned'
	| 'direct'
	| 'starred'
	| 'mentions'
	| 'federated'
	| 'videoconf'
	| 'search';

type MessageToolboxActionConditionParams = {
	message: IMessage;
	user: IUser | undefined;
	room: IRoom;
	subscription?: ISubscription;
	context?: MessageToolboxActionContext;
	settings: { [key: string]: SettingValue };
	chat: ContextType<typeof ChatContext>;
};

export type MessageToolboxActionConfig = {
	id: string;
	icon: ComponentProps<typeof Icon>['name'];
	variant?: 'danger' | 'success' | 'warning';
	label: TranslationKey;
	order?: number;
	group?: MessageToolboxActionGroup | MessageToolboxActionGroup[];
	context?: MessageToolboxActionContext[];
	action: (
		e: UIEvent<Element>,
		{
			message,
			tabbar,
			room,
			chat,
			autoTranslateOptions,
		}: {
			message?: IMessage & Partial<ITranslatedMessage>;
			tabbar: ToolboxContextValue;
			room?: IRoom;
			chat: ContextType<typeof ChatContext>;
			autoTranslateOptions?: AutoTranslateOptions;
		},
	) => any;
	condition?: (props: MessageToolboxActionConditionParams) => Promise<boolean> | boolean;
};

type MessageToolboxActionConfigList = MessageToolboxActionConfig[];

class MessageToolboxActions {
	private buttons = new ReactiveVar<Record<string, MessageToolboxActionConfig>>({});

	public add(config: MessageToolboxActionConfig): void {
		if (!config?.id) {
			return;
		}

		if (!config.group) {
			config.group = 'menu';
		}

		if (config.condition) {
			config.condition = mem(config.condition, { maxAge: 1000, cacheKey: JSON.stringify });
		}

		Tracker.nonreactive(() => {
			const btns = this.buttons.get();
			btns[config.id] = config;
			mem.clear(this._getButtons);
			mem.clear(this.getButtonsByGroup);
			this.buttons.set(btns);
		});
	}

	public remove(id: MessageToolboxActionConfig['id']): void {
		Tracker.nonreactive(() => {
			const btns = this.buttons.get();
			delete btns[id];
			this.buttons.set(btns);
		});
	}

	private _getButtons = mem(
		(): MessageToolboxActionConfigList => Object.values(this.buttons.get()).sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
		{
			maxAge: 1000,
		},
	);

	private async getButtonsByCondition(
		prop: MessageToolboxActionConditionParams,
		arr: MessageToolboxActionConfigList = messageToolboxActions._getButtons(),
	): Promise<MessageToolboxActionConfigList> {
		return (
			await Promise.all(
				arr.map(async (button) => {
					return [button, !button.condition || (await button.condition(prop))] as const;
				}),
			)
		)
			.filter(([, condition]) => condition)
			.map(([button]) => button);
	}

	private getButtonsByGroup = mem(
		(
			group: MessageToolboxActionGroup,
			arr: MessageToolboxActionConfigList = messageToolboxActions._getButtons(),
		): MessageToolboxActionConfigList => {
			return arr.filter((button) => !button.group || (Array.isArray(button.group) ? button.group.includes(group) : button.group === group));
		},
		{ maxAge: 1000 },
	);

	private getButtonsByContext(context: MessageToolboxActionContext, arr: MessageToolboxActionConfigList): MessageToolboxActionConfigList {
		return !context ? arr : arr.filter((button) => !button.context || button.context.includes(context));
	}

	public async get(
		props: MessageToolboxActionConditionParams,
		context: MessageToolboxActionContext,
		group: MessageToolboxActionGroup,
	): Promise<MessageToolboxActionConfigList> {
		const allButtons = group ? this.getButtonsByGroup(group) : messageToolboxActions._getButtons();

		if (props.message) {
			return this.getButtonsByCondition({ ...props, context }, this.getButtonsByContext(context, allButtons));
		}
		return allButtons;
	}

	public async getPermaLink(mid: IMessage['_id']): Promise<string> {
		if (!mid) {
			throw new Error('invalid-parameter');
		}

		const msg = Messages.findOne(mid) || (await findMessage(mid));
		if (!msg) {
			throw new Error('message-not-found');
		}
		const roomData = Rooms.findOne({ _id: msg.rid });

		if (!roomData) {
			throw new Error('room-not-found');
		}

		const subData = Subscriptions.findOne({ 'rid': roomData._id, 'u._id': Meteor.userId() });
		const roomURL = roomCoordinator.getURL(roomData.t, subData || roomData);
		return `${roomURL}?msg=${mid}`;
	}
}

export const messageToolboxActions = new MessageToolboxActions();
