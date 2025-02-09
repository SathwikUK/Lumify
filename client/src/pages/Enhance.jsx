import React, { useState } from "react";
import "./Enhance.css";
import axios from "axios";
import { LuDownload } from "react-icons/lu";
import { FiSave } from "react-icons/fi";

import defaultImage from '../assets/lumify.png'

const Enhance = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [enhancedImages, setEnhancedImages] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle file drop
  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Prevent default behavior for drag over
  const handleDragOver = (event) => {
    event.preventDefault();
  };

  // Handle file input change
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Enhance image using API
  const handleEnhance = async () => {
    if (!selectedImage) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
      const response = await axios.post("http://localhost:5000/predict", formData);

      const timestamp = Date.now();
      const enhancedData = {};

      if (response.data.enhanced_image_url) {
        enhancedData.enhanced_image_url = `${response.data.enhanced_image_url}?key=${timestamp}`;
      }
      if (response.data.annotated_image_url) {
        enhancedData.annotated_image_url = `${response.data.annotated_image_url}?key=${timestamp}`;
      }

      setEnhancedImages(enhancedData);
    } catch (error) {
      console.error("Error enhancing the image:", error);
    } finally {
      setLoading(false);
    }
  };
  const saveImage = async (imageUrl, defaultName) => {
    try {
      const response = await fetch(imageUrl, {
        mode: "cors",
      });
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
  
      // Prompt user to enter a file name
      const userFileName = prompt("Enter file name:", defaultName);
      if (userFileName) {
        // Create a hidden anchor element
        const link = document.createElement("a");
        link.href = blobUrl;
        link.setAttribute("download", userFileName); // Set the file name for download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
  
      // Revoke the blob URL to free memory
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Error saving the image:", error);
    }
  };
  
     
  


  // Download image helper
  const downloadImage = async (imageUrl, name) => {
    try {
      const response = await fetch(imageUrl, {
        mode: 'cors',
      });
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
  
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", name);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  
      // Clean up the blob URL after the download
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Error downloading the image:", error);
    }
  };
  

  
  return (
    <div className="collaborative-container">
      {/* Fireflies Background */}
      <div className="background">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              top: `${Math.random() * 100}vh`,
              left: `${Math.random() * 100}vw`,
              animationDuration: `${5 + Math.random() * 10}s`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          ></div>
        ))}
      </div>
      {/* Upload Area */}
      <div
        className="upload-area"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => document.getElementById("fileInput").click()}
      >
        {previewUrl ? (
          <img src={previewUrl} alt="Uploaded" className="preview-image" />
        ) : (
          <p>Drop your image here or click to browse</p>
        )}
        <input
          id="fileInput"
          type="file"
          onChange={handleImageUpload}
          accept="image/*"
          style={{ display: "none" }}
        />
        {selectedImage && <p className="file-name">{selectedImage.name}</p>}
      </div>

      {/* Center Div for Enhance Button */}
      <div className="center-div">
        {loading ? (
          <span className="loader"></span> 
        ) : (
          <button onClick={handleEnhance} disabled={!selectedImage}>
            Enhance
          </button>
        )}
      </div>

      {/* Right Div for Enhanced Images */}
      {/* Right Div for Enhanced Images */}
      <div className="right-div">
  {enhancedImages ? (
    <>
      {enhancedImages.enhanced_image_url && (
        <div className="image-container">
          <h3>Enhanced Image</h3>
          <img
            src={enhancedImages.enhanced_image_url}
            alt="Enhanced"
            className="output-image"
          />
          <div className="icon-containera">
            <LuDownload
              className="download-icon"
              onClick={() =>
                downloadImage(
                  enhancedImages.enhanced_image_url,
                  "enhanced_image.jpg"
                )
              }
            />
            <FiSave
                className="save-icon"
                onClick={() =>
                  saveImage(
                    enhancedImages.enhanced_image_url,
                    "enhanced_image.jpg"
                  )
                }
              />
          </div>
        </div>
      )}
      {enhancedImages.annotated_image_url && (
        <div className="image-container">
          <h3>Enhanced Image with Faces</h3>
          <img
            src={enhancedImages.annotated_image_url}
            alt="Enhanced with Faces"
            className="output-image"
          />
          <div className="icon-containerb">
            <LuDownload
              className="download-icon"
              onClick={() =>
                downloadImage(
                  enhancedImages.annotated_image_url,
                  "enhanced_with_faces.jpg"
                )
              }
            />
            <FiSave
                className="save-icon"
                onClick={() =>
                  saveImage(
                    enhancedImages.enhanced_image_url,
                    "enhanced_image.jpg"
                  )
                }
              />
          </div>
        </div>
      )}
    </>
  ) : (
    <div>
      <img src={defaultImage} alt="Default" className="default-image" />
    </div>
  )}
</div>

    </div>
  );
};

export default Enhance;
