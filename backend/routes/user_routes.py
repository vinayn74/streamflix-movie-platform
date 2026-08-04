from datetime import datetime
from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models.user import User
from models.favorite import Favorite
from models.watchlist import Watchlist
from models.history import History
from models.continue_watching import ContinueWatching
from utils.response_utils import error_response, success_response

user_bp = Blueprint('user', __name__, url_prefix='/api/user')

def parse_user_id(identity):
    if isinstance(identity, dict):
        return int(identity.get('id') or identity.get('_id'))
    return int(identity)


@user_bp.route('/favorites', methods=['GET'])
@jwt_required()
def get_favorites():
    try:
        user_id = parse_user_id(get_jwt_identity())
        favorites = Favorite.query.filter_by(user_id=user_id).order_by(Favorite.created_at.desc()).all()
        return success_response([f.to_dict() for f in favorites], 200)
    except Exception as e:
        return error_response('Failed to fetch favorites', 500)


@user_bp.route('/favorites', methods=['POST'])
@jwt_required()
def toggle_favorite():
    try:
        user_id = parse_user_id(get_jwt_identity())
        movie = request.get_json() or {}
        movie_id_raw = movie.get('id')

        if not movie_id_raw:
            return error_response('Movie payload required', 400)

        try:
            movie_id = int(movie_id_raw)
        except (ValueError, TypeError):
            return error_response('Invalid movie ID', 400)

        existing = Favorite.query.filter_by(user_id=user_id, movie_id=movie_id).first()
        if existing:
            db.session.delete(existing)
        else:
            new_fav = Favorite(
                user_id=user_id,
                movie_id=movie_id,
                title=str(movie.get('title') or 'Untitled'),
                poster_path=str(movie.get('poster_path') or ''),
                vote_average=float(movie.get('vote_average') or 0.0),
                release_date=str(movie.get('release_date') or ''),
                media_type=str(movie.get('media_type') or 'movie')
            )
            db.session.add(new_fav)

        db.session.commit()
        favorites = Favorite.query.filter_by(user_id=user_id).order_by(Favorite.created_at.desc()).all()
        return success_response([f.to_dict() for f in favorites], 200)
    except Exception as e:
        db.session.rollback()
        return error_response('Error updating favorites', 500)


@user_bp.route('/watchlist', methods=['GET'])
@jwt_required()
def get_watchlist():
    try:
        user_id = parse_user_id(get_jwt_identity())
        watchlist_items = Watchlist.query.filter_by(user_id=user_id).order_by(Watchlist.created_at.desc()).all()
        return success_response([w.to_dict() for w in watchlist_items], 200)
    except Exception as e:
        return error_response('Failed to fetch watchlist', 500)


@user_bp.route('/watchlist', methods=['POST'])
@jwt_required()
def toggle_watchlist():
    try:
        user_id = parse_user_id(get_jwt_identity())
        movie = request.get_json() or {}
        movie_id_raw = movie.get('id')

        if not movie_id_raw:
            return error_response('Movie payload required', 400)

        try:
            movie_id = int(movie_id_raw)
        except (ValueError, TypeError):
            return error_response('Invalid movie ID', 400)

        existing = Watchlist.query.filter_by(user_id=user_id, movie_id=movie_id).first()
        if existing:
            db.session.delete(existing)
        else:
            new_item = Watchlist(
                user_id=user_id,
                movie_id=movie_id,
                title=str(movie.get('title') or 'Untitled'),
                poster_path=str(movie.get('poster_path') or ''),
                vote_average=float(movie.get('vote_average') or 0.0),
                release_date=str(movie.get('release_date') or ''),
                media_type=str(movie.get('media_type') or 'movie')
            )
            db.session.add(new_item)

        db.session.commit()
        watchlist_items = Watchlist.query.filter_by(user_id=user_id).order_by(Watchlist.created_at.desc()).all()
        return success_response([w.to_dict() for w in watchlist_items], 200)
    except Exception as e:
        db.session.rollback()
        return error_response('Error updating watchlist', 500)


@user_bp.route('/history', methods=['GET'])
@jwt_required()
def get_history():
    try:
        user_id = parse_user_id(get_jwt_identity())
        history_items = History.query.filter_by(user_id=user_id).order_by(History.watched_at.desc()).all()
        return success_response([h.to_dict() for h in history_items], 200)
    except Exception as e:
        return error_response('Failed to fetch history', 500)


@user_bp.route('/history', methods=['POST'])
@jwt_required()
def add_to_history():
    try:
        user_id = parse_user_id(get_jwt_identity())
        movie = request.get_json() or {}
        movie_id_raw = movie.get('id')

        if not movie_id_raw:
            return error_response('Movie payload required', 400)

        try:
            movie_id = int(movie_id_raw)
        except (ValueError, TypeError):
            return error_response('Invalid movie ID', 400)

        existing = History.query.filter_by(user_id=user_id, movie_id=movie_id).first()
        if existing:
            existing.watched_at = datetime.utcnow()
        else:
            new_hist = History(
                user_id=user_id,
                movie_id=movie_id,
                title=str(movie.get('title') or 'Untitled'),
                poster_path=str(movie.get('poster_path') or '')
            )
            db.session.add(new_hist)

        db.session.commit()
        history_items = History.query.filter_by(user_id=user_id).order_by(History.watched_at.desc()).all()
        return success_response([h.to_dict() for h in history_items], 200)
    except Exception as e:
        db.session.rollback()
        return error_response('Error updating watch history', 500)


@user_bp.route('/continue-watching', methods=['GET'])
@jwt_required()
def get_continue_watching():
    try:
        user_id = parse_user_id(get_jwt_identity())
        cw_items = ContinueWatching.query.filter_by(user_id=user_id).order_by(ContinueWatching.updated_at.desc()).all()
        return success_response([cw.to_dict() for cw in cw_items], 200)
    except Exception as e:
        return error_response('Failed to fetch continue watching', 500)


@user_bp.route('/continue-watching', methods=['POST'])
@jwt_required()
def update_continue_watching():
    try:
        user_id = parse_user_id(get_jwt_identity())
        data = request.get_json() or {}
        movie = data.get('movie') or data
        progress = data.get('progress', 50)
        movie_id_raw = movie.get('id')

        if not movie_id_raw:
            return error_response('Movie payload required', 400)

        try:
            movie_id = int(movie_id_raw)
        except (ValueError, TypeError):
            return error_response('Invalid movie ID', 400)

        existing = ContinueWatching.query.filter_by(user_id=user_id, movie_id=movie_id).first()
        if existing:
            existing.progress = float(progress)
            existing.updated_at = datetime.utcnow()
        else:
            new_cw = ContinueWatching(
                user_id=user_id,
                movie_id=movie_id,
                title=str(movie.get('title') or 'Untitled'),
                poster_path=str(movie.get('poster_path') or ''),
                progress=float(progress)
            )
            db.session.add(new_cw)

        db.session.commit()
        cw_items = ContinueWatching.query.filter_by(user_id=user_id).order_by(ContinueWatching.updated_at.desc()).all()
        return success_response([cw.to_dict() for cw in cw_items], 200)
    except Exception as e:
        db.session.rollback()
        return error_response('Error updating continue watching', 500)
