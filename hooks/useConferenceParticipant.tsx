'use client';
import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
	getConferenceParticipant,
	removeConferenceParticipant,
	updateConferenceParticipants,
} from '@/lib/twilio/conference/helpers';
import { toast } from 'sonner';

type Props = {
	conferenceSid: string;
	participantSid: string;
};

const useConferenceParticipant = ({ conferenceSid, participantSid }: Props) => {
	const [isMuted, setIsMuted] = useState(false);
	const [isOnHold, setIsOnHold] = useState(false);

	const getParticipant = useQuery({
		queryKey: ['participant', conferenceSid, participantSid],
		queryFn: () => getConferenceParticipant(conferenceSid, participantSid),
	});

	// setIsOnHold(data?.hold ?? false);
	// setIsMuted(data?.muted ?? false);

	const toggleParticipantMute = useMutation({
		mutationKey: ['toggleParticipantMute', conferenceSid, participantSid],
		mutationFn: ({ label, muted }: { label?: string; muted: boolean }) =>
			updateConferenceParticipants(conferenceSid, label ?? participantSid, { Muted: muted }),
		onSuccess: (data, variables) => {
			setIsMuted(data.muted);
		},
	});

	const removeParticipant = useMutation({
		mutationKey: ['toggleParticipantMute', conferenceSid, participantSid],
		mutationFn: (muted: boolean) => removeConferenceParticipant(conferenceSid, participantSid),
	});

	const toggleParticipantHoldState = useMutation({
		mutationKey: ['toggleParticipantHoldState', conferenceSid, participantSid],
		mutationFn: ({ label, hold }: { label?: string; hold: boolean }) =>
			updateConferenceParticipants(conferenceSid, label ?? participantSid, { Hold: hold }),
		onSuccess: (data, variables) => {
			setIsMuted(data.hold);
		},
		onError(error, variables, context) {
			toast.error(error.message);
		},
	});

	return {
		isMuted,
		isOnHold,
		getParticipant,
		toggleParticipantHoldState,
		toggleParticipantMute,
		removeParticipant,
	};
};

export default useConferenceParticipant;
