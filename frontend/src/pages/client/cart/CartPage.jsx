import { useMemo } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import TitleTable from "../../../components/cartpage/Title_table";

export default function CartPage() {
  const cartContent = useMemo(() => <TitleTable />, []);

  return (
    <MainLayout>
      {cartContent}
    </MainLayout>
  );
}
