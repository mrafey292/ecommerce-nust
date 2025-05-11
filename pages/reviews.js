import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get("/api/reviews")
      .then((response) => {
        setReviews(response.data);
      })
      .catch((error) => {
        console.error("Error fetching reviews:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Reviews</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-cyan-800 text-white">
              <th className="border border-gray-200 px-4 py-2 text-left">
                Name
              </th>
              <th className="border border-gray-200 px-4 py-2 text-left">
                Email
              </th>
              <th className="border border-gray-200 px-4 py-2 text-left">
                Rating
              </th>
              <th className="border border-gray-200 px-4 py-2 text-left">
                Notes
              </th>
              <th className="border border-gray-200 px-4 py-2 text-left">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {reviews.length > 0 &&
              reviews.map((review) => (
                <tr key={review._id} className="hover:bg-gray-50 transition-colors">
                  <td className="border border-gray-200 px-4 py-2 text-gray-700">
                    {review.name}
                  </td>
                  <td className="border border-gray-200 px-4 py-2 text-gray-700">
                    {review.email}
                  </td>
                  <td className="border border-gray-200 px-4 py-2 text-gray-700">
                    {review.rating} / 5
                  </td>
                  <td className="border border-gray-200 px-4 py-2 text-gray-700">
                    {review.notes || "No notes"}
                  </td>
                  <td className="border border-gray-200 px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded-full text-sm font-medium ${
                        review.status === "approved"
                          ? "bg-green-100 text-green-600"
                          : review.status === "pending"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {review.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            {reviews.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  No reviews found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}