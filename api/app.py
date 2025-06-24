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

@app.route("/")
def index():
    return {"message": "LegallyUp Backend is Running"}

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
                verified BOOLEAN DEFAULT FALSE,
                plan VARCHAR(32) DEFAULT 'free',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
            CREATE TABLE IF NOT EXISTS document_generation_logs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                document_type VARCHAR(255),
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
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS payments (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            plan ENUM('free', 'pro', 'attorney') NOT NULL,
            payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            amount DECIMAL(10, 2) NOT NULL,
            status ENUM('success', 'failed') NOT NULL,
            transaction_id VARCHAR(100) UNIQUE NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id)
            )
        ''')
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS plan_changes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                old_plan VARCHAR(32) NOT NULL,
                new_plan VARCHAR(32) NOT NULL,
                payment_id INT,
                change_reason ENUM('payment', 'system', 'expiration', 'user_request') NOT NULL,
                changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE SET NULL
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

    # Check if user can generate document
    can_generate, error_message = check_and_log_document_generation(user_id)
    if not can_generate:
        return jsonify({'error': error_message}), 403

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

@app.route('/api/payments/select-plan', methods=['POST'])
def select_plan():
    data = request.get_json()
    user_id = data.get('user_id')
    plan = data.get('plan')

    if not user_id or not plan:
        return jsonify({'error': 'Missing required fields'}), 400

    if plan not in ['free', 'pro', 'attorney']:
        return jsonify({'error': 'Invalid plan selected'}), 400

    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor(dictionary=True)

        # Check current user plan
        cursor.execute("SELECT plan FROM users WHERE id = %s", (user_id,))
        user = cursor.fetchone()
        
        if not user:
            return jsonify({'error': 'User not found'}), 404

        current_plan = user['plan']

        # For free plan selection
        if plan == 'free':
            # Prevent unnecessary free plan selection if already on free plan
            if current_plan == 'free':
                return jsonify({'message': 'User is already on free plan'}), 400

            # Generate a transaction ID for record keeping
            transaction_id = f"FREE-{user_id}-{datetime.utcnow().strftime('%Y%m%d%H%M%S')}"
            
            # Record the free plan selection
            sql = """
                INSERT INTO payments (user_id, plan, amount, status, transaction_id)
                VALUES (%s, %s, %s, %s, %s)
            """
            cursor.execute(sql, (user_id, plan, 0.00, 'success', transaction_id))

            # Update user's plan
            cursor.execute("UPDATE users SET plan = %s WHERE id = %s", (plan, user_id))
            
            conn.commit()
            cursor.close()
            conn.close()
            
            return jsonify({
                'message': 'Free plan activated successfully',
                'transaction_id': transaction_id,
                'previous_plan': current_plan
            }), 200

        else:
            # For paid plans, return error as payment processing is not implemented yet
            return jsonify({
                'error': 'Payment processing for paid plans not implemented yet'
            }), 501

    except Error as e:
        print('Plan selection error:', e)
        return jsonify({'error': str(e)}), 500

@app.route('/api/payments/user-plan', methods=['GET'])
def get_user_plan():
    user_id = request.args.get('user_id')
    
    if not user_id:
        return jsonify({'error': 'User ID is required'}), 400

    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor(dictionary=True)

        # Get current plan
        cursor.execute("SELECT plan FROM users WHERE id = %s", (user_id,))
        user = cursor.fetchone()

        if not user:
            return jsonify({'error': 'User not found'}), 404

        # Get payment history
        cursor.execute("""
            SELECT plan, payment_date, amount, status, transaction_id 
            FROM payments 
            WHERE user_id = %s 
            ORDER BY payment_date DESC
        """, (user_id,))
        payment_history = cursor.fetchall()

        cursor.close()
        conn.close()

        return jsonify({
            'current_plan': user['plan'],
            'payment_history': payment_history
        }), 200

    except Error as e:
        print('Get user plan error:', e)
        return jsonify({'error': str(e)}), 500

@app.route('/api/payments/plan-features', methods=['GET'])
def get_plan_features():
    # Define plan features and pricing
    plan_details = {
        'free': {
            'name': 'Free Plan',
            'price': 0.00,
            'features': [
                'Access to basic document templates',
                'Limited document generation',
                'Basic legal resources'
            ],
            'limits': {
                'templates_per_month': 3,
                'documents_per_month': 5
            }
        },
        'pro': {
            'name': 'Pro Plan',
            'price': 29.99,
            'features': [
                'Access to all document templates',
                'Unlimited document generation',
                'Priority support',
                'Advanced legal resources',
                'Document storage'
            ],
            'limits': {
                'templates_per_month': 'Unlimited',
                'documents_per_month': 'Unlimited'
            }
        },
        'attorney': {
            'name': 'Attorney Plan',
            'price': 99.99,
            'features': [
                'All Pro Plan features',
                'Direct attorney consultation',
                'Custom document review',
                'Priority support',
                'Legal advisory services'
            ],
            'limits': {
                'templates_per_month': 'Unlimited',
                'documents_per_month': 'Unlimited',
                'attorney_consultations_per_month': 2
            }
        }
    }
    
    return jsonify(plan_details), 200

@app.route('/api/documents/check-daily-limit', methods=['GET'])
def check_daily_limit():
    user_id = request.args.get('user_id')
    
    if not user_id:
        return jsonify({'error': 'User ID is required'}), 400

    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor(dictionary=True)

        # Get user's plan
        cursor.execute("SELECT plan FROM users WHERE id = %s", (user_id,))
        user = cursor.fetchone()

        if not user:
            return jsonify({'error': 'User not found'}), 404

        # If user is not on free plan, they have unlimited generations
        if user['plan'] != 'free':
            return jsonify({
                'can_generate': True,
                'daily_limit': 'unlimited',
                'generations_today': 0,
                'remaining_generations': 'unlimited'
            }), 200

        # Count today's generations for free users
        cursor.execute("""
            SELECT COUNT(*) as count
            FROM document_generation_logs
            WHERE user_id = %s
            AND DATE(generated_at) = CURDATE()
        """, (user_id,))
        result = cursor.fetchone()
        generations_today = result['count']

        daily_limit = 3  # Updated: Free plan daily limit increased to 3
        remaining_generations = max(0, daily_limit - generations_today)

        cursor.close()
        conn.close()

        return jsonify({
            'can_generate': remaining_generations > 0,
            'daily_limit': daily_limit,
            'generations_today': generations_today,
            'remaining_generations': remaining_generations
        }), 200

    except Error as e:
        print('Check daily limit error:', e)
        return jsonify({'error': str(e)}), 500

def check_subscription_status(user_id):
    """
    Check if user has an active paid subscription
    Returns (is_paid, plan_type, expiry_date)
    """
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor(dictionary=True)

        # First check user's current plan in users table
        cursor.execute("SELECT plan FROM users WHERE id = %s", (user_id,))
        user = cursor.fetchone()
        
        if not user:
            return False, None, None  # User not found
            
        # If user is explicitly on free plan, no need to check payments
        if user['plan'] == 'free':
            return False, 'free', None

        # Only check payment status for paid plans
        cursor.execute("""
            SELECT *
            FROM payments
            WHERE user_id = %s 
            AND status = 'success'
            AND plan != 'free'
            ORDER BY payment_date DESC
            LIMIT 1
        """, (user_id,))
        
        latest_payment = cursor.fetchone()
        cursor.close()
        conn.close()

        # If user's plan is paid but no payment found, something's wrong
        if not latest_payment:
            # Reset to free plan as no valid payment found
            conn = mysql.connector.connect(**DB_CONFIG)
            cursor = conn.cursor()
            cursor.execute("UPDATE users SET plan = 'free' WHERE id = %s", (user_id,))
            conn.commit()
            cursor.close()
            conn.close()
            return False, 'free', None

        # Check if payment is still valid
        payment_date = latest_payment['payment_date']
        expiry_date = payment_date + timedelta(days=30)
        is_active = datetime.utcnow() < expiry_date

        if not is_active:
            # If subscription expired, update user to free plan
            conn = mysql.connector.connect(**DB_CONFIG)
            cursor = conn.cursor()
            cursor.execute("UPDATE users SET plan = 'free' WHERE id = %s", (user_id,))
            conn.commit()
            cursor.close()
            conn.close()
            return False, 'free', None

        return True, latest_payment['plan'], expiry_date

    except Error as e:
        print('Subscription check error:', e)
        return False, 'free', None

def update_user_plan(user_id, new_plan, payment_id=None):
    """
    Update user's plan and log the change
    Args:
        user_id: The user's ID
        new_plan: The new plan ('free', 'pro', 'attorney')
        payment_id: Optional payment ID that triggered this change
    Returns:
        (success, error_message)
    """
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor(dictionary=True)

        # Get current plan
        cursor.execute("SELECT plan FROM users WHERE id = %s", (user_id,))
        user = cursor.fetchone()
        
        if not user:
            return False, "User not found"

        old_plan = user['plan']
        
        # Update the plan
        cursor.execute("UPDATE users SET plan = %s WHERE id = %s", (new_plan, user_id))
        
        # Log the plan change
        cursor.execute("""
            INSERT INTO plan_changes (
                user_id, 
                old_plan, 
                new_plan, 
                payment_id, 
                change_reason
            ) VALUES (%s, %s, %s, %s, %s)
        """, (
            user_id, 
            old_plan, 
            new_plan, 
            payment_id,
            'payment' if payment_id else 'system'
        ))
        
        conn.commit()
        cursor.close()
        conn.close()
        return True, None

    except Error as e:
        print('Plan update error:', e)
        return False, str(e)

@app.route('/api/payments/subscription-status', methods=['GET'])
def get_subscription_status():
    user_id = request.args.get('user_id')
    
    if not user_id:
        return jsonify({'error': 'User ID is required'}), 400

    is_paid, plan_type, expiry_date = check_subscription_status(user_id)
    
    return jsonify({
        'is_paid': is_paid,
        'plan_type': plan_type,
        'expiry_date': expiry_date.isoformat() if expiry_date else None,
        'days_remaining': (expiry_date - datetime.utcnow()).days if expiry_date else 0
    }), 200

@app.route('/api/payments/process-payment', methods=['POST'])
def process_payment():
    data = request.get_json()
    user_id = data.get('user_id')
    plan = data.get('plan')
    payment_method = data.get('payment_method')
    amount = data.get('amount')

    if not all([user_id, plan, payment_method, amount]):
        return jsonify({'error': 'Missing required fields'}), 400

    if plan not in ['pro', 'attorney']:
        return jsonify({'error': 'Invalid plan selected'}), 400

    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor()

        # Generate a transaction ID
        transaction_id = f"PAID-{user_id}-{datetime.utcnow().strftime('%Y%m%d%H%M%S')}"

        # Start transaction
        conn.start_transaction()

        try:
            # Record the payment first
            cursor.execute("""
                INSERT INTO payments (user_id, plan, amount, status, transaction_id)
                VALUES (%s, %s, %s, %s, %s)
            """, (user_id, plan, amount, 'success', transaction_id))
            
            # Get the payment ID
            payment_id = cursor.lastrowid

            # Update user's plan
            success, error = update_user_plan(user_id, plan, payment_id)
            
            if not success:
                conn.rollback()
                return jsonify({'error': f'Failed to update plan: {error}'}), 500

            conn.commit()
            
            return jsonify({
                'message': 'Payment processed and plan updated successfully',
                'transaction_id': transaction_id,
                'plan': plan,
                'expiry_date': (datetime.utcnow() + timedelta(days=30)).isoformat()
            }), 200

        except Error as e:
            conn.rollback()
            raise e

    except Error as e:
        print('Payment processing error:', e)
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@app.route('/api/payments/history', methods=['GET'])
def get_payment_history():
    user_id = request.args.get('user_id')
    
    if not user_id:
        return jsonify({'error': 'User ID is required'}), 400

    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor(dictionary=True)
        
        cursor.execute("""
            SELECT plan, payment_date, amount, status, transaction_id
            FROM payments
            WHERE user_id = %s
            ORDER BY payment_date DESC
        """, (user_id,))
        
        payments = cursor.fetchall()
        cursor.close()
        conn.close()
        
        return jsonify({'payments': payments}), 200
        
    except Error as e:
        print('Payment history error:', e)
        return jsonify({'error': str(e)}), 500

def check_and_log_document_generation(user_id):
    """
    Check if user can generate a document and log the generation if allowed.
    Returns (can_generate, error_message)
    """
    try:
        is_paid, plan_type, _ = check_subscription_status(user_id)

        # If user has paid plan, they can always generate
        if is_paid:
            conn = mysql.connector.connect(**DB_CONFIG)
            cursor = conn.cursor()
            # Still log the generation but don't enforce limits
            cursor.execute("""
                INSERT INTO document_generation_logs (user_id)
                VALUES (%s)
            """, (user_id,))
            conn.commit()
            cursor.close()
            conn.close()
            return True, None

        # For free users, check daily limit
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor(dictionary=True)

        # Check today's generation count
        cursor.execute("""
            SELECT COUNT(*) as count
            FROM document_generation_logs
            WHERE user_id = %s
            AND DATE(generated_at) = CURDATE()
        """, (user_id,))
        result = cursor.fetchone()
        generations_today = result['count']

        if generations_today >= 3:  # Free plan daily limit
            cursor.close()
            conn.close()
            return False, "Daily document generation limit reached for free plan. Upgrade to generate more documents!"

        # Log the generation
        cursor.execute("""
            INSERT INTO document_generation_logs (user_id)
            VALUES (%s)
        """, (user_id,))
        
        conn.commit()
        cursor.close()
        conn.close()
        return True, None

    except Error as e:
        print('Document generation check error:', e)
        return False, str(e)

@app.route('/api/update-profile', methods=['PUT'])
def update_profile():
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    # Extract user ID from the request (you might want to use JWT token instead)
    # For now, we'll use the email to identify the user
    email = data.get('email')
    username = data.get('username')
    password = data.get('password')
    
    if not email or not username:
        return jsonify({'error': 'Email and username are required'}), 400
    
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor(dictionary=True)
        
        # First, check if user exists
        cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
        user = cursor.fetchone()
        
        if not user:
            cursor.close()
            conn.close()
            return jsonify({'error': 'User not found'}), 404
        
        user_id = user['id']
        
        # Update user data
        if password:
            # Update username and password
            cursor.execute("""
                UPDATE users 
                SET username = %s, password = %s 
                WHERE id = %s
            """, (username, password, user_id))
        else:
            # Update only username
            cursor.execute("""
                UPDATE users 
                SET username = %s 
                WHERE id = %s
            """, (username, user_id))
        
        conn.commit()
        
        # Get updated user data
        cursor.execute("SELECT id, username, email, plan, verified, created_at FROM users WHERE id = %s", (user_id,))
        updated_user = cursor.fetchone()
        
        cursor.close()
        conn.close()
        
        return jsonify({
            'message': 'Profile updated successfully',
            'user': updated_user
        }), 200
        
    except Error as e:
        print('Profile update error:', e)
        return jsonify({'error': 'Failed to update profile'}), 500

if __name__ == "__main__":
    # For local development only
    app.run(host="0.0.0.0", port=5000, debug=True) 