import React, { useRef, useState } from "react";
import { useMessageStore } from "../store/useMessageStore";
import { Image, Send, X } from "lucide-react";
import axios from "axios";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [imgUrl, setImgUrl] = useState("");
  const [uploadProgress, setuploadProgress] = useState(0);
  const fileRef = useRef(null);
  const { sendMessage } = useMessageStore();

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select image");
      return;
    }
    setImagePreview(URL.createObjectURL(file));
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await axios.post(
        "http://localhost:3000/api/message/uploads",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progress) => {
            const per = Math.round((progress.loaded * 1000) / progress.total);
            setuploadProgress(per);
          },
        }
      );
      setImgUrl(res.data.url);
    } catch (error) {
      console.log(error);
    }
  };
  // console.log(uploadProgress);

  const removeImage = () => {
    setImagePreview(null);
    setImgUrl(null);
    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    const formData = {
      text,
      imageUrl: imgUrl,
    };

    try {
      await sendMessage(formData);
      setText("");
      setImagePreview(null);
      setImgUrl("");

      if (fileRef.current) fileRef.current.value = "";
    } catch (error) {
      console.log("Error in sending message: ", error);
    }
  };
  {
  }

  return (
    <div className=" p-4 w-full">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-3">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="size-20 object-cover rounded-lg border border-zinc-700"
            />

            {/* Circular progress overlay */}
            {uploadProgress < 100 && (
              <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center">
                <svg className="w-12 h-12">
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    stroke="white"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray={2 * Math.PI * 20}
                    strokeDashoffset={
                      2 * Math.PI * 20 * (1 - uploadProgress / 100)
                    }
                    strokeLinecap="round"
                  />
                </svg>

                <span className="absolute text-white text-sm font-semibold">
                  {uploadProgress}%
                </span>
              </div>
            )}
            <button
              onClick={removeImage}
              type="button"
              className="absolute -top-1.5 -right-1.5 size-5 rounded-full bg-base-300 flex items-center justify-center"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex flex-1 gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            className="w-full input input-bordered  rounded-lg input-sm sm:input-md"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileRef}
            onChange={handleImageChange}
          />
          <button
            type="button"
            className={` sm:flex btn btn-circle
                ${imagePreview ? "text-emerald-500" : "text-zinc-400"}
                `}
            onClick={() => fileRef.current?.click()}
          >
            <Image size={20} />
          </button>
          <button
            type="submit"
            className="btn btn-sm bg-transparent mt-1 border-0 btn-circle"
            disabled={!text.trim() && !imagePreview}
          >
            <Send size={22} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default MessageInput;
