import { quickActions, QuickActionsEnum } from '../../../../client/lib/QuickActions';

quickActions.add(QuickActionsEnum.OnHoldChat, {
	groups: ['live'],
	id: QuickActionsEnum.OnHoldChat,
	title: 'Omnichannel_onHold_Chat',
	icon: 'pause-unfilled',
	order: 4,
});
