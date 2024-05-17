import face_recognition
import cv2
import numpy as np
import os
import datetime
import sqlite3

# Path to the directory containing registered users' images
registered_images_path = 'registered_users/'
db_path = 'attendance.db'

# Initialize and connect to the database
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Create the attendance table if it doesn't exist
cursor.execute('''
CREATE TABLE IF NOT EXISTS attendance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT NOT NULL
)
''')
conn.commit()

# Function to load registered users' images and learn their encodings
def load_registered_users():
    known_face_encodings = []
    known_face_names = []

    for filename in os.listdir(registered_images_path):
        if filename.endswith('.jpg') or filename.endswith('.png'):
            img_path = os.path.join(registered_images_path, filename)
            img = face_recognition.load_image_file(img_path)
            img_encodings = face_recognition.face_encodings(img)
            if img_encodings:
                known_face_encodings.append(img_encodings[0])
                known_face_names.append(os.path.splitext(filename)[0])
    
    return known_face_encodings, known_face_names

# Load registered users' images and learn their encodings
known_face_encodings, known_face_names = load_registered_users()

# Initialize some variables
face_locations = []
face_encodings = []
face_names = []
process_this_frame = True

def mark_attendance(name):
    current_time = datetime.datetime.now()
    date_str = current_time.strftime("%Y-%m-%d")
    time_str = current_time.strftime("%H:%M:%S")
    cursor.execute('''
    INSERT INTO attendance (name, date, time) VALUES (?, ?, ?)
    ''', (name, date_str, time_str))
    conn.commit()

def register_new_user(frame, name):
    # Save the frame as a new user's image
    img_path = os.path.join(registered_images_path, f"{name}.jpg")
    cv2.imwrite(img_path, frame)

    # Reload registered users
    global known_face_encodings, known_face_names
    known_face_encodings, known_face_names = load_registered_users()

# Start the video capture
video_capture = cv2.VideoCapture(0)

if not video_capture.isOpened():
    print("Error: Could not open video capture")
    exit()

while True:
    user_input = input("Enter 'r' to register a new user, 'c' to start attendance tracking, or 'q' to quit: ")
    
    if user_input == 'r':
        new_user_name = input("Enter the name of the new user: ")
        ret, frame = video_capture.read()
        if ret and frame is not None:
            register_new_user(frame, new_user_name)
            print(f"New user {new_user_name} registered.")
        else:
            print("Failed to capture frame for user registration.")
    
    elif user_input == 'c':
        break
    
    elif user_input == 'q':
        video_capture.release()
        cv2.destroyAllWindows()
        conn.close()
        exit()
    
    else:
        
        # Grab a single frame of video
        ret, frame = video_capture.read()
        print("Invalid input. Please try again.")
        if not ret or frame is None:
            print("Failed to grab frame")
            break

    # Resize frame for faster processing
    small_frame = cv2.resize(frame, (0, 0), fx=0.25, fy=0.25)

    # Convert the image from BGR color (which OpenCV uses) to RGB color (which face_recognition uses)
    rgb_small_frame = small_frame[:, :, ::-1]

    if process_this_frame:
        # Find all the faces and face encodings in the current frame of video
        face_locations = face_recognition.face_locations(rgb_small_frame)
        face_encodings = face_recognition.face_encodings(rgb_small_frame, face_locations)

        face_names = []
        for face_encoding in face_encodings:
            matches = face_recognition.compare_faces(known_face_encodings, face_encoding)
            name = "Unknown"

            face_distances = face_recognition.face_distance(known_face_encodings, face_encoding)
            best_match_index = np.argmin(face_distances)
            if matches[best_match_index]:
                name = known_face_names[best_match_index]

            face_names.append(name)
            if name != "Unknown":
                mark_attendance(name)

    process_this_frame = not process_this_frame

    # Display the results
    for (top, right, bottom, left), name in zip(face_locations, face_names):
        top *= 4
        right *= 4
        bottom *= 4
        left *= 4

        # Draw a box around the face
        cv2.rectangle(frame, (left, top), (right, bottom), (0, 0, 255), 2)

        # Draw a label with a name below the face
        cv2.rectangle(frame, (left, bottom - 35), (right, bottom), (0, 0, 255), cv2.FILLED)
        font = cv2.FONT_HERSHEY_DUPLEX
        cv2.putText(frame, name, (left + 6, bottom - 6), font, 1.0, (255, 255, 255), 1)

    # Display the resulting image
    cv2.imshow('Video', frame)

    # Check for user input to register a new user
    if cv2.waitKey(1) & 0xFF == ord('r'):
        new_user_name = input("Enter the name of the new user: ")
        register_new_user(frame, new_user_name)
        print(f"New user {new_user_name} registered.")

    # Hit 'q' on the keyboard to quit!
    if cv2.waitKey(1) & 0xFF == ord('q'):
            break

# Release handle to the webcam
video_capture.release()
cv2.destroyAllWindows()

# Close the database connection
conn.close()