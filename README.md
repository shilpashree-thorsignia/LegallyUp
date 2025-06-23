# LegallyUp API

A Flask-based REST API for the LegallyUp platform, providing document generation, user management, and payment processing services.

## 📁 Project Structure

```
LegallyUp/
├── 📂 api/                          # Backend (Flask API)
│   ├── app.py                       # Main Flask application
│   ├── requirements.txt             # Python dependencies
│   └── venv/                        # Python virtual environment
│
├── 📂 src/                          # Frontend (React TypeScript)
│   ├── 📂 components/               # Reusable React components
│   │   ├── 📂 forms/               # Form components
│   │   │   └── FormField.tsx       # Form field component
│   │   ├── 📂 Layout/              # Layout components
│   │   │   ├── Header.tsx          # Header component
│   │   │   └── Footer.tsx          # Footer component
│   │   ├── 📂 ui/                  # UI components
│   │   │   ├── button.jsx          # Button component
│   │   │   ├── HeroBackground.tsx  # Hero background component
│   │   │   └── SignatureBlock.tsx  # Signature component
│   │   ├── DocumentPreview.tsx     # Document preview component
│   │   └── ScrollToTop.tsx         # Scroll to top component
│   │
│   ├── 📂 pages/                   # Page components
│   │   ├── 📂 Documents/           # Document generation pages
│   │   │   ├── DocumentGeneratorPage.tsx
│   │   │   ├── NdaPage.tsx
│   │   │   ├── PrivacyPolicyPage.tsx
│   │   │   ├── RefundPolicyPage.tsx
│   │   │   ├── PowerOfAttorneyPage.tsx
│   │   │   ├── WebsiteServicesAgreementPage.tsx
│   │   │   ├── EulaPage.tsx
│   │   │   └── CookiesPolicyPage.tsx
│   │   ├── 📂 policies/            # Policy pages
│   │   │   ├── PrivacyPolicy.tsx
│   │   │   ├── RefundPolicy.tsx
│   │   │   └── TermsAndConditions.tsx
│   │   ├── HomePage.tsx            # Landing page
│   │   ├── DashboardPage.tsx       # User dashboard
│   │   ├── SignInPage.tsx          # Authentication pages
│   │   ├── SignUpPage.tsx
│   │   ├── ForgotPasswordPage.tsx
│   │   ├── EditProfilePage.tsx     # User profile
│   │   ├── TemplateLibraryPage.tsx # Template browsing
│   │   ├── AboutPage.tsx           # About page
│   │   ├── PricingPage.tsx         # Pricing plans
│   │   ├── ContactPage.tsx         # Contact form
│   │   ├── BlogsPage.tsx           # Blog listing
│   │   ├── BlogDetailPage.tsx      # Individual blog posts
│   │   ├── CaseStudiesPage.tsx     # Case studies
│   │   ├── CaseStudyDetailPage.tsx
│   │   ├── LegalResourcesPage.tsx  # Legal resources
│   │   ├── ResourceDetailPage.tsx
│   │   ├── AttorneyPage.tsx        # Attorney services
│   │   └── ScheduleConsultationPage.tsx
│   │
│   ├── 📂 contexts/                # React contexts
│   │   └── AuthContext.tsx         # Authentication context
│   │
│   ├── 📂 hooks/                   # Custom React hooks
│   │   └── useFormValidation.ts    # Form validation hook
│   │
│   ├── 📂 lib/                     # Utility libraries
│   │   ├── apiBase.ts              # API configuration
│   │   └── blogsData.ts            # Blog data
│   │
│   ├── 📂 utils/                   # Utility functions
│   │   └── formValidation.ts       # Form validation utilities
│   │
│   ├── 📂 assets/                  # Static assets
│   │   ├── images/                 # Image files
│   │   └── videos/                 # Video files
│   │
│   ├── App.tsx                     # Main React application
│   ├── main.tsx                    # React entry point
│   ├── index.css                   # Global styles
│   ├── declarations.d.ts           # TypeScript declarations
│   └── vite-env.d.ts              # Vite environment types
│
├── 📂 public/                      # Public static files
│   ├── favicon.ico                 # Site favicon
│   ├── sw.js                       # Service worker
│   ├── test.html                   # Test page
│   ├── vite.svg                    # Vite logo
│   └── _redirects                  # Netlify redirects
│
├── 📄 package.json                 # Frontend dependencies
├── 📄 package-lock.json            # Lock file
├── 📄 tsconfig.json                # TypeScript configuration
├── 📄 tsconfig.node.json           # Node TypeScript config
├── 📄 tailwind.config.js           # Tailwind CSS configuration
├── 📄 postcss.config.js            # PostCSS configuration
├── 📄 vite.config.ts               # Vite bundler configuration
├── 📄 vercel.json                  # Vercel deployment config
├── 📄 index.html                   # HTML entry point
└── 📄 README.md                    # Project documentation
```

## Features

### User Management
- User registration with email verification
- Login/Authentication
- Password reset functionality
- User profile management

### Document Management
- Document template creation and management
- Document generation with plan-based limits
- Template library access
- Document version control

### Payment and Subscription System
- Three-tier subscription model:
  - Free Plan: Limited to 3 documents per day
  - Pro Plan ($29.99/month): Unlimited documents
  - Attorney Plan ($99.99/month): Unlimited documents + legal services
- Complete payment tracking
- Plan change history
- Automatic plan expiration handling
- Transaction-safe payment processing

### Plan Management Flow
1. **Plan Selection**
   - User selects a plan (free/pro/attorney)
   - System verifies current plan status
   - For paid plans, processes payment
   - Updates user's plan in transaction

2. **Payment Processing**
   - Records payment in payments table
   - Updates user's plan
   - Logs plan change history
   - All changes happen in single transaction

3. **Plan Verification**
   - Checks user's current plan in users table
   - For paid plans:
     - Verifies valid payment exists
     - Checks payment is within 30 days
     - Auto-downgrades expired subscriptions
   - For free plan:
     - Enforces daily document limits
     - Tracks usage in document_generation_logs

4. **Plan Change Tracking**
   - Records all plan changes
   - Tracks reason for change (payment/system/expiration)
   - Maintains complete audit trail
   - Links changes to payments when applicable

## API Endpoints

### Authentication
- `POST /api/register`: Register new user
- `POST /api/login`: User login
- `POST /api/auth/send-otp`: Send OTP for verification
- `POST /api/auth/verify-otp`: Verify OTP
- `POST /api/auth/reset-password`: Reset password

### Document Management
- `POST /api/templates`: Create new template
- `GET /api/templates`: Get user's templates
- `GET /api/templates/<id>`: Get specific template
- `PUT /api/templates/<id>`: Update template
- `POST /api/templates/<id>/trash`: Move template to trash
- `POST /api/templates/<id>/restore`: Restore template from trash

### Payment and Subscription
- `GET /api/payments/subscription-status`: Check subscription status
- `POST /api/payments/process-payment`: Process new payment
- `GET /api/payments/history`: Get payment history
- `POST /api/payments/select-plan`: Select or change plan

### Document Generation Limits
- `GET /api/documents/check-daily-limit`: Check remaining daily generations

## Usage Examples

### Check Subscription Status
```javascript
// GET /api/payments/subscription-status?user_id=123
{
  "is_paid": true,
  "plan_type": "pro",
  "expiry_date": "2024-03-20T10:30:00Z",
  "days_remaining": 25
}
```

### Process Payment
```javascript
// POST /api/payments/process-payment
{
  "user_id": "123",
  "plan": "pro",
  "payment_method": "card",
  "amount": 29.99
}

// Response
{
  "message": "Payment processed and plan updated successfully",
  "transaction_id": "PAID-123-20240220123456",
  "plan": "pro",
  "expiry_date": "2024-03-20T10:30:00Z"
}
```

### Check Daily Document Limit
```javascript
// GET /api/documents/check-daily-limit?user_id=123
{
  "can_generate": true,
  "daily_limit": 3,
  "generations_today": 1,
  "remaining_generations": 2
}
```

## Setup and Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   cd api
   pip install -r requirements.txt
   ```
3. Set up environment variables:
   ```
   SENDGRID_API_KEY=your_sendgrid_key
   SENDGRID_FROM_EMAIL=your_sender_email
   ```
4. Run the development server:
   ```bash
   python app.py
   ```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    verified BOOLEAN DEFAULT FALSE,
    plan VARCHAR(32) DEFAULT 'free',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

### Payments Table
```sql
CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    plan ENUM('free', 'pro', 'attorney') NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    amount DECIMAL(10, 2) NOT NULL,
    status ENUM('success', 'failed') NOT NULL,
    transaction_id VARCHAR(100) UNIQUE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
)
```

### Plan Changes Table
```sql
CREATE TABLE plan_changes (
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
```

### Document Generation Logs
```sql
CREATE TABLE document_generation_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    document_type VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
)
```

## Security Considerations
- All endpoints require authentication
- Rate limiting implemented for API endpoints
- Secure password storage with hashing
- OTP-based email verification
- Payment information handled securely
- Daily limits enforced for free plan users
- Transaction safety for payment processing
- Plan change audit trail

## Error Handling
- Comprehensive error messages
- HTTP status codes properly implemented
- Input validation on all endpoints
- Secure error logging
- Transaction rollback on failures

## Future Improvements
- Implement Stripe payment integration
- Add webhook support for payment events
- Implement subscription renewal notifications
- Add usage analytics dashboard
- Implement document template categories
- Add plan upgrade recommendations
- Implement automatic renewal system
- Add payment failure handling
- Implement promotional pricing
- Add subscription pause/resume functionality
