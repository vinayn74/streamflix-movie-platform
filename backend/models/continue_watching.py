from datetime import datetime
from extensions import db

class ContinueWatching(db.Model):
    __tablename__ = 'continue_watching'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    movie_id = db.Column(db.Integer, nullable=False)
    title = db.Column(db.String(255), nullable=False)
    poster_path = db.Column(db.Text, nullable=True)
    progress = db.Column(db.Float, default=0.0)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __init__(self, user_id, movie_id, title, poster_path='', progress=0.0, **kwargs):
        self.user_id = user_id
        self.movie_id = movie_id
        self.title = title
        self.poster_path = poster_path
        self.progress = progress


    def to_dict(self):
        return {
            'id': self.movie_id,
            'title': self.title,
            'poster_path': self.poster_path,
            'progress': self.progress,
            'updatedAt': self.updated_at.isoformat() if self.updated_at else None
        }
