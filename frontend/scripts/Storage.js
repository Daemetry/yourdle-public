import Category from "./Category.js";
import Entity from "./Entity.js";

class Storage {
    constructor() {
        if (Storage.instance) {
            return Storage.instance;
        }

        this.guessEntityNames = [];
        this.serverEntityList = [];
        this.serverCategoryList = [];
        this.categoryList = [];
        this.entityList = [];

        this.entitiesId = null;
        this.typeId = null;
        this.gameCode = null;
        this.userId = null;
        this.gameId = null;
        this.gameName = null;
        this.email = null;
        this.password = null;
        this.tokenType = null;
        this.accessToken = null;
        this.twoFactorCode = null;
        this.twoFactorRecoveryCode = null;
        this.refreshToken = null;

        this.guessCount = 0;
        this.isGuessed = false;

        Storage.instance = this;
    }

    resetEditorStorage() {
        this.categoryList = [];
        this.entityList = [];
    }

    resetGuesses() {
        this.guessEntityNames = [];
        this.guessCount = 0;
    }

    getCategoryById(id) {
        return this.categoryList.find(x => x.id === id);
    }

    getEntityById(id) {
        return this.entityList.find(x => x.id === id);
    }

    addCategory(name, type) {
        const newCategory = new Category(name, type);

        this.categoryList.push(newCategory);

        if (this.entityList.length > 0) {
            for (const entity of this.entityList) {
                entity.addCategory(newCategory);
            }
        }

        return newCategory.id;
    }

    addEntity(name, data) {
        const newEntity = new Entity(name, this.categoryList, data);

        this.entityList.push(newEntity);

        return newEntity.id;
    }

    removeCategory(id) {
        this.categoryList = this.categoryList.filter(x => x.id !== id);
        Category.removeId(id);

        for (const entity of this.entityList) {
            delete entity.categoryDictionary[id];
        }
    }

    removeEntity(id) {
        this.entityList = this.entityList.filter(x => x.id !== id);
        Entity.removeId(id);
    }
}

export default Storage;