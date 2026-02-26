import { Link } from "react-router-dom";
import { RiArrowLeftLine } from "react-icons/ri";

export default function OrderDetailsHeader() {
  return (
    <>
      <div className="mb-4">
        <Link
          to="/admin/orders"
          className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-green-dark text-green-dark bg-white-intense transition-all duration-300 hover:border-white-intense hover:bg-green-dark hover:text-white-intense hover:opacity-80 md:h-12 md:w-12"
          aria-label="Back to orders"
        >
          <RiArrowLeftLine size={16} />
        </Link>
      </div>
      <h1 className="mb-4 text-3xl font-black text-gray sm:text-4xl">Order Details</h1>
    </>
  );
}
