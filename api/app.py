from flask import Flask, jsonify, request
import mysql.connector
from mysql.connector import Error
import re

app = Flask(__name__)

# MySQL database configuration
DB_CONFIG = {
    'host': 'trolley.proxy.rlwy.net',
    'port': 28889,
    'user': 'root',
    'password': 'cLvJtIXnDdDjwGOSvBnFbxrDfBzsLOjh',
    'database': 'railway'
}

def init_db():
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL
            )
        ''')
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS templates (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                title VARCHAR(255) NOT NULL,
                content TEXT NOT NULL,
                is_trashed BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        ''')
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS consultations (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT,
                user_name VARCHAR(255),
                user_email VARCHAR(255),
                attorney_id VARCHAR(32),
                attorney_name VARCHAR(255),
                full_name VARCHAR(255),
                email VARCHAR(255),
                phone VARCHAR(20),
                preferred_date DATE,
                preferred_time TIME,
                reason_for_consult TEXT,
                case_type VARCHAR(255)
            )
        ''')
        cursor.close()
        conn.close()
    except Error as e:
        print('DB init error:', e)

init_db()

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

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    print('Received login data:', data)
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        print('Missing required fields')
        return jsonify({'error': 'Missing required fields'}), 400

    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor(dictionary=True)
        sql = "SELECT id, username, email FROM users WHERE email = %s AND password = %s"
        cursor.execute(sql, (email, password))
        user = cursor.fetchone()
        cursor.close()
        conn.close()
        if user:
            print('Login successful for:', user)
            return jsonify({'message': 'Login successful', 'user': user}), 200
        else:
            print('Invalid email or password')
            return jsonify({'error': 'Invalid email or password'}), 401
    except Error as e:
        print('Login error:', e)
        return jsonify({'error': str(e)}), 500

# Template management endpoints
@app.route('/api/templates', methods=['POST'])
def create_template():
    data = request.get_json()
    user_id = data.get('user_id')
    title = data.get('title')
    content = data.get('content')
    if not user_id or not title or not content:
        return jsonify({'error': 'Missing required fields'}), 400
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor()
        sql = "INSERT INTO templates (user_id, title, content) VALUES (%s, %s, %s)"
        cursor.execute(sql, (user_id, title, content))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'message': 'Template created successfully'}), 201
    except Error as e:
        print('Create template error:', e)
        return jsonify({'error': str(e)}), 500

@app.route('/api/templates', methods=['GET'])
def get_templates():
    user_id = request.args.get('user_id')
    if not user_id:
        return jsonify({'error': 'Missing user_id'}), 400
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor(dictionary=True)
        sql = "SELECT * FROM templates WHERE user_id = %s AND is_trashed = FALSE ORDER BY created_at DESC"
        cursor.execute(sql, (user_id,))
        templates = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify({'templates': templates}), 200
    except Error as e:
        print('Get templates error:', e)
        return jsonify({'error': str(e)}), 500

@app.route('/api/templates/trash', methods=['GET'])
def get_trashed_templates():
    user_id = request.args.get('user_id')
    if not user_id:
        return jsonify({'error': 'Missing user_id'}), 400
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor(dictionary=True)
        sql = "SELECT * FROM templates WHERE user_id = %s AND is_trashed = TRUE ORDER BY created_at DESC"
        cursor.execute(sql, (user_id,))
        templates = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify({'templates': templates}), 200
    except Error as e:
        print('Get trashed templates error:', e)
        return jsonify({'error': str(e)}), 500

@app.route('/api/templates/<int:template_id>/trash', methods=['POST'])
def trash_template(template_id):
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor()
        sql = "UPDATE templates SET is_trashed = TRUE WHERE id = %s"
        cursor.execute(sql, (template_id,))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'message': 'Template moved to trash'}), 200
    except Error as e:
        print('Trash template error:', e)
        return jsonify({'error': str(e)}), 500

@app.route('/api/templates/<int:template_id>/restore', methods=['POST'])
def restore_template(template_id):
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor()
        sql = "UPDATE templates SET is_trashed = FALSE WHERE id = %s"
        cursor.execute(sql, (template_id,))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'message': 'Template restored from trash'}), 200
    except Error as e:
        print('Restore template error:', e)
        return jsonify({'error': str(e)}), 500

@app.route('/api/templates/<int:template_id>', methods=['PUT'])
def update_template(template_id):
    data = request.get_json()
    title = data.get('title')
    content = data.get('content')
    if not title or not content:
        return jsonify({'error': 'Missing required fields'}), 400
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor()
        sql = "UPDATE templates SET title = %s, content = %s WHERE id = %s"
        cursor.execute(sql, (title, content, template_id))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'message': 'Template updated successfully'}), 200
    except Error as e:
        print('Update template error:', e)
        return jsonify({'error': str(e)}), 500

@app.route('/api/templates/<int:template_id>', methods=['GET'])
def get_template(template_id):
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor(dictionary=True)
        sql = "SELECT * FROM templates WHERE id = %s"
        cursor.execute(sql, (template_id,))
        template = cursor.fetchone()
        cursor.close()
        conn.close()
        if template:
            return jsonify({'template': template}), 200
        else:
            return jsonify({'error': 'Template not found'}), 404
    except Error as e:
        print('Get template error:', e)
        return jsonify({'error': str(e)}), 500

@app.route('/api/consultations', methods=['POST'])
def create_consultation():
    data = request.get_json()
    user_id = data.get('userId')
    user_name = data.get('userName')
    user_email = data.get('userEmail')
    attorney_id = data.get('attorneyId')
    attorney_name = data.get('attorneyName')
    full_name = data.get('fullName')
    email = data.get('email')
    phone = data.get('phone')
    preferred_date = data.get('preferredDate')
    preferred_time = data.get('preferredTime')
    reason_for_consult = data.get('reasonForConsult')
    case_type = data.get('caseType')

    # Ensure preferred_time is a valid TIME string or None
    if preferred_time:
        # Accept 'HH:MM' or 'HH:MM:SS', else set to None
        if re.match(r'^\d{2}:\d{2}$', preferred_time):
            preferred_time = preferred_time + ':00'
        elif not re.match(r'^\d{2}:\d{2}:\d{2}$', preferred_time):
            preferred_time = None
    else:
        preferred_time = None

    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor()
        sql = '''
            INSERT INTO consultations
            (user_id, user_name, user_email, attorney_id, attorney_name, full_name, email, phone, preferred_date, preferred_time, reason_for_consult, case_type)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        '''
        cursor.execute(sql, (
            user_id, user_name, user_email, attorney_id, attorney_name,
            full_name, email, phone, preferred_date, preferred_time, reason_for_consult, case_type
        ))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'message': 'Consultation scheduled!'}), 201
    except Exception as e:
        print('Consultation error:', e)
        return jsonify({'error': str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True) 