'use client';
import { useEffect, useState } from 'react';

const useRinger = (doLoop: boolean = true) => {
	const [audio, setAudio] = useState<HTMLAudioElement>();
	const [playing, setPlaying] = useState(false);

	useEffect(() => {
		setAudio(new Audio('/phone_ringing.mp3'));

		return () => {
			setAudio(undefined);
		};
	}, []);

	const togglePlayback = (play: boolean) => {
		setPlaying(play);
	};

	useEffect(() => {
		if (!audio) return;
		if (playing) {
			audio.loop = doLoop;
			audio.play();
		} else {
			audio.pause();
		}
	}, [playing, audio]);

	useEffect(() => {
		if (!audio) return;
		audio.addEventListener('ended', () => setPlaying(false));
		return () => {
			audio.removeEventListener('ended', () => setPlaying(false));
		};
	}, [audio]);

	return { playing, togglePlayback };
};

export default useRinger;
