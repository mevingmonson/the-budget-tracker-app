// Budget Controller
var budgetController = (function () {

    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    }

    Expense.prototype.calcPercentage = function (totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.floor((this.value / totalIncome) * 100);
        }
        else {
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function () {
        return this.percentage;
    };

    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }

    var calculateTotal = function (type) {
        var sum = 0;
        data.allItems[type].forEach(function (current) {
            sum = sum + current.value;
        });
        data.totals[type] = sum;
    }
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };

    return {
        addItem: function (type, des, val) {
            var newItem, ID;
            //creating ID
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            }
            else {
                ID = 0;
            }

            //creating new item based on income or expense
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            }
            else {
                newItem = new Income(ID, des, val);
            }

            data.allItems[type].push(newItem);
            return newItem;
        },

        deleteItem: function (type, id) {
            var index, ids;

            ids = data.allItems[type].map(function (current) {
                return current.id;
            });
            index = ids.indexOf(id);
            data.allItems[type].splice(index, 1);
        },

        calculcateBudget: function () {

            //calculate total income and expense
            calculateTotal('exp');
            calculateTotal('inc');

            //calculate budget = income - expense
            data.budget = data.totals.inc - data.totals.exp;

            //calculate the percentage 
            if (data.totals.inc > 0) {
                data.percentage = Math.floor((data.totals.exp / data.totals.inc) * 100);
            }
            else {
                data.percentage = -1;
            }

        },

        calculatePercentage: function () {
            data.allItems.exp.forEach(function (current) {
                current.calcPercentage(data.totals.inc);
            });
        },

        getPercentages: function () {
            var allPerc = data.allItems.exp.map(function (current) {
                return current.percentage;
            });
            return allPerc;
        },

        getBudget: function () {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
        },

        testing: function () {
            console.log(data);
        }
    }


})();


// UI Contoller
var UIController = (function () {
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expPercentLabel: '.item__percentage',
        monthLabel: '.budget__title--month'
    };

    var formatNumber = function (num, type) {

        var int, dec;
        num = Math.abs(num);
        num = num.toFixed(2);

        num = num.split('.');
        int = num[0];

        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
        }

        dec = num[1];
        return (type === 'exp' ? '-' : '+') + int + '.' + dec;
    };

    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
        },

        addListItem: function (obj, type) {
            var html, newHtml, element;

            //creating html strings with placeholder
            if (type === 'inc') {

                element = DOMstrings.incomeContainer;

                html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

            } else if (type === 'exp') {

                element = DOMstrings.expenseContainer;

                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            //replacing placegolder with actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

            //inserting html into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

        },

        deleteListItem: function (selectorID) {
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },

        clearFields: function () {
            var fields, fieldsArray;

            fields = document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue);
            fieldsArray = Array.prototype.slice.call(fields);

            fieldsArray.forEach(function (current, index, array) {
                current.value = '';
            });
            fieldsArray[0].focus();
        },

        displayBudget: function (obj) {

            var type;
            obj.budget > 0 ? type = 'inc' : type = 'exp';

            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMstrings.expenseLabel).textContent = formatNumber(obj.totalExp, 'exp');
            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            }
            else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }
        },

        displayPercentage: function (percentages) {

            var fields = document.querySelectorAll(DOMstrings.expPercentLabel);

            var nodeListForEachfunction = function (fieldSet, callback) {
                for (var i = 0; i < fieldSet.length; i++) {
                    callback(fieldSet[i], percentages[i]);
                }
            }

            nodeListForEachfunction(fields, function (current, perc) {
                if (perc > 0) {
                    current.textContent = perc + '%';
                }
                else {
                    current.textContent = '--';
                }
            });
        },

        displayMonth: function () {
            var date, month, months, year;
            date = new Date();
            month = date.getMonth();
            year = date.getFullYear();
            months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            document.querySelector(DOMstrings.monthLabel).textContent = months[month] + ' ' + year;
        },

        getDOMstrings: function () {
            return DOMstrings;
        }
    };


})();


// Global App Controller
var controller = (function (budgetCtrl, UICtrl) {

    //Setting up event handlers
    var setupEventListeners = function () {
        var DOM = UICtrl.getDOMstrings();
        document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);
        document.addEventListener('keypress', function (event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
    };

    var updateBudget = function () {

        // 1  Calculate the budget
        budgetCtrl.calculcateBudget();

        // 2 Return thr budget
        var budget = budgetCtrl.getBudget();
        console.log(budget);

        // 3 Display the budget to the UI
        UICtrl.displayBudget(budget);
    };

    var updatePercentage = function () {

        //calculate the percentage
        budgetCtrl.calculatePercentage();

        //read percentage from the budger controller
        var percentages = budgetCtrl.getPercentages();
        console.log(percentages);

        //update the UI with the new %
        UICtrl.displayPercentage(percentages);
    }

    //Get the field input data
    var ctrlAddItem = function () {
        var input, newItem;

        // get the data from the input field
        input = UICtrl.getInput();

        if (input.description !== '' && !isNaN(input.value) && input.value > 0) {
            //add the item to the budet controller
            newItem = budgetController.addItem(input.type, input.description, input.value);

            //add the item to the UI
            UICtrl.addListItem(newItem, input.type);

            //clear the input fields
            UICtrl.clearFields();

            //calculate and update the budget
            updateBudget();

            //calculate and update percentage
            updatePercentage();
        }
    };

    var ctrlDeleteItem = function (event) {
        var itemID, splitID, ID, type;
        console.log(event.target);

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id

        if (itemID) {
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);
        }

        //delete the item from the data structure
        budgetCtrl.deleteItem(type, ID);

        //delete item from the ui
        UICtrl.deleteListItem(itemID);

        //update and show the new budget
        updateBudget();

        //calculate and update the percentage
        updatePercentage();
    };

    return {
        init: function () {
            setupEventListeners();
            UICtrl.displayMonth();
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
        }
    }

})(budgetController, UIController);

controller.init()