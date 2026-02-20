import React from 'react'
import MainLayout from '../../../components/layouts/MainLayout';
import useProducts from '../../../hooks/useProducts';
import { useParams } from 'react-router-dom';
const apiOrigin = (process.env.REACT_APP_API_URL || "http://localhost:5000/api").replace(/\/api$/, "");

const ProductDetail = () => {
    const { id } = useParams();
    const { product ,loading } = useProducts(id);
    console.log(product);
    if (loading) {
        return <div className="text-center py-12">Loading...</div>;
    }
    return (
        <MainLayout>
            <section className='my-24  mx-6 md:px-0 md:mx-24 md:my-32 '>
                <section className='md:flex md:gap-4 '>
                    <div className=' w-full md:w-1/2 bg-gray-800 rounded-3xl flex flex-col gap-2 p-0'>
                        <div className='w-5/6 h-72 bg-gray-200 rounded-3xl overflow-hidden flex items-center justify-center'>
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
                                    <div key={index} className='w-20 h-20 bg-gray-200 rounded-3xl overflow-hidden flex items-center justify-center mt-0'>
                                        <img src={img.startsWith("http")
                                                ? img
                                                : `${apiOrigin}${img}`
                                        } alt={`Product ${index + 1}`} className='w-full h-full object-cover rounded-3xl' />
                                    </div>
                                ))}
                            </div>
                    </div>
                    <div className='w-full md:w-1/2'>
                    <div>
                        
                    </div>
                        <h1 className='text-2xl font-bold mb-4'>{product?.name}</h1>
                        <p className='text-gray-700 mb-4'>{product?.description}</p>
                        <p className='text-xl font-semibold mb-4'>${product?.price}</p>
                        <button className='bg-blue-500 text-white px-4 py-2 rounded'>Add to Cart</button>
                    </div>

                </section>
                <section></section>
                <section></section>
            </section>
        </MainLayout>
    )
}

export default ProductDetail