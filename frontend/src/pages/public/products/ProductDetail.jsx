import React from 'react'
import MainLayout from '../../../components/layouts/MainLayout';
import useProducts from '../../../hooks/useProducts';
import useUsers from '../../../hooks/useUsers';
import useCartActions from '../../../hooks/useCartActions';
import { useNavigate, useParams , Link} from 'react-router-dom';
import { RiArrowLeftLine } from "react-icons/ri";
import defaultSellerAvatar from "../../../assets/profile-picture.png";
import toast from 'react-hot-toast';
import ProductMediaGallery from './components/ProductMediaGallery';
import ProductSummaryPanel from './components/ProductSummaryPanel';
import ProductDetailsTabs from './components/ProductDetailsTabs';
import RelatedProductsSection from './components/RelatedProductsSection';

const apiOrigin = (process.env.REACT_APP_API_URL || "http://localhost:5000/api").replace(/\/api$/, "");
const ProductDetail = () => {
    const { id } = useParams();
    const { product } = useProducts(id);
    const { productsRelated } = useProducts(null, product?.category?.name);
    const { addProductToCart, adding } = useCartActions();
    const navigate = useNavigate();

    const { seller } = useUsers(product?.seller);

    const [quantity, setQuantity] = React.useState(1);
    const [galleryImages, setGalleryImages] = React.useState([]);
    const [currentPage, setCurrentPage] = React.useState(1);

    const [activeTab, setActiveTab] = React.useState("details");
    const relatedProducts = React.useMemo(
        () => (productsRelated || []).filter((relatedProduct) => relatedProduct._id !== id),
        [productsRelated, id]
    );
    const productsPerPage = 6;
    const totalPages = React.useMemo(
        () => Math.max(1, Math.ceil(relatedProducts.length / productsPerPage)),
        [relatedProducts.length]
    );
    const currentProducts = React.useMemo(() => {
        const startIndex = (currentPage - 1) * productsPerPage;
        return relatedProducts.slice(startIndex, startIndex + productsPerPage);
    }, [relatedProducts, currentPage]);

    React.useEffect(() => {
        setGalleryImages(Array.isArray(product?.images) ? product.images : []);
    }, [product?.images]);
    React.useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);
    React.useEffect(() => {
        setCurrentPage(1);
    }, [product?.category?.name, id]);

    const resolveImageUrl = (path) => {
        if (!path) return "/assets/images/placeholder_product.png";
        return path.startsWith("http") ? path : `${apiOrigin}${path}`;
    };

    const resolveSellerImageUrl = (path) => {
        if (!path) return defaultSellerAvatar;
        return path.startsWith("http") ? path : `${apiOrigin}${path}`;
    };

    const handleThumbnailClick = (smallIndex) => {
        setGalleryImages((prev) => {
            const clickedIndex = smallIndex + 1;
            if (!prev[clickedIndex]) return prev;
            const next = [...prev];
            [next[0], next[clickedIndex]] = [next[clickedIndex], next[0]];
            return next;
        });
    };

    const handleAddToCart = async () => {
        if (!product?._id) return;
        try {
            const response = await addProductToCart({
                productId: product._id,
                quantity: Math.max(1, quantity),
            });
            if (!response?.redirectedToLogin) {
                toast.success('Product added to cart successfully');
            }
        } catch (err) {
            toast.error(err?.message || 'Failed to add product to cart');
        }
    };

    return (
        <MainLayout>
            <section className='my-24  mx-6 md:px-0 md:mx-24 md:my-28 '>
                 <Link
                  to="/product_list"
                  aria-label="Back to product list"
                  className='mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full border
                   border-green-dark text-green-dark bg-white-intense transition-all duration-300 
                   hover:border-white-intense hover:bg-green-dark hover:text-white-intense 
                   hover:opacity-80 md:h-12 md:w-12' >
                    <RiArrowLeftLine size={16} />
                </Link>
                <section className='md:flex md:gap-4 '>
                    <ProductMediaGallery
                        galleryImages={galleryImages}
                        productName={product?.name || product?.title}
                        resolveImageUrl={resolveImageUrl}
                        onThumbnailClick={handleThumbnailClick}
                    />
                    <ProductSummaryPanel
                        seller={seller}
                        product={product}
                        quantity={quantity}
                        setQuantity={setQuantity}
                        adding={adding}
                        onAddToCart={handleAddToCart}
                        onSellerClick={() => navigate("/profile/" + seller?._id)}
                        resolveSellerImageUrl={resolveSellerImageUrl}
                    />
                </section>
                <ProductDetailsTabs
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    product={product}
                    apiOrigin={apiOrigin}
                />
                <RelatedProductsSection
                    currentProducts={currentProducts}
                    totalPages={totalPages}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                />
            </section>
        </MainLayout>
    )
}

export default ProductDetail
