from flask import Flask, render_template, request, send_from_directory, jsonify
import os
import cv2
from ultralytics import YOLO
import matplotlib.pyplot as plt
from tensorflow.keras.preprocessing import image
# import tensorflow as tf
from tensorflow.keras.models import load_model
import numpy as np


app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads/'
app.config['PROCESSED_FOLDER'] = 'processed/'

os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
os.makedirs(app.config['PROCESSED_FOLDER'], exist_ok=True)
class_names = ['longitudinal_crack', 'transverse_crack', 'alligator_crack', 'pothole', 'other_damage']
VGG16Model = load_model("Models/best_vgg16FineTuned.keras")
YoloModel = YOLO("Models/yolov8n.pt")  
ResNet50Model = load_model("Models/best_modelVGG19_fixed5.keras")# This Will be Changed
EfficientNetB3Model = load_model("Models/best_efficientnetb3.keras")
EfficientNetV2LModel = load_model("Models/best_modelVGG19_fixed5.keras")# This Will be Changed
VGG19Model = load_model("Models/best_modelVGG19_fixed5.keras")
DenseNetModel = load_model("Models/best_densenet.keras")
models = {"VGG16":VGG16Model,
          "YOLOv8":YoloModel,
          "ResNet50":ResNet50Model,
          "VGG19":VGG19Model,
          "EfficientNetV2L":EfficientNetV2LModel,
          "EfficientNetB3":EfficientNetB3Model,
          "DenseNet201":DenseNetModel}
name = ""
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_image():
    checked_value = request.form.get('checked')
    print(f"User selected option: {checked_value}")
    name = checked_value
    if 'files' not in request.files:
        
        return jsonify({"error": "No files uploaded"}), 400

    files = request.files.getlist('files')
    processed_filenames = []

    for file in files:
        if file.filename == '':
            continue

        file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(file_path)

        output_filename = 'processed_' + file.filename
        output_path = os.path.join(app.config['PROCESSED_FOLDER'], output_filename)

        process_image(file_path, output_path, checked_value)
        processed_filenames.append(output_filename)

    return jsonify({"filenames": processed_filenames})

@app.route('/processed_video/<filename>')
def get_processed_video(filename):
    return send_from_directory(app.config['PROCESSED_FOLDER'], filename, mimetype='image/jpeg')



def process_image(input_path, output_path, checked_value):
    image = cv2.imread(input_path)
    present_classes = []
    resized_image = cv2.resize(image, (224, 224))
    predicted_class = ""
    img_array = np.expand_dims(resized_image, axis=0)  
    img_array = img_array / 255.0  
    if(checked_value != "YOLOv8"):
        if(checked_value == "VGG16"  or checked_value == "DenseNet201" or checked_value == "EfficientNetB3"):
            print("L")
            prediction = models[checked_value].predict(img_array)
            print(prediction)
            prediction = prediction[0]  
            print(prediction)

            binary_prediction = (prediction > 0.4).astype(int)

            print(binary_prediction)

            present_classes.append([class_names[i] for i in range(5) if binary_prediction[i] == 1])

            print(f"Detected classes: {present_classes}")
            y_offset = 30  

            for i in present_classes[0]:
                print(i)
                cv2.putText(image, i, (10, y_offset), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 0, 0), 2)
                y_offset += 30  
    
    
        if(checked_value =="VGG19"):
            prediction = models[checked_value].predict(img_array)

            prediction = prediction[0]  

            binary_prediction = (prediction > 0.5).astype(int)

            print(binary_prediction)

            present_classes = [class_names[i] for i in range(len(binary_prediction)) if binary_prediction[:, :, i].any()]

            print(f"Detected classes: {present_classes}")
            y_offset = 30  

            for i in present_classes:
                print(i)
                cv2.putText(image, i, (10, y_offset), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 0, 0), 2)
                y_offset += 30  
        
        
        print(predicted_class)
    else:
        print("LLLL")
        
        prediction = models[checked_value](resized_image)
        for result in prediction:
            for box in result.boxes:
                x1, y1, x2, y2 = box.xyxy[0].tolist()
                conf = box.conf[0]
                cls = int(box.cls[0])

                cv2.rectangle(image, (int(x1), int(y1)), (int(x2), int(y2)), (255, 0, 0), 2)
                label = f'{models[checked_value].names[cls]} {conf:.2f}'
                cv2.putText(image, label, (int(x1), int(y1) - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (255, 0, 0), 2)

        # Save the result
        cv2.imwrite(output_path, image)
        print(f"Processed image saved at{output_path}")

    

   
        
       
    
    
    border_color = (0, 0, 0)  
    border_thickness = 5  
    bordered_image = cv2.copyMakeBorder(image, border_thickness, border_thickness, 
                                        border_thickness, border_thickness, cv2.BORDER_CONSTANT, 
                                        value=border_color)

    cv2.imwrite(output_path, bordered_image)

    print(f"Processed Photo saved at {output_path}")






if __name__ == '__main__':
    app.run(debug=True)
