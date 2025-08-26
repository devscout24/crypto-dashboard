interface ErrorMessageProps {
  title: string;
  message: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

export default function ErrorMessage({
  title,
  message,
  buttonText = "Retry",
  onButtonClick,
}: ErrorMessageProps) {
  return (
    <div className="text-center p-4 h-[230px] flex items-center justify-center">
      <div>
        <p className="text-lg font-semibold text-red-500 mb-2">{title}</p>
        <p className="text-sm text-gray-500">{message}</p>
        {onButtonClick && (
          <button
            onClick={onButtonClick}
            className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            {buttonText}
          </button>
        )}
      </div>
    </div>
  );
}
