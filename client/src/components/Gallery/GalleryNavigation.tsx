interface GalleryNavigationProps {
  onNext: () => void;
  onPrevious: () => void;
  disabled?: boolean;
}

export function GalleryNavigation({
  onNext,
  onPrevious,
  disabled = false,
}: GalleryNavigationProps) {
  return (
    <>
      <button
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-deep-charcoal p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-pointer"
        onClick={onPrevious}
        disabled={disabled}
      >
        <i className="fas fa-chevron-left text-lg"></i>
      </button>

      <button
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-deep-charcoal p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-pointer"
        onClick={onNext}
        disabled={disabled}
      >
        <i className="fas fa-chevron-right text-lg"></i>
      </button>
    </>
  );
}
