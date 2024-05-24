"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import image from "../../public/800px-Instagram_logo_2016.webp";
import { signIn, useSession, signOut } from "next-auth/react";
import Insta from "../../public/Instagram_logo_black.webp";
import Modal from "react-modal";
import { IoMdAddCircleOutline } from "react-icons/io";
import { HiCamera } from "react-icons/hi";
import { AiOutlineClose } from "react-icons/ai";
import { app } from "../firebase";
import {
  getDownloadURL,
  getStorage,
  uploadBytesResumable,
  ref,
} from "firebase/storage";
import {
  addDoc,
  collection,
  getFirestore,
  serverTimestamp,
} from "firebase/firestore";
const Header = () => {
  const { data: session } = useSession();
  // console.log(session);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [caption, setCaption] = useState("");
  const [postUploading, setPostUploading] = useState(false);

  const filePickerRef = useRef(null);
  const db = getFirestore(app);
  function addImageToPost(e) {
    const file = e.target.files[0];
    console.log(file, "file");
    if (file) {
      setSelectedFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  }
  console.log(imageFileUrl, "imagefileurl");

  useEffect(() => {
    if (selectedFile) {
      uploadImageToStorage();
    }
  }, [selectedFile]);
  async function uploadImageToStorage() {
    setImageFileUploading(true);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + "-" + selectedFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, selectedFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const porcess = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("upload is" + porcess + "% done");
      },
      (error) => {
        console.error(error);
        setImageFileUploading(false);
        setSelectedFile(null);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downoadURL) => {
          setImageFileUploading(false);
          setImageFileUrl(downoadURL);
        });
      }
    );
  }
  // console.log(imageFileUploading);
  async function handleSubmit(e) {
    // e.preventDefault();
    setPostUploading(true);
    const docRef = await addDoc(collection(db, "posts"), {
      username: session.user.username,
      caption,
      profileImg: session.user.image,
      image: imageFileUrl,
      timestamp: serverTimestamp(),
    });
    console.log(docRef);
    setPostUploading(false);
    setIsOpen(false);
    location.reload();
  }
  return (
    <div className="sticky  top-0 border-b z-10 lg:ml-8 mx-auto bg-white p-3">
      <div className="flex justify-between mx-auto  max-w-6xl">
        <Link href="/" className="hidden lg:inline-flex">
          <Image src={Insta} alt="insta" width={96} height={96} />
        </Link>
        <Link href="/" className="lg:hidden">
          <Image src={image} alt="insta" width={40} height={40} />
        </Link>
        <input
          type="text"
          placeholder="Search"
          className="border rounded-lg flex-1 max-w-[210px] w-full bg-gray-50 border-gray-200 text-sm py-2 px-4 focus:outline-none "
        />
        {session ? (
          <div className="flex items-center space-x-3 ">
            <IoMdAddCircleOutline
              onClick={() => setIsOpen(true)}
              className="cursor-pointer text-4xl p-1 hover:scale-125 hover:text-red-600 transform transition duration-300"
            />
            <img
              src={session.user.image}
              alt={session.user.name}
              className="h-10 w-10 rounded-full cursor-pointer"
              onClick={signOut}
            />
          </div>
        ) : (
          <button onClick={() => signIn()} className="text-blue-500">
            Log in
          </button>
        )}
      </div>
      {isOpen && (
        <Modal
          isOpen={isOpen}
          onRequestClose={() => setIsOpen(false)}
          ariaHideApp={false}
          className=" max-w-lg w-[90%]  p-6 absolute top-56 left-[50%] translate-x-[-50%] border-2 shadow-md bg-white rounded-md"
        >
          <div className="flex flex-col justify-center items-center">
            <div className="flex justify-center items-center h-[100%]">
              {selectedFile ? (
                <img
                  onClick={() => setSelectedFile(null)}
                  src={imageFileUrl}
                  alt="select file"
                  className={`w-full max-h-[250px] obj-cover cursor-pointer ${
                    imageFileUploading ? "animate-pulse" : ""
                  }`}
                />
              ) : (
                <HiCamera
                  onClick={() => filePickerRef.current.click()}
                  className="text-5xl text-gray-400 cursor-pointer"
                />
              )}

              <input
                hidden
                ref={filePickerRef}
                type="file"
                accept="image/*"
                onChange={addImageToPost}
              />
            </div>
            <input
              type="text"
              maxLength="150"
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Please enter your capition.... "
              className="w-[60%] focus:outline-none m-4 text-center"
            />
            <button
              disabled={
                !selectedFile ||
                caption.trim() === "" ||
                postUploading ||
                imageFileUploading
              }
              onClick={handleSubmit}
              className="text-white bg-red-500 w-full py-1 rounded-md hover:brightness-125 hover:shadow-md disabled:bg-gray-200 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:brightness-100"
            >
              Upload Post
            </button>
            <AiOutlineClose
              onClick={() => setIsOpen(false)}
              className="absolute cursor-pointer top-0 right-0 text-4xl p-2 hover:text-red-500 transition duration-300"
            />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Header;
