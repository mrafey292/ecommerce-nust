import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import { withSwal } from "react-sweetalert2";

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

  useEffect(() => {
    fetchProducts();
    fetchDeals();
  }, []);

  function fetchProducts() {
    axios.get("/api/products").then((result) => {
      setProducts(result.data);
    });
  }

  function fetchDeals() {
    axios.get("/api/deals").then((result) => {
      setDeals(result.data);
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
        await axios.delete("/api/deals?_id=" + deal._id);
        fetchDeals();
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
                  <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(ev) => setIsActive(ev.target.checked)}
                      className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                    />
                    <label className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                  </div>
                  <span className={`text-sm ${isActive ? 'text-green-600' : 'text-gray-500'}`}>
                    {isActive ? 'Active' : 'Inactive'}
                  </span>
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
                {editedDeal ? "Update Deal" : "Create Deal"}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Product</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Discount</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Period</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {deals.map(deal => (
                  <tr key={deal._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {products.find(p => p._id === deal.productId)?.title}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        {deal.discountAmount}{deal.discountType === "percentage" ? "%" : " USD"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(deal.startDate).toLocaleDateString()} - 
                      {new Date(deal.endDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        deal.isActive 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {deal.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium space-x-2">
                      <button
                        onClick={() => editDeal(deal)}
                        className="text-blue-600 hover:text-blue-900 bg-blue-50 px-3 py-1 rounded-md transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteDeal(deal)}
                        className="text-red-600 hover:text-red-900 bg-red-50 px-3 py-1 rounded-md transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default withSwal(({ swal }, ref) => <Deals swal={swal} />); 