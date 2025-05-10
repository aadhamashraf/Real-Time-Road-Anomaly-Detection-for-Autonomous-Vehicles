# Real-Time-Road-Anomaly-Detection-for-Autonomous-Vehicles
This web application uses Flask to provide a user interface for detecting different types of road damage in uploaded images. It leverages several pre-trained deep learning models, including YOLOv8, VGG16, ResNet50 (VGG19 architecture), EfficientNetB3, EfficientNetV2L (VGG19 architecture), and DenseNet201, to identify and classify common road surface defects.

This application is also containerized using Docker for easy deployment and portability.

## Features

* **Image Upload:** Allows users to upload one or multiple images for analysis.
* **Model Selection:** Users can choose which deep learning model to use for the detection process. The available models are:
    * YOLOv8
    * VGG16
    * ResNet50 (Note: The code indicates this uses a "best\_modelVGG19\_fixed5.keras" file, suggesting it might be a VGG19-based model instead of a pure ResNet50.)
    * VGG19
    * EfficientNetV2L (Note: The code indicates this uses a "best\_modelVGG19\_fixed5.keras" file, suggesting it might be a VGG19-based model instead of a pure EfficientNetV2L.)
    * EfficientNetB3
    * DenseNet201
* **Road Damage Detection:** The selected model analyzes the uploaded image(s) to detect the presence of the following types of road damage:
    * Longitudinal Crack
    * Transverse Crack
    * Alligator Crack
    * Pothole
    * Other Damage
* **Visual Output:** The application processes the image(s) by either drawing bounding boxes around detected objects (for YOLOv8) or by adding text labels indicating the detected damage types (for other classification models). A black border is added to the processed images.
* **Processed Image Display:** The processed image(s) are saved and then displayed back to the user in the web browser.
* **Dockerized Application:** The application can be easily built and run using Docker, ensuring a consistent environment across different systems.

The `modeling/` directory is crucial as it contains the pre-trained weights that enable the deep learning models to perform road damage detection. The application code (`app.py`) loads these weights during initialization.

## Setup

1.  **Clone the repository** (if applicable) or download the application files.
2.  **Install Python Dependencies (Optional - if using Docker):** If you are not using Docker, ensure you have Python 3 installed. Install the required Python libraries using pip:
    ```bash
    pip install Flask opencv-python ultralytics tensorflow keras matplotlib numpy
    ```
3.  **Ensure Model Weights are Present:** Verify that all the model weight files listed in the `Directory Structure` are present in the `modeling/` directory. You might need to download these separately and place them there.

## Running the Application

### Using Docker (Recommended)

1.  **Build the Docker Image:** Navigate to the application's root directory in your terminal and build the Docker image:
    ```bash
    docker build -t road-damage-detection .
    ```
2.  **Run the Docker Container:** Run the Docker container, mapping the container's port 5000 to your host's port 5000:
    ```bash
    docker run -p 5000:5000 road-damage-detection
    ```
3.  Open your web browser and go to `http://localhost:5000/` to access the application.

### Without Docker (For Development/Testing)

1.  **Install Python Dependencies:** Ensure you have installed the dependencies as mentioned in the "Setup" section.
2.  **Run the Flask Development Server:** Navigate to the application's directory in your terminal and run the Flask development server:
    ```bash
    python app.py
    ```
3.  Open your web browser and go to `http://127.0.0.1:5000/` to access the application.

## Usage

1.  On the web interface, you will see an upload section with a file selection button and a dropdown menu to choose the detection model.
2.  Click the "Choose Files" button to select one or more image files from your computer.
3.  Select the desired model from the dropdown menu.
4.  Click the "Upload" button to send the image(s) to the server for processing.
5.  Once the processing is complete, the processed image(s) will be displayed on the page, showing the detected road damage.

## Notes

* The accuracy and performance of the detection depend on the chosen model and the quality of the input images.
* The threshold for binary classification (0.4 for VGG16, DenseNet201, EfficientNetB3 and 0.5 for VGG19) can be adjusted in the `process_image` function to control the sensitivity of the damage detection.
* YOLOv8 performs object detection by drawing bounding boxes around the detected damage, while the other models perform image classification and label the entire image with the detected damage types.
* Using Docker ensures that the application runs in a consistent environment, regardless of your local system configuration.
