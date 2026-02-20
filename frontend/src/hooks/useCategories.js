import { useEffect, useState } from "react";
import publicApi from "../api/publicApi";

export default function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loadingCat, setLoadingCat] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      const data = await publicApi.getCategories();
      setCategories(data);
      setLoadingCat(false);
    }
    fetchCategories();
  }, []);


  return { categories, loadingCat };
}
