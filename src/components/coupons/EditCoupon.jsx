import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
const EditCoupon = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const editcouponform = async () => {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `https://jewellery-backend-km3b.onrender.com/api/edit-coupon-form/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      reset(response.data);
    };
    editcouponform();
  }, [id, reset]);

  const onsubmit = async (data) => {
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      const response = await axios.put(
        `https://jewellery-backend-km3b.onrender.com/api/edit-coupon/${id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      reset;
      navigate("/manage-coupons");
       setLoading(false);
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error);
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold pb-6 text-fuchsia-700 underline">
          Edit Coupon
        </h1>
        <Link
          to="/manage-coupons"
          className="inline-flex items-center gap-2 px-4 py-2 bg-fuchsia-700 text-white rounded-xl shadow-md hover:bg-fuchsia-800 transition"
        >
          ← Back
        </Link>
      </div>

      <div className="p-6 bg-white rounded-xl shadow-md">
        <form
          onSubmit={handleSubmit(onsubmit)}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <div>
            <label
              htmlFor="code"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Coupon Code
            </label>
            <input
              type="text"
              id="code"
              {...register("code", { required: true })}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-400"
            />
            {errors.code && (
              <p className="text-red-500 text-sm mt-1">{errors.code.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="title"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              {...register("title", { required: true })}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-400"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="discountValue"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Discount Value
            </label>
            <input
              type="number"
              id="discountValue"
              {...register("discountValue", { required: true })}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-400"
            />
            {errors.discountValue && (
              <p className="text-red-500 text-sm mt-1">
                {errors.discountValue.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="minOrderAmount"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Min Order Amount
            </label>
            <input
              type="number"
              id="minOrderAmount"
              {...register("minOrderAmount", { required: true })}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-400"
            />
            {errors.minOrderAmount && (
              <p className="text-red-500 text-sm mt-1">
                {errors.minOrderAmount.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="maxOrderAmount"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Max Order Amount
            </label>
            <input
              type="number"
              id="maxOrderAmount"
              {...register("maxOrderAmount", { required: true })}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-400"
            />
            {errors.maxOrderAmount && (
              <p className="text-red-500 text-sm mt-1">
                {errors.maxOrderAmount.message}
              </p>
            )}
          </div>
          <div className="col-span-1 sm:col-span-2 lg:col-span-3 flex justify-start">
            <button
              type="submit"
              className={`bg-fuchsia-700 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
            >
             {loading ? (
                <>
                  <span>Updating...</span>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </>
              ) : (
                "Update Coupon"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCoupon;
