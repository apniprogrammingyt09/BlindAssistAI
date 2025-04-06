from fastapi import FastAPI, File, UploadFile, HTTPException
import cv2
import numpy as np
from ultralytics import YOLO
import io
from PIL import Image

app = FastAPI()

# Load YOLOv8 Nano model
model = YOLO("yolov8n.pt")

WALKING_OBSTACLES = [
    "car", "bus", "truck", "person", "dog", "bicycle", "motorbike",
    "traffic light", "stop sign", "construction barrier", "wall",
    "pole", "rail track", "stairs"
]

previous_obstacles = {}  # Stores last detected obstacles


@app.post("/detect")
async def detect_obstacles(file: UploadFile = File(...)):
    global previous_obstacles
    
    try:
        # Read image file
        image_bytes = await file.read()
        image_np = np.array(Image.open(io.BytesIO(image_bytes)))

        # Convert to correct format
        frame = cv2.cvtColor(image_np, cv2.COLOR_RGB2BGR)
        frame = cv2.resize(frame, (640, 480))  # Resize for speed

        # Run YOLO model
        results = model(frame, conf=0.4)
        current_obstacles = {}

        for result in results:
            for box in result.boxes:
                x1, y1, x2, y2 = map(int, box.xyxy[0])
                conf = box.conf[0].item()
                label = result.names[int(box.cls[0])]

                if label in WALKING_OBSTACLES and conf > 0.4:
                    width, height = x2 - x1, y2 - y1
                    object_center = (x1 + x2) // 2
                    frame_center = frame.shape[1] // 2

                    if width * height < 5000:  # Ignore small (far) objects
                        continue

                    # Determine distance based on bounding box size
                    if width * height < 15000:
                        distance = "Far"
                    elif width * height < 30000:
                        distance = "Medium"
                    else:
                        distance = "Near"

                    # Determine position relative to frame center
                    if object_center < frame_center - 100:
                        position = "Left"
                    elif object_center > frame_center + 100:
                        position = "Right"
                    else:
                        position = "Center"
                    
                    current_obstacles[label] = {"distance": distance, "position": position}

        # Compare with previous frame detections
        changes = {}

        for obj, details in current_obstacles.items():
            prev_details = previous_obstacles.get(obj)
            if prev_details is None or prev_details != details:
                changes[obj] = details  # Object detected or changed

        for obj in previous_obstacles:
            if obj not in current_obstacles:
                changes[obj] = {"status": "Removed"}  # Object removed

        # If there are changes, update and return response
        if changes:
            previous_obstacles = current_obstacles.copy()
            
            return {"detected_changes": changes}

        return {}  # Return empty if no changes detected

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")