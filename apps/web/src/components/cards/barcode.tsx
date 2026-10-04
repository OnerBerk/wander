const BARCODE_WIDTHS = [1, 1, 2, 1, 3, 1, 1, 2, 1, 1, 3, 1, 2, 1, 1, 2, 3, 1, 3, 2, 1, 3, 1, 1];

const Barcode = () => {
  return (
    <div className="flex h-12 w-18 shrink-0 items-center justify-center" aria-hidden>
      <div className="flex h-full items-stretch gap-px">
        {BARCODE_WIDTHS.map((width, index) => (
          <span key={index} className="bg-current" style={{ width }} />
        ))}
      </div>
    </div>
  );
};

export default Barcode;
