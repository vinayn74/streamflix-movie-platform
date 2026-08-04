from datetime import datetime
from extensions import db

class History(db.Model):
    __tablename__ = 'history'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    movie_id = db.Column(db.Integer, nullable=False)
    title = db.Column(db.String(255), nullable=False)
    poster_path = db.Column(db.Text, nullable=True)
    watched_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __init__(self, user_id, movie_id, title, poster_path='', **kwargs):
        self.user_id = user_id
        self.movie_id = movie_id
        self.title = title
        self.poster_path = poster_path


    def to_dict(self):
        return {
            'id': self.movie_id,
            'title': self.title,
            'poster_path': self.poster_path,
            'watchedAt': self.watched_at.isoformat() if self.watched_at else None
        }
