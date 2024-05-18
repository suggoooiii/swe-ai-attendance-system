from flask import Flask, request, jsonify
import face_recognition
import cv2
import numpy as np
import sqlite3
import os
from werkzeug.utils import secure_filename
import base64
from flask_cors import CORS
import logging

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

def get_db_connection():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    with sqlite3.connect('database.db') as conn:
        conn.execute('''CREATE TABLE IF NOT EXISTS faces
                        (id INTEGER PRIMARY KEY AUTOINCREMENT,
                         name TEXT NOT NULL,
                         encoding BLOB NOT NULL)''')
        conn.execute('''CREATE TABLE IF NOT EXISTS attendance
                        (id INTEGER PRIMARY KEY AUTOINCREMENT,
                         name TEXT NOT NULL,
                         date_time TEXT NOT NULL)''')

@app.before_first_request
def initialize_database():
    init_db()

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
    print(file)
    name = request.form['name']
    print(name)
    if file.filename == '':
        return jsonify({"error": "No selected file"})
    if file:
        if not os.path.exists('uploads'):
            os.makedirs('uploads')
            
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

@app.route('/verify_identity', methods=['POST'])
def verify_identity():
    data = request.json
    if not data or 'image' not in data:
        logging.error("Invalid request data: %s", data)
        return jsonify({"error": "Invalid request data"}), 400

    try:
        image_data = data['image'].split(',')[1]
        image_data = base64.b64decode(image_data)
        logging.debug('Image data: %s', image_data)
        np_array = np.frombuffer(image_data, np.uint8)
        image = cv2.imdecode(np_array, cv2.IMREAD_COLOR)
        print('image', image)

        face_encodings = face_recognition.face_encodings(image)
        if len(face_encodings) > 0:
            face_encoding = face_encodings[0]
            conn = get_db_connection()
            known_faces = conn.execute('SELECT * FROM faces').fetchall()
            logging.debug('Known faces: %s', known_faces)

            matches = face_recognition.compare_faces(
                [np.frombuffer(known_face['encoding'], dtype=np.float64) for known_face in known_faces],
                face_encoding
            )

            if True in matches:
                matched_index = matches.index(True)
                student_name = known_faces[matched_index]['name']
                
                # Mark attendance
                conn.execute('INSERT INTO attendance (name, date_time) VALUES (?, datetime("now"))', (student_name,))
                conn.commit()
                conn.close()
                
                return jsonify({"status": "Identity Verified", "name": student_name})
            else:
                conn.close()
                return jsonify({"status": "Identity Not Verified"})
        else:
            return jsonify({"error": "No face detected"})
    except Exception as e:
        logging.error("Error processing image data: %s", e)
        return jsonify({"error": "Error processing image data"}), 500

if __name__ == '__main__':
    app.run(debug=True)