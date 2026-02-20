import React from 'react'
import MainLayout from '../../../components/layouts/MainLayout';
import useProducts from '../../../hooks/useProducts';
import useUsers from '../../../hooks/useUsers';
import { useParams } from 'react-router-dom';
const apiOrigin = (process.env.REACT_APP_API_URL || "http://localhost:5000/api").replace(/\/api$/, "");


const ProductDetail = () => {
    const { id } = useParams();
    const { product, loading } = useProducts(id);
    const { seller } = useUsers(product?.seller);
    const rated = "https://icons8.com/icon/19416/star-filled?color=AEF2C3"; 
    const unrated = "https://icons8.com/icon/19416/star-filled?color=ffffff?stroke=AEF2C3";
    if (loading) {
        return <div className="text-center py-12">Loading...</div>;
    }
    return (
        <MainLayout>
            <section className='my-24  mx-6 md:px-0 md:mx-24 md:my-64 '>
                <section className='md:flex md:gap-4 '>
                    <div className=' w-full md:w-1/2 rounded-3xl flex flex-col gap-2 p-0'>
                        <div className='w-5/6 h-72 rounded-3xl overflow-hidden flex items-center justify-center'>
                            <img src={
                                product?.images?.[0]
                                    ? product.images[0].startsWith("http")
                                        ? product.images[0]
                                        : `${apiOrigin}${product.images[0]}`
                                    : "/assets/images/placeholder_product.png"
                            } alt={product?.title} className='w-auto h-auto object-cover rounded-3xl' />
                        </div>
                        <div className='flex flex-row gap-2 mt-3  '>
                            {product?.images?.slice(1).map((img, index) => (
                                <div key={index} className='w-20 h-20  rounded-3xl overflow-hidden flex items-center justify-center mt-0'>
                                    <img src={img.startsWith("http")
                                        ? img
                                        : `${apiOrigin}${img}`
                                    } alt={`Product ${index + 1}`} className='w-full h-full object-cover rounded-3xl' />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className='w-full md:w-1/2'>
                        <div className=' md:flex '>
                            <div className='w-16 h-16 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center'>
                                <img src={
                                    seller?.profileUrl? (seller.profileUrl.startsWith("http")
                                        ? seller.profileUrl
                                        : `${apiOrigin}${seller.profileUrl}`) : "/assets/images/placeholder_user.png"
                                } alt={seller?.fullName} className='w-full h-full object-cover rounded-full' />
                            </div>
                            <div className='ml-4 flex flex-row justify-center'>
                                <div className='flex flex-col justify-center'>
                                    <p className='text-lg font-semibold'>{seller?.fullName}</p>
                                <p className='text-gray-500 text-sm'>{seller?.email}</p>
                                </div>
                                
                                {seller?.rating && (
                                    <div className='flex items-center ml-3 '>
                                        {[...Array(5)].map((_, i) => (
                                            <img
                                                key={i}
                                                src={i < Math.round(seller.rating) ? rated : unrated}
                                                alt={i < Math.round(seller.rating) ? "Rated" : "Unrated"}
                                                className='w-4 h-4'
                                            />
                                        ))}
                                        <span className='text-gray-500 text-sm ml-2'>({seller.rating.toFixed(1)})</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div>
                            <h1 className='text-2xl font-bold mb-4'>{product?.name}</h1>
                            <p className='text-gray-700 mb-4'>{product?.description}</p>
                            <p className='text-xl font-semibold mb-4'>${product?.price}</p>
                            <button className='bg-blue-500 text-white px-4 py-2 rounded'>Add to Cart</button>
                        </div>
                    </div>

                </section>
                <section></section>
                <section></section>
            </section>
        </MainLayout>
    )
}

export default ProductDetail
