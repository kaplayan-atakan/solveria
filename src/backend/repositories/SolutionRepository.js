const BaseRepository = require('./BaseRepository');
const Solution = require('../models/Solution');

class SolutionRepository extends BaseRepository {
    constructor() {
        super(Solution);
    }

    async findByProblemId(problemId) {
        try {
            return await this.findOne({ problemId });
        } catch (error) {
            throw new Error(`Error finding solution by problem ID: ${error.message}`);
        }
    }

    async findByUserId(userId, options = {}) {
        try {
            const filter = { userId };
            const queryOptions = {
                sort: { createdAt: -1 },
                limit: options.limit || 10,
                populate: 'problemId',
                ...options
            };
            
            return await this.find(filter, queryOptions);
        } catch (error) {
            throw new Error(`Error finding solutions by user ID: ${error.message}`);
        }
    }

    async updateUserFeedback(solutionId, rating, comment = '') {
        try {
            const updateData = {
                'userFeedback.rating': rating,
                'userFeedback.comment': comment
            };
            return await this.update(solutionId, updateData);
        } catch (error) {
            throw new Error(`Error updating user feedback: ${error.message}`);
        }
    }

    async markAsCorrect(solutionId, isCorrect) {
        try {
            return await this.update(solutionId, { isCorrect });
        } catch (error) {
            throw new Error(`Error marking solution correctness: ${error.message}`);
        }
    }

    async getAverageRating() {
        try {
            const result = await this.model.aggregate([
                { $match: { 'userFeedback.rating': { $exists: true } } },
                {
                    $group: {
                        _id: null,
                        avgRating: { $avg: '$userFeedback.rating' },
                        totalRatings: { $sum: 1 }
                    }
                }
            ]);

            return result[0] || { avgRating: 0, totalRatings: 0 };
        } catch (error) {
            throw new Error(`Error getting average rating: ${error.message}`);
        }
    }

    async getSolutionsByConfidence(minConfidence = 0.8, options = {}) {
        try {
            const filter = { confidence: { $gte: minConfidence } };
            return await this.find(filter, options);
        } catch (error) {
            throw new Error(`Error finding solutions by confidence: ${error.message}`);
        }
    }

    async getUserSolutionStats(userId) {
        try {
            const stats = await this.model.aggregate([
                { $match: { userId } },
                {
                    $group: {
                        _id: null,
                        totalSolutions: { $sum: 1 },
                        avgConfidence: { $avg: '$confidence' },
                        avgTimeTaken: { $avg: '$timeTaken' },
                        avgRating: { $avg: '$userFeedback.rating' },
                        correctSolutions: {
                            $sum: {
                                $cond: [{ $eq: ['$isCorrect', true] }, 1, 0]
                            }
                        },
                        ratedSolutions: {
                            $sum: {
                                $cond: [
                                    { $ne: ['$userFeedback.rating', null] },
                                    1,
                                    0
                                ]
                            }
                        }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        totalSolutions: 1,
                        avgConfidence: { $round: ['$avgConfidence', 3] },
                        avgTimeTaken: { $round: ['$avgTimeTaken', 0] },
                        avgRating: { $round: ['$avgRating', 2] },
                        correctSolutions: 1,
                        ratedSolutions: 1,
                        accuracyRate: {
                            $multiply: [
                                { $divide: ['$correctSolutions', '$totalSolutions'] },
                                100
                            ]
                        }
                    }
                }
            ]);

            return stats[0] || {
                totalSolutions: 0,
                avgConfidence: 0,
                avgTimeTaken: 0,
                avgRating: 0,
                correctSolutions: 0,
                ratedSolutions: 0,
                accuracyRate: 0
            };
        } catch (error) {
            throw new Error(`Error getting user solution stats: ${error.message}`);
        }
    }
}

module.exports = SolutionRepository;
