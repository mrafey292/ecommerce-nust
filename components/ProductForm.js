import { use, useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { ReactSortable } from "react-sortablejs";
import Spinner from "./Spinner";

export default function ProductForm({
  _id,
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
  images: existingImages,
  category: assignedCategory,
  properties: assignedProperties,
}) {
  const [title, setTitle] = useState(existingTitle || "");
  const [category, setCategory] = useState(assignedCategory || "");
  const [productProperties, setProductProperties] = useState(
    assignedProperties || {}
  );
  const [price, setPrice] = useState(existingPrice || "");
  const [description, setDescription] = useState(existingDescription || "");
  const [gotoProducts, setGotoProducts] = useState(false);
  const [images, setImages] = useState(existingImages || []);
  const [isUploading, setIsUploading] = useState(false);
  const [categories, setCategories] = useState([]);
  const router = useRouter();

  useEffect(() => {
    axios.get("/api/categories").then((result) => {
      setCategories(result.data);
    });
  }, []);

  async function saveProduct(ev) {
    ev.preventDefault();
    const data = {
      title,
      description,
      price,
      images,
      category,
      properties: productProperties,
    };
    if (_id) {
      data._id = _id;
      await axios.put("/api/products", data);
    } else {
      await axios.post("/api/products", data);
    }
    setGotoProducts(true);
  }
  if (gotoProducts) {
    return router.push("/products");
  }

  async function uploadImages(ev) {
    const files = ev.target?.files;
    if (files?.length > 0) {
      setIsUploading(true);
      const data = new FormData();
      // Convert FileList to an array using Array.from
      Array.from(files).forEach((file) => data.append("file", file));
      try {
        const res = await axios.post("/api/upload", data);
        setImages((oldImages) => {
          return [...oldImages, ...res.data.links];
        });
      } catch (error) {
        console.error("Error uploading images:", error);
      } finally {
        setIsUploading(false);
      }
    }
  }

  function updateImagesOrder(images) {
    setImages(images);
  }

  function setProductProp(propName, value) {
    setProductProperties((prev) => {
      const newProductProps = { ...prev };
      newProductProps[propName] = value;
      return newProductProps;
    });
  }

  const propertiesToFill = [];
if (categories.length > 0 && category) {
  let catInfo = categories.find(({ _id }) => _id === category);
  if (catInfo) {
    propertiesToFill.push(...catInfo.properties);
    while (catInfo?.parent?._id) {
      const parentCat = categories.find(
        ({ _id }) => _id === catInfo?.parent?._id
      );
      if (!parentCat) break; // Break the loop if the parent category is not found
      propertiesToFill.push(...parentCat.properties);
      catInfo = parentCat;
    }
  }
}
  return (
    <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Product Form</h2>
      <form onSubmit={saveProduct}>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="name">
            Product Name
          </label>
          <input
            className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            id="name"
            type="text"
            placeholder="Enter product name"
            onChange={(ev) => setTitle(ev.target.value)}
            value={title}
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-medium mb-2">Category</label>
          <select
            className="shadow-sm border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            value={category}
            onChange={(ev) => setCategory(ev.target.value)}
          >
            <option>Uncategorized</option>
            {categories.length > 0 &&
              categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
  
          {propertiesToFill.length > 0 &&
            propertiesToFill.map((p) => (
              <div className="flex items-center gap-2 mt-4" key={p.name}>
                <div className="text-gray-700 font-medium">{p.name}</div>
                <select
                  className="shadow-sm border border-gray-300 rounded-lg py-1 px-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  value={productProperties[p.name]}
                  onChange={(ev) => setProductProp(p.name, ev.target.value)}
                >
                  {p.values.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>
            ))}
        </div>
  
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-medium mb-2">Photos</label>
          <div className="mb-4 flex flex-wrap gap-2">
            <ReactSortable
              list={images}
              className="flex flex-wrap gap-2"
              setList={updateImagesOrder}
            >
              {!!images?.length &&
                images.map((link) => (
                  <div
                    key={link}
                    className="h-24 w-24 bg-white p-2 shadow-sm rounded-lg border border-gray-300"
                  >
                    <img src={link} alt="" className="rounded-lg object-cover h-full w-full" />
                  </div>
                ))}
            </ReactSortable>
            {isUploading && (
              <div className="h-24 w-24 flex items-center justify-center">
                <Spinner />
              </div>
            )}
            <label className="w-24 h-24 cursor-pointer flex flex-col items-center justify-center text-sm gap-1 text-cyan-600 rounded-lg bg-gray-100 shadow-sm border border-cyan-500 hover:bg-cyan-50">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                />
              </svg>
              <div>Add image</div>
              <input type="file" onChange={uploadImages} className="hidden" />
            </label>
          </div>
        </div>
  
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-medium mb-2"
            htmlFor="price"
          >
            Price
          </label>
          <input
            className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            id="price"
            type="text"
            placeholder="Enter price"
            onChange={(ev) => setPrice(ev.target.value)}
            value={price}
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-medium mb-2"
            htmlFor="description"
          >
            Description
          </label>
          <textarea
            className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            id="description"
            placeholder="Enter product description"
            onChange={(ev) => setDescription(ev.target.value)}
            value={description}
          ></textarea>
        </div>
        <button
          className="bg-cyan-600 hover:bg-cyan-500 text-white font-medium py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
          type="submit"
        >
          Save Product
        </button>
      </form>
    </div>
  );
}
