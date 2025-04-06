import cv2
import numpy as np
from ultralytics import YOLO

# Load YOLOv8 Nano model (fastest version)
model = YOLO("yolov8n.pt")

# Open camera
cap = cv2.VideoCapture(0)

# List of walking obstacle classes
WALKING_OBSTACLES = [
    "car", "bus", "truck", "person", "dog", "bicycle", "motorbike",
    "traffic light", "stop sign", "construction barrier", "wall",
    "pole", "rail track", "stairs"
]

# Frame counter to skip frames (for better FPS)
frame_count = 0

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

    frame_count += 1
    if frame_count % 2 != 0:  # Skip every alternate frame for speed
        continue

    frame = cv2.resize(frame, (640, 480))  # Resize for speed

    # Run YOLO detection
    results = model(frame, conf=0.4)

    alert_message = ""

    for result in results:
        for box in result.boxes:
            x1, y1, x2, y2 = map(int, box.xyxy[0])  # Bounding box
            conf = box.conf[0].item()  # Confidence score
            label = result.names[int(box.cls[0])]  # Class label

            # Only process walking obstacles
            if label in WALKING_OBSTACLES and conf > 0.4:
                width = x2 - x1  # Width of bounding box
                height = y2 - y1  # Height of bounding box
                object_center = (x1 + x2) // 2
                frame_center = frame.shape[1] // 2

                # Ignore if the object is too small (far away)
                if width * height < 5000:  # Adjust threshold if needed
                    continue

                # Determine distance based on object size
                if width * height > 30000:  # Large bounding box = Near
                    distance = "Near"
                    color = (0, 0, 255)  # Red for near
                else:  # Medium-sized bounding box
                    distance = "Medium"
                    color = (0, 255, 255)  # Yellow for medium

                # Determine position of object
                if object_center < frame_center - 100:
                    position = "Left"
                elif object_center > frame_center + 100:
                    position = "Right"
                else:
                    position = "Center"

                # Create alert message
                alert_message = f"Obstacle {distance} - {position}"

                # Draw bounding box
                cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)

    # Display alert message on the screen
    if alert_message:
        cv2.putText(frame, alert_message, (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 0, 255), 2)

    cv2.imshow("Blind Assist AI - YOLOv8", frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()