import React from 'react'
import MainLayout from '../../../components/layouts/MainLayout';
import Button from '../../../components/ui/Button';
import useProducts from '../../../hooks/useProducts';
import useUsers from '../../../hooks/useUsers';
import { useParams } from 'react-router-dom';
import RatingStars from '../../../components/common/RatingStars';

const apiOrigin = (process.env.REACT_APP_API_URL || "http://localhost:5000/api").replace(/\/api$/, "");
const ProductDetail = () => {
    const { id } = useParams();
    const { product } = useProducts(id);
    const { seller } = useUsers(product?.seller);

    const [quantity, setQuantity] = React.useState(1);
    const [galleryImages, setGalleryImages] = React.useState([]);

    const [activeTab, setActiveTab] = React.useState("details");
    React.useEffect(() => {
        setGalleryImages(Array.isArray(product?.images) ? product.images : []);
    }, [product?.images]);

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

    return (
        <MainLayout>
            <section className='my-24  mx-6 md:px-0 md:mx-24 md:my-32 '>
                <section className='md:flex md:gap-4 '>
                    <div className=' w-full md:w-1/2 rounded-3xl flex flex-col gap-1 p-0'>
                        <div className='w-5/6 h-64 rounded-3xl overflow-hidden flex items-center justify-center'>
                            <img
                                src={resolveImageUrl(galleryImages[0])}
                                alt={product?.title}
                                className='w-auto h-auto object-cover rounded-3xl'
                            />
                        </div>
                        <div className='flex flex-row gap-2   '>
                            {galleryImages.slice(1).map((img, index) => (
                                <div key={`${img}-${index}`} className='w-20 h-20  rounded-3xl overflow-hidden flex items-center justify-center mt-0'>
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
                        <div className=' md:flex '>
                            <div className='w-16 h-16 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center'>
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
                            <p className='text-gray-700 mb-3 '>{product?.category.description}</p>
                            <p className='text-xl font-bold font-nexa mb-4'>{product?.price} MAD </p>
                            <div className='flex items-center gap-2 mb-4'>
                                <RatingStars product={product} />
                            </div>
                            <div className='flex gap-6'>
                                <div className='flex items-center gap-3'>
                                    <input type='submit' onClick={() => { quantity > 0 ? setQuantity(quantity - 1) : setQuantity(0) }} value="-"
                                        className=" text-white-intense px-3 py-1 rounded mr-2"
                                        style={{ background: "linear-gradient(to right, #1E5A2A, #5F9A62)" }}
                                    />
                                    <p className="text-lg bg-green-dark text-white-intense rounded-full 
                                    w-8 h-8 flex items-center justify-center">{quantity}</p>

                                    <input type='submit' onClick={() => { setQuantity(quantity + 1) }} value="+"
                                        className=" text-white-intense px-3 py-1 rounded ml-2"
                                        style={{ background: "linear-gradient(to right, #5F9A62, #1E5A2A)" }}
                                    />
                                </div>
                                <Button className='bg-green-medium text-white-intense font-nexa px-5 py-3 rounded'>Add to Cart</Button>
                            </div>
                        </div>
                    </div>
                </section>
                <section className='bg-green-light rounded-3xl mt-3 border border-green-dark h-64 max-h-64 overflow-hidden'>
                    <div className='bg-green-medium rounded-full flex '>
                        <button
                            onClick={() => setActiveTab("details")}
                            className={`w-1/2 py-3 rounded-full font-nexa font-bold border transition-all duration-200
                            ${activeTab === "details"
                                    ? "bg-white-intense text-green-dark border-green-medium"
                                    : "text-white-intense border-transparent"
                                }`}
                        >
                            Details
                        </button>

                        <button
                            onClick={() => setActiveTab("reviews")}
                            className={`w-1/2 py-3 rounded-full font-nexa font-bold border transition-all duration-200
                            ${activeTab === "reviews"
                                    ? "bg-white-intense text-green-dark border-green-medium"
                                    : "text-white-intense border-transparent"
                                }`}
                        >
                            Reviews
                        </button>
                    </div>
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
                                                    <img
                                                        src={review.client.profileUrl ? (review.client.profileUrl.startsWith("http")
                                                            ? review.client.profileUrl
                                                            : `${apiOrigin}${review.client.profileUrl}`) : "/assets/images/placeholder_user.png"}
                                                        alt={review.client.fullName}
                                                        className="w-full h-full object-cover rounded-full"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold">{review.client.userId.firstName }</p>
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
                <section></section>
            </section>
        </MainLayout>
    )
}

export default ProductDetail
