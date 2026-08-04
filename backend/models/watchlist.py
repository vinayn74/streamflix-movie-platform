from datetime import datetime
from extensions import db

class Watchlist(db.Model):
    __tablename__ = 'watchlist'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    movie_id = db.Column(db.Integer, nullable=False)
    title = db.Column(db.String(255), nullable=False)
    poster_path = db.Column(db.Text, nullable=True)
    vote_average = db.Column(db.Float, nullable=True, default=0.0)
    release_date = db.Column(db.String(50), nullable=True)
    media_type = db.Column(db.String(50), nullable=True, default='movie')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __init__(self, user_id, movie_id, title, poster_path='', vote_average=0.0, release_date='', media_type='movie', **kwargs):
        self.user_id = user_id
        self.movie_id = movie_id
        self.title = title
        self.poster_path = poster_path
        self.vote_average = vote_average
        self.release_date = release_date
        self.media_type = media_type


    def to_dict(self):
        return {
            'id': self.movie_id,
            'title': self.title,
            'poster_path': self.poster_path,
            'vote_average': self.vote_average,
            'release_date': self.release_date,
            'media_type': self.media_type
        }
