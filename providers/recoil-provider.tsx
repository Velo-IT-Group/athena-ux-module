'use client';
import React from 'react';
import { RecoilRoot } from 'recoil';

type Props = {
	children: React.ReactNode;
};

const RecoilProvider = ({ children }: Props) => {
	return <RecoilRoot>{children}</RecoilRoot>;
};

export default RecoilProvider;
