# 🚀 Solveria - SOLID Prensiplere Uygun Klasör Yapısı

Bu proje **SOLID prensipleri** doğrultusunda düzenlenmiş modern bir klasör yapısına sahiptir.

## 📁 Klasör Yapısı

```
solveria/
├── 📁 src/                          # Kaynak kodlar
│   ├── 📁 frontend/                 # Frontend katmanı
│   │   ├── 📁 pages/               # Tam sayfa bileşenleri
│   │   │   ├── solveria-landing.html
│   │   │   ├── math-solver.html
│   │   │   ├── signup-form.html
│   │   │   ├── text-editor.html
│   │   │   ├── pricing-demo.html
│   │   │   └── test.html
│   │   └── 📁 components/          # Yeniden kullanılabilir bileşenler
│   │       ├── 📁 pricing/         # Fiyatlandırma bileşenleri
│   │       │   ├── pricing-component.html
│   │       │   ├── pricing-section.html
│   │       │   └── enhanced-pricing-section.html
│   │       └── 📁 faq/             # SSS bileşenleri
│   │           ├── faq-component.html
│   │           └── faq-section.html
│   ├── 📁 backend/                 # Backend katmanı
│   │   ├── 📁 controllers/         # İş mantığı kontrolcüleri
│   │   ├── 📁 models/              # Veri modelleri
│   │   │   └── User.js
│   │   ├── 📁 routes/              # API rotaları
│   │   │   ├── signup-api.js
│   │   │   ├── ocr-api.js
│   │   │   └── solver-api.js
│   │   ├── 📁 services/            # İş servis katmanı
│   │   ├── 📁 middleware/          # Ara katman yazılımları
│   │   └── server.js               # Ana sunucu dosyası
│   └── 📁 shared/                  # Paylaşılan kaynaklar
│       ├── 📁 utils/               # Yardımcı fonksiyonlar
│       │   ├── math-prompt-template.js
│       │   └── success-handler.js
│       └── 📁 constants/           # Sabit değerler
├── 📁 docs/                        # Dokümantasyon
│   ├── README.md
│   ├── SYSTEM_OVERVIEW.md
│   └── PRICING_UPDATE_GUIDE.md
├── 📁 config/                      # Konfigürasyon dosyaları
│   └── .env.example
├── 📁 scripts/                     # Çalıştırma scriptleri
│   ├── start.bat
│   └── start.ps1
├── 📁 tests/                       # Test dosyaları
├── package.json                    # Node.js bağımlılıkları
├── package-lock.json
├── .env                           # Çevre değişkenleri
├── .gitignore                     # Git ignore kuralları
└── PROJECT_STRUCTURE.md           # Bu dosya
```

## 🏗️ SOLID Prensipleri Uygulaması

### ✅ **Single Responsibility Principle (Tek Sorumluluk)**
- Her klasör tek bir sorumluluğa sahip
- `pages/` - Tam sayfa bileşenleri
- `components/` - Yeniden kullanılabilir bileşenler
- `models/` - Veri yapıları
- `routes/` - API endpoint'leri
- `utils/` - Yardımcı fonksiyonlar

### ✅ **Open/Closed Principle (Açık/Kapalı)**
- Bileşenler genişletmeye açık, değişikliğe kapalı
- Component'lar ayrı dosyalarda, kolayca extend edilebilir
- API rotaları modüler yapıda

### ✅ **Liskov Substitution Principle (Liskov Yerine Koyma)**
- Benzer bileşenler aynı interface'i takip eder
- Pricing ve FAQ component'ları aynı yapıyı takip eder

### ✅ **Interface Segregation Principle (Arayüz Ayrımı)**
- Her katman kendi interface'ine sahip
- Frontend ve Backend ayrı klasörlerde
- Shared utilities ortak kullanım için

### ✅ **Dependency Inversion Principle (Bağımlılık Tersine Çevirme)**
- Yüksek seviye modüller düşük seviye modüllere bağımlı değil
- Shared katmanı her iki taraftan da kullanılabilir
- Config dosyaları merkezi yönetim

## 🎯 Avantajlar

### 📦 **Modülerlik**
- Her bileşen bağımsız çalışabilir
- Tek bir component'ı değiştirmek diğerlerini etkilemez
- Yeni özellikler kolayca eklenebilir

### 🔄 **Yeniden Kullanılabilirlik**
- Component'lar farklı sayfalarda kullanılabilir
- Shared utilities her katmanda kullanılabilir
- API'ler bağımsız geliştirilebilir

### 🛠️ **Sürdürülebilirlik**
- Kod bulunması ve değiştirilmesi kolay
- Test yazma daha basit
- Dokümantasyon merkezi

### 👥 **Takım Çalışması**
- Farklı geliştiriciler farklı katmanlarda çalışabilir
- Merge conflict'leri minimize
- Code review süreci daha verimli

## 🚀 Geliştirme Workflow'u

### 🎨 **Frontend Geliştirici:**
```bash
# Yeni component oluşturma
src/frontend/components/new-feature/

# Yeni sayfa oluşturma  
src/frontend/pages/new-page.html
```

### ⚙️ **Backend Geliştirici:**
```bash
# Yeni API route
src/backend/routes/new-api.js

# Yeni model
src/backend/models/NewModel.js

# Yeni service
src/backend/services/NewService.js
```

### 📝 **Dokümantasyon:**
```bash
# Yeni döküman
docs/NEW_FEATURE.md
```

## 🔧 Çalıştırma

```bash
# Backend sunucusu
cd src/backend
node server.js

# Ya da root'tan script ile
npm start
# veya
scripts/start.ps1
```

## 📋 TODO: İyileştirmeler

- [ ] TypeScript desteği ekle
- [ ] Test dosyaları oluştur (`tests/` klasöründe)
- [ ] API dokümantasyonu (Swagger/OpenAPI)
- [ ] Environment-specific config dosyaları
- [ ] Build scripts ekleme
- [ ] Docker containerization
- [ ] CI/CD pipeline

---

Bu klasör yapısı projenin büyümesini ve geliştirilmesini kolaylaştırır, kod kalitesini artırır ve takım çalışmasını optimize eder.
