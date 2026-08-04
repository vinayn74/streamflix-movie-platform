from datetime import datetime
from extensions import db, bcrypt

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __init__(self, name=None, email=None, password=None, **kwargs):
        self.name = name
        self.email = email
        if password:
            self.set_password(password)
        for key, value in kwargs.items():
            setattr(self, key, value)

    # Relationships with ordering (newest first)
    favorites = db.relationship(
        'Favorite', 
        backref='user', 
        cascade='all, delete-orphan', 
        order_by='desc(Favorite.created_at)',
        lazy=True
    )
    watchlist = db.relationship(
        'Watchlist', 
        backref='user', 
        cascade='all, delete-orphan', 
        order_by='desc(Watchlist.created_at)',
        lazy=True
    )
    history = db.relationship(
        'History', 
        backref='user', 
        cascade='all, delete-orphan', 
        order_by='desc(History.watched_at)',
        lazy=True
    )
    continue_watching = db.relationship(
        'ContinueWatching', 
        backref='user', 
        cascade='all, delete-orphan', 
        order_by='desc(ContinueWatching.updated_at)',
        lazy=True
    )

    def set_password(self, raw_password):
        self.password = bcrypt.generate_password_hash(raw_password).decode('utf-8')

    def check_password(self, raw_password):
        return bcrypt.check_password_hash(self.password, raw_password)

    def to_dict(self):
        return {
            '_id': str(self.id),
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'favorites': [f.to_dict() for f in self.favorites],
            'watchlist': [w.to_dict() for w in self.watchlist],
            'history': [h.to_dict() for h in self.history],
            'continueWatching': [cw.to_dict() for cw in self.continue_watching]
        }
