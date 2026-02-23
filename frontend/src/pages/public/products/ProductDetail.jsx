import React from 'react'
import MainLayout from '../../../components/layouts/MainLayout';
import Button from '../../../components/ui/Button';
import ProductCard from '../../../components/common/ProductCard';
import Pagination from '../../../components/common/Pagination';
import Tabs from '../../../components/common/Tabs';
import useProducts from '../../../hooks/useProducts';
import useUsers from '../../../hooks/useUsers';
import useCartActions from '../../../hooks/useCartActions';
import { useParams } from 'react-router-dom';
import RatingStars from '../../../components/common/RatingStars';

const apiOrigin = (process.env.REACT_APP_API_URL || "http://localhost:5000/api").replace(/\/api$/, "");
const ProductDetail = () => {
    const { id } = useParams();
    const { product } = useProducts(id);
    const { productsRelated } = useProducts(null, product?.category?.name);
    const { addProductToCart, adding } = useCartActions();

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
        await addProductToCart({
            productId: product._id,
            quantity: Math.max(1, quantity),
        });
    };

    return (
        <MainLayout>
            <section className='my-24  mx-6 md:px-0 md:mx-24 md:my-32 '>
                <section className='md:flex md:gap-4 '>
                    <div className=' w-full md:w-1/2 rounded-3xl flex flex-col gap-1 p-0'>
                        <div className='md:w-5/6 md:h-64 w-96 rounded-3xl overflow-hidden flex items-center justify-center'>
                            <img
                                src={resolveImageUrl(galleryImages[0])}
                                alt={product?.title}
                                className='w-auto h-auto object-cover rounded-3xl'
                            />
                        </div>
                        <div className='flex flex-row gap-2 ml-2 md:ml-0 mt-2 md:mt-0    '>
                            {galleryImages.slice(1).map((img, index) => (
                                <div key={`${img}-${index}`} className='w-20 h-20 rounded-3xl overflow-hidden flex md:items-center md:justify-center mt-0'>
                                    <img
                                        src={resolveImageUrl(img)}
                                        alt={`Product ${index + 1}`}
                                        className='w-full h-full object-cover rounded-3xl cursor-pointer'
                                        onClick={() => handleThumbnailClick(index)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className='w-full md:w-1/2'>
                        <div className=' flex '>
                            <div className='w-16 h-16 mt-4 md:mt-0 rounded-full bg-gray-200 overflow-hidden flex md:items-center md:justify-center'>
                                <img src={
                                    seller?.profileUrl ? (seller.profileUrl.startsWith("http")
                                        ? seller.profileUrl
                                        : `${apiOrigin}${seller.profileUrl}`) : "/assets/images/placeholder_user.png"
                                } alt={seller?.fullName} className='w-full h-full object-cover rounded-full' />
                            </div>
                            <div className='ml-4 flex flex-row justify-center'>
                                <div className='flex flex-col justify-center'>
                                    <p className='text-lg font-semibold'>{seller?.fullName}</p>
                                    <p className='text-gray-500 text-sm'>{seller?.email}</p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h1 className='text-2xl font-nexa font-bold mt-4 mb-4'>{product?.name}</h1>
                            <Button className='bg-green-light text-gray-900 hover:bg-green-light px-4 py-2 rounded mb-2' >
                                {product?.category.name} </Button>
                            <p className='text-gray-700 mb-2 font-nexa'>Quantity: {product?.quantity}</p>
                            <p className='text-xl font-bold font-nexa mb-3'>{product?.price} MAD </p>
                            <div className='flex items-center gap-2 mb-4'>
                                <RatingStars product={product} />
                            </div>
                            <div className='flex gap-14 md:gap-6'>
                                <div className='flex items-center gap-3'>
                                    <input type='submit' onClick={() => { quantity > 0 ? setQuantity(quantity - 1) : setQuantity(0) }} value="-"
                                        className=" text-white-intense px-3 py-1 rounded mr-2"
                                        style={{ background: "linear-gradient(to right, #1E5A2A, #5F9A62)" }}
                                    />
                                    <p className="text-lg bg-green-dark text-white-intense rounded-full 
                                    w-8 h-8 flex items-center justify-center">{quantity}</p>

                                    <input type='submit' onClick={() => { quantity < product?.quantity ? setQuantity(quantity + 1) : setQuantity(product?.quantity || 10) }} value="+"
                                        className=" text-white-intense px-3 py-1 rounded ml-2"
                                        style={{ background: "linear-gradient(to right, #5F9A62, #1E5A2A)" }}
                                    />
                                </div>
                                <Button
                                    onClick={handleAddToCart}
                                    disabled={adding}
                                    className='bg-green-medium text-white-intense font-nexa px-5 py-3 rounded disabled:opacity-60'
                                >
                                    {adding ? "Adding..." : "Add to Cart"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>
                <section className=' rounded-3xl mt-4 border border-green-dark h-64 max-h-64 overflow-hidden'
                    style={{ background: "linear-gradient(to bottom, #C4E6C9, #FFFFFF)" }}
                >
                    <Tabs
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        tabs={[
                            { label: "Details", value: "details" },
                            { label: "Reviews", value: "reviews" },
                        ]}
                    />
                    <div className=' p-4'>
                        {activeTab === "details" ? (
                            <div className="text-green-dark overflow-y-auto h-48">
                                <p>{product?.description}</p>
                            </div>
                        ) : (
                            <div className=" overflow-y-auto h-48 ">
                                {product?.comments?.length > 0 ? (
                                    product.comments.map((review) => (
                                        <div key={review._id} className="mb-4 border-b pb-2">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">

                                                    {review?.client?.profileUrl && (
                                                        <img
                                                            src={review.client.profileUrl.startsWith("http")
                                                                ? review.client.profileUrl
                                                                : `${apiOrigin}${review.client.profileUrl}`}
                                                            alt={`${review?.client?.userId?.firstName || ""} ${review?.client?.userId?.lastName || ""}`.trim()}
                                                            className="w-full h-full object-cover rounded-full"
                                                        />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold">{review.client.userId.firstName} {review.client.userId.lastName}</p>
                                                    <RatingStars rating={review.rating} />
                                                </div>
                                            </div>
                                            <p className="text-gray-700">{review.text}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-700">No reviews yet.</p>
                                )}
                            </div>
                        )}
                    </div>
                </section>
                <section>
                    <h2 className='text-green-dark text-2xl font-nexa font-bold mt-8 mb-4 text-center'>Related Products</h2>
                    <div>
                        {currentProducts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                                {currentProducts.map((relatedProduct) => (
                                    <ProductCard key={relatedProduct._id} product={relatedProduct} />
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-700">No related products found.</p>
                        )}
                    </div>
                    {totalPages > 1 && (
                        <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />
                    )}
                </section>
            </section>
        </MainLayout>
    )
}

export default ProductDetail
