import torch
import torch.nn as nn
import torchvision
import os
import numpy as np
from torchvision import transforms
from PIL import Image, ImageDraw
import glob
import time
import face_recognition  # For face detection
import model


def lowlight(image_path, model_path='snapshots/Epoch99.pth', result_dir='data/result/'):
    # Load and preprocess the input image
    data_lowlight = Image.open(image_path).convert("RGB")
    data_lowlight_np = np.asarray(data_lowlight) / 255.0
    data_lowlight_tensor = torch.from_numpy(data_lowlight_np).float().permute(2, 0, 1).unsqueeze(0)

    # Load the model
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    DCE_net = model.enhance_net_nopool().to(device)
    DCE_net.load_state_dict(torch.load(model_path, map_location=device))
    DCE_net.eval()

    # Process the image
    data_lowlight_tensor = data_lowlight_tensor.to(device)
    start = time.time()
    _, enhanced_image, _ = DCE_net(data_lowlight_tensor)
    end_time = time.time() - start
    print(f"Processing time for {image_path}: {end_time:.4f} seconds")

    # Save the enhanced output image
    os.makedirs(result_dir, exist_ok=True)
    result_path = os.path.join(result_dir, os.path.basename(image_path))
    torchvision.utils.save_image(enhanced_image, result_path)
    print(f"Saved enhanced image to {result_path}")

    # Convert enhanced image to numpy for face detection
    enhanced_image_np = enhanced_image.squeeze(0).permute(1, 2, 0).cpu().numpy()
    enhanced_image_np = (enhanced_image_np * 255).astype(np.uint8)

    # Perform face detection
    face_locations = face_recognition.face_locations(enhanced_image_np)

    if face_locations:
        print(f"Found {len(face_locations)} face(s) in {image_path}.")
        # Draw bounding boxes around faces
        enhanced_image_pil = Image.fromarray(enhanced_image_np)
        draw = ImageDraw.Draw(enhanced_image_pil)
        for top, right, bottom, left in face_locations:
            draw.rectangle([left, top, right, bottom], outline="red", width=2)

        # Save the image with face annotations
        annotated_result_path = os.path.join(result_dir, f"faces_{os.path.basename(image_path)}")
        enhanced_image_pil.save(annotated_result_path)
        print(f"Saved annotated image with faces to {annotated_result_path}")


if __name__ == '__main__':
    with torch.no_grad():
        # Input and output directories
        test_dir = 'data/test_data1/'
        result_dir = 'data/result1/'
        
        if not os.listdir(test_dir):
            print(f"No files or subdirectories in {test_dir}. Exiting.")
            exit()

        # Process all images directly in the test directory
        test_list = glob.glob(os.path.join(test_dir, "*"))
        if not test_list:
            print(f"No images found in {test_dir}. Exiting.")
            exit()

        print(f"Found {len(test_list)} files in {test_dir}.")
        for image_path in test_list:
            print(f"Processing: {image_path}")
            lowlight(image_path, result_dir=result_dir)