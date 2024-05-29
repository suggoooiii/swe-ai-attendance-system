# app.py
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, create_refresh_token, jwt_required, get_jwt_identity, jwt_refresh_token_required
from werkzeug.security import generate_password_hash, check_password_hash
import enum

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['JWT_SECRET_KEY'] = 'your_secret_key'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = 900  # Access token expires in 15 minutes
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = 2592000  # Refresh token expires in 30 days
db = SQLAlchemy(app)
jwt = JWTManager(app)

class Role(enum.Enum):
    ADMIN = 'admin'
    USER = 'user'

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    role = db.Column(db.Enum(Role), default=Role.USER, nullable=False)

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    hashed_password = generate_password_hash(data['password'], method='sha256')
    new_user = User(username=data['username'], password=hashed_password, role=Role.USER)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "User registered successfully"}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()
    if user and check_password_hash(user.password, data['password']):
        access_token = create_access_token(identity={'username': user.username, 'role': user.role.name})
        refresh_token = create_refresh_token(identity={'username': user.username, 'role': user.role.name})
        return jsonify(access_token=access_token, refresh_token=refresh_token)
    return jsonify({"error": "Invalid credentials"}), 401

@app.route('/refresh', methods=['POST'])
@jwt_refresh_token_required
def refresh():
    current_user = get_jwt_identity()
    new_access_token = create_access_token(identity=current_user)
    return jsonify(access_token=new_access_token)

@app.route('/protected', methods=['GET'])
@jwt_required
def protected():
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200

@app.route('/admin', methods=['GET'])
@jwt_required
def admin():
    current_user = get_jwt_identity()
    if current_user['role'] != 'ADMIN':
        return jsonify({"error": "Access forbidden"}), 403
    return jsonify(message="Welcome Admin"), 200

if __name__ == '__main__':
    db.create_all()
    app.run(debug=True)