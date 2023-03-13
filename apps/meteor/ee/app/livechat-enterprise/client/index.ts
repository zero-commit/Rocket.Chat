import { hasLicense } from '../../license/client';

hasLicense('livechat-enterprise').then((enabled) => {
	if (!enabled) {
		return;
	}

	return Promise.all([
		import('./views/livechatSideNavItems'),
		import('./views/business-hours/Multiple'),
		import('./quickActions'),
		import('./messageTypes'),
	]);
});
