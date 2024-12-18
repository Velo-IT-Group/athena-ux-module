'use client';
import { useTwilio } from '@/providers/twilio-provider';
import { useEffect, useMemo, useState } from 'react';
import { SyncClient, SyncMapItem } from 'twilio-sync';

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
				setItems((prev) => [
					...prev.filter((i) => i.key !== item.item.key),
					item.item,
				]);
			});

			map.on('itemAdded', (item) => {
				let newItems = [
					...items.filter((i) => i.key !== item.item.key),
					item.item,
				];
				setItems(newItems);
			});

			map.on('itemRemoved', (item) => {
				let newItems = [...items.filter((i) => i.key !== item.key)];
				setItems(newItems);
			});
		};

		getSync();
	}, [syncClient, mapKey]);

	return {
		items,
	};
};

export default useSyncMap;
