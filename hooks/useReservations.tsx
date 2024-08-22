import { useEffect, useState } from 'react';
import { useWorker } from '@/providers/worker-provider';
import { Reservation } from 'twilio-taskrouter';

const useReservations = () => {
	const { worker } = useWorker();
	const [reservations, setReservations] = useState<Reservation[]>([]);

	useEffect(() => {
		if (!worker) return;
		const ress = Array.from(worker.reservations.values());
		setReservations(ress);
	}, [worker]);

	const addReservation = async (res: Reservation) => {
		setReservations((prev) => [...prev, res]);
	};

	const removeReservation = async (res: Reservation) => {
		setReservations((prev) => [...prev.filter((r) => r.sid !== res.sid)]);
	};

	return {
		reservations,
		addReservation,
		removeReservation,
	};
};

export default useReservations;
