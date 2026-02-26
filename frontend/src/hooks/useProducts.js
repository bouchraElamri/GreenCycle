import { useState, useEffect } from "react";
import publicApi from "../api/publicApi";

export default function useProducts(productId = null, category = null, seller = null, searchName = "") {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState(null);
  const [productsRelated, setProductsRelated] = useState([]);
  const toArray = (value) => (Array.isArray(value) ? value : Array.isArray(value?.data) ? value.data : []);


  useEffect(() => {
    setLoading(true);
    setError(null);

    const fetchData = async () => {
      try {
        if (productId) {
          const data = await publicApi.getProductDetails(productId);
          setProduct(data);
        } 
        else if (category) {
          const data = await publicApi.getProductByCategory(category);
          setProductsRelated(toArray(data));
        }
        else if (seller) {
           const data = await publicApi.getProductBySeller(seller);
          setProducts(toArray(data));
        }
        else {
          const data = await publicApi.getProducts(searchName);
          setProducts(data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [productId, category, seller, searchName]);
   

  return { products, product, loading, error, productsRelated };
}
