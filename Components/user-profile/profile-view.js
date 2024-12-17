import { Input } from "@chakra-ui/react";
import {
  Skeleton,
  SkeletonCircle,
  SkeletonText,
} from "@/components/ui/skeleton";
import axios from "axios";
import { useState, useEffect } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase-client";
import { toast } from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import { useUser } from "@/context/user-context";
import jwtInterceptor from "@/utils/jwt-interceptor";
export default function ProfileView() {
  const { userData, setUserData, fetchUserProfile } = useUser();
  const [previewImage, setPreviewImage] = useState(null);
  const [fileForUpload, setFileForUpload] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // preview
    setPreviewImage(URL.createObjectURL(file));
    setFileForUpload(file);
  };
  const loadUserProfile = async () => {
    try {
      setIsLoading(true);
      const result = await fetchUserProfile();
      if (!result.success) {
        setIsLoading(false);
        setError(true);
      }
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setError(true);
    }
  };

  const handleSave = async () => {
    let newImageUrl = userData.profile_image;
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      if (fileForUpload) {
        const fileName = `${userData.user_id}-${Date.now()}`;
        const { data, error } = await supabase.storage
          .from("ProfilePicture")
          .upload(fileName, fileForUpload);
        if (error) {
          console.log("Upload error:", error);
          return;
        }

        newImageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/ProfilePicture/${data.path}`;
      }

      await axios.patch(
        "api/users/update-profile",
        {
          name: userData.name,
          email: userData.email,
          profile_image: newImageUrl,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast(
        <div>
          <strong>Saved profile</strong>
          <p>Your profile has been successfully updated</p>
        </div>,
        {
          position: "bottom-right",
          style: {
            borderRadius: "4px",
            color: "white",
            backgroundColor: "#00A37299",
          },
        }
      );
      loadUserProfile();
    } catch (error) {
      toast(
        <strong>An unexpected error occurred. Please try again later.</strong>,
        {
          position: "bottom-right",
          style: {
            borderRadius: "4px",
            backgroundColor: "#E5364B99",
            color: "white",
          },
        }
      );
      console.log("Error saving profile data:", error);
    }
  };

  useEffect(() => {
    jwtInterceptor();
    loadUserProfile();
  }, []);

  if (isLoading) {
    return (
      <div className="flex-1 md:p-8">
        <h1 className="text-4xl font-bold mb-10">
          <Skeleton height="48px" width="30%" />
        </h1>

        <SkeletonText noOfLines={2} gap="3" />

        <div className="max-w-md mt-10">
          <div className="mb-8 flex items-end gap-5">
            <SkeletonCircle size="128px" />
            <Skeleton height="24px" width="100px" />
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Skeleton height="20px" width="30%" />
              <Skeleton height="40px" />
            </div>
            <div className="space-y-2">
              <Skeleton height="20px" width="30%" />
              <Skeleton height="40px" />
            </div>
            <Skeleton height="48px" width="110px" />
          </div>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="p-8">
        <p className="font-bold mb-5">Server error, please try again.</p>
        <button
          onClick={() => {
            setIsLoading(true);
            setError(false);
            loadUserProfile();
          }}
          className="px-4 py-2 border border-[#565F7E] text-white rounded font-bold"
        >
          Try Again
        </button>
      </div>
    );
  }
  return (
    <div className="flex-1 md:p-8">
      <h1 className="text-4xl font-bold mb-10">Profile</h1>
      <p className="text-gray-400 mb-8">
        Keep your personal details private.
        <br />
        Information you add here is visible to anyone who can view your profile
      </p>

      <div className="max-w-md">
        <div className="mb-8 flex items-end gap-5">
          <div className="w-32 h-32 bg-gray-700 rounded-full mb-2 flex items-center justify-center overflow-hidden">
            <Image
              src={
                previewImage ||
                userData.profile_image ||
                "/img/menu/User_duotone.png"
              }
              width={128}
              height={128}
              className="text-center"
              alt="Profile Picture"
            />
          </div>

          <label className="underline font-bold cursor-pointer">
            Upload
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block mb-1 text-[#C8CEDD]">Name</label>
            <Input
              defaultValue={userData.name}
              bg="#21263F"
              className="text-white border border-[#565F7E] px-3 py-6"
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          </div>
          <div>
            <label className="block mb-1 text-[#C8CEDD]">Email</label>
            <Input
              defaultValue={userData.email}
              bg="#21263F"
              className="text-white border border-[#565F7E] px-3 py-6"
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, email: e.target.value }))
              }
            />
          </div>
          <button
            className="px-10 py-3 bg-transparent border border-[#8B93B0] text-white rounded hover:bg-gray-800 translate-y-5"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
