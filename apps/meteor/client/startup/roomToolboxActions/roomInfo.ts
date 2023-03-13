import { lazy } from 'react';

import { roomToolboxActions } from '../../views/room/lib/Toolbox';

roomToolboxActions.add('room-info', {
	groups: ['live' /* , 'voip'*/],
	id: 'room-info',
	title: 'Room_Info',
	icon: 'info-circled',
	template: lazy(() => import('../../views/omnichannel/directory/chats/contextualBar/ChatsContextualBar')),
	order: 0,
});
