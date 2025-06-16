from flask import Flask, jsonify, request
import mysql.connector
from mysql.connector import Error

app = Flask(__name__)

# MySQL database configuration
DB_CONFIG = {
    'host': 'trolley.proxy.rlwy.net',
    'port': 28889,
    'user': 'root',
    'password': 'cLvJtIXnDdDjwGOSvBnFbxrDfBzsLOjh',
    'database': 'railway'
}

@app.route('/api/hello')
def hello():
    return jsonify({"message": "Hello from Flask!"})

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    print('Received registration data:', data)
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not username or not email or not password:
        print('Missing required fields')
        return jsonify({'error': 'Missing required fields'}), 400

    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor()
        # Ensure users table exists
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL
            )
        ''')
        sql = "INSERT INTO users (username, email, password) VALUES (%s, %s, %s)"
        cursor.execute(sql, (username, email, password))
        conn.commit()
        cursor.close()
        conn.close()
        print('User registered successfully')
        return jsonify({'message': 'User registered successfully'}), 201
    except Error as e:
        print('Registration error:', e)
        return jsonify({'error': str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True) 