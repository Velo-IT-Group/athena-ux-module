'use client';
import React, { ReactNode, useState } from 'react';
import NextLink, { LinkProps } from 'next/link';

interface Props extends LinkProps {
	children: ReactNode;
}

const Link = ({ children, ...props }: Props) => {
	const [isPrefetching, setIsPrefetching] = useState(false);

	return (
		<NextLink
			{...props}
			prefetch={isPrefetching}
			onMouseEnter={() => setIsPrefetching(true)}
			onMouseLeave={() => setIsPrefetching(false)}
		>
			{children}
		</NextLink>
	);
};

export default Link;
