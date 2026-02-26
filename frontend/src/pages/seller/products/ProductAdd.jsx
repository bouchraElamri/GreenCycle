import { useEffect, useRef, useState } from "react";
import useSellerProductAdd from "../../../hooks/useSellerProductAdd";
import ProductAddForm from "./components/ProductAddForm";

const initialForm = {
  name: "",
  description: "",
  price: "",
  quantity: "",
  category: "",
};

export default function ProductAdd() {
  const [form, setForm] = useState(initialForm);
  const [images, setImages] = useState([]);
  const [openCategory, setOpenCategory] = useState(false);
  const categoryRef = useRef(null);
  const {
    categories,
    loadingCategories,
    loading,
    error,
    success,
    createProduct,
  } = useSellerProductAdd();

  useEffect(() => {
    function handleClickOutside(event) {
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setOpenCategory(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function onChangeField(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function onSelectImages(event) {
    const pickedFile = event.target.files?.[0];
    if (!pickedFile) return;

    setImages((prev) => {
      if (prev.length >= 5) return prev;
      const alreadyExists = prev.some(
        (file) =>
          file.name === pickedFile.name &&
          file.size === pickedFile.size &&
          file.lastModified === pickedFile.lastModified
      );
      if (alreadyExists) return prev;
      return [...prev, pickedFile];
    });

    // Allow re-selecting the same file after removal.
    event.target.value = "";
  }

  function onRemoveImage(indexToRemove) {
    setImages((prev) => prev.filter((_, index) => index !== indexToRemove));
  }

  const selectedCategoryLabel =
    categories.find((category) => category._id === form.category)?.name ||
    (loadingCategories ? "Loading..." : "Select category");

  async function onSubmit(event) {
    event.preventDefault();
    const created = await createProduct({ ...form, images });
    if (created) {
      setForm(initialForm);
      setImages([]);
    }
  }

  return (
    <ProductAddForm
      form={form}
      images={images}
      categories={categories}
      loadingCategories={loadingCategories}
      loading={loading}
      error={error}
      success={success}
      openCategory={openCategory}
      categoryRef={categoryRef}
      selectedCategoryLabel={selectedCategoryLabel}
      onChangeField={onChangeField}
      onToggleCategory={() => {
        if (!loadingCategories) setOpenCategory((v) => !v);
      }}
      onSelectCategory={(categoryId) => {
        setForm((prev) => ({ ...prev, category: categoryId }));
        setOpenCategory(false);
      }}
      onSelectImages={onSelectImages}
      onRemoveImage={onRemoveImage}
      onSubmit={onSubmit}
    />
  );
}
