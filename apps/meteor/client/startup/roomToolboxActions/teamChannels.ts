import type { FC, LazyExoticComponent } from 'react';
import { lazy } from 'react';

import { roomToolboxActions } from '../../views/room/lib/Toolbox';

roomToolboxActions.add('team-channels', {
	groups: ['team'],
	id: 'team-channels',
	anonymous: true,
	full: true,
	title: 'Team_Channels',
	icon: 'hash',
	template: lazy(() => import('../../views/teams/contextualBar/channels/index')) as LazyExoticComponent<FC>,
	order: 2,
});
