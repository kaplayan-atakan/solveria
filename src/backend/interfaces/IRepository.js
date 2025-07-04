// Base Repository Interface
class IRepository {
    async create(data) {
        throw new Error('Method not implemented');
    }

    async findById(id) {
        throw new Error('Method not implemented');
    }

    async findOne(filter) {
        throw new Error('Method not implemented');
    }

    async find(filter = {}, options = {}) {
        throw new Error('Method not implemented');
    }

    async update(id, data) {
        throw new Error('Method not implemented');
    }

    async delete(id) {
        throw new Error('Method not implemented');
    }

    async count(filter = {}) {
        throw new Error('Method not implemented');
    }
}

module.exports = IRepository;
