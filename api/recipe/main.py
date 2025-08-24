from http.server import BaseHTTPRequestHandler
import json
import os
from openai import OpenAI
import mysql.connector
import bcrypt
import jwt

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        # Enable CORS
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        
        # Parse request
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data.decode('utf-8'))
        
        # Route to correct function based on path
        path = self.path.split('/')[-1]
        
        if path == 'generate_recipe':
            result = self.generate_recipe(data)
        elif path == 'login':
            result = self.login(data)
        elif path == 'register':
            result = self.register(data)
        else:
            result = {'error': 'Unknown endpoint'}
        
        self.wfile.write(json.dumps(result).encode())
    
    def generate_recipe(self, data):
        client = OpenAI(api_key=os.environ.get('OPENAI_API_KEY'))
        # Your existing recipe generation logic
        return {'recipe': 'Generated recipe here'}
    
    def login(self, data):
        # Your existing login logic
        return {'success': True, 'token': 'dummy-token'}
    
    def register(self, data):
        # Your existing register logic
        return {'success': True, 'message': 'Registered'}
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
