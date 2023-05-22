import { useEndpoint } from '@rocket.chat/ui-contexts';
import { useInfiniteQuery } from '@tanstack/react-query';

const tenMinutes = 10 * 60 * 1000;

export const useInfiniteFederationSearchPublicRooms = (serverName: string, roomName?: string, count?: number) => {
	const fetchRoomList = useEndpoint('GET', '/v1/federation/searchPublicRooms');
	return useInfiniteQuery(
		['federation/searchPublicRooms', serverName, roomName, count],
		async ({ pageParam }) => fetchRoomList({ serverName, roomName, count, pageToken: pageParam }),
		{
			getNextPageParam: (lastPage) => lastPage.nextPageToken,
			useErrorBoundary: true,
			refetchOnWindowFocus: false,
			staleTime: tenMinutes,
			cacheTime: tenMinutes,
		},
	);
};
