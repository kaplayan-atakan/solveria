const IRepository = require('../interfaces/IRepository');

class BaseRepository extends IRepository {
    constructor(model) {
        super();
        this.model = model;
    }

    async create(data) {
        try {
            const document = new this.model(data);
            return await document.save();
        } catch (error) {
            throw new Error(`Error creating document: ${error.message}`);
        }
    }

    async findById(id) {
        try {
            return await this.model.findById(id);
        } catch (error) {
            throw new Error(`Error finding document by ID: ${error.message}`);
        }
    }

    async findOne(filter) {
        try {
            return await this.model.findOne(filter);
        } catch (error) {
            throw new Error(`Error finding document: ${error.message}`);
        }
    }

    async find(filter = {}, options = {}) {
        try {
            const { sort, limit, skip, populate } = options;
            let query = this.model.find(filter);
            
            if (sort) query = query.sort(sort);
            if (limit) query = query.limit(limit);
            if (skip) query = query.skip(skip);
            if (populate) query = query.populate(populate);
            
            return await query.exec();
        } catch (error) {
            throw new Error(`Error finding documents: ${error.message}`);
        }
    }

    async update(id, data) {
        try {
            return await this.model.findByIdAndUpdate(
                id, 
                data, 
                { new: true, runValidators: true }
            );
        } catch (error) {
            throw new Error(`Error updating document: ${error.message}`);
        }
    }

    async delete(id) {
        try {
            return await this.model.findByIdAndDelete(id);
        } catch (error) {
            throw new Error(`Error deleting document: ${error.message}`);
        }
    }

    async count(filter = {}) {
        try {
            return await this.model.countDocuments(filter);
        } catch (error) {
            throw new Error(`Error counting documents: ${error.message}`);
        }
    }

    async aggregate(pipeline) {
        try {
            return await this.model.aggregate(pipeline);
        } catch (error) {
            throw new Error(`Error in aggregation: ${error.message}`);
        }
    }

    async exists(filter) {
        try {
            const doc = await this.model.findOne(filter, { _id: 1 });
            return !!doc;
        } catch (error) {
            throw new Error(`Error checking document existence: ${error.message}`);
        }
    }
}

module.exports = BaseRepository;
