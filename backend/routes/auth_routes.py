from flask import Blueprint, request
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from extensions import db
from models.user import User
from utils.response_utils import error_response, success_response

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

def parse_user_id(identity):
    if isinstance(identity, dict):
        return int(identity.get('id') or identity.get('_id'))
    return int(identity)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    if not name or not email or not password:
        return error_response('Please provide all required fields', 400)

    if len(str(password)) < 6:
        return error_response('Password must be at least 6 characters', 400)

    email_clean = str(email).strip().lower()
    existing_user = User.query.filter_by(email=email_clean).first()
    if existing_user:
        return error_response('User already exists with this email', 400)

    user = User(name=str(name).strip(), email=email_clean)
    user.set_password(str(password))

    try:
        db.session.add(user)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return error_response('Database error during user registration', 500)

    token = create_access_token(identity=str(user.id))
    user_dict = user.to_dict()
    user_dict['token'] = token

    return success_response(user_dict, 201)


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return error_response('Please provide email and password', 400)

    email_clean = str(email).strip().lower()
    user = User.query.filter_by(email=email_clean).first()

    if not user or not user.check_password(str(password)):
        return error_response('Invalid email or password', 401)

    token = create_access_token(identity=str(user.id))
    user_dict = user.to_dict()
    user_dict['token'] = token

    return success_response(user_dict, 200)


@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_me():
    try:
        identity = get_jwt_identity()
        user_id = parse_user_id(identity)
        user = db.session.get(User, user_id) or User.query.get(user_id)

        if not user:
            return error_response('User not found', 404)

        return success_response(user.to_dict(), 200)
    except Exception as e:
        return error_response('Invalid token identity', 401)


@auth_bp.route('/logout', methods=['POST'])
def logout():
    return success_response({'message': 'Logged out successfully'}, 200)
