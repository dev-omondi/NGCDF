import React, { useEffect, useRef, useState } from "react";
import {
  useGetProfileQuery,
  useUpdateUserMutation,
} from "@/authRedux/baseApiSlice";
import { useUploadMutation } from "@/imageRedux/imageBase";

import {
  Camera,
  Mail,
  Phone,
  User,
  Save,
  Loader2,
} from "lucide-react";

const Profilepage = () => {
  const { data, isLoading } = useGetProfileQuery();
  const [updateUser, { isLoading: updating }] = useUpdateUserMutation();
  const [uploadImage, { isLoading: uploadingImage }] = useUploadMutation();

  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    firstName: "",
    secondName: "",
    email: "",
    phoneNo: "",
    image: "",
  });

  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (data) {

      setFormData({
        firstName: data.firstName || "",
        secondName: data.secondName || "",
        email: data.email || "",
        phoneNo: data.phoneNo || "",
        image: data.image || "",
      });

      setPreview(data?.image || "");
      
    }
  }, [data]);
 
  const changeHandler = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const imageHandler = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  try {
    setPreview(URL.createObjectURL(file));

    const form = new FormData();
    form.append("file", file);

    const res = await uploadImage(form).unwrap();
    const imageUrl = res.url;

    // instantly update backend (no need to click save)
    const updatedForm = {
            ...formData,
            image: imageUrl,
            }; 
        setFormData(updatedForm);
    await updateUser(updatedForm).unwrap();
  } catch (error) {
    console.log(error);
  }
};
  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await updateUser(formData).unwrap();

      alert("Profile updated successfully");
    } catch (error) {
      console.log(error);
      alert(error?.data?.message || "Update failed");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader2 className="animate-spin w-10 h-10 text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          
          {/* HEADER */}
          <div className="h-44 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 relative">
            
            {/* PROFILE IMAGE */}
            <div className="absolute left-1/2 transform -translate-x-1/2 top-24">
              <div
                onClick={() => fileInputRef.current.click()}
                className="relative group cursor-pointer"
              >
                <img
                  src={
                    preview ||
                    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  }
                  alt="profile"
                  className="w-36 h-36 rounded-full border-4 border-white object-cover shadow-lg"
                />

                <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                  <Camera className="text-white w-12 h-12" />
                </div>
              </div>

              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                hidden
                onChange={imageHandler}
              />
            </div>
          </div>

          {/* BODY */}
          <div className="pt-24 md:pt-10 px-5 md:px-10 pb-10">
            
            {/* TITLE */}
                <div className="text-center mb-10 mt-6">
              <h1 className="text-3xl font-bold text-slate-800">
                My Profile
              </h1>

              <p className="text-slate-500 mt-2">
                Manage your account information and profile details
              </p>
            </div>

            {/* FORM */}
            <form
              onSubmit={submitHandler}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* FIRST NAME */}
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 block">
                  First Name
                </label>

                <div className="flex items-center border rounded-2xl px-4 h-14 focus-within:ring-2 focus-within:ring-blue-500 bg-slate-50">
                  <User className="text-slate-400 w-5 h-5 mr-3" />

                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={changeHandler}
                    placeholder="Enter first name"
                    className="w-full bg-transparent outline-none"
                  />
                </div>
              </div>

              {/* SECOND NAME */}
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 block">
                  Second Name
                </label>

                <div className="flex items-center border rounded-2xl px-4 h-14 focus-within:ring-2 focus-within:ring-blue-500 bg-slate-50">
                  <User className="text-slate-400 w-5 h-5 mr-3" />

                  <input
                    type="text"
                    name="secondName"
                    value={formData.secondName}
                    onChange={changeHandler}
                    placeholder="Enter second name"
                    className="w-full bg-transparent outline-none"
                  />
                </div>
              </div>

              {/* EMAIL */}
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 block">
                  Email Address
                </label>

                <div className="flex items-center border rounded-2xl px-4 h-14 focus-within:ring-2 focus-within:ring-blue-500 bg-slate-50">
                  <Mail className="text-slate-400 w-5 h-5 mr-3" />

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={changeHandler}
                    placeholder="Enter email"
                    className="w-full bg-transparent outline-none"
                  />
                </div>
              </div>

              {/* PHONE */}
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 block">
                  Phone Number
                </label>

                <div className="flex items-center border rounded-2xl px-4 h-14 focus-within:ring-2 focus-within:ring-blue-500 bg-slate-50">
                  <Phone className="text-slate-400 w-5 h-5 mr-3" />

                  <input
                    type="text"
                    name="phoneNo"
                    value={formData.phoneNo}
                    onChange={changeHandler}
                    placeholder="Enter phone number"
                    className="w-full bg-transparent outline-none"
                  />
                </div>
              </div>

              {/* BUTTON */}
              <div className="md:col-span-2 mt-4 flex justify-center">
                <button
                  type="submit"
                  disabled={updating}
                  className="w-full md:w-fit bg-gradient-to-r from-blue-700 to-indigo-700 hover:opacity-90 transition text-white px-8 h-14 rounded-2xl flex items-center justify-center gap-3 font-semibold shadow-lg"
                >
                  {updating ? (
                    <>
                      <Loader2 className="animate-spin w-5 h-5" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profilepage;