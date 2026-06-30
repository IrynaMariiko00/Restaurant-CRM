import type { ReactNode } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
}

export const AccentButton = ({
  children,
  className = "",
  ...props
}: ButtonProps) => (
  <button className={`btn-accent ${className}`} {...props}>
    {children}
  </button>
);
