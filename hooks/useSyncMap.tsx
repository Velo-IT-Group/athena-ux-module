import { useTwilio } from '@/providers/twilio-provider';
import React, { useEffect, useMemo, useState } from 'react';
import { SyncClient, SyncMap, SyncMapItem } from 'twilio-sync';

type Props = {};

const useSyncMap = (mapKey: string) => {
	const { token } = useTwilio();
	const [items, setItems] = useState<SyncMapItem[]>([]);
	const syncClient = useMemo(() => new SyncClient(token), [token]);

	useEffect(() => {
		if (!syncClient) return;
		const getSync = async () => {
			const map = await syncClient.map(mapKey);
			const { items } = await map.getItems();
			setItems(items);

			map.on('itemUpdated', (item) => {
				const oldItems = items;
				const oldItem = oldItems.findIndex((i) => i.key === item.key);
				oldItems[oldItem] = item;
				setItems(oldItems);

				console.log(item);
			});

			map.on('itemAdded', (item) => {
				setItems((prev) => [...prev, item]);
			});

			map.on('itemRemoved', (item) => {
				setItems((prev) => [...prev.filter((i) => i.key !== item.key)]);
			});
		};

		getSync();
	}, [syncClient, mapKey]);

	// const getSyncItem = async (key: string) => {
	// 	const map = await syncClient.map(mapKey);
	// 	map.on('itemAdded', () => {});
	// 	const item = await map.get(key);
	// 	// item.get
	// 	return item;
	// };

	// const updateSyncItem = async (key: string, data: Object) => {
	// 	const map = await syncClient.map(mapKey);
	// 	const item = await map.get(key);
	// 	// item.update()
	// 	return item;
	// };

	return {
		items,
	};
};

export default useSyncMap;
