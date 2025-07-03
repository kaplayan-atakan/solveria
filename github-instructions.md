# GitHub Instructions & Development Guidelines

## 📋 Proje Genel Bilgileri

**Proje Adı:** Solveria Math Solver  
**Teknoloji Stack:** Node.js, Express.js, MongoDB, Docker, React/Vanilla JS  
**Mimari:** Microservices, Clean Architecture, SOLID Principles  

## 🏗️ Proje Yapısı

```
mathSolverLanding/
├── src/
│   ├── backend/
│   │   ├── controllers/          # HTTP isteklerini yöneten katman
│   │   ├── services/             # İş mantığı katmanı
│   │   ├── repositories/         # Veri erişim katmanı
│   │   ├── models/              # MongoDB modelleri
│   │   ├── middleware/          # Express middleware'leri
│   │   ├── routes/              # API route tanımları
│   │   ├── interfaces/          # TypeScript benzeri interface'ler
│   │   └── server.js            # Ana server dosyası
│   ├── frontend/
│   │   ├── components/          # UI bileşenleri
│   │   ├── pages/               # HTML sayfaları
│   │   └── assets/              # CSS, JS, resim dosyaları
│   └── shared/
│       ├── utils/               # Paylaşılan yardımcı fonksiyonlar
│       └── constants/           # Sabitler
├── tests/                       # Test dosyaları
├── docs/                        # Dokümantasyon
├── docker-compose.yml           # Docker servis tanımları
├── Dockerfile.backend           # Backend container tanımı
└── package.json                 # Node.js bağımlılıkları
```

## 🎯 Kodlama Standartları

### Backend Kodlama Kuralları

#### 1. Dosya Adlandırma
- **Controllers:** `UserController.js`, `AuthController.js`
- **Services:** `UserService.js`, `AuthService.js`, `EmailService.js`
- **Repositories:** `UserRepository.js`, `ProblemRepository.js`
- **Models:** `User.js`, `Problem.js`, `Solution.js`
- **Routes:** `user-routes.js`, `auth-routes.js`
- **Middleware:** `auth-middleware.js`, `validation-middleware.js`

#### 2. Klasör Yapısı Kuralları
```javascript
// ✅ Doğru yapı
src/backend/
├── controllers/
│   ├── UserController.js
│   ├── AuthController.js
│   └── ProblemController.js
├── services/
│   ├── UserService.js
│   ├── AuthService.js
│   └── AIService.js
├── repositories/
│   ├── BaseRepository.js
│   ├── UserRepository.js
│   └── ProblemRepository.js
```

#### 3. Kod Yapısı ve SOLID Prensipleri

**Controller Örneği:**
```javascript
// UserController.js
const UserService = require('../services/UserService');
const { validationResult } = require('express-validator');

class UserController {
    constructor(userService) {
        this.userService = userService;
    }

    async register(req, res) {
        try {
            // Validation kontrolü
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation errors',
                    errors: errors.array()
                });
            }

            const result = await this.userService.createUser(req.body);
            res.status(201).json(result);
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = UserController;
```

**Service Örneği:**
```javascript
// UserService.js
const bcrypt = require('bcrypt');
const UserRepository = require('../repositories/UserRepository');
const JWTService = require('./JWTService');

class UserService {
    constructor(userRepository, jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    async createUser(userData) {
        // İş mantığı
        const existingUser = await this.userRepository.findByEmail(userData.email);
        if (existingUser) {
            throw new Error('User already exists');
        }

        // Şifre hashleme
        const hashedPassword = await bcrypt.hash(userData.password, 12);
        
        const newUser = await this.userRepository.create({
            ...userData,
            password: hashedPassword
        });

        const token = this.jwtService.generateToken(newUser._id);
        
        return {
            success: true,
            user: this.sanitizeUser(newUser),
            token
        };
    }

    sanitizeUser(user) {
        const { password, ...sanitizedUser } = user.toObject();
        return sanitizedUser;
    }
}

module.exports = UserService;
```

#### 4. API Response Formatı

**Standart Response Yapısı:**
```javascript
// ✅ Başarılı yanıt
{
    "success": true,
    "message": "Operation successful",
    "data": { /* actual data */ },
    "meta": { /* pagination, etc. */ }
}

// ❌ Hata yanıtı
{
    "success": false,
    "message": "Error description",
    "errors": [ /* validation errors */ ],
    "code": "ERROR_CODE"
}
```

#### 5. Error Handling
```javascript
// CustomError.js
class CustomError extends Error {
    constructor(message, statusCode, code) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.isOperational = true;
    }
}

// Kullanım
throw new CustomError('User not found', 404, 'USER_NOT_FOUND');
```

### Frontend Kodlama Kuralları

#### 1. HTML Yapısı
```html
<!-- ✅ Semantic HTML kullanın -->
<section class="hero-section">
    <header class="hero-header">
        <h1 class="hero-title">Solveria</h1>
    </header>
    <main class="hero-content">
        <!-- Content -->
    </main>
</section>
```

#### 2. CSS Sınıf Adlandırma (BEM)
```css
/* ✅ BEM metodolojisi */
.card { }
.card__header { }
.card__content { }
.card--featured { }
.card__button--primary { }
```

#### 3. JavaScript Standartları
```javascript
// ✅ Modern JavaScript kullanın
const API_BASE_URL = 'http://localhost:3000/api';

class APIClient {
    async post(endpoint, data) {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            return await response.json();
        } catch (error) {
            console.error(`API Error: ${error.message}`);
            throw error;
        }
    }
}
```

## 🔄 Git Workflow

### Branch Naming Convention
```bash
# ✅ Doğru branch isimleri
feature/user-authentication
feature/math-solver-api
bugfix/signup-validation
hotfix/security-patch
refactor/clean-architecture
```

### Commit Message Formatı
```bash
# Format: <type>(<scope>): <description>

# ✅ Örnekler
feat(auth): add JWT authentication system
fix(api): resolve signup validation issue
refactor(backend): implement clean architecture
docs(readme): update installation instructions
test(auth): add unit tests for login functionality

# Types:
# feat: yeni özellik
# fix: hata düzeltme
# refactor: kod iyileştirme
# docs: dokümantasyon
# test: test ekleme
# style: kod formatı
# perf: performans iyileştirme
```

### Pull Request Şablonu
```markdown
## 📋 Değişiklik Özeti
Bu PR'da neler yapıldı?

## 🎯 İlgili Issue
Closes #123

## ✅ Yapılan Değişiklikler
- [ ] Backend API endpoint'i eklendi
- [ ] Frontend form validation eklendi
- [ ] Unit test'ler yazıldı
- [ ] Dokümantasyon güncellendi

## 🧪 Test Edildi
- [ ] Manuel test yapıldı
- [ ] Unit test'ler geçiyor
- [ ] Integration test'ler geçiyor

## 📸 Screenshots (varsa)
![description](image-url)
```

## 🧪 Test Standartları

### Unit Test Örneği
```javascript
// UserService.test.js
const UserService = require('../services/UserService');
const UserRepository = require('../repositories/UserRepository');

describe('UserService', () => {
    let userService;
    let userRepository;

    beforeEach(() => {
        userRepository = {
            findByEmail: jest.fn(),
            create: jest.fn()
        };
        userService = new UserService(userRepository);
    });

    describe('createUser', () => {
        it('should create a new user successfully', async () => {
            // Arrange
            const userData = {
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123'
            };
            userRepository.findByEmail.mockResolvedValue(null);
            userRepository.create.mockResolvedValue({ _id: '123', ...userData });

            // Act
            const result = await userService.createUser(userData);

            // Assert
            expect(result.success).toBe(true);
            expect(result.user.email).toBe(userData.email);
        });
    });
});
```

## 📦 Dependencies ve Package Management

### Backend Dependencies
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.6.3",
    "bcrypt": "^5.1.1",
    "jsonwebtoken": "^9.0.2",
    "express-validator": "^7.0.1",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "jest": "^29.7.0",
    "supertest": "^6.3.3",
    "nodemon": "^3.0.1"
  }
}
```

## 🔒 Güvenlik Standartları

### Environment Variables
```bash
# .env.example
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/solveria
JWT_SECRET=your-super-secret-jwt-key
OPENAI_API_KEY=your-openai-api-key
CORS_ORIGIN=http://localhost:3000
```

### Security Middleware
```javascript
// security-middleware.js
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const securityMiddleware = [
    helmet(),
    rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100 // limit each IP to 100 requests per windowMs
    })
];
```

## 📚 Dokümantasyon Standartları

### API Dokümantasyonu (JSDoc)
```javascript
/**
 * Kullanıcı kayıt işlemi
 * @route POST /api/signup
 * @param {Object} req.body - Kullanıcı bilgileri
 * @param {string} req.body.name - Kullanıcı adı
 * @param {string} req.body.email - E-posta adresi
 * @param {string} req.body.password - Şifre (min 8 karakter)
 * @returns {Object} 201 - Başarılı kayıt
 * @returns {Object} 400 - Validation hatası
 * @returns {Object} 409 - Kullanıcı zaten mevcut
 * @example
 * // Request body:
 * {
 *   "name": "Ahmet Yılmaz",
 *   "email": "ahmet@example.com", 
 *   "password": "securePassword123"
 * }
 */
```

## 🚀 Deployment Kuralları

### Docker Best Practices
```dockerfile
# Dockerfile.backend
FROM node:18-alpine

# Güvenlik: non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

WORKDIR /app

# Dependencies ilk önce (cache optimization)
COPY package*.json ./
RUN npm ci --only=production

# Kod kopyalama
COPY . .
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000
CMD ["npm", "start"]
```

## 📋 Code Review Checklist

### Backend PR Review
- [ ] SOLID prensipleri takip ediliyor mu?
- [ ] Error handling doğru yapılmış mı?
- [ ] Validation'lar eksiksiz mi?
- [ ] Security açıkları var mı?
- [ ] Performance sorunları var mı?
- [ ] Test coverage yeterli mi?
- [ ] Dokümantasyon güncel mi?

### Frontend PR Review  
- [ ] Semantic HTML kullanılmış mı?
- [ ] CSS class'ları BEM standardında mı?
- [ ] Accessibility (a11y) kuralları takip ediliyor mu?
- [ ] Mobile responsive mı?
- [ ] Performance optimizasyonu yapılmış mı?

---

**Not:** Bu dosya proje geliştikçe güncellenecektir. Tüm ekip üyelerinin bu standartları takip etmesi beklenir.
