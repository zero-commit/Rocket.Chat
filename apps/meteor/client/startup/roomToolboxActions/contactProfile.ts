import { lazy } from 'react';

import { roomToolboxActions } from '../../views/room/lib/Toolbox';

roomToolboxActions.add('contact-profile', {
	groups: ['live' /* , 'voip'*/],
	id: 'contact-profile',
	title: 'Contact_Info',
	icon: 'user',
	template: lazy(() => import('../../views/omnichannel/directory/contacts/contextualBar/ContactsContextualBar')),
	order: 1,
});
