import { lazy } from 'react';

import { roomToolboxActions } from '../../views/room/lib/Toolbox';

roomToolboxActions.add('contact-chat-history', {
	groups: ['live' /* , 'voip'*/],
	id: 'contact-chat-history',
	title: 'Contact_Chat_History',
	icon: 'clock',
	// template: 'contactChatHistory',
	template: lazy(() => import('../../views/omnichannel/contactHistory/ContactHistory')),
	order: 11,
});
