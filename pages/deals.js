import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import { withSwal } from "react-sweetalert2";
import Spinner from "@/components/Spinner";

function Deals({ swal }) {
  const [products, setProducts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [editedDeal, setEditedDeal] = useState(null);
  
  // Form states
  const [selectedProduct, setSelectedProduct] = useState("");
  const [discountType, setDiscountType] = useState("percentage"); // percentage or fixed
  const [discountAmount, setDiscountAmount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isActive, setIsActive] = useState(true);

  // Loading states
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingDeals, setLoadingDeals] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchDeals();
  }, []);

  function fetchProducts() {
    setLoadingProducts(true);
    axios.get("/api/products").then((result) => {
      setProducts(result.data);
      setLoadingProducts(false);
    }).catch(error => {
      console.error("Error fetching products:", error);
      setLoadingProducts(false);
    });
  }

  function fetchDeals() {
    setLoadingDeals(true);
    axios.get("/api/deals").then((result) => {
      setDeals(result.data);
      setLoadingDeals(false);
    }).catch(error => {
      console.error("Error fetching deals:", error);
      setLoadingDeals(false);
    });
  }

  async function saveDeal(ev) {
    ev.preventDefault();
    if (!selectedProduct || !discountAmount || !startDate || !endDate) {
      swal.fire({
        title: "Error",
        text: "Please fill in all required fields",
        icon: "error",
      });
      return;
    }

    setSaving(true);
    try {
      const data = {
        productId: selectedProduct,
        discountType,
        discountAmount: parseFloat(discountAmount),
        startDate,
        endDate,
        isActive,
      };

      if (editedDeal) {
        data._id = editedDeal._id;
        await axios.put("/api/deals", data);
        setEditedDeal(null);
      } else {
        await axios.post("/api/deals", data);
      }

      resetForm();
      fetchDeals();
    } catch (error) {
      console.error("Error saving deal:", error);
      swal.fire({
        title: "Error",
        text: "Failed to save deal. Please try again.",
        icon: "error",
      });
    } finally {
      setSaving(false);
    }
  }

  function resetForm() {
    setSelectedProduct("");
    setDiscountType("percentage");
    setDiscountAmount("");
    setStartDate("");
    setEndDate("");
    setIsActive(true);
  }

  function editDeal(deal) {
    setEditedDeal(deal);
    setSelectedProduct(deal.productId);
    setDiscountType(deal.discountType);
    setDiscountAmount(deal.discountAmount.toString());
    setStartDate(deal.startDate.split("T")[0]);
    setEndDate(deal.endDate.split("T")[0]);
    setIsActive(deal.isActive);
  }

  function deleteDeal(deal) {
    swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete this deal?`,
      showCancelButton: true,
      cancelButtonText: "Cancel",
      confirmButtonText: "Yes, Delete!",
      confirmButtonColor: "#d55",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete("/api/deals?_id=" + deal._id);
          fetchDeals();
        } catch (error) {
          console.error("Error deleting deal:", error);
          swal.fire({
            title: "Error",
            text: "Failed to delete deal. Please try again.",
            icon: "error",
          });
        }
      }
    });
  }

  return (
    <Layout>
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Deals Management</h1>
          <div className="text-sm text-gray-500">
            {deals.length} {deals.length === 1 ? 'deal' : 'deals'} total
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6 text-gray-700 border-b pb-4">
            {editedDeal ? `Edit Deal: ${products.find(p => p._id === editedDeal.productId)?.title}` : "Create New Deal"}
          </h2>
          
          <form onSubmit={saveDeal}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-2">Product</label>
                <select
                  value={selectedProduct}
                  onChange={(ev) => setSelectedProduct(ev.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  disabled={loadingProducts}
                >
                  <option value="">Select a product</option>
                  {products.map(product => (
                    <option key={product._id} value={product._id}>
                      {product.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-2">Discount Type</label>
                <select
                  value={discountType}
                  onChange={(ev) => setDiscountType(ev.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount</option>
                </select>
              </div>

              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-2">Discount Amount</label>
                <input
                  type="number"
                  value={discountAmount}
                  onChange={(ev) => setDiscountAmount(ev.target.value)}
                  placeholder={discountType === "percentage" ? "Enter percentage" : "Enter amount"}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>

              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(ev) => setStartDate(ev.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>

              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(ev) => setEndDate(ev.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>

              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <div className="flex items-center space-x-2">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(ev) => setIsActive(ev.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    <span className="ml-3 text-sm font-medium text-gray-700">
                      {isActive ? 'Active' : 'Inactive'}
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-8 pt-4 border-t">
              {editedDeal && (
                <button
                  type="button"
                  onClick={() => {
                    setEditedDeal(null);
                    resetForm();
                  }}
                  className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
              >
                {saving ? (
                  <div className="flex items-center gap-2">
                    <Spinner />
                    <span>Saving...</span>
                  </div>
                ) : (
                  <span>{editedDeal ? "Update Deal" : "Create Deal"}</span>
                )}
              </button>
            </div>
          </form>
        </div>

        {loadingDeals ? (
          <div className="flex justify-center items-center h-64">
            <Spinner />
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full border-collapse">
              <thead className="bg-cyan-800 text-white">
                <tr>
                  <th className="text-left py-3 px-4">Product</th>
                  <th className="text-left py-3 px-4">Discount</th>
                  <th className="text-left py-3 px-4">Period</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="py-3 px-4"></th>
                </tr>
              </thead>
              <tbody>
                {deals.length > 0 ? (
                  deals.map(deal => (
                    <tr key={deal._id} className="border-b hover:bg-gray-100">
                      <td className="py-3 px-4">
                        {products.find(p => p._id === deal.productId)?.title}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          {deal.discountAmount}{deal.discountType === "percentage" ? "%" : " USD"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {new Date(deal.startDate).toLocaleDateString()} - 
                        {new Date(deal.endDate).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          deal.isActive 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {deal.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => editDeal(deal)}
                          className="bg-cyan-800 text-sm text-white rounded-md py-1 px-3 hover:bg-cyan-700 mr-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteDeal(deal)}
                          className="bg-red-800 text-sm text-white rounded-md py-1 px-3 hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-gray-500">
                      No deals found. Create your first deal above.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default withSwal(({ swal }, ref) => <Deals swal={swal} />); 