'use client';
import { useTwilio } from '@/providers/twilio-provider';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { SyncClient, SyncListItem, type SyncDocument } from 'twilio-sync';

type TaskSyncObject = {
	task: string;
	reservation: string;
	worker: {
		name: string;
		sid: string;
	};
	customer: {
		name: string;
		sid: string;
	};
	dateCreated: string;
	wrapUpTime?: string;
};

export const useTwilioSync = (listName: string) => {
	const { token } = useTwilio();
	// const syncClient = new SyncClient(token);
	const [syncClient, setSyncClient] = useState<SyncClient | null>(null);
	const [listItems, setListItems] = useState<TaskSyncObject[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const initSyncClient = async () => {
			try {
				const client = new SyncClient(token, { logLevel: 'info' });
				setSyncClient(client);
			} catch (err) {
				toast.error(JSON.stringify(err));
				// setError('Error initializing Sync Client');
				// console.error(err);
			}
		};

		initSyncClient();
	}, [token]);

	// Fetch the list and populate initial items
	const fetchList = useCallback(async () => {
		if (!syncClient) return;
		setLoading(true);

		try {
			const list = await syncClient.list(listName);
			const { items } = await list.getItems({ limit: 1000 });

			setListItems(items.map((item) => item.data as TaskSyncObject));
		} catch (err) {
			// setError('Error fetching the list');
			console.error(err);
			// toast.error(JSON.stringify(err));
		} finally {
			setLoading(false);
		}
	}, [syncClient, listName]);

	// Create a new item in the list
	const addItem = useCallback(
		async (data: any) => {
			if (!syncClient) return;

			try {
				const list = await syncClient.list(listName);
				const newItem = await list.push(data);
				// setListItems((prevItems) => [...prevItems, { index: newItem.index, data: newItem.data }]);
			} catch (err) {
				setError('Error adding item to the list');
				console.error(err);
			}
		},
		[syncClient, listName]
	);

	// Update an item in the list
	const updateItem = useCallback(
		async (index: number, newData: any) => {
			if (!syncClient) return;

			try {
				const list = await syncClient.list(listName);
				await list.update(index, newData);
				// setListItems((prevItems) =>
				// 	prevItems.map((item) => (item.index === index ? { ...item, data: newData } : item))
				// );
			} catch (err) {
				setError('Error updating item');
				console.error(err);
			}
		},
		[syncClient, listName]
	);

	// Delete an item from the list
	const deleteItem = useCallback(
		async (index: number) => {
			if (!syncClient) return;

			try {
				const list = await syncClient.list(listName);
				await list.remove(index);
				// setListItems((prevItems) => prevItems.filter((item) => item.index !== index));
			} catch (err) {
				setError('Error deleting item');
				console.error(err);
			}
		},
		[syncClient, listName]
	);

	useEffect(() => {
		if (!syncClient) return;

		fetchList();
	}, [syncClient]);

	return {
		listItems,
		loading,
		error,
		addItem,
		updateItem,
		deleteItem,
	};
};
