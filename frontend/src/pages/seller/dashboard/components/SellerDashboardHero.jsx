export default function SellerDashboardHero({ hasSellerProfile }) {
  return (
    <section className="rounded-3xl bg-gradient-to-r from-green-tolerated to-green-dark p-5 text-white-intense shadow sm:p-7">
      <h2 className="text-2xl font-bold sm:text-3xl">Seller Dashboard</h2>
      <p className="mt-2 text-sm text-white-broken sm:text-base">
        {hasSellerProfile
          ? "Your seller data is connected to live endpoints."
          : "Seller profile endpoint is missing; showing available data only."}
      </p>
    </section>
  );
}
