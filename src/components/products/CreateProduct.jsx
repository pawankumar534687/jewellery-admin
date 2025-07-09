import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CreateProduct = () => {
  const [allsubcategory, setallsubcategory] = useState([]);
  const [categorys, setCategorys] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [previewImages, setPreviewImages] = useState([]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    const previews = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      local: true,
    }));

    setPreviewImages(previews);
    setValue("images", files);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm();

  useEffect(() => {
    const getsubcategory = async () => {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:8000/api/get-sub-category",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setallsubcategory(response.data);
      console.log(response.data);
    };
    getsubcategory();
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const formData = new FormData();
      for (let key in data) {
        if (key === "images") {
          Array.from(data.images).forEach((file) =>
            formData.append("images", file)
          );
        } else {
          formData.append(key, data[key]);
        }
      }
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:8000/api/create-product",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      reset();
      navigate("/all-products");
      setLoading(false);
      toast.success("Product created successfully!");
    } catch (error) {
      console.error(error);
      alert("Error creating product");
      setLoading(false);
    }
  };
  const price = watch("price");
  const discount = watch("discount");

  useEffect(() => {
    if (price && discount >= 0) {
      const discountedPrice = price - (price * discount) / 100;
      setValue("finalprice", discountedPrice.toFixed(2));
    }
  }, [price, discount, setValue]);

  useEffect(() => {
    const getallcategory = async () => {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:8000/api/get-category",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCategorys(response.data);
      console.log(response.data);
    };
    getallcategory();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6 pb-2">
        <h1 className="text-3xl underline font-bold text-fuchsia-700">
          Create Product
        </h1>
        <Link
          to="/all-products"
          className="inline-flex items-center gap-2 px-4 py-2 bg-fuchsia-700 text-white rounded-xl shadow-md hover:bg-fuchsia-800 transition"
        >
          ← Back
        </Link>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-7xl mx-auto"
        encType="multipart/form-data"
      >
        <div>
          <label className="block  font-medium text-gray-700">
            Select Category
          </label>
          <select
            {...register("category", { required: "Category is required" })}
            className="border-fuchsia-500 border px-4 py-2 focus:border-fuchsia-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 rounded-xl w-full"
          >
            <option value="">Select Category</option>
            {categorys.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-red-600">Category is required</p>
          )}
        </div>
        <div>
          <label className="block  font-medium text-gray-700">
            Select Sub Category
          </label>
          <select
            {...register("subCategory", {
              required: "Sub Category is required",
            })}
            className="border-fuchsia-500 border px-4 py-2 focus:border-fuchsia-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 rounded-xl w-full"
          >
            <option value="">Select Sub Category</option>
            {allsubcategory.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.subcategory}
              </option>
            ))}
          </select>
          {errors.subCategory && (
            <p className="text-red-600">Category is required</p>
          )}
        </div>
        <div>
          <label className="block  font-medium text-gray-700">
            Product Name
          </label>
          <input
            {...register("productName", { required: true })}
            placeholder="Product Name"
            className="border-fuchsia-500 border px-4 py-2 focus:border-fuchsia-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 rounded-xl w-full"
          />
          {errors.productName && (
            <p className="text-red-600">Product name is required</p>
          )}
        </div>

        <div>
          <label className="block  font-medium text-gray-700">
            Description
          </label>
          <input
            {...register("description", { required: true })}
            placeholder="Description"
            className="border-fuchsia-500 border px-4 py-2 focus:border-fuchsia-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 rounded-xl w-full"
          />
          {errors.description && (
            <p className="text-red-600">Description is required</p>
          )}
        </div>

        <div>
          <label className="block  font-medium text-gray-700">Metal Type</label>
          <input
            {...register("metaltype", { required: true })}
            placeholder="Metal Type"
            className="border-fuchsia-500 border px-4 py-2 focus:border-fuchsia-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 rounded-xl w-full"
          />
          {errors.metaltype && (
            <p className="text-red-600">Metal type is required</p>
          )}
        </div>

        <div>
          <label className="block  font-medium text-gray-700">Price</label>
          <input
            {...register("price", { required: true })}
            type="number"
            placeholder="Price"
            className="border-fuchsia-500 border px-4 py-2 focus:border-fuchsia-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 rounded-xl w-full"
          />
          {errors.price && <p className="text-red-600">Price is required</p>}
        </div>
        <div>
          <label className="block  font-medium text-gray-700">
            Discount (%)
          </label>
          <input
            {...register("discount")}
            type="number"
            placeholder="Discount (%)"
            className="border-fuchsia-500 border px-4 py-2 focus:border-fuchsia-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 rounded-xl w-full"
          />
        </div>

        <div>
          <label className="block  font-medium text-gray-700">
            Final Price
          </label>
          <input
            {...register("finalprice", { required: true })}
            placeholder="Final Price"
            readOnly
            className="border-fuchsia-500 border px-4 py-2 focus:border-fuchsia-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 rounded-xl w-full"
          />
          {errors.finalprice && (
            <p className="text-red-600">Final price is required</p>
          )}
        </div>
        <div>
          <label className="block font-medium text-gray-700">
            Product Images
          </label>

          <div className="border-2 border-dashed border-fuchsia-500 rounded-xl p-4 text-center cursor-pointer hover:bg-fuchsia-50 transition">
            <label htmlFor="images" className="cursor-pointer block">
              📁 Click to upload images
            </label>
            <input
              id="images"
              type="file"
              multiple
              className="hidden"
              onChange={handleImageChange}
            />
            <p className="text-sm text-gray-500">
              You can upload multiple files
            </p>
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            {previewImages.map((img, index) => (
              <img
                key={index}
                src={img.url}
                alt="preview"
                className="w-16 h-16 object-cover border border-fuchsia-300 rounded"
              />
            ))}
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`bg-fuchsia-700 text-white px-4 py-2 rounded hover:bg-fuchsia-800 flex items-center justify-center gap-2 ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? (
            <>
              <span>Creating...</span>
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </>
          ) : (
            "Create Product"
          )}
        </button>
      </form>
    </div>
  );
};

export default CreateProduct;
