class Entity {
    constructor(name, categoryList, data) {
        this.id = Entity.getId();
        this.name = name;
        this.fillCategoryDictionary(categoryList, data);
    }

    fillCategoryDictionary(categoryList, data) {
        this.categoryDictionary = {};

        for (let i = 0; i < data.length; i++) {
            this.categoryDictionary[categoryList[i].id] = { category: categoryList[i], value: data[i] }
        }
    }

    addCategory(category) {
        this.categoryDictionary[category.id] = { category: category, value: "" }
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
export default Entity;