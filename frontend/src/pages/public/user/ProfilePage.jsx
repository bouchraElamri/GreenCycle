import MainLayout from '../../../components/layouts/MainLayout';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import useUsers from '../../../hooks/useUsers';
import defaultSellerAvatar from '../../../assets/profile-picture.png';
import headerBackground from '../../../assets/Cover.png';
import useProducts from '../../../hooks/useProducts';
import ProductCard from '../../../components/common/ProductCard';
import Pagination from '../../../components/common/Pagination';

const ProfilePage = () => {
    const { id } = useParams();
    const { seller, loading, error } = useUsers(id);
    const { products, loading: productsLoading } = useProducts(null, null, id);
    const [currentPage, setCurrentPage] = useState(1);
    const apiOrigin = (process.env.REACT_APP_API_URL || 'http://localhost:5000/api').replace(/\/api\/?$/, '');
    const productsPerPage = 4;

    const normalizedProducts = useMemo(() => {
        if (Array.isArray(products)) return products;
        if (Array.isArray(products?.data)) return products.data;
        return [];
    }, [products]);

    const totalPages = useMemo(
        () => Math.max(1, Math.ceil(normalizedProducts.length / productsPerPage)),
        [normalizedProducts.length]
    );

    const currentProducts = useMemo(() => {
        const startIndex = (currentPage - 1) * productsPerPage;
        return normalizedProducts.slice(startIndex, startIndex + productsPerPage);
    }, [normalizedProducts, currentPage]);

    useEffect(() => {
        setCurrentPage(1);
    }, [id]);

    useEffect(() => {
        if (currentPage > totalPages) setCurrentPage(totalPages);
    }, [currentPage, totalPages]);

    const resolveImageUrl = (rawPath) => {
        if (!rawPath) return '';

        const normalized = String(rawPath).replace(/\\/g, '/');
        if (normalized.startsWith('http')) return normalized;

        const uploadsIndex = normalized.indexOf('/uploads/');
        if (uploadsIndex >= 0) return `${apiOrigin}${normalized.slice(uploadsIndex)}`;

        if (normalized.startsWith('uploads/')) return `${apiOrigin}/${normalized}`;

        return `${apiOrigin}${normalized.startsWith('/') ? normalized : `/${normalized}`}`;
    };

    const SellerName = `${seller?.fullName}`;
    const description = seller?.description || 'Here the user can implement a marketing text to attract his customer regarding his style or his product kind that he sells';
    const sellerProfilePath = seller?.profileImage || seller?.user?.profileImage || seller?.profileUrl || seller?.user?.profileUrl;
    const profileImage = resolveImageUrl(sellerProfilePath) || defaultSellerAvatar;

    if (loading) {
        return (
            <MainLayout>
                <section className="mt-24 mx-6 md:mx-24 text-center font-nexa text-gray-600">
                    Loading profile...
                </section>
            </MainLayout>
        );
    }

    if (error) {
        return (
            <MainLayout>
                <section className="mt-24 mx-6 md:mx-24 text-center font-nexa text-red-600">
                    {error}
                </section>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <section className='my-24  mx-6 md:px-0 md:mx-24 md:my-32'>
                <section className="">
                    <article className="mx-auto overflow-hidden bg-white-intense rounded-3xl ">
                        <div className="relative w-full h-[180px] sm:h-[205px]">
                            <img
                                src={headerBackground}
                                alt="Profile cover"
                                className="h-full w-full object-cover"
                            />
                            <div className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-b from-transparent via-[#2c7b66]/30 to-[#f7f7f7]" />
                        </div>

                        <div className="relative pb-10 px-5 text-center font-nexa">
                            <div className="absolute left-1/2 -top-[67px] -translate-x-1/2">
                                <div className="w-[122px] h-[122px] rounded-full p-[3px] bg-[#d8e9e6] shadow-[0_10px_22px_rgba(0,0,0,0.18)]">
                                    <img
                                        src={profileImage}
                                        alt={SellerName}
                                        className="h-full w-full rounded-full object-cover"
                                    />
                                </div>
                            </div>

                            <h1 className="pt-[72px] text-3xl sm:text-4xl leading-none font-bold text-gray-800">
                                {SellerName}
                            </h1>

                            <p className="mt-7 text-green-dark text-base sm:text-xl md:text-lg leading-[1.28]  mx-auto px-2">
                                {description}
                            </p>
                        </div>
                    </article>
                </section>
                <section className="">
                    <div className=" mx-auto">
                        <div className="bg-green-medium rounded-full ">
                            <h2 className=" text-white-intense font-semibold font-nexa text-lg text-center py-2">
                                Products
                            </h2>
                        </div>
                        {(
                            <div className="mt-8">
                                {
                                    productsLoading ? (
                                        <p className="mt-6 text-center font-nexa text-gray-600">Loading products...</p>
                                    ) :
                                        currentProducts.length > 0 ? (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
                                                {currentProducts.map((product) => (
                                                    <ProductCard key={product._id} product={product} />
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-center font-nexa text-gray-600 py-6">
                                                This seller has no products yet.
                                            </p>
                                        )
                                }
                            </div>
                        )}
                        {!productsLoading && normalizedProducts.length > productsPerPage && (
                            <Pagination
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                totalPages={totalPages}
                            />
                        )}
                    </div>
                    
                </section>
            </section>
        </MainLayout>
    )
}

export default ProfilePage
