import type { FC, LazyExoticComponent } from 'react';
import { lazy } from 'react';

import { roomToolboxActions } from '../../views/room/lib/Toolbox';

roomToolboxActions.add('team-info', {
	groups: ['team'],
	id: 'team-info',
	anonymous: true,
	full: true,
	title: 'Teams_Info',
	icon: 'info-circled',
	template: lazy(() => import('../../views/teams/contextualBar/info/index.js')) as LazyExoticComponent<FC>,
	order: 1,
});
