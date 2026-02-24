import { useContext } from "react";
import { Link } from "react-router-dom";
import MainLayout from "../../../components/layouts/MainLayout";
import CartContext from "../../../contexts/CartContext";

const formatPrice = (value) => `${Number(value || 0).toFixed(2)} MAD`;

export default function CartPage() {
  const { items, total, updateQty, removeFromCart, clearCart } = useContext(CartContext);

  return (
    <MainLayout>
      <section className="mx-6 md:mx-24 mt-28 mb-16 font-nexa">
        <h1 className="text-3xl font-bold text-green-dark mb-6">My Cart</h1>

        {items.length === 0 ? (
          <div className="rounded-3xl bg-white-intense shadow p-8 text-center">
            <p className="text-gray-600 text-lg mb-4">Your cart is empty.</p>
            <Link
              to="/product_list"
              className="inline-flex items-center justify-center rounded-full bg-green-dark text-white-intense px-6 py-3 font-bold hover:bg-green-medium transition"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 rounded-3xl bg-white-intense shadow overflow-hidden">
              <div className="grid grid-cols-12 px-6 py-4 bg-green-light/30 text-green-dark font-bold">
                <span className="col-span-6">Product</span>
                <span className="col-span-2 text-center">Price</span>
                <span className="col-span-2 text-center">Qty</span>
                <span className="col-span-2 text-right">Total</span>
              </div>

              {items.map((item) => (
                <div key={item._id} className="grid grid-cols-12 px-6 py-4 border-t border-black/10 items-center">
                  <div className="col-span-6 flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                      {item.images?.[0] ? (
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">
                          No image
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-green-dark">{item.name}</p>
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="text-sm text-red-500 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <div className="col-span-2 text-center text-gray-700">{formatPrice(item.price)}</div>

                  <div className="col-span-2 flex items-center justify-center gap-2">
                    <button
                      onClick={() => updateQty(item, Math.max(1, item.qty - 1))}
                      className="w-7 h-7 rounded-full border border-green-dark text-green-dark"
                    >
                      -
                    </button>
                    <span className="min-w-6 text-center">{item.qty}</span>
                    <button
                      onClick={() => updateQty(item, item.qty + 1)}
                      className="w-7 h-7 rounded-full border border-green-dark text-green-dark"
                    >
                      +
                    </button>
                  </div>

                  <div className="col-span-2 text-right font-bold text-green-dark">
                    {formatPrice(item.price * item.qty)}
                  </div>
                </div>
              ))}
            </div>

            <aside className="rounded-3xl bg-white-intense shadow p-6 h-fit">
              <h2 className="text-xl font-bold text-green-dark mb-4">Summary</h2>
              <div className="flex justify-between text-gray-700 mb-2">
                <span>Items</span>
                <span>{items.reduce((sum, item) => sum + item.qty, 0)}</span>
              </div>
              <div className="flex justify-between text-gray-700 mb-4">
                <span>Subtotal</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="h-px bg-black/10 mb-4" />
              <div className="flex justify-between text-lg font-bold text-green-dark mb-6">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>

              <button
                type="button"
                className="w-full rounded-full bg-green-dark text-white-intense py-3 font-bold hover:bg-green-medium transition mb-3"
              >
                Proceed to Checkout
              </button>
              <button
                type="button"
                onClick={clearCart}
                className="w-full rounded-full border border-red-400 text-red-500 py-3 font-bold hover:bg-red-50 transition"
              >
                Clear Cart
              </button>
            </aside>
          </div>
        )}
      </section>
    </MainLayout>
  );
}
