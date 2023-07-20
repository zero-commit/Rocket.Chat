import type { Browser, Page } from '@playwright/test';

import type { IUserState } from './userStates';

export const createAuxContext = async (browser: Browser, userState: IUserState, route = '/'): Promise<{ page: Page }> => {
	const page = await browser.newPage({ storageState: userState.state });
	await page.goto(route);
	await page.locator('.main-content').waitFor();

	return { page };
};
