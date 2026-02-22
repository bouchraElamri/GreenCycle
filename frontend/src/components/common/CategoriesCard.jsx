import React from "react";
import { Link } from "react-router-dom";

const CategoriesCard = ({ title, image, className = "" }) => {
  return (
    <Link to="/product_list" className="group block">
      <article
        className={`relative overflow-hidden rounded-[40px] shadow-sm ${className}`}
      >
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
          loading="lazy"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-green-dark/80 via-green-dark/20 to-transparent" />

        <div className="absolute bottom-5 left-5 right-3 z-10">
          <h3 className="whitespace-pre-line font-nexa text-white-intense text-[28px] md:text-[32px] 2xl:text-[40px] leading-[0.95] tracking-tight">
            {title}
          </h3>
        </div>
      </article>
    </Link>
  );
};

export default CategoriesCard;
