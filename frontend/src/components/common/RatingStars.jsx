
import unrated from "../../assets/icons8-star-50.png";
export default function RatingStars({ product, rating }) {
    const rated = "https://img.icons8.com/?size=100&id=19416&format=png&color=AEF2C3";
    const sourceRating = Number(
        rating ?? product?.rating?.average ?? 0
    );
    const normalizedRating = Math.max(0, Math.min(5, Math.round(sourceRating)));


    return (
        <div className='flex items-center gap-1'>
            {Array(5).fill(0).map((_, index) => (
                <img
                    key={index}
                    src={index < normalizedRating ? rated : unrated}
                    alt="Star"
                    className='w-5 h-5'
                />
            ))}

        </div>
    )
}
