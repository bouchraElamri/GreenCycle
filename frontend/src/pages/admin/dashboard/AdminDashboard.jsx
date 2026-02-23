import useDashboard from "../../../hooks/useDashboard";

export default function AdminDashboard() {
  const { data, loading, error } = useDashboard();

  if (loading) {
    return <p className="p-6 text-gray">Loading dashboard...</p>;
  }

  if (error) {
    return <p className="p-6 text-red">{error}</p>;
  }

  const cards = [
    {
      label: "Users Registered",
      value: data.usersRegistered,
      bgImage: "/assets/images/UsersRegistered.jpg",
    },
    {
      label: "Product In Selling",
      value: data.productsInSelling,
      bgImage: "/assets/images/ProductsinSelling.jpg",
    },
    {
      label: "Product On Hold",
      value: data.productsOnHold,
      bgImage: "/assets/images/ProductsOnHold.jpg",
    },
    {
      label: "Total Orders",
      value: data.totalOrders,
      bgImage: "/assets/images/TotalOrders.jpeg",
    },
  ];

  return (
    <section className="w-full font-nexa">
      <h1 className="mb-6 text-4xl font-black text-gray sm:mb-8 sm:text-5xl">Dashboard</h1>
      <div className="grid max-w-[950px] grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
        {cards.map((card) => (
          <div
            key={card.label}
            className="relative w-full overflow-hidden rounded-3xl bg-gradient-to-r from-green-dark to-green-tolerated p-[1.5px] min-h-[170px] sm:min-h-[180px]"
          >
            <div className="relative h-full overflow-hidden rounded-[22px] bg-green-light/35 p-5 sm:p-6">
              {card.bgImage && (
                <>
                  <img
                    src={card.bgImage}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover object-[center_35%] blur-[1px] scale-105 opacity-85"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-green-light/80 to-white-intense/80
                  " />
                </>
              )}
              <div className="relative z-10">
                <p className="text-4xl font-black text-gray sm:text-5xl">{card.value ?? 0}</p>
                <p className="mt-2 text-2xl text-gray sm:text-3xl">{card.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
