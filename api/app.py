from flask import Flask, jsonify, request
import mysql.connector
from mysql.connector import Error
import re
from dotenv import load_dotenv
import os
import sendgrid
from sendgrid.helpers.mail import Mail
import secrets
from datetime import datetime, timedelta
from flask_cors import CORS

app = Flask(__name__)
# Enable CORS for all routes
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:5173", "https://legally-up-nu.vercel.app"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# For Vercel Python serverless: expose 'app' at module level
# (Vercel looks for 'app' in this file)

load_dotenv()
SENDGRID_API_KEY = os.getenv('SENDGRID_API_KEY')
SENDGRID_FROM_EMAIL = os.getenv('SENDGRID_FROM_EMAIL')

# MySQL database configuration
DB_CONFIG = {
    'host': 'trolley.proxy.rlwy.net',
    'port': 28889,
    'user': 'root',
    'password': 'cLvJtIXnDdDjwGOSvBnFbxrDfBzsLOjh',
    'database': 'railway'
}

# In-memory OTP store for demo (use persistent store in production)
otp_store = {}
OTP_EXPIRY_MINUTES = 10

def init_db():
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                verified BOOLEAN DEFAULT FALSE
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
                case_type VARCHAR(255),
                status VARCHAR(255),
                metadata TEXT
            )
        ''')
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS contact_forms (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                subject VARCHAR(255),
                message TEXT NOT NULL,
                submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
            )
        ''')
        cursor.close()
        conn.close()
    except Error as e:
        print('DB init error:', e)

init_db()

def generate_otp():
    return str(secrets.randbelow(1000000)).zfill(6)

def send_otp_email(email, otp, purpose):
    subject = 'LegallyUp - ' + ('Registration OTP' if purpose == 'register' else 'Password Reset OTP')
    
    # Common CSS styles
    styles = """
        .container { 
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9f9f9;
            border-radius: 10px;
        }
        .header {
            text-align: center;
            padding: 20px 0;
            border-bottom: 2px solid #eee;
        }
        .content {
            padding: 30px 0;
            text-align: center;
        }
        .otp-code {
            font-size: 32px;
            font-weight: bold;
            color: #2563eb;
            letter-spacing: 5px;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 5px;
            margin: 20px 0;
            display: inline-block;
        }
        .footer {
            text-align: center;
            color: #666;
            font-size: 14px;
            padding-top: 20px;
            border-top: 1px solid #eee;
        }
    """

    if purpose == 'register':
        html_content = f"""
            <html>
            <head>
                <style>{styles}</style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Welcome to LegallyUp!</h1>
                    </div>
                    <div class="content">
                        <p>Thank you for registering with LegallyUp. To complete your registration, please use the following OTP code:</p>
                        <div class="otp-code">{otp}</div>
                        <p>This code will expire in {OTP_EXPIRY_MINUTES} minutes.</p>
                    </div>
                    <div class="footer">
                        <p>If you didn't request this registration, please ignore this email.</p>
                        <p>© {datetime.now().year} LegallyUp. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        """
    else:
        html_content = f"""
            <html>
            <head>
                <style>{styles}</style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Password Reset Request</h1>
                    </div>
                    <div class="content">
                        <p>You have requested to reset your password for your LegallyUp account. Please use the following OTP code to proceed:</p>
                        <div class="otp-code">{otp}</div>
                        <p>This code will expire in {OTP_EXPIRY_MINUTES} minutes.</p>
                    </div>
                    <div class="footer">
                        <p>If you didn't request this password reset, please ignore this email.</p>
                        <p>© {datetime.now().year} LegallyUp. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        """

    sg = sendgrid.SendGridAPIClient(api_key=SENDGRID_API_KEY)
    message = Mail(
        from_email=SENDGRID_FROM_EMAIL,
        to_emails=email,
        subject=subject,
        html_content=html_content
    )
    sg.send(message)

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    print('Received registration data:', data)
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    otp = data.get('otp')

    if not username or not email or not password or not otp:
        print('Missing required fields')
        return jsonify({'error': 'Missing required fields'}), 400

    # Check OTP validity
    record = otp_store.get(email)
    if not record or record['otp'] != otp or record['expires'] < datetime.utcnow() or record['purpose'] != 'register':
        return jsonify({'error': 'Invalid or expired OTP'}), 400

    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor(dictionary=True)
        # Check if user already exists
        cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
        if cursor.fetchone():
            cursor.close()
            conn.close()
            return jsonify({'error': 'Email already registered'}), 400
        sql = "INSERT INTO users (username, email, password, verified) VALUES (%s, %s, %s, TRUE)"
        cursor.execute(sql, (username, email, password))
        conn.commit()
        # Fetch the new user with plan
        cursor.execute("SELECT id, username, email, plan FROM users WHERE email = %s", (email,))
        user = cursor.fetchone()
        cursor.close()
        conn.close()
        del otp_store[email]
        print('User registered and verified successfully')
        return jsonify({'message': 'User registered and verified successfully', 'user': user}), 201
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
        sql = "SELECT id, username, email, plan FROM users WHERE email = %s AND password = %s"
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
    # status = data.get('status', 'pending')
    metadata = data.get('metadata')

    # Ensure preferred_time is a valid TIME string or None
    if preferred_time:
        if re.match(r'^\d{2}:\d{2}$', preferred_time):
            preferred_time = preferred_time + ':00'
        elif not re.match(r'^\d{2}:\d{2}:\d{2}$', preferred_time):
            preferred_time = None
    else:
        preferred_time = None

    # Validate required fields
    required_fields = [user_name, user_email, full_name, email, phone, preferred_date, reason_for_consult, case_type]
    if not all(required_fields):
        return jsonify({'error': 'Missing required fields'}), 400

    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor()
        sql = '''
            INSERT INTO consultations
            (user_id, user_name, user_email, attorney_id, attorney_name, full_name, email, phone, preferred_date, preferred_time, reason_for_consult, case_type, status, metadata)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        '''
        cursor.execute(sql, (
            user_id, user_name, user_email, attorney_id, attorney_name,
            full_name, email, phone, preferred_date, preferred_time, reason_for_consult, case_type, status, str(metadata) if metadata else None
        ))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'message': 'Consultation scheduled!'}), 201
    except Exception as e:
        print('Consultation error:', e)
        return jsonify({'error': str(e)}), 500

@app.route('/api/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    email = data.get('email')
    if not email:
        return jsonify({'error': 'Email is required'}), 400
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor(dictionary=True)
        sql = "SELECT id, username FROM users WHERE email = %s"
        cursor.execute(sql, (email,))
        user = cursor.fetchone()
        cursor.close()
        conn.close()
        if not user:
            return jsonify({'error': 'No user found with that email'}), 404
        # Generate a simple reset token (not stored, demo only)
        reset_token = secrets.token_urlsafe(32)
        reset_link = f"https://your-frontend-domain.com/reset-password?token={reset_token}&email={email}"
        # Send email via SendGrid
        sg = sendgrid.SendGridAPIClient(api_key=SENDGRID_API_KEY)
        message = Mail(
            from_email=SENDGRID_FROM_EMAIL,
            to_emails=email,
            subject='Password Reset Request',
            html_content=f"""
                <p>Hello {user['username']},</p>
                <p>You requested a password reset. Click the link below to reset your password:</p>
                <a href='{reset_link}'>Reset Password</a>
                <p>If you did not request this, please ignore this email.</p>
            """
        )
        try:
            sg.send(message)
            return jsonify({'message': 'Password reset email sent!'}), 200
        except Exception as e:
            print('SendGrid error:', e)
            return jsonify({'error': 'Failed to send email'}), 500
    except Exception as e:
        print('Forgot password error:', e)
        return jsonify({'error': str(e)}), 500

@app.route('/api/auth/send-otp', methods=['POST'])
def send_otp():
    data = request.get_json()
    email = data.get('email')
    purpose = data.get('purpose', 'register')
    if not email:
        return jsonify({'error': 'Email is required'}), 400
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
        user = cursor.fetchone()
        cursor.close()
        conn.close()
        if purpose == 'register':
            if user:
                return jsonify({'error': 'Email already registered'}), 400
        elif purpose == 'forgot':
            if not user:
                return jsonify({'error': 'No user found with that email'}), 404
        else:
            return jsonify({'error': 'Invalid OTP purpose'}), 400
        otp = generate_otp()
        otp_store[email] = {'otp': otp, 'expires': datetime.utcnow() + timedelta(minutes=OTP_EXPIRY_MINUTES), 'purpose': purpose}
        send_otp_email(email, otp, purpose)
        return jsonify({'message': 'OTP sent'}), 200
    except Exception as e:
        print('Send OTP error:', e)
        return jsonify({'error': 'Failed to send OTP'}), 500

@app.route('/api/auth/verify-otp', methods=['POST'])
def verify_otp():
    data = request.get_json()
    email = data.get('email')
    otp = data.get('otp')
    if not email or not otp:
        return jsonify({'error': 'Email and OTP are required'}), 400
    record = otp_store.get(email)
    if not record or record['otp'] != otp or record['expires'] < datetime.utcnow():
        return jsonify({'error': 'Invalid or expired OTP'}), 400
    # Optionally, mark user as verified in DB for registration
    if record['purpose'] == 'register':
        try:
            conn = mysql.connector.connect(**DB_CONFIG)
            cursor = conn.cursor()
            cursor.execute("UPDATE users SET verified = TRUE WHERE email = %s", (email,))
            conn.commit()
            cursor.close()
            conn.close()
        except Exception as e:
            print('Verify OTP DB error:', e)
            return jsonify({'error': 'Failed to verify user'}), 500
    del otp_store[email]
    return jsonify({'message': 'OTP verified'}), 200

@app.route('/api/auth/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json()
    email = data.get('email')
    otp = data.get('otp')
    new_password = data.get('newPassword')
    if not email or not otp or not new_password:
        return jsonify({'error': 'Email, OTP, and new password are required'}), 400
    record = otp_store.get(email)
    if not record or record['otp'] != otp or record['expires'] < datetime.utcnow() or record['purpose'] != 'forgot':
        return jsonify({'error': 'Invalid or expired OTP'}), 400
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor()
        cursor.execute("UPDATE users SET password = %s WHERE email = %s", (new_password, email))
        conn.commit()
        cursor.close()
        conn.close()
        del otp_store[email]
        return jsonify({'message': 'Password reset successful'}), 200
    except Exception as e:
        print('Reset password error:', e)
        return jsonify({'error': 'Failed to reset password'}), 500

@app.route('/api/contact', methods=['POST'])
def submit_contact_form():
    data = request.get_json()
    user_id = data.get('user_id')  # Optional, if user is logged in
    name = data.get('name')
    email = data.get('email')
    subject = data.get('subject')
    message = data.get('message')
    if not name or not email or not message:
        return jsonify({'error': 'Missing required fields'}), 400
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor()
        sql = """
            INSERT INTO contact_forms (user_id, name, email, subject, message)
            VALUES (%s, %s, %s, %s, %s)
        """
        cursor.execute(sql, (user_id, name, email, subject, message))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'message': 'Contact form submitted successfully!'}), 201
    except Exception as e:
        print('Contact form error:', e)
        return jsonify({'error': str(e)}), 500

if __name__ == "__main__":
    # For local development only
    app.run(host="0.0.0.0", port=5000, debug=True) 