
# import torch
# import torch.nn as nn
# import torchvision
# import os
# import numpy as np
# from torchvision import transforms
# from PIL import Image, ImageDraw
# import glob
# import time
# import face_recognition  # For face detection
# import model
# from flask import Flask,request,jsonify,send_from_directory



# from flask_cors import CORS

# app=Flask(__name__)
# CORS(app, resources={"/*": {"origins": "http://localhost:3000"}})
# app.config['RES_DIR']='data/static'

# import io
# @app.route('/predict',methods=['POST'])
# def predict():
#     if 'image' not in request.files:
#         return jsonify({"error":"No Image"}),400
#     image_file = request.files['image']
#     #form data 
#     image = Image.open(io.BytesIO(image_file.read())).convert('RGB')
#     #scaling
#     data_lowlight_np = np.asarray(image) / 255.0
#     data_lowlight_tensor = torch.from_numpy(data_lowlight_np).float().permute(2, 0, 1).unsqueeze(0)


#     model_path = r'E:\projects\low\snapshots\Epoch99.pth'
#     # Load the model
#     device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

#     DCE_net = model.enhance_net_nopool().to(device)
#     DCE_net.load_state_dict(torch.load(model_path, map_location=device))
#     DCE_net.eval()

#     # Process the image
#     data_lowlight_tensor = data_lowlight_tensor.to(device)
#     start = time.time()
#     _, enhanced_image, _ = DCE_net(data_lowlight_tensor)
#     end_time = time.time() - start
#     print(f"Processing time for {image}: {end_time:.4f} seconds")

#     result_dir = 'data/static'
#     # Save the enhanced output image
#     os.makedirs(result_dir, exist_ok=True)
#     result_path = os.path.join(result_dir, os.path.basename("Mahesh.jpg"))
#     torchvision.utils.save_image(enhanced_image, result_path)
#     print(f"Saved enhanced image to {result_path}")
#     print("Image File ",image)

#     # Convert enhanced image to numpy for face detection
#     enhanced_image_np = enhanced_image.squeeze(0).permute(1, 2, 0).detach().numpy()
#     enhanced_image_np = (enhanced_image_np * 255).astype(np.uint8)

#     # Perform face detection
#     face_locations = face_recognition.face_locations(enhanced_image_np)

#     ss="Mahesh.jpg"
#     if face_locations:
#         print(f"Found {len(face_locations)} face(s) in {image}.")
#         # Draw bounding boxes around faces
#         enhanced_image_pil = Image.fromarray(enhanced_image_np)
#         draw = ImageDraw.Draw(enhanced_image_pil)
#         for top, right, bottom, left in face_locations:
#             draw.rectangle([left, top, right, bottom], outline="red", width=2)

#         # Save the image with face annotations
        
#         annotated_result_path = os.path.join(result_dir,os.path.basename("Mahesh.jpg"))
#         enhanced_image_pil.save(annotated_result_path)
#         print(f"Saved annotated image with faces to {annotated_result_path}")

    
#     return jsonify({
#         "message": "Image processed successfully",
#         "result": f"http://localhost:5000/static/{ss}"
#     })

# @app.route('/static/<filename>')
# def send_file_from_server(filename):
#     return send_from_directory(app.config['RES_DIR'],filename)

# # # Convert enhanced image to numpy for face detection
# # enhanced_image_np = enhanced_image.squeeze(0).permute(1, 2, 0).cpu().numpy()
# # enhanced_image_np = (enhanced_image_np * 255).astype(np.uint8)

# # # Perform face detection
# # face_locations = face_recognition.face_locations(enhanced_image_np)

# # if face_locations:
# #     print(f"Found {len(face_locations)} face(s) in {image_path}.")
# #     # Draw bounding boxes around faces
# #     enhanced_image_pil = Image.fromarray(enhanced_image_np)
# #     draw = ImageDraw.Draw(enhanced_image_pil)
# #     for top, right, bottom, left in face_locations:
# #         draw.rectangle([left, top, right, bottom], outline="red", width=2)

# #     # Save the image with face annotations
# #     annotated_result_path = os.path.join(result_dir, f"faces_{os.path.basename(image_path)}")
# #     enhanced_image_pil.save(annotated_result_path)
# #     print(f"Saved annotated image with faces to {annotated_result_path}")

# if __name__ == '__main__':
#     app.run(debug=True)
import torch
import torchvision
import os
import numpy as np
from torchvision import transforms
from PIL import Image, ImageDraw
import io
import time
import face_recognition  # For face detection
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import model

# Initialize Flask app
app = Flask(__name__)
CORS(app, resources={"/*": {"origins": "http://localhost:5173"}})
app.config['RES_DIR'] = 'data/static'

@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({"error": "No Image"}), 400

    # Read and preprocess image
    image_file = request.files['image']
    image = Image.open(io.BytesIO(image_file.read())).convert('RGB')

    # Scale the image
    data_lowlight_np = np.asarray(image) / 255.0
    data_lowlight_tensor = torch.from_numpy(data_lowlight_np).float().permute(2, 0, 1).unsqueeze(0)

    model_path = r'E:\projects\low\snapshots\Epoch99.pth'

    # Load the model
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    DCE_net = model.enhance_net_nopool().to(device)
    DCE_net.load_state_dict(torch.load(model_path, map_location=device))
    DCE_net.eval()

    # Process the image
    data_lowlight_tensor = data_lowlight_tensor.to(device)
    start_time = time.time()
    _, enhanced_image, _ = DCE_net(data_lowlight_tensor)
    processing_time = time.time() - start_time
    print(f"Processing time: {processing_time:.4f} seconds")

    # Create result directory if it doesn't exist
    result_dir = app.config['RES_DIR']
    os.makedirs(result_dir, exist_ok=True)

    # Convert enhanced image to numpy
    enhanced_image_np = (
        enhanced_image.squeeze(0).permute(1, 2, 0).detach().cpu().numpy()
    )
    enhanced_image_np = (enhanced_image_np * 255).astype(np.uint8)

    # Save enhanced image
    enhanced_image_path = os.path.join(result_dir, "enhanced_image.jpg")
    Image.fromarray(enhanced_image_np).save(enhanced_image_path)

    # Perform face detection
    face_locations = face_recognition.face_locations(enhanced_image_np)

    response_data = {"enhanced_image_url": f"http://localhost:5000/static/enhanced_image.jpg"}

    # Annotate image if faces are detected
    if face_locations:
        print(f"Found {len(face_locations)} face(s) in the image.")
        enhanced_image_pil = Image.fromarray(enhanced_image_np)
        draw = ImageDraw.Draw(enhanced_image_pil)
        for top, right, bottom, left in face_locations:
            draw.rectangle([left, top, right, bottom], outline="red", width=2)

        # Save annotated image with face detection
        annotated_image_path = os.path.join(result_dir, "enhanced_with_faces.jpg")
        enhanced_image_pil.save(annotated_image_path)
        response_data["annotated_image_url"] = f"http://localhost:5000/static/enhanced_with_faces.jpg"
    else:
        print("No faces detected.")

    return jsonify(response_data)

@app.route('/static/<filename>')
def send_file_from_server(filename):
    return send_from_directory(app.config['RES_DIR'], filename)

if __name__ == '__main__':
    app.run(debug=True)


