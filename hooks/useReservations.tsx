import { useEffect, useState } from 'react';
import { useWorker } from '@/providers/worker-provider';
import { Reservation } from 'twilio-taskrouter';
import { useDevice } from '@/providers/device-provider';

const useReservations = () => {
	const { worker } = useWorker();
	const [reservations, setReservations] = useState<Reservation[]>([]);

	useEffect(() => {
		if (!worker) return;
		const ress = Array.from(worker.reservations.values());
		setReservations(ress);
	}, [worker]);

	const addReservation = (res: Reservation) => {
		setReservations((prev) => [...prev, res]);
	};

	const removeReservation = (res: Reservation) => {
		setReservations((prev) => [...prev.filter((r) => r.sid !== res.sid)]);
	};

	return {
		reservations,
		addReservation,
		removeReservation,
	};
};

export default useReservations;
