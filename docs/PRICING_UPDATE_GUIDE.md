# 💰 Solveria Pricing Section - Update Guide

## ✨ What's Built

You now have a **modern, reusable pricing section** with:

### 🎯 **Features:**
- **3 Pricing Cards** with professional design
- **Popular Plan Highlighting** (middle card scales and has badge)
- **Responsive Layout** (1 column → 3 columns)
- **Smooth Hover Effects** and animations
- **Custom Icons** for each feature
- **Promo Message** below cards
- **Easy Plan Selection** with JavaScript integration

### 🔧 **Built With:**
- **Tailwind CSS** for styling
- **Lucide Icons** for features
- **Pure JavaScript** for dynamic generation
- **Mobile-First** responsive design

---

## 🚀 **How to Update Prices & Plans**

### 📍 **Location:** 
All pricing data is at the top of the pricing section in `solveria-landing.html`

### 1️⃣ **Change Prices:**
```javascript
// Find this section in solveria-landing.html:
plans: [
    {
        id: "basic",
        name: "Başlangıç Paketi",
        price: 29,          // ← Change this number
        originalPrice: null, // ← Set to show discount
        // ...
    }
]
```

**Example - Add discount to basic plan:**
```javascript
{
    id: "basic",
    name: "Başlangıç Paketi",
    price: 25,           // New price
    originalPrice: 29,   // Show crossed-out price
    // ...
}
```

### 2️⃣ **Update Plan Names:**
```javascript
{
    id: "premium",
    name: "Lise Paketi",        // ← Plan title
    targetGroup: "9–12. sınıf öğrencileri",  // ← Description
    // ...
}
```

### 3️⃣ **Modify Features:**
```javascript
{
    id: "basic",
    features: [
        "50 soru çözümü/ay",      // ← Change features
        "Temel matematik konuları",
        "7/24 AI desteği"
    ],
    // ...
}
```

### 4️⃣ **Change Popular Plan:**
```javascript
// Set popular: true for the plan you want to highlight
{
    id: "premium",
    popular: true,    // ← This makes it highlighted
    // ...
}
```

### 5️⃣ **Update Promo Message:**
```javascript
promoMessage: {
    text: "Yıllık alımlarda %16 indirim – 2 ay bizden hediye!",  // ← Change text
    icon: "gift"  // ← Change icon (Lucide icon name)
}
```

---

## 🎨 **Visual Customization**

### **Plan Card Design:**
- **Popular Plan**: Automatically scaled (105%) with gradient badge
- **Hover Effects**: Cards lift up on hover (-4px translateY)
- **Button Styles**: "solid" (filled) or "outline" (bordered)

### **Feature Icons:**
Add new icons in `featureIcons` mapping:
```javascript
featureIcons: {
    "Yeni özellik": "star",        // ← Add new feature
    "Video dersler": "play-circle", // ← Custom icon
    // ...
}
```

### **Colors:**
Modify Tailwind classes:
- `border-primary` → Plan borders
- `bg-primary` → Button backgrounds  
- `text-secondary` → Feature icons

---

## 📱 **Responsive Design**

### **Breakpoints:**
- **Mobile**: 1 column (default)
- **Tablet**: 2 columns (`md:grid-cols-2`)
- **Desktop**: 3 columns (`lg:grid-cols-3`)

### **Mobile Optimizations:**
- Touch-friendly buttons
- Readable font sizes
- Proper spacing
- Hover effects work on touch

---

## 🔧 **Advanced Features**

### **Plan Selection Integration:**
When user clicks "Planı Seç", it redirects to signup with plan info:
```javascript
// Current behavior:
window.location.href = `signup-form.html?plan=${planId}&price=${plan.price}`;

// You can customize to:
// 1. Open modal
// 2. Scroll to signup form
// 3. Track analytics
// 4. Show checkout
```

### **Dynamic Updates:**
Update pricing without page reload:
```javascript
// Change price dynamically
window.SolveriaPricing.plans[0].price = 35;
window.updateSolveriaPricing();
```

### **Analytics Integration:**
Track plan selections:
```javascript
document.addEventListener('solveriaPlanSelected', function(event) {
    const plan = event.detail.plan;
    // Google Analytics
    gtag('event', 'plan_selected', {
        plan_name: plan.name,
        plan_price: plan.price
    });
});
```

---

## 🎯 **Quick Examples**

### **Example 1: Change Basic Plan to ₺35**
```javascript
// In solveria-landing.html, find:
{
    id: "basic",
    price: 29,  // Change to: 35
    // ...
}
```

### **Example 2: Add New Feature**
```javascript
// Add to features array:
features: [
    "50 soru çözümü/ay",
    "Temel matematik konuları", 
    "7/24 AI desteği",
    "Video açıklamalar"  // ← New feature
]

// Add icon:
featureIcons: {
    // ...existing icons...
    "Video açıklamalar": "video"
}
```

### **Example 3: Change Popular Plan**
```javascript
// Make basic plan popular instead:
{
    id: "basic",
    popular: true,    // ← Change this
    // ...
}
{
    id: "premium", 
    popular: false,   // ← Change this
    // ...
}
```

### **Example 4: Annual Pricing Toggle**
```javascript
// Add button to switch to annual pricing:
function switchToAnnual() {
    window.SolveriaPricing.plans.forEach(plan => {
        plan.price = Math.round(plan.price * 12 * 0.84); // 16% discount
        plan.period = 'yıl';
    });
    window.updateSolveriaPricing();
}
```

---

## 🛠 **File Structure**

```
📁 mathSolverLanding/
├── 📄 solveria-landing.html    # Main landing page (pricing included)
├── 📄 pricing-section.html     # Standalone pricing page
├── 📄 pricing-component.html   # Reusable component
└── 📄 PRICING_UPDATE_GUIDE.md  # This file
```

---

## 🎉 **What Makes This Special**

1. **✅ Zero Code Required**: Just change numbers and text
2. **🎨 Professional Design**: Modern cards with hover effects
3. **📱 Mobile Perfect**: Responsive on all devices
4. **🔄 Easy Updates**: All data in one place
5. **🎯 Conversion Optimized**: Popular plan highlighting
6. **⚡ Fast Loading**: Pure CSS/JS, no frameworks
7. **🧩 Reusable**: Can be dropped into any page

---

## 📞 **Need Help?**

- **Quick Changes**: Edit the `window.SolveriaPricing` object
- **Design Changes**: Modify Tailwind classes
- **Advanced Features**: Customize JavaScript functions
- **Integration**: Use the reusable component version

**The pricing section is now fully functional and ready for production! 🚀**
