const BaseRepository = require('./BaseRepository');
const Problem = require('../models/Problem');

class ProblemRepository extends BaseRepository {
    constructor() {
        super(Problem);
    }

    async findByUserId(userId, options = {}) {
        try {
            const filter = { userId };
            const queryOptions = {
                sort: { createdAt: -1 },
                limit: options.limit || 10,
                ...options
            };
            
            return await this.find(filter, queryOptions);
        } catch (error) {
            throw new Error(`Error finding problems by user ID: ${error.message}`);
        }
    }

    async findByStatus(status, options = {}) {
        try {
            return await this.find({ status }, options);
        } catch (error) {
            throw new Error(`Error finding problems by status: ${error.message}`);
        }
    }

    async updateStatus(problemId, status, processingTime = 0) {
        try {
            const updateData = { status };
            if (processingTime > 0) {
                updateData.processingTime = processingTime;
            }
            return await this.update(problemId, updateData);
        } catch (error) {
            throw new Error(`Error updating problem status: ${error.message}`);
        }
    }

    async findBySubjectAndGrade(subject, grade, options = {}) {
        try {
            const filter = { subject, grade };
            return await this.find(filter, options);
        } catch (error) {
            throw new Error(`Error finding problems by subject and grade: ${error.message}`);
        }
    }

    async getUserProblemStats(userId) {
        try {
            const stats = await this.model.aggregate([
                { $match: { userId } },
                {
                    $group: {
                        _id: null,
                        totalProblems: { $sum: 1 },
                        solvedProblems: {
                            $sum: {
                                $cond: [{ $eq: ['$status', 'solved'] }, 1, 0]
                            }
                        },
                        avgProcessingTime: { $avg: '$processingTime' },
                        subjectDistribution: {
                            $push: '$subject'
                        },
                        gradeDistribution: {
                            $push: '$grade'
                        }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        totalProblems: 1,
                        solvedProblems: 1,
                        successRate: {
                            $multiply: [
                                { $divide: ['$solvedProblems', '$totalProblems'] },
                                100
                            ]
                        },
                        avgProcessingTime: { $round: ['$avgProcessingTime', 2] },
                        subjectDistribution: 1,
                        gradeDistribution: 1
                    }
                }
            ]);

            return stats[0] || {
                totalProblems: 0,
                solvedProblems: 0,
                successRate: 0,
                avgProcessingTime: 0,
                subjectDistribution: [],
                gradeDistribution: []
            };
        } catch (error) {
            throw new Error(`Error getting user problem stats: ${error.message}`);
        }
    }

    async findRecentProblems(userId, limit = 5) {
        try {
            return await this.find(
                { userId },
                {
                    sort: { createdAt: -1 },
                    limit,
                    populate: 'userId'
                }
            );
        } catch (error) {
            throw new Error(`Error finding recent problems: ${error.message}`);
        }
    }
}

module.exports = ProblemRepository;
