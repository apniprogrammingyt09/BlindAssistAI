import cv2
import torch
import numpy as np
from fastapi import FastAPI, File, UploadFile
from ultralytics import YOLO
from typing import List, Dict
from io import BytesIO

app = FastAPI()

# Load YOLO Model
model = YOLO("yolov11s-face.pt")

# Constants for Distance Calculation
KNOWN_DISTANCE = 50  # cm
KNOWN_FACE_WIDTH = 14  # cm
REF_IMAGE_FACE_WIDTH = 120  # pixels
FOCAL_LENGTH = (REF_IMAGE_FACE_WIDTH * KNOWN_DISTANCE) / KNOWN_FACE_WIDTH
SCALING_FACTOR = 2.0  # Adjust based on real-world testing

# Previous state storage
previous_people = {}
THRESHOLD_DISTANCE_CHANGE = 50  # cm

# Function to Process Frame & Detect Faces
def process_frame(image: np.ndarray) -> List[Dict]:
    global previous_people
    results = model(image)
    frame_width = image.shape[1]
    current_people = {}
    detected_people = []
    
    for idx, result in enumerate(results):
        for i, box in enumerate(result.boxes):
            x1, y1, x2, y2 = map(int, box.xyxy[0])
            conf = box.conf[0].item()
            
            if conf > 0.5:  # Confidence threshold
                center_x = (x1 + x2) // 2
                face_width_pixels = x2 - x1
                
                # Determine Position
                if center_x < frame_width // 3:
                    position = "Left"
                elif center_x > 2 * frame_width // 3:
                    position = "Right"
                else:
                    position = "Center"
                
                # Estimate Distance
                if face_width_pixels > 0:
                    estimated_distance = (FOCAL_LENGTH * KNOWN_FACE_WIDTH) / face_width_pixels
                    estimated_distance *= SCALING_FACTOR
                else:
                    estimated_distance = -1  # Error case
                
                person_id = f"person{i+1}"
                current_people[person_id] = {
                    "distance": round(estimated_distance, 1),
                    "position": position
                }
    
    # Compare with previous state
    if previous_people:
        changes_detected = False
        for person_id, data in current_people.items():
            prev_data = previous_people.get(person_id)
            if not prev_data or abs(prev_data["distance"] - data["distance"]) > THRESHOLD_DISTANCE_CHANGE or prev_data["position"] != data["position"]:
                changes_detected = True
                break
        
        # Check if any person entered or left
        if set(current_people.keys()) != set(previous_people.keys()):
            changes_detected = True
        
        if not changes_detected:
            return []
    
    previous_people = current_people.copy()
    
    for person_id, data in current_people.items():
        detected_people.append({person_id: data})
    
    return detected_people

@app.post("/detect")
async def detect_faces(file: UploadFile = File(...)):
    image_data = await file.read()
    nparr = np.frombuffer(image_data, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    faces = process_frame(image)
    return {"people": faces}
    
