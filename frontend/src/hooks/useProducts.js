import { useState, useEffect } from "react";
import publicApi from "../api/publicApi";

export default function useProducts(productId = null) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const fetchData = async () => {
      try {
        if (productId) {
          const data = await publicApi.getProductDetails(productId);
          console.log(data);
          setProduct(data);
        } else {
          const data = await publicApi.getProducts();
          console.log(data);
          setProducts(data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [productId]);

  return { products, product, loading, error };
}
