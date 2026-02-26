import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";
import { useEffect } from "react";

export default function OrderImagePreviewModal({
  previewImage,
  previewImages,
  previewIndex,
  setPreviewIndex,
  closePreview,
}) {
  useEffect(() => {
    if (!previewImage) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") closePreview();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [previewImage, closePreview]);

  if (!previewImage) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={closePreview}
    >
      <div
        className="relative w-full max-w-4xl rounded-2xl bg-white p-3 sm:p-4"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            closePreview();
          }}
          className="absolute right-3 top-3 z-20 rounded-md border border-white-broken bg-white px-3 py-1 text-sm text-gray hover:bg-white-broken/40"
        >
          Close
        </button>

        <div className="relative flex min-h-[320px] items-center justify-center pt-8">
          {previewImages.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous image"
                onClick={() =>
                  setPreviewIndex((prev) =>
                    prev === 0 ? previewImages.length - 1 : prev - 1
                  )
                }
                className="absolute left-2 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white-broken bg-white text-gray shadow-sm hover:bg-white-broken/40 sm:left-4"
              >
                <RiArrowLeftSLine size={20} />
              </button>
              <button
                type="button"
                aria-label="Next image"
                onClick={() =>
                  setPreviewIndex((prev) =>
                    prev === previewImages.length - 1 ? 0 : prev + 1
                  )
                }
                className="absolute right-2 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white-broken bg-white text-gray shadow-sm hover:bg-white-broken/40 sm:right-4"
              >
                <RiArrowRightSLine size={20} />
              </button>
              <span className="absolute left-1/2 top-2 -translate-x-1/2 rounded-full bg-white px-2 py-1 text-xs text-gray">
                {previewIndex + 1}/{previewImages.length}
              </span>
            </>
          )}

          <img
            src={previewImages[previewIndex]}
            alt={previewImage.alt}
            className="mx-auto max-h-[75vh] w-auto max-w-[92%] rounded-xl object-contain"
          />
        </div>
      </div>
    </div>
  );
}
