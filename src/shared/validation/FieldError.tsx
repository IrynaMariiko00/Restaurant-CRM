type FieldErrorProps = {
  message?: string | null;
};

export const FieldError = ({ message }: FieldErrorProps) => {
  if (!message) return null;

  return (
    <p className="mt-1.5 text-xs text-[var(--error-color)]" role="alert">
      {message}
    </p>
  );
};
