import { Input } from "@chakra-ui/react";
import axios from "axios";
import { useState, useEffect } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase-client";

export default function ProfileView() {
  const [userData, setUserData] = useState({
    user_id: null,
    name: "",
    email: "",
    profile_image: "",
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [fileForUpload, setFileForUpload] = useState(null);

  const fetchUserProfile = async () => {
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const response = await axios.get("api/users/profile", config);

      setUserData(response.data.data);
    } catch (error) {
      console.error("Error fetching user profile", error);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // preview
    setPreviewImage(URL.createObjectURL(file));
    setFileForUpload(file);
  };

  const handleSave = async () => {
    let newImageUrl = userData.profile_image;
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      console.log(token);

      // ถ้ามีการอัปโหลดไฟล์ใหม่
      if (fileForUpload) {
        const fileName = `${userData.user_id}-${Date.now()}`;
        const { data, error } = await supabase.storage
          .from("ProfilePicture")
          .upload(fileName, fileForUpload);
        if (error) {
          console.error("Upload error:", error);
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
      fetchUserProfile();
    } catch (error) {
      console.error("Error saving profile data:", error);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return (
    <div className="flex-1 p-8">
      <h1 className="text-4xl font-bold mb-2">Profile</h1>
      <p className="text-gray-400 mb-8">
        Keep your personal details private.
        <br />
        Information you add here is visible to anyone who can view your profile
      </p>

      <div className="max-w-md">
        <div className="mb-8 flex items-end gap-5">
          <div className="w-32 h-32 bg-gray-700 rounded-full mb-2 flex items-center justify-center overflow-hidden">
            <Image
              src={previewImage || userData.profile_image}
              width={128}
              height={128}
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

        <div className="space-y-4">
          <div>
            <label className="block mb-1 text-[#C8CEDD]">Name</label>
            <Input
              defaultValue={userData.name}
              bg="#21263F"
              className="text-white border border-[#565F7E] px-3"
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
              className="text-white border border-[#565F7E] px-3"
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, email: e.target.value }))
              }
            />
          </div>
          <button
            className="mt-4 px-6 py-2 bg-transparent border border-gray-600 text-white rounded hover:bg-gray-800"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
