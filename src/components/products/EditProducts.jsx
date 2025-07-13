import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const EditProducts = () => {
  const [allsubcategory, setAllSubcategory] = useState([]);
  const [categorys, setCategorys] = useState([]);
  const [product, setProduct] = useState(null);
  const [previewImages, setPreviewImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
   const [loading, setLoading] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm();

  const price = watch("price");
  const discount = watch("discount");

  useEffect(() => {
    if (price && discount >= 0) {
      const discountedPrice = price - (price * discount) / 100;
      setValue("finalprice", discountedPrice.toFixed(2));
    }
  }, [price, discount, setValue]);

  useEffect(() => {
    const fetchCategories = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get("https://jewellery-backend-km3b.onrender.com/api/get-category", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCategorys(res.data);
    };
    const fetchSubCategories = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "https://jewellery-backend-km3b.onrender.com/api/get-sub-category",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAllSubcategory(res.data);
    };
    fetchCategories();
    fetchSubCategories();
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `https://jewellery-backend-km3b.onrender.com/api/detaildProduct/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProduct(res.data);
      setValue("productName", res.data.productName);
      setValue("description", res.data.description);
      setValue("metaltype", res.data.metaltype);
      setValue("category", res.data.category);
      setValue("subCategory", res.data.subCategory);
      setValue("price", res.data.price);
      setValue("discount", res.data.discount || 0);
      setValue("finalprice", res.data.finalprice);
      setPreviewImages(res.data.images || []);
    };
    fetchProduct();
  }, [id, setValue]);

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const formData = new FormData();

      for (let key in data) {
        if (key !== "images") {
          formData.append(key, data[key]);
        }
      }

      selectedFiles.forEach((file) => {
        formData.append("images", file);
      });

      previewImages.forEach((img) => {
        formData.append("oldImages[]", JSON.stringify(img));
      });
      const token = localStorage.getItem("token");
      await axios.put(
        `https://jewellery-backend-km3b.onrender.com/api/edit-product/${id}`,

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
      navigate("/all-products");
       setLoading(false)
      toast.success("Product updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update product");
      setLoading(false)
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);

    const previews = files.map((file) => ({
      url: URL.createObjectURL(file),
      local: true,
    }));

    setPreviewImages(previews);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 pb-2">
        <h1 className="text-3xl underline font-bold text-fuchsia-700">
          Edit Product
        </h1>
        <Link
          to="/all-products"
          className="inline-flex items-center gap-2 px-4 py-2 bg-fuchsia-700 text-white rounded-xl hover:bg-fuchsia-800 transition"
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
          <label className="font-medium text-gray-700">Category</label>
          <select
            {...register("category", { required: true })}
            className="border px-4 py-2 rounded-xl w-full border-fuchsia-500"
          >
            <option value="">Select Category</option>
            {categorys.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="font-medium text-gray-700">Sub Category</label>
          <select
            {...register("subCategory", { required: true })}
            className="border px-4 py-2 rounded-xl w-full border-fuchsia-500"
          >
            <option value="">Select Sub Category</option>
            {allsubcategory.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.subcategory}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="font-medium text-gray-700">Product Name</label>
          <input
            {...register("productName", { required: true })}
            className="border px-4 py-2 rounded-xl w-full border-fuchsia-500"
          />
          {errors.productName && <p className="text-red-600">Required</p>}
        </div>

        <div>
          <label className="font-medium text-gray-700">Description</label>
          <input
            {...register("description", { required: true })}
            className="border px-4 py-2 rounded-xl w-full border-fuchsia-500"
          />
        </div>

        <div>
          <label className="font-medium text-gray-700">Metal Type</label>
          <input
            {...register("metaltype", { required: true })}
            className="border px-4 py-2 rounded-xl w-full border-fuchsia-500"
          />
        </div>

        <div>
          <label className="font-medium text-gray-700">Price</label>
          <input
            type="number"
            {...register("price", { required: true })}
            className="border px-4 py-2 rounded-xl w-full border-fuchsia-500"
          />
        </div>

        <div>
          <label className="font-medium text-gray-700">Discount (%)</label>
          <input
            type="number"
            {...register("discount")}
            className="border px-4 py-2 rounded-xl w-full border-fuchsia-500"
          />
        </div>

        <div>
          <label className="font-medium text-gray-700">Final Price</label>
          <input
            readOnly
            {...register("finalprice", { required: true })}
            className="border px-4 py-2 rounded-xl w-full border-fuchsia-500"
          />
        </div>
        <div>
          <label className="font-medium text-gray-700">Product Images</label>
          <div className="border-dashed border-2 border-fuchsia-500 rounded-xl p-4 text-center">
            <input
              type="file"
              multiple
              onChange={handleImageChange}
              className="hidden"
              id="images"
            />
            <label htmlFor="images" className="cursor-pointer">
              📁 Click to upload images
            </label>
            <p className="text-sm text-gray-500">Multiple files allowed</p>
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            {previewImages.map((img, index) => (
              <img
                key={index}
                src={img.local ? img.url : img.url || img}
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
              <span>Updating...</span>
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </>
          ) : (
            "Update Product"
          )}
        </button>
      </form>
    </div>
  );
};

export default EditProducts;
