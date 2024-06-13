import Storage from "./Storage.js";

//  .-----------.
//  |  GENERAL  |
//  '-----------'

const storage = new Storage();

const logo = document.querySelector('.logo')

const easterEgg = document.querySelector('.easter-egg');
const easterEggEffect = document.querySelector('.easter-egg-effect');
let easterEggCounter = 0;


function allowOnlyPositiveIntegers(event) {
    const key = event.key;

    if (!(/^[0-9]$/.test(key)) || event.target.value === '0') {
        event.preventDefault();
    }
}

function allowOnlyEnglishLettersAndIntegers(event) {
    const key = event.key;

    if (!(/^[0-9a-zA-Z]$/.test(key))) {
        event.preventDefault();
    }
}

function allowOnlyLettersAndIntegers(event) {
    const key = event.key;

    if (!(/^[0-9a-zA-Zа-яА-Я]$/.test(key))) {
        event.preventDefault();
    }
}

logo.addEventListener('click', () => {
    easterEggCounter++;
    if (easterEggCounter === 5) {
        easterEgg.volume = 0.5;
        easterEgg.play();
        easterEggEffect.style.display = 'flex';
    }
});


//  .------------.
//  |  DOCUMENT  |
//  '------------'

const mainScreen = document.querySelector('.main-screen');
const editorScreen = document.querySelector('.editor-screen');
const gameScreen = document.querySelector('.game-screen');

const transitionOverlay = document.querySelector('.transition-overlay');
const transitionOverlayLoadingAnimation = document.querySelector('.transition-overlay-loading-animation');


function fadeInScreenTransition() {
    transitionOverlayLoadingAnimation.style.display = 'flex';
    transitionOverlay.style.width = '200vw';
    transitionOverlay.style.height = '200vh';
    setTimeout(() => {
        transitionOverlayLoadingAnimation.style.opacity = '1';
    }, 350);
}

function fadeOutScreenTransition() {
    transitionOverlayLoadingAnimation.style.opacity = '0';
    setTimeout(() => {
        transitionOverlayLoadingAnimation.style.display = 'none';
        transitionOverlay.style.width = '0';
        transitionOverlay.style.height = '0';
    }, 350);
}


function spawnRandomBlob() {
    const blobContainer = document.querySelector('.blob-container');
    const newBlob = document.createElement('div');
    newBlob.classList.add('blob');

    const innerColors = ['rgba(255, 0, 128, 0.06)', 'rgba(255, 255, 0, 0.04)', 'rgba(0, 255, 128, 0.06)'];
    const outerColors = ['rgba(255, 0, 128, 0)', 'rgba(255, 255, 0, 0)', 'rgba(0, 255, 128, 0)'];
    const colorID = Math.floor(Math.random() * 2.99);
    const innerColor = innerColors[colorID];
    const outerColor = outerColors[colorID];
    newBlob.style.background = `linear-gradient(45deg, ${innerColor}, ${outerColor})`;

    newBlob.style.setProperty('--start-x', 200 * Math.random() - 100 + 'vw');
    newBlob.style.setProperty('--start-y', 150 * Math.random() - 50 + 'vh');
    newBlob.style.setProperty('--start-scale', String(3 - Math.random() * 2));

    newBlob.style.setProperty('--end-x', 200 * Math.random() - 100 + 'vw');
    newBlob.style.setProperty('--end-y', 150 * Math.random() - 50 + 'vh');
    newBlob.style.setProperty('--end-scale', String(3 - Math.random() * 2));

    blobContainer.appendChild(newBlob);

    setTimeout(() => {
        newBlob.remove();
    }, 16000);
}

setInterval(spawnRandomBlob, 4000);


//  .---------------.
//  |  MAIN-SCREEN  |
//  '---------------'

const commentWindow = mainScreen.querySelector('#comment-window');
const commentWindowParagraph = commentWindow.querySelector('.comment');

const playWindow = mainScreen.querySelector('#play-window');
const playButton = mainScreen.querySelector('#play-button');

const createWindow = mainScreen.querySelector('#create-window');
const createButton = mainScreen.querySelector('#create-button');

const authorisationWindow = mainScreen.querySelector('#authorisation-window');
const authorisationButton = mainScreen.querySelector('#authorisation-button');

const registrationWindow = mainScreen.querySelector('#registration-window');
const registrationButton = mainScreen.querySelector('#registration-button');

const authorisationExitWindow = mainScreen.querySelector('#authorisation-exit-window');
const authorisationExitButton = mainScreen.querySelector('#authorisation-exit-button');


function enterMainScreen() {
    mainScreen.style.display = 'flex';
    clearPlayWindowInputs();
    clearCreateWindowInputs();

    playButton.classList.remove('selected');
    createButton.classList.remove('selected');

    commentWindow.style.display = 'block';
    playWindow.style.display = 'none';
    createWindow.style.display = 'none';
    //authorisationWindow.style.display = 'none';

    fadeOutScreenTransition()
}


// PLAY
const playWindowBackButton = playWindow.querySelector('#play-window-back-button');
const playWindowStartButton = playWindow.querySelector('#play-window-start-button');

const playGameCode = playWindow.querySelector('#play-game-code');


function clearPlayWindowInputs() {
    playGameCode.value = '';
}

function checkPlayWindowFields() {
    playWindowStartButton.disabled = playGameCode.value.length !== 7;
}


playGameCode.addEventListener('input', () => {
    playGameCode.value = playGameCode.value.toUpperCase();
    checkPlayWindowFields();
});

playGameCode.addEventListener('keypress', allowOnlyEnglishLettersAndIntegers);

playButton.addEventListener('mouseenter', () => {
    commentWindowParagraph.textContent = 'Играйте в -dle игры других пользователей';
});

playButton.addEventListener('mouseleave', () => {
    commentWindowParagraph.textContent = 'Добро пожаловать!';
});

playButton.addEventListener('click', () => {
    clearPlayWindowInputs();

    commentWindow.style.display = 'none';
    playWindow.style.display = 'flex';
    createWindow.style.display = 'none';
    authorisationWindow.style.display = 'none';
    registrationWindow.style.display = 'none';
    authorisationExitWindow.style.display = 'none';

    playButton.classList.add('selected');
    createButton.classList.remove('selected');
    authorisationButton.classList.remove('selected');
    registrationButton.classList.remove('selected');
    authorisationExitButton.classList.remove('selected');
});

playWindowBackButton.addEventListener('click', () => {
    commentWindow.style.display = 'flex';
    playWindow.style.display = 'none';
    playButton.classList.remove('selected');
});

playWindowStartButton.addEventListener('click', () => {
    fadeInScreenTransition();
    setTimeout(() => {
        mainScreen.style.display = 'none';
    }, 350);
})


// CREATE
const createWindowBackButton = createWindow.querySelector('#create-window-back-button');
const createWindowStartButton = createWindow.querySelector('#create-window-start-button');

const createGameName = createWindow.querySelector('#create-game-name');
const createGameTheme = createWindow.querySelector('#create-game-theme');
const createGameCode = createWindow.querySelector('#create-game-code');


function clearCreateWindowInputs() {
    createGameName.value = '';
    createGameTheme.value = '';
    createGameCode.value = '';
}

function checkCreateWindowFields() {
    createWindowStartButton.disabled =
        createGameName.value === '' ||
        createGameTheme.value === '' ||
        createGameCode.value.length !== 7;
}


createGameName.addEventListener('input', checkCreateWindowFields);
createGameTheme.addEventListener('input', checkCreateWindowFields);
createGameCode.addEventListener('input', () => {
    createGameCode.value = createGameCode.value.toUpperCase();
    checkCreateWindowFields();
});

createGameCode.addEventListener('keypress', allowOnlyEnglishLettersAndIntegers);

createButton.addEventListener('mouseenter', () => {
    commentWindowParagraph.textContent = 'Создайте свою собственную -dle игру';
});

createButton.addEventListener('mouseleave', () => {
    commentWindowParagraph.textContent = 'Добро пожаловать!';
});

createButton.addEventListener('click', () => {
    clearCreateWindowInputs();

    commentWindow.style.display = 'none';
    playWindow.style.display = 'none';
    createWindow.style.display = 'flex';
    authorisationWindow.style.display = 'none';
    registrationWindow.style.display = 'none';
    authorisationExitWindow.style.display = 'none';

    playButton.classList.remove('selected');
    createButton.classList.add('selected');
    authorisationButton.classList.remove('selected');
    registrationButton.classList.remove('selected');
    authorisationExitButton.classList.remove('selected');
});

createWindowBackButton.addEventListener('click', () => {
    commentWindow.style.display = 'flex';
    createWindow.style.display = 'none';
    createButton.classList.remove('selected');
});

createWindowStartButton.addEventListener('click', () => {
    fadeInScreenTransition();
    setTimeout(() => {
        mainScreen.style.display = 'none';
    }, 350);
})


// AUTHORISATION
const authorisationWindowBackButton = authorisationWindow.querySelector('#authorisation-window-back-button');
const authorisationWindowEntryButton = authorisationWindow.querySelector('#authorisation-window-entry-button');


function clearAuthorisationWindowInputs() {
    authorisationWindow.querySelector('#authorisation-login-input').value = '';
    authorisationWindow.querySelector('#authorisation-password-input').value = '';
}

authorisationButton.addEventListener('mouseenter', () => {
    commentWindowParagraph.textContent = 'Войдите в аккаунт';
});

authorisationButton.addEventListener('mouseleave', () => {
    commentWindowParagraph.textContent = 'Добро пожаловать!';
});

authorisationButton.addEventListener('click', () => {
    clearAuthorisationWindowInputs();

    commentWindow.style.display = 'none';
    playWindow.style.display = 'none';
    createWindow.style.display = 'none';
    authorisationWindow.style.display = 'flex';
    registrationWindow.style.display = 'none';
    authorisationExitWindow.style.display = 'none';

    playButton.classList.remove('selected');
    createButton.classList.remove('selected');
    authorisationButton.classList.add('selected');
    registrationButton.classList.remove('selected');
    authorisationExitButton.classList.remove('selected');
});

authorisationWindowBackButton.addEventListener('click', () => {
    commentWindow.style.display = 'flex';
    authorisationWindow.style.display = 'none';
    authorisationButton.classList.remove('selected');
});

authorisationWindowEntryButton.addEventListener('click', () => {
    commentWindow.style.display = 'flex';
    authorisationWindow.style.display = 'none';
    authorisationButton.classList.remove('selected');
    commentWindowParagraph.textContent = 'Вы вошли в аккаунт.';
})


// REGISTRATION
const registrationWindowBackButton = registrationWindow.querySelector('#registration-window-back-button');
const registrationWindowEntryButton = registrationWindow.querySelector('#registration-window-entry-button');


function clearRegistrationWindowInputs() {
    registrationWindow.querySelector('#registration-login-input').value = '';
    registrationWindow.querySelector('#registration-password-input').value = '';
}

registrationButton.addEventListener('mouseenter', () => {
    commentWindowParagraph.textContent = 'Зарегистрируйтесь';
});

registrationButton.addEventListener('mouseleave', () => {
    commentWindowParagraph.textContent = 'Добро пожаловать!';
});

registrationButton.addEventListener('click', () => {
    clearRegistrationWindowInputs();

    commentWindow.style.display = 'none';
    playWindow.style.display = 'none';
    createWindow.style.display = 'none';
    authorisationWindow.style.display = 'none';
    registrationWindow.style.display = 'flex';
    authorisationExitWindow.style.display = 'none';

    playButton.classList.remove('selected');
    createButton.classList.remove('selected');
    authorisationButton.classList.remove('selected');
    registrationButton.classList.add('selected');
    authorisationExitButton.classList.remove('selected');
});

registrationWindowBackButton.addEventListener('click', () => {
    commentWindow.style.display = 'flex';
    registrationWindow.style.display = 'none';
    registrationButton.classList.remove('selected');
});

registrationWindowEntryButton.addEventListener('click', () => {
    commentWindow.style.display = 'flex';
    registrationWindow.style.display = 'none';
    registrationButton.classList.remove('selected');
    commentWindowParagraph.textContent = 'Вы зарегистрировались.';
})


// AUTHORISATION-EXIT
const authorisationExitExitButton = authorisationExitWindow.querySelector('#authorisation-exit-exit-button');


authorisationExitButton.addEventListener('mouseenter', () => {
    commentWindowParagraph.textContent = 'Выйти из аккаунта';
});

authorisationExitButton.addEventListener('mouseleave', () => {
    commentWindowParagraph.textContent = 'Добро пожаловать!';
});

authorisationExitButton.addEventListener('click', () => {
    clearAuthorisationWindowInputs();

    commentWindow.style.display = 'none';
    playWindow.style.display = 'none';
    createWindow.style.display = 'none';
    authorisationWindow.style.display = 'none';
    registrationWindow.style.display = 'none';
    authorisationExitWindow.style.display = 'flex';

    playButton.classList.remove('selected');
    createButton.classList.remove('selected');
    authorisationButton.classList.remove('selected');
    registrationButton.classList.remove('selected');
    authorisationExitButton.classList.add('selected');
});

authorisationExitExitButton.addEventListener('click', () => {
    commentWindow.style.display = 'flex';
    authorisationExitWindow.style.display = 'none';
    authorisationExitButton.classList.remove('selected');
    commentWindowParagraph.textContent = 'Вы вышли из аккаунта.';
})



//  .-----------------.
//  |  EDITOR-SCREEN  |
//  '-----------------'

const introWindow = editorScreen.querySelector('#editor-intro-window');

const categoryWindow = editorScreen.querySelector('#category-window');
const categoryButton = editorScreen.querySelector('#category-button');

const categoryAddWindow = editorScreen.querySelector('#category-add-window');
const categoryAddButton = categoryWindow.querySelector('#category-add-button');

const categoryList = categoryWindow.querySelector('.category-list');

const categoryAddWindowAcceptButton = categoryAddWindow.querySelector('#category-add-window-accept-button');
const categoryAddWindowCancelButton = categoryAddWindow.querySelector('#category-add-window-cancel-button');

const entityWindow = editorScreen.querySelector('#entity-window');
const entityButton = editorScreen.querySelector('#entity-button');

const entityAddWindow = editorScreen.querySelector('#entity-add-window');
const entityAddButton = entityWindow.querySelector('#entity-add-button');

const entityList = entityWindow.querySelector('.entity-list');

const entityCategoriesList = entityAddWindow.querySelector('.entity-categories-list');
const entityAddWindowAcceptButton = entityAddWindow.querySelector('#entity-add-window-accept-button');
const entityAddWindowCancelButton = entityAddWindow.querySelector('#entity-add-window-cancel-button');

const editorFinishButton = editorScreen.querySelector('#finish-button');
const editorExitButton = editorScreen.querySelector('#editor-exit-button');

let entityAddWindowMode = 'add';
let editedEntityID = 'no id at start';


function addCategoryBlock(categoryName, categoryType, id) {
    const block = document.createElement('div');
    block.classList.add('category');
    block.id = `category-${id}`;

    const icon = document.createElement('img');
    icon.src = `resources/${categoryType}_icon.png`;
    icon.alt = `${categoryType}`;
    icon.width = 40;
    block.appendChild(icon);

    const name = document.createElement('p');
    name.textContent = categoryName;
    block.appendChild(name);

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.textContent = 'X';
    deleteButton.style.fontWeight = 'bold';
    deleteButton.classList.add('category-delete-button');
    deleteButton.classList.add('mini-button');
    block.appendChild(deleteButton);

    categoryList.appendChild(block);
}

function addEntityBlock(entityName, id) {
    const block = document.createElement('div');
    block.classList.add('entity');
    block.id = `entity-${id}`;

    const name = document.createElement('p');
    name.textContent = entityName;
    block.appendChild(name);

    const buttons = document.createElement('div');
    buttons.classList.add('entity-buttons');

    const editButton = document.createElement('button');
    editButton.type = 'button';
    editButton.textContent = '...';
    editButton.style.fontWeight = 'bold';
    editButton.classList.add('entity-edit-button');
    editButton.classList.add('mini-button');
    buttons.appendChild(editButton);

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.textContent = 'X';
    deleteButton.style.fontWeight = 'bold';
    deleteButton.classList.add('entity-delete-button');
    deleteButton.classList.add('mini-button')
    buttons.appendChild(deleteButton);

    block.appendChild(buttons);

    entityList.appendChild(block);
}

function addCategoryToEntityAddWindow(categoryName, categoryType, id) {
    const block = document.createElement('div');
    block.classList.add('entity-category')
    block.id = `category-${id}-in-entity`;

    const label = document.createElement('div');
    label.classList.add('entity-category-label')

    const icon = document.createElement('img');
    icon.src = `resources/${categoryType}_icon.png`;
    icon.alt = `${categoryType}`;
    icon.width = 40;
    icon.height = 40;
    label.appendChild(icon);

    const name = document.createElement('p');
    name.textContent = categoryName;
    label.appendChild(name);

    const input = document.createElement('input');
    input.classList.add('entity-category-input');
    input.type = 'text';
    input.maxLength = 20;
    if (categoryType === 'integer') {
        input.addEventListener('keypress', allowOnlyPositiveIntegers);
    }

    block.appendChild(label)
    block.appendChild(input);

    entityCategoriesList.appendChild(block);
}

function resetCategoryAddInputs() {
    categoryAddWindow.querySelector('#category-name-input').value = '';
    categoryAddWindow.querySelector('#integer').checked = true;
}

function resetEntityAddInputs() {
    entityAddWindow.querySelector('#entity-name-input').value = '';
    for (const input of entityAddWindow.querySelectorAll('.entity-category-input')) {
        input.value = '';
    }
}

function fillEntityAddInputs(entityID) {
    const entity = storage.getEntityById(Number(entityID));

    const nameInput = entityAddWindow.querySelector('#entity-name-input');
    nameInput.value = entity.name;

    const entityCategories = entity.categoryDictionary;
    for (const categoryID in entityCategories) {
        const categoryValue = entityCategories[categoryID].value;
        const categoryInput = entityAddWindow.querySelector(`#category-${categoryID}-in-entity input`);
        categoryInput.value = categoryValue;
    }
}

function startEntityEditing(entityBlockID) {
    editedEntityID = entityBlockID.substring(7);
    entityAddWindowMode = 'edit';

    resetEntityAddInputs();
    fillEntityAddInputs(editedEntityID);

    entityWindow.style.display = 'none';
    entityAddWindow.style.display = 'flex';
}

function closeAllEditorWindows() {
    categoryWindow.style.display = 'none';
    categoryAddWindow.style.display = 'none';
    entityWindow.style.display = 'none';
    entityAddWindow.style.display = 'none';
    introWindow.style.display = 'none';
}

function openIntroWindow() {
    closeAllEditorWindows();
    introWindow.style.display = 'flex';

    categoryButton.classList.remove('selected');
    entityButton.classList.remove('selected');
}

function openCategoryWindow() {
    closeAllEditorWindows();
    categoryWindow.style.display = 'flex';

    updateCategoryCount();

    categoryButton.classList.add('selected');
    entityButton.classList.remove('selected');
}

function openEntityWindow() {
    closeAllEditorWindows();
    entityWindow.style.display = 'flex';

    updateEntityCount();

    categoryButton.classList.remove('selected');
    entityButton.classList.add('selected');
}


// CATEGORY
const categoryCounter = categoryWindow.querySelector('.category-counter');

const MAX_CATEGORY_COUNT = 10;
let categoryCount = 0;


function updateCategoryCount() {
    categoryAddButton.classList.toggle('list-empty', categoryCount === 0);
    categoryAddButton.disabled = categoryCount >= MAX_CATEGORY_COUNT;
    categoryCounter.textContent = `${categoryCount} / ${MAX_CATEGORY_COUNT}`;
}


categoryButton.addEventListener('click', openCategoryWindow);

categoryAddButton.addEventListener('click', () => {
    closeAllEditorWindows();
    categoryAddWindow.style.display = 'flex';

    resetCategoryAddInputs();
});

categoryAddWindowAcceptButton.addEventListener('click', () => {
    const categoryName = categoryAddWindow.querySelector('#category-name-input').value;
    const categoryType = categoryAddWindow.querySelector('.category-type-radio:checked').value;
    const id = storage.addCategory(categoryName, categoryType);

    addCategoryBlock(categoryName, categoryType, id);
    addCategoryToEntityAddWindow(categoryName, categoryType, id);
    categoryCount++;

    openCategoryWindow();
    scrollTo({top: document.body.scrollHeight, behavior: 'auto'});
});

categoryAddWindowCancelButton.addEventListener('click', () => {
    openCategoryWindow();
    scrollTo({top: document.body.scrollHeight, behavior: 'auto'});
});

categoryList.addEventListener('click', (event) => {
    const categoryBlock = event.target.parentNode;
    if (event.target.classList.contains('category-delete-button') && categoryBlock.id.startsWith('category-')) {
        const categoryID = Number(categoryBlock.id.substring(9));
        storage.removeCategory(categoryID);

        const categoryBlockInEntityCategories = document.getElementById(categoryBlock.id + '-in-entity');
        categoryBlockInEntityCategories.remove();
        categoryBlock.remove();

        categoryCount--;
        updateCategoryCount();
    }
})


// ENTITY
const entityCounter = entityWindow.querySelector('.entity-counter');

const MAX_ENTITY_COUNT = 200;
let entityCount = 0;


function updateEntityCount() {
    entityAddButton.classList.toggle('list-empty', entityCount === 0);
    entityAddButton.disabled = entityCount >= MAX_ENTITY_COUNT;
    entityCounter.textContent = `${entityCount} / ${MAX_ENTITY_COUNT}`;
}


entityButton.addEventListener('click', openEntityWindow);

entityAddButton.addEventListener('click', () => {
    closeAllEditorWindows();
    entityAddWindow.style.display = 'flex';

    entityAddWindowMode = 'add';

    resetEntityAddInputs();
});

entityAddWindowAcceptButton.addEventListener('click', () => {
    if (entityAddWindowMode === 'edit') {
        storage.removeEntity(Number(editedEntityID));
        document.querySelector(`#entity-${editedEntityID}`).remove();
        entityCount--;
    }

    const entityName = entityAddWindow.querySelector('input[type="text"]').value;
    const valueList = Array.from(entityCategoriesList.querySelectorAll('input'))
        .map(input => input.value);
    const id = storage.addEntity(entityName, valueList);

    addEntityBlock(entityName, id);
    entityCount++;

    openEntityWindow();
    scrollTo({top: document.body.scrollHeight, behavior: 'auto'});
});

entityAddWindowCancelButton.addEventListener('click', () => {
    openEntityWindow();
    scrollTo({top: document.body.scrollHeight, behavior: 'auto'});
});

entityList.addEventListener('click', (event) => {
    const entityBlock = event.target.parentNode.parentNode;
    if (entityBlock.id.startsWith('entity-')) {
        if (event.target.classList.contains('entity-delete-button')) {
            const entityID = Number(entityBlock.id.substring(7));
            storage.removeEntity(entityID);
            entityBlock.remove();

            entityCount--;
            updateEntityCount();
        }
        if (event.target.classList.contains('entity-edit-button')) {
            startEntityEditing(entityBlock.id);
        }
    }
});


// GENERAL
function clearCategoryList() {
    categoryList.innerHTML = '';
    categoryCount = 0;
    updateCategoryCount();
}

function clearEntityList() {
    entityList.innerHTML = '';
    entityCount = 0;
    updateEntityCount();
}

function clearEntityCategoriesList() {
    entityCategoriesList.innerHTML = '';
}

function enterEditorScreen() {
    editorScreen.style.display = 'flex';
    clearCategoryList();
    clearEntityList();
    clearEntityCategoriesList();
    openIntroWindow();
    editorFinishButton.disabled = false;

    fadeOutScreenTransition();
}


editorExitButton.addEventListener('click', () => {
    fadeInScreenTransition();
    setTimeout(() => {
        editorScreen.style.display = 'none';
        enterMainScreen();
    }, 350);
})

editorFinishButton.addEventListener('click', () => {
    fadeInScreenTransition();
    setTimeout(() => {
        editorScreen.style.display = 'none';
        enterMainScreen();
    }, 350);
})


//  .---------------.
//  |  GAME-SCREEN  |
//  '---------------'

const gameContent = gameScreen.querySelector('.game-content');

const gameContentHeader = gameContent.querySelector('.game-content-header');
const gameCategoryNames = gameContentHeader.querySelector('.game-category-names');

const gameContentBody = gameContent.querySelector('.game-content-body');
const gameGuessEntityList = gameContentBody.querySelector('.game-guess-entity-list');
const gameGuessCategoriesList = gameContentBody.querySelector('.game-guess-categories-list');

const gameEntityPool = gameScreen.querySelector('.game-entity-pool');
const gameGuessInput = gameScreen.querySelector('#game-guess-input');
const gameGuessButton = gameScreen.querySelector('#game-guess-button');

const gameExitButton = gameScreen.querySelector('#game-exit-button');


function enterGameScreen() {
    gameScreen.style.display = 'flex';
    document.body.style.overflowX = 'auto';
    fadeOutScreenTransition()
}

function startGame() {
    storage.resetGuesses();
    enableGuessing();

    clearGameContent();
    clearCategoryNames();
    clearEntityPool();

    setGameName();
    fillGameCategoryNames();
    fillGameEntityPool();
}

function showGuess(entityName, guessProperties) {
    if (storage.guessCount <= 0) {
        gameContent.style.display = 'none';
        return;
    }
    gameContent.style.display = 'flex';

    createGuessEntityBlock(entityName);
    createGuessCategoriesBlock(guessProperties);

    if (storage.isGuessed) {
        disableGuessing();
        openGameWinWindow(entityName);
    }
}

function disableGuessing() {
    gameGuessInput.disabled = true;
    gameGuessButton.disabled = true;
}

function enableGuessing() {
    gameGuessInput.disabled = false;
    gameGuessButton.disabled = false;
}

function createGuessEntityBlock(entityName) {
    const gameGuessEntity = document.createElement('p');
    gameGuessEntity.classList.add('game-guess-entity');
    gameGuessEntity.textContent = entityName;
    gameGuessEntityList.appendChild(gameGuessEntity);
}

function createGuessCategoriesBlock(guessProperties) {
    const guessCategoriesBlock = document.createElement('div');
    guessCategoriesBlock.classList.add('game-guess-categories');

    const guessCategories = {};
    for (const guessProperty of guessProperties) {
        const { property, propertyValue, state } = guessProperty;
        guessCategories[property['name']] = { propertyValue, state };
    }

    for (const categoryName of storage.serverCategoryList) {
        const guessCategoryBlock = document.createElement('p');
        guessCategoryBlock.classList.add('game-guess-category');

        switch (guessCategories[categoryName]['state']) {
            case 0:
                guessCategoryBlock.classList.add('wrong');
                break;
            case 1:
                guessCategoryBlock.classList.add('right');
                break;
            case 2:
                guessCategoryBlock.classList.add('under');
                break;
            case 3:
                guessCategoryBlock.classList.add('over');
                break;
            default:
                throw new Error("Wrong enum parameter");
        }

        guessCategoryBlock.textContent = guessCategories[categoryName].propertyValue;
        guessCategoriesBlock.appendChild(guessCategoryBlock);
    }

    gameGuessCategoriesList.appendChild(guessCategoriesBlock);
}

function clearGameContent() {
    gameContent.style.display = 'none';
    gameCategoryNames.innerHTML = '';
    gameGuessEntityList.innerHTML = '';
    gameGuessCategoriesList.innerHTML = '';
}

function setGameName() {
    const gameNameLabel = gameScreen.querySelector('.game-name');
    gameNameLabel.textContent = storage.gameName;
}

function fillGameCategoryNames() {
    for (const categoryName of storage.serverCategoryList) {
        const gameCategoryNamesItem = document.createElement('p');
        gameCategoryNamesItem.classList.add('game-category-names-item');
        gameCategoryNamesItem.textContent = categoryName;
        gameCategoryNames.appendChild(gameCategoryNamesItem);
    }
}

function clearCategoryNames() {
    gameCategoryNames.innerHTML = '';
}

function fillGameEntityPool() {
    for (const entity of storage.serverEntityList) {
        const gameEntityPoolItem = document.createElement('p');
        const entityName = entity['name'];
        gameEntityPoolItem.classList.add('game-entity-pool-item');
        gameEntityPoolItem.textContent = entityName;
        gameEntityPoolItem.id = 'pool-entity-' + entityName.replaceAll(' ', '-');

        gameEntityPoolItem.addEventListener('click', () => {
            gameGuessInput.value = gameEntityPoolItem.textContent;
            gameEntityPool.style.display = 'none';
        });

        gameEntityPool.appendChild(gameEntityPoolItem);
    }
}

function clearEntityPool() {
    gameEntityPool.innerHTML = '';
}

function removeFromGameEntityPool(entityName) {
    const blockID = '#pool-entity-' + entityName.replaceAll(' ', '-');
    const block = gameEntityPool.querySelector(blockID);
    if (block) {
        block.remove();
    }
}


gameGuessInput.addEventListener('input', () => {
    const value = gameGuessInput.value.toLowerCase();
    const gameEntityPoolItems = gameEntityPool.querySelectorAll('.game-entity-pool-item');

    let hasMatches = false;
    gameEntityPoolItems.forEach(item => {
        const entityName = item.textContent.toLowerCase();

        let isPartMatch = false;
        for (const entityNamePart of entityName.split(' ')) {
            isPartMatch ||= entityNamePart.startsWith(value);
        }

        const isMatch = value !== '' && isPartMatch;
        item.style.display = isMatch ? 'flex' : 'none';
        if (isMatch) {
            hasMatches = true;
        }
    });

    gameEntityPool.style.display = hasMatches ? 'flex' : 'none';
});

gameExitButton.addEventListener('click', () => {
    fadeInScreenTransition();
    setTimeout(() => {
        gameScreen.style.display = 'none';
        document.body.style.overflowX = 'hidden';
        enterMainScreen();
    }, 350);
})


//  .-------------------.
//  |  GAME-WIN-WINDOW  |
//  '-------------------'

const gameScreenOverlay = document.querySelector('.game-screen-overlay');
const gameWinWindow = document.querySelector('.game-win-window');
const gameWinButton = gameWinWindow.querySelector('.game-win-message-close-button');


function openGameWinWindow(correctEntityName) {
    const gameWinMessage = gameWinWindow.querySelector('.game-win-message');
    for (const oldGameWinLine of gameWinMessage.querySelectorAll('.game-win-line')) {
        oldGameWinLine.remove();
    }

    const gameWinLine1 = document.createElement('p');
    gameWinLine1.classList.add('game-win-line');
    gameWinLine1.innerHTML = '<pre>Правильный ответ:  <strong>' + correctEntityName + '</strong></pre>';
    gameWinMessage.appendChild(gameWinLine1);

    const gameWinLine2 = document.createElement('p');
    gameWinLine2.classList.add('game-win-line');
    gameWinLine2.innerHTML = '<pre>Попытки:  <strong>' + storage.guessCount.toString() + '</strong></pre>';
    gameWinMessage.appendChild(gameWinLine2);

    showGameScreenOverlay();
    gameWinWindow.style.display = 'flex';
}

function closeGameWinWindow() {
    hideGameScreenOverlay();
    gameWinWindow.style.display = 'none';
}

function showGameScreenOverlay() {
    gameScreenOverlay.style.display = 'flex';
}

function hideGameScreenOverlay() {
    gameScreenOverlay.style.display = 'none';
}


gameWinButton.addEventListener('click', closeGameWinWindow);


//  .-----------.
//  |  SUBMITS  |
//  '-----------'

const LOCALHOST_URL = 'https://localhost:443/api';
const SERVER_URL = 'https://yourdle.fun/api';

const serverUrl = SERVER_URL;

// Game

// /game/create post

createWindow.addEventListener('submit', (event) => {
    event.preventDefault();

    const gameName = createGameName.value;
    const gameCode = createGameCode.value;
    const gameTheme = createGameTheme.value;

    let box;
    if (gameCode === '') {
        box = { gameName: gameName, typeName: gameTheme};
    } else {
        box = { gameName: gameName, typeName: gameTheme, gameCode: gameCode};
    }

    fetch(serverUrl + '/game/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(box)
    })
        .then(response => response.json())
        .then(data => {
            storage.gameId = data['gameId'];
            storage.gameCode = data['gameCode'];
            storage.typeId = data['typeId'];
            storage.resetEditorStorage();

            enterEditorScreen();

            console.log('game create ok');
        })
        .catch(err => {
            alert('Не удалось создать игру. Перезагрузите страницу.')
            console.log(err);
        });
})

// /game/get post

playWindow.addEventListener('submit', (event) => {
    event.preventDefault();

    const gameCode = playGameCode.value;

    fetch(serverUrl + '/game/get', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gameCode: gameCode })
    })
        .then(response => response.json())
        .then(data => {
            const parsedData = data['game'];

            storage.gameCode = parsedData['code'];
            storage.gameId = parsedData['id'];
            storage.gameName = parsedData['name'];
            storage.serverCategoryList = parsedData['type']['properties'].map(x => x['name']);
            storage.serverEntityList = parsedData['objects'];

            storage.entitiesId = {}
            for (const entity of parsedData['objects']) {
                storage.entitiesId[entity['name']] = entity['id'];
            }

            startGame();
            enterGameScreen();

            console.log('game get ok');
        })
        .catch(err => {
            alert('Не удалось получить игру. Перезагрузите страницу.')
            console.log(err);
        });
});

// /game/guess post

gameScreen.addEventListener('submit', (event) => {
    event.preventDefault();

    const entityName = gameGuessInput.value;
    if (storage.serverEntityList.some(entity => entity['name'] === entityName) &&
        !storage.guessEntityNames.includes(entityName)) {
        const box = { gameId: storage.gameId, objectId: storage.entitiesId[entityName] };

        fetch(serverUrl + '/game/guess', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(box)
        })
            .then(response => response.json())
            .then(data => {
                storage.guessEntityNames.push(entityName);
                storage.guessCount++;
                removeFromGameEntityPool(entityName);

                storage.isGuessed = data['guessed'];
                showGuess(entityName, data['guessProperties']);

                console.log('game guess ok');
            })
            .catch(err => {
                alert('Не удалось получить информацию об ответе.')
                console.log(err);
            });

        gameGuessInput.value = '';
    }
});

// /game/public get

// Objects

// /objects/change post



// /objects/create post

editorScreen.addEventListener('submit', (event) => {
    event.preventDefault();
    editorFinishButton.disabled = true;

    const propertiesId = {};
    const properties = [];

    for (const category of storage.categoryList) {
        properties.push({ name: category.name, type: category.type });
    }

    const categoryBox = { typeId: storage.typeId, properties: properties };

    // отправка категорий
    fetch(serverUrl + '/type/properties/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(categoryBox)
    })
        .then(response => response.json())
        .then(data => {
            for (const property of data['properties']) {
                propertiesId[property['name']] = property['id'];
            }

            const objects = [];

            for (const entity of storage.entityList) {
                const objectProperties = [];
                for (const categoryWithValue of Object.values(entity.categoryDictionary)) {
                    objectProperties.push({
                        propertyId: propertiesId[categoryWithValue['category'].name],
                        value: categoryWithValue['value']
                    });
                }

                objects.push({ name: entity.name, properties: objectProperties });
            }

            const objectBox = { typeId: storage.typeId, objects: objects};

            // отправка объектов
            fetch(serverUrl + '/objects/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(objectBox)
            })
                .then(response => response.json())
                .then(data => data)
                .catch(err => {
                    console.log(err);
                });

            alert('Игра была завершена успешно! Код игры: ' + storage.gameCode)
            console.log('game finish ok');
        })
        .catch(err => {
            alert('Не удалось завершить игру.')
            console.log(err);
        });
})

// /objects/remove post

// TypeProperties
// Users

// /type/properties/getgame post
// /type/properties/getgames get

// Yourdle.WebApi

// /register post

registrationWindow.addEventListener('submit', (event) => {
    event.preventDefault();

    const email = registrationWindow.querySelector('#registration-login-input').value;
    const password = registrationWindow.querySelector('#registration-password-input').value;

    const box = { email: email, password: password };

    fetch(serverUrl + '/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(box)
    })
        .then(response => {
            if (response.status !== 200)
            {
                throw new Error();
            }
        })
        .catch(err => {
            alert('Не удалось получить информацию об ответе.')
            console.log(err);
        });
});

// /login post

authorisationWindow.addEventListener('submit', (event) => {
    event.preventDefault();

    const email = authorisationWindow.querySelector('#authorisation-login-input').value;
    const password = authorisationWindow.querySelector('#authorisation-password-input').value;
    //const twoFactorCode = storage.twoFactorCode;
    //const twoFactorRecoveryCode = storage.twoFactorRecoveryCode;

    const box = { email: email, password: password };

    fetch(serverUrl + '/login?useCookies=true&useSessionCookies=true', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(box)
    })
        .then(response => {
            if (response.status !== 200)
            {
                throw new Error();
            }
        })
        // .then(data => {
        //     localStorage.setItem('auth', data['refreshToken']);
        //
        //     // здесь менюшка успешной аутентификации
        //     alert('ok auth');
        //     console.log('ok');
        // })
        .catch(err => {
            alert('Не удалось получить информацию об ответе.')
            console.log(err);
        });
});

// /logout get

authorisationExitWindow.addEventListener('submit', (event) => {
    event.preventDefault();

    fetch(serverUrl + '/logout', {
        method: "GET"
        }).then(response => {
            if (!response.ok) {
                throw new Error();
            }

            // менюшка, что все ок
        }).catch(error => {
            console.error(`Ошибка выхода: ${error}`);
        });
});

// /refresh post

function refreshTokens(refreshToken) {
    fetch(serverUrl + '/refresh', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(refreshToken)
    })
        .then(response => {
            if (response.status !== 200) {
                throw new Error();
            }

            return response.json();
        })
        .then(data => {
            localStorage.setItem('auth', data['refreshToken']);

            console.log('refresh ok');
        })
}

// /confirmEmail get
// /resendConfirmationEmail post
// /forgotPassword post
// /resetPassword post
// /manage/2fa post
// /manage/info get
// /manage/info post

// Обертка для запросов с аутентификацией

function fetchWithAuth(url, options, attempt) {
    if (attempt === 3) {
        return false; // здесь переход на окно аутентификации
    }

    if (!options.headers) { // если в запросе отсутствует headers, то задаем их
        options.headers = {};
    }

    //options.headers.Authorization = `Bearer ${tokenData.token}`; // добавляем токен в headers запроса

    return fetch(url, options)
        .then(response => {
            if (response.status !== 200) {
                try {
                    refreshTokens(localStorage['auth']); // если истек, то обновляем токен с помощью refresh_token
                    fetchWithAuth(url, options, attempt + 1);
                } catch {
                    return false; // здесь переход на окно аутентификации
                }
            }
        }).then(data => data)
        .catch(err => {
            alert('Не удалось получить информацию об ответе.')
            console.log(err);
        });
}