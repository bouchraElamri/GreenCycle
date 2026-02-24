import React, { memo } from "react";
import Tabs from "../../../../components/common/Tabs";
import RatingStars from "../../../../components/common/RatingStars";

function ProductDetailsTabs({ activeTab, setActiveTab, product, apiOrigin }) {
  return (
    <section
      className="rounded-3xl mt-4 border border-green-dark h-64 max-h-64 overflow-hidden"
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
      <div className="p-4">
        {activeTab === "details" ? (
          <div className="text-green-dark overflow-y-auto h-48">
            <p>{product?.description}</p>
          </div>
        ) : (
          <div className="overflow-y-auto h-48">
            {product?.comments?.length > 0 ? (
              product.comments.map((review) => (
                <div key={review._id} className="mb-4 border-b pb-2">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                      {review?.client?.profileUrl && (
                        <img
                          src={
                            review.client.profileUrl.startsWith("http")
                              ? review.client.profileUrl
                              : `${apiOrigin}${review.client.profileUrl}`
                          }
                          alt={`${review?.client?.userId?.firstName || ""} ${
                            review?.client?.userId?.lastName || ""
                          }`.trim()}
                          className="w-full h-full object-cover rounded-full"
                        />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">
                        {review.client.userId.firstName} {review.client.userId.lastName}
                      </p>
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
  );
}

export default memo(ProductDetailsTabs);
