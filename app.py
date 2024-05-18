from flask import Flask, request, jsonify
import face_recognition
import cv2
import numpy as np
import sqlite3
import os

app = Flask(__name__)

def get_db_connection():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/upload', methods=['POST'])
def upload_image():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"})
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"})
    if file:
        filename = secure_filename(file.filename)
        file_path = os.path.join('uploads', filename)
        file.save(file_path)

        # Process the image
        image = face_recognition.load_image_file(file_path)
        face_encodings = face_recognition.face_encodings(image)

        if len(face_encodings) > 0:
            face_encoding = face_encodings[0]
            conn = get_db_connection()
            known_faces = conn.execute('SELECT * FROM faces').fetchall()
            conn.close()

            for known_face in known_faces:
                known_face_encoding = np.frombuffer(known_face['encoding'], dtype=np.float64)
                matches = face_recognition.compare_faces([known_face_encoding], face_encoding)
                if True in matches:
                    return jsonify({"status": "Identity Verified", "name": known_face['name']})

            return jsonify({"status": "Identity Not Verified"})
        else:
            return jsonify({"error": "No face detected"})

@app.route('/register', methods=['POST'])
def register_face():
    if 'file' not in request.files or 'name' not in request.form:
        return jsonify({"error": "File and name are required"})
    file = request.files['file']
    name = request.form['name']
    if file.filename == '':
        return jsonify({"error": "No selected file"})
    if file:
        filename = secure_filename(file.filename)
        file_path = os.path.join('uploads', filename)
        file.save(file_path)

        # Process the image
        image = face_recognition.load_image_file(file_path)
        face_encodings = face_recognition.face_encodings(image)

        if len(face_encodings) > 0:
            face_encoding = face_encodings[0]
            conn = get_db_connection()
            conn.execute('INSERT INTO faces (name, encoding) VALUES (?, ?)', (name, face_encoding.tobytes()))
            conn.commit()
            conn.close()
            return jsonify({"status": "Registration Successful"})
        else:
            return jsonify({"error": "No face detected"})

if __name__ == '__main__':
    app.run(debug=True)
