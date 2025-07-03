const BaseRepository = require('./BaseRepository');
const User = require('../models/User');

class UserRepository extends BaseRepository {
    constructor() {
        super(User);
    }

    async findByEmail(email) {
        try {
            return await this.model.findOne({ email: email.toLowerCase() });
        } catch (error) {
            throw new Error(`Error finding user by email: ${error.message}`);
        }
    }

    async findActiveUsers(filter = {}) {
        try {
            return await this.find({ ...filter, isActive: true });
        } catch (error) {
            throw new Error(`Error finding active users: ${error.message}`);
        }
    }

    async updateLastLogin(userId) {
        try {
            return await this.update(userId, { lastLoginAt: new Date() });
        } catch (error) {
            throw new Error(`Error updating last login: ${error.message}`);
        }
    }

    async decrementQuestionCount(userId) {
        try {
            const user = await this.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }

            if (user.isPremium) {
                // Premium users: just increment total count
                user.totalQuestionsAsked += 1;
            } else {
                // Free users: check remaining questions
                if (user.questionsRemaining <= 0) {
                    throw new Error('No questions remaining');
                }
                user.questionsRemaining -= 1;
                user.totalQuestionsAsked += 1;
            }

            return await user.save();
        } catch (error) {
            throw new Error(`Error decrementing question count: ${error.message}`);
        }
    }

    async getUserStats(userId) {
        try {
            const stats = await this.model.aggregate([
                { $match: { _id: userId } },
                {
                    $lookup: {
                        from: 'problems',
                        localField: '_id',
                        foreignField: 'userId',
                        as: 'problems'
                    }
                },
                {
                    $lookup: {
                        from: 'solutions',
                        localField: '_id',
                        foreignField: 'userId',
                        as: 'solutions'
                    }
                },
                {
                    $project: {
                        name: 1,
                        email: 1,
                        plan: 1,
                        questionsRemaining: 1,
                        totalQuestionsAsked: 1,
                        problemsCount: { $size: '$problems' },
                        solutionsCount: { $size: '$solutions' },
                        avgRating: { $avg: '$solutions.userFeedback.rating' }
                    }
                }
            ]);

            return stats[0] || null;
        } catch (error) {
            throw new Error(`Error getting user stats: ${error.message}`);
        }
    }

    async findByPlan(plan) {
        try {
            return await this.find({ plan, isActive: true });
        } catch (error) {
            throw new Error(`Error finding users by plan: ${error.message}`);
        }
    }

    async updatePlan(userId, plan, expiresAt = null) {
        try {
            const updateData = { plan };
            if (expiresAt) {
                updateData.planExpiresAt = expiresAt;
            }
            return await this.update(userId, updateData);
        } catch (error) {
            throw new Error(`Error updating user plan: ${error.message}`);
        }
    }
}

module.exports = UserRepository;
