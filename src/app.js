// Budget Controller
var BudgetController = (function () {


})();


// UI Contoller
var UIController = (function () {
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn'
    };
    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                add__value: document.querySelector(DOMstrings.inputValue).value
            };
        },
        getDOMstrings: function () {
            return DOMstrings;
        }
    };


})();


// Global App Controller
var Controller = (function (budgetCtrl, UICtrl) {

    //Setting up event handlers
    var setupEventListeners = function () {
        var DOM = UICtrl.getDOMstrings();
        document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);
        document.addEventListener('keypress', function (event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });
    };

    //Get the field input data
    var ctrlAddItem = function () {
        var input = UICtrl.getInput();
        console.log(input);
        console.log('it works');
    };
    //add the item to the budet controller


    //add the item to the UI


    //calculate the budget


    //displat the budget on the UI

    return {
        init: function () {
            setupEventListeners();
        }
    }

})(BudgetController, UIController);

Controller.init()