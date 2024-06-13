class Category {
    constructor(name, type) {
        this.id = Category.getId();
        this.name = name;
        this.type = type;
    }

    static idQueue = [];
    static maxId = 0;

    static getId() {
        if (this.idQueue.length === 0) {
            this.maxId++;

            return this.maxId;
        }

        return this.idQueue.shift();
    }

    static removeId(id) {
        if (id === this.maxId) {
            this.maxId--;
        }
        else {
            this.idQueue.push(id);
        }
    }
}

export default Category;