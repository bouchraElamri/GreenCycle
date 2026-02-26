import { useEffect, useState } from "react";
import publicApi from "../api/publicApi";

export default function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loadingCat, setLoadingCat] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function fetchCategories() {
      try {
        const data = await publicApi.getCategories();
        if (mounted) {
          setCategories(Array.isArray(data) ? data : []);
        }
      } catch (_err) {
        if (mounted) {
          setCategories([]);
        }
      } finally {
        if (mounted) {
          setLoadingCat(false);
        }
      }
    }

    fetchCategories();

    return () => {
      mounted = false;
    };
  }, []);


  return { categories, loadingCat };
}
