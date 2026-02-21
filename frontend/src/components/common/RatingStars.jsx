
import unrated from "../../assets/icons8-star-50.png";
export default function RatingStars({ product }) {
    const rated = "https://img.icons8.com/?size=100&id=19416&format=png&color=AEF2C3";


    return (
        <div className='flex items-center gap-1'>
            {product?.rating?.average === 0 ?
                Array(5).fill(0).map((_, index) => (
                    <img key={index} src={unrated} alt="Unrated Star" className='w-5 h-5' />
                )) :
                product?.rating?.average === 1 ?
                    Array(5).fill(0).map((_, index) => (
                        <img key={index} src={index < 1 ? rated : unrated} alt="Star" className='w-5 h-5' />
                    )) :
                    product?.rating?.average === 2 ?
                        Array(5).fill(0).map((_, index) => (
                            <img key={index} src={index < 2 ? rated : unrated} alt="Star" className='w-5 h-5' />
                        )) :
                        product?.rating?.average === 3 ?
                            Array(5).fill(0).map((_, index) => (
                                <img key={index} src={index < 3 ? rated : unrated} alt="Star" className='w-5 h-5' />
                            )) :
                            product?.rating?.average === 4 ?
                                Array(5).fill(0).map((_, index) => (
                                    <img key={index} src={index < 4 ? rated : unrated} alt="Star" className='w-5 h-5' />
                                )) :
                                Array(5).fill(0).map((_, index) => (
                                    <img key={index} src={index < 5 ? rated : unrated} alt="Star" className='w-5 h-5' />
                                ))
            }

        </div>
    )
}