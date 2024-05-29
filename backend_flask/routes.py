from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import face_recognition
import logging
from .database import get_db_connection
from .config import Config

app = Flask(__name__)
app.config.from_object(Config)

logger = logging.getLogger('face_registration')

@app.route('/register', methods=['POST'])
def register_face():
    logger.info('Received registration request')
    if 'file' not in request.files or 'name' not in request.form:
        logger.error('File and name are required')
        return jsonify({"error": "File and name are required"})

    file = request.files['file']
    name = request.form['name']

    if file.filename == '':
        logger.error('No selected file')
        return jsonify({"error": "No selected file"})

    if file:
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        logger.info(f'File saved to {file_path}')
        
        try:
            image = face_recognition.load_image_file(file_path)
            face_encodings = face_recognition.face_encodings(image)
        except Exception as e:
            logger.error(f'Error processing image: {e}')
            return jsonify({"error": "Error processing image"})

        if len(face_encodings) > 0:
            face_encoding = face_encodings[0]
            try:
                conn = get_db_connection()
                conn.execute('INSERT INTO faces (name, encoding) VALUES (?, ?)', (name, face_encoding.tobytes()))
                conn.commit()
                conn.close()
                logger.info(f'Face registered for {name}')
                return jsonify({"status": "Registration Successful"})
            except Exception as e:
                logger.error(f'Error saving to database: {e}')
                return jsonify({"error": "Database error"})
        else:
            logger.warning('No face detected')
            return jsonify({"error": "No face detected"})