const jwt = require('jsonwebtoken');

class JWTService {
    constructor() {
        this.secret = process.env.JWT_SECRET || 'solveria-default-secret';
        this.expiresIn = process.env.JWT_EXPIRES_IN || '7d';
    }

    generateToken(payload) {
        try {
            return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn });
        } catch (error) {
            throw new Error(`Error generating JWT token: ${error.message}`);
        }
    }

    verifyToken(token) {
        try {
            return jwt.verify(token, this.secret);
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                throw new Error('Token has expired');
            } else if (error.name === 'JsonWebTokenError') {
                throw new Error('Invalid token');
            } else {
                throw new Error(`Token verification failed: ${error.message}`);
            }
        }
    }

    decodeToken(token) {
        try {
            return jwt.decode(token);
        } catch (error) {
            throw new Error(`Error decoding token: ${error.message}`);
        }
    }

    generateRefreshToken(payload) {
        try {
            return jwt.sign(payload, this.secret, { expiresIn: '30d' });
        } catch (error) {
            throw new Error(`Error generating refresh token: ${error.message}`);
        }
    }
}

module.exports = JWTService;
