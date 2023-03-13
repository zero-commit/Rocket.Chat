import { lazy } from 'react';

import { roomToolboxActions } from '../../views/room/lib/Toolbox';

roomToolboxActions.add('mentions', {
	groups: ['channel', 'group', 'team'],
	id: 'mentions',
	title: 'Mentions',
	icon: 'at',
	template: lazy(() => import('../../views/room/contextualBar/MentionsTab')),
	order: 9,
});
