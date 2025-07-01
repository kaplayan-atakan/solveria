# Solveria Math Solver

AI-powered math problem solver with OCR capabilities. Upload an image of a math problem, extract text via OCR, edit it, and get step-by-step AI solutions.

## Features

- 🏠 **Modern Landing Page** - Responsive design with Turkish/English language toggle
- 📝 **User Registration** - Complete signup flow with validation
- 📷 **Image Upload** - Camera capture or file upload for math problems
- 🔍 **OCR Text Extraction** - Tesseract.js powered text recognition
- ✏️ **Text Editor** - Edit and refine extracted text
- 🤖 **AI Math Solver** - GPT-4 powered step-by-step solutions
- 🌍 **Multi-language** - Turkish and English support
- 📱 **Mobile Responsive** - Works perfectly on all devices

## Quick Start

### Prerequisites
- Node.js 16+
- MongoDB (local or cloud)
- OpenAI API key

### Installation

1. **Clone or download the project**
2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   copy .env.example .env
   ```
   Edit `.env` and add your API keys:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   MONGODB_URI=mongodb://localhost:27017/solveria
   ```

4. **Start the server:**
   ```bash
   npm start
   ```
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   - Landing Page: http://localhost:3000
   - Math Solver: http://localhost:3000/solve
   - Signup: http://localhost:3000/signup

## API Endpoints

### User Management
- `POST /api/signup` - User registration

### OCR Processing
- `POST /api/ocr` - Extract text from uploaded images
- `GET /api/ocr/health` - OCR service health check

### AI Math Solving
- `POST /api/solve` - Solve math problems with AI
- `GET /api/solver/health` - Solver service health check

## Project Structure

```
├── server.js              # Main server file
├── package.json           # Dependencies and scripts
├── .env.example          # Environment variables template
├── solveria-landing.html # Landing page
├── signup-form.html      # User registration
├── math-solver.html      # Complete math solving workflow
├── text-editor.html      # Text editing interface
├── signup-api.js         # User registration API
├── ocr-api.js           # OCR processing API
├── solver-api.js        # AI math solving API
├── User.js              # MongoDB user model
└── success-handler.js   # Success page handler
```

## Technologies Used

### Frontend
- **HTML5 & CSS3** - Modern web standards
- **Tailwind CSS** - Utility-first CSS framework
- **JavaScript ES6+** - Modern JavaScript features
- **Lucide Icons** - Beautiful SVG icons

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB object modeling

### AI & OCR
- **OpenAI GPT-4** - AI-powered math solving
- **Tesseract.js** - OCR text extraction
- **Multer** - File upload handling

### Security & Utils
- **bcrypt** - Password hashing
- **express-rate-limit** - API rate limiting
- **helmet** - Security headers
- **cors** - Cross-origin resource sharing

## Usage

### 1. Math Problem Solving Workflow

1. **Upload Image**: Take a photo or upload an image of a math problem
2. **OCR Processing**: System extracts text from the image automatically
3. **Edit Text**: Review and edit the extracted text if needed
4. **Select Grade & Language**: Choose appropriate grade level and language
5. **Get Solution**: Receive step-by-step AI-generated solution

### 2. User Registration

- Simple form with name (optional), email, and password
- Server-side validation and password hashing
- MongoDB storage with duplicate email prevention

### 3. Language Support

- Turkish (TR) and English (EN) interface
- AI solutions in the selected language
- Grade-appropriate explanations

## Configuration

### OpenAI API
Get your API key from [OpenAI](https://platform.openai.com/):
```
OPENAI_API_KEY=sk-your-key-here
```

### MongoDB
Local MongoDB:
```
MONGODB_URI=mongodb://localhost:27017/solveria
```

MongoDB Atlas (cloud):
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/solveria
```

## Development

### Available Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests (placeholder)

### File Upload Limits
- Maximum file size: 10MB
- Supported formats: JPEG, PNG, WebP, BMP
- Temporary files are automatically cleaned up

### Rate Limiting
- OCR: No limit (file processing naturally limits requests)
- AI Solver: 50 requests per 15 minutes per IP
- Signup: Standard rate limiting

## Security Features

- Password hashing with bcrypt
- Input validation and sanitization
- File type and size validation
- Rate limiting on sensitive endpoints
- CORS configuration
- Security headers with helmet
- Temporary file cleanup

## Deployment

### Environment Variables for Production
```
NODE_ENV=production
PORT=3000
MONGODB_URI=your_production_mongodb_uri
OPENAI_API_KEY=your_openai_api_key
```

### Production Considerations
- Set `NODE_ENV=production`
- Use a robust process manager (PM2)
- Set up proper logging
- Configure reverse proxy (nginx)
- Enable HTTPS
- Set up MongoDB replica set
- Monitor API usage and costs

## Troubleshooting

### Common Issues

1. **OCR not working**: Ensure uploaded images are clear and contain readable text
2. **AI solver errors**: Check OpenAI API key and account credits
3. **Database connection**: Verify MongoDB is running and connection string is correct
4. **File upload issues**: Check file size (max 10MB) and format (images only)

### Logs
Check console output for detailed error messages and processing logs.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for educational or commercial purposes.

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review the console logs
3. Ensure all environment variables are set correctly
4. Verify API keys and database connectivity
