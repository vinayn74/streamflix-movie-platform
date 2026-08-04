import requests
from flask import current_app

TMDB_BASE_URL = 'https://api.themoviedb.org/3'

def fetch_tmdb(endpoint, params=None):
    if params is None:
        params = {}
    
    api_key = current_app.config.get('TMDB_API_KEY', '4f4f1723d3e5c1e9571656f5152345f6')
    params['api_key'] = api_key

    try:
        response = requests.get(f"{TMDB_BASE_URL}{endpoint}", params=params, timeout=10)
        if response.status_code == 200:
            return response.json()
    except Exception as e:
        print(f"TMDB Request Error: {e}")
    return None
