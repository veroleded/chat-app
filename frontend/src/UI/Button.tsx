import React from 'react';
import { Link } from 'react-router-dom';

type Props = {
  children: React.ReactNode | React.ReactNode[];
  className: string;
  ariaLabel?: string;
  href?: string;
  onCLick?: (event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  target?: '_blank';
};

export const Button = ({ children, className, ariaLabel, href, onCLick, target }: Props) => {
  if (href) {
    return (
      <Link
        to={href}
        target={target ?? '_self'}
        className={className}
        aria-label={ariaLabel}
        onClick={onCLick}>
        {children}
      </Link>
    );
  }
  return (
    <button className={className} aria-label={ariaLabel} onClick={onCLick}>
      {children}
    </button>
  );
};
