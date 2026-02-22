import { memo } from "react";
import Button from "../ui/Button";
import { ReactComponent as YourSvg } from "../../assets/Logo-category.svg";

function ProductFiltring({
    categories,
    loadingCat,
    catRef,
    selectedCategory,
    setSelectedCategory,
    setSelectedCategoryId,
    openCategory,
    min,
    max,
    minValue,
    maxValue,
    setMinValue,
    setMaxValue,
    minPercent,
    maxPercent,
    setOpenCategory,
    onShowResult,
    onResetFilters,
}) {
    const safeMinPercent = Number.isFinite(minPercent)
        ? Math.min(Math.max(minPercent, 0), 100)
        : 0;
    const safeMaxPercent = Number.isFinite(maxPercent)
        ? Math.min(Math.max(maxPercent, 0), 100)
        : 100;

    return (
        <section className="relative w-full rounded-3xl overflow-visible md:w-80 md:overflow-hidden md:min-h-[640px] md:h-auto md:self-start pt-7">
            <img
                src={"/assets/images/product_filtring.png"}
                alt="background"
                className="absolute inset-0 w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-white-intense/85 pointer-events-none" />

            <div className="relative h-full flex flex-col items-center
           justify-center text-black text-center py-6 px-4 md:pt-10 md:pb-6 md:px-6">
                <h1 className="text-2xl font-nexa font-semibold ">Craft your path</h1>
                <p className="text-sm mt-1 font-nexa ">Curated Sustainable Selection</p>

                <div className="my-9 w-full text-left">
                    <p className="text-base mb-4 font-nexa text-green-dark">Category</p>
                    <div ref={catRef} className=" ">
                        <button
                            onClick={() => setOpenCategory((v) => !v)}
                            className="w-full bg-white-intense text-green-dark px-4 py-2 text-xs font-nexa 
                    rounded-full flex justify-between items-center h-8"
                        ><span> <YourSvg className="flex" /> </span>
                            {selectedCategory}
                            <span>▼</span>
                        </button>

                        {openCategory && (
                            <div
                                className="absolute mt-2 w-full bg-white-intense rounded-2xl text-xs font-nexa
                                  hadow-lg z-10 max-h-40 overflow-y-auto">
                                {loadingCat && <div className="px-3 py-2 text-gray-600 text-center">Loading...</div>}

                                {!loadingCat &&
                                    categories?.map((cat) => (
                                        <div
                                            key={cat._id}
                                            onClick={() => {
                                                setSelectedCategory(cat.name);
                                                setSelectedCategoryId(cat._id);
                                                setOpenCategory(false);
                                            }}
                                            className="px-3 py-2 hover:bg-white-broken cursor-pointer text-gray-700"
                                        >
                                            {cat.name}
                                        </div>
                                    ))}
                            </div>
                        )}

                    </div>
                </div>
                <div className="w-full py-4 text-left pt-1 pb-4">
                    <p className="text-md font-nexa text-green-dark mb-4">Price</p>

                    {/* MIN */}
                    <label className="text-xs font-nexa text-gray-600">min</label>
                    <div className="relative w-full mb-6">
                        <input
                            type="range"
                            min={min}
                            max={max}
                            value={minValue}
                            onChange={(e) => setMinValue(Number(e.target.value))}
                            className="w-full appearance-none bg-transparent pointer-events-auto"
                            style={{
                                background: `linear-gradient(to right, 
          #4F8F5B 0%, 
          #4F8F5B ${safeMinPercent}%, 
          #E5E5E5 ${safeMinPercent}%, 
          #E5E5E5 100%)`
                            }}
                        />

                        <div
                            className="absolute text-xs font-nexa text-gray-600"
                            style={{ left: `${safeMinPercent}%`, transform: "translateX(-50%)" }}
                        >
                            {minValue}
                        </div>
                    </div>

                    {/* MAX */}
                    <label className="text-xs font-nexa text-gray-600">max</label>
                    <div className="relative w-full">
                        <input
                            type="range"
                            min={min}
                            max={max}
                            value={maxValue}
                            onChange={(e) => setMaxValue(Number(e.target.value))}
                            className="w-full appearance-none bg-transparent"
                            style={{
                                background: `linear-gradient(to right, 
          #4F8F5B 0%, 
          #4F8F5B ${safeMaxPercent}%, 
          #E5E5E5 ${safeMaxPercent}%, 
          #E5E5E5 100%)`
                            }}
                        />

                        <div
                            className="absolute text-xs font-nexa text-gray-600"
                            style={{ left: `${safeMaxPercent}%`, transform: "translateX(-50%)" }}
                        >
                            {maxValue}
                        </div>
                    </div>
                </div>
                <div className="w-full pointer-events-auto mt-4">
                    <Button
                        onClick={onShowResult}
                        base="w-full justify-center px-8 h-8 text-center font-nexa text-sm"
                        variant="green"
                    >
                        Show result
                    </Button>
                    <Button
                        onClick={onResetFilters}
                        base="w-full justify-center px-8 h-8 text-center font-nexa text-sm mt-2"
                        variant="white"
                    >
                        Reset filters
                    </Button>
                </div>
            </div>
        </section>
    )
}

export default memo(ProductFiltring);
