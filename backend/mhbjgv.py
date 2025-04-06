import cv2
import torch
from ultralytics import YOLO

model = YOLO("yolov11s-face.pt")

cap = cv2.VideoCapture(0)

is_front_camera = cap.get(cv2.CAP_PROP_FRAME_WIDTH) < 1000

KNOWN_DISTANCE = 50  # Distance in cm when reference image was taken
KNOWN_FACE_WIDTH = 14  # Average human face width in cm

# Reference face width in pixels at the known distance (You should measure this manually)
REF_IMAGE_FACE_WIDTH = 120

# Calculate focal length
FOCAL_LENGTH = (REF_IMAGE_FACE_WIDTH * KNOWN_DISTANCE) / KNOWN_FACE_WIDTH

print(f"Computed Focal Length: {FOCAL_LENGTH:.2f}")

# Scaling factor (Experimental, adjust based on testing)
SCALING_FACTOR = 2.0  # If the predicted distance is half of the real distance

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

    if is_front_camera:
        frame = cv2.flip(frame, 1)  # Flip horizontally for correct left/right orientation

    frame_width = frame.shape[1]

    # Run YOLO on the frame
    results = model(frame)

    left_count, center_count, right_count = 0, 0, 0

    for result in results:
        for box in result.boxes:
            x1, y1, x2, y2 = map(int, box.xyxy[0])
            conf = box.conf[0].item()

            if conf > 0.5:  # Confidence threshold
                center_x = (x1 + x2) // 2
                face_width_pixels = x2 - x1  # Detected face width in pixels

                # Determine position (left, center, right)
                if center_x < frame_width // 3:
                    position = "Left"
                    left_count += 1
                elif center_x > 2 * frame_width // 3:
                    position = "Right"
                    right_count += 1
                else:
                    position = "Center"
                    center_count += 1

                # Calculate distance using the corrected focal length formula
                if face_width_pixels > 0:
                    estimated_distance = (FOCAL_LENGTH * KNOWN_FACE_WIDTH) / face_width_pixels
                    estimated_distance *= SCALING_FACTOR  # Apply scaling fix
                    distance_text = f"{estimated_distance:.1f} cm"
                else:
                    distance_text = "Calculating..."

                # Draw bounding box & text
                cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
                cv2.putText(frame, f"{position}, {distance_text}", (x1, y1 - 10),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

    # Display object count
    count_text = f"Left: {left_count} | Center: {center_count} | Right: {right_count}"
    cv2.putText(frame, count_text, (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 255), 2)

    # Show the frame
    cv2.imshow("YOLOv11 Face Detection - Blind Assist AI", frame)

    # Press 'q' to exit
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()