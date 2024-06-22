'use client';
import React, { ReactNode, useContext, useEffect, useState } from 'react';
const context = React.createContext({});
const { Provider } = context;

export const JabraProvider = ({ children }: { children: ReactNode }) => {
	useEffect(() => {}, []);

	return <Provider value={{}}>{children}</Provider>;
};

export const useJabra = () => {
	const state = useContext(context);

	return state;
};
