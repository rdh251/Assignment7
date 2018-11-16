/*
	Ross Hall
	ross_hall@student.uml.edu
	UMass Lowell Computer Science Student
	COMP 4610 GUI Programming 1
	Assignment No.6: Creating an Interactive Dynamic Table
    11/15/2018
    
    Description: This is the javascript file for the dynamic
    multiplication table website. The main function is run 
    every time the user clicks the calculate table button. 
*/
const CELL_LIMIT = 99999;
const NUMBER_LIMIT = Number.MAX_SAFE_INTEGER

/* indexes for arrays*/
const X_LO = 0;
const X_HI = 1;
const Y_LO = 2;
const Y_HI = 3;

function main() {
    let table_holder = document.getElementById("tableHolder");
    let messageSpan = document.getElementById("messageSpan");
    let badForms = document.getElementsByClassName("badForm");
    clearPrevious(table_holder, messageSpan, badForms); 
    let error_exists = false;

    formNodes = [];  // array to hold entire input nodes
    formNodes.push(document.getElementById("lowerX"));
    formNodes.push(document.getElementById("upperX"));
    formNodes.push(document.getElementById("lowerY"));
    formNodes.push(document.getElementById("upperY"));
    
    formValues = [];  // array to hold values in input fields
    let tempValue; 
    for (let i = 0; i < 4; i++) {
        let str_length = formNodes[i].value.length;
        console.log(str_length);
        tempValue = Number(formNodes[i].value)
        formValues.push(tempValue);
        if (Number.isNaN(tempValue) || tempValue % 1 !== 0 || str_length === 0) {
            /* Invalid integer */
            formNodes[i].classList.add('badForm');
            messageSpan.innerText = "A bound must be an integer value. Ex: 10000";
            messageSpan.classList.add('error');
            error_exists = true;
        } else if (tempValue < -NUMBER_LIMIT || tempValue > NUMBER_LIMIT) {
            /* Integer out of valid range */
            formNodes[i].classList.add('badForm');
            messageSpan.innerText = "A bound must a value between -" + NUMBER_LIMIT + " and +" + NUMBER_LIMIT; 
            messageSpan.classList.add('error');
            error_exists = true;
        }
    }
    if (!error_exists) {
        let temp_node;
        if (formValues[0] > formValues[1]) {
            /* Order x bounds by size */
            tempValue = formValues[0];
            formValues[0] = formValues[1];
            formValues[1] = tempValue;
            
            temp_node = formNodes[0];
            formNodes[0] = formNodes[1];
            formNodes[1] = temp_node;
        }
        if (formValues[2] > formValues[3]) {
            /* Order y bounds by size */
            tempValue = formValues[2];
            formValues[2] = formValues[3];
            formValues[3] = tempValue;
            
            temp_node = formNodes[2];
            formNodes[2] = formNodes[3];
            formNodes[3] = temp_node;
        }
        /* arrays now have form [xLowBound, xHighBound, yLowBound, yHighBound] */
        let x_size = Math.abs(formValues[X_HI]) - Math.abs(formValues[X_LO]) + 1;
        let y_size = Math.abs(formValues[Y_HI]) - Math.abs(formValues[Y_LO]) + 1; 
        if (x_size * y_size > CELL_LIMIT) {
            /* Too many cells in table */
            formNodes[X_LO].classList.add('badForm');
            formNodes[X_HI].classList.add('badForm');
            formNodes[Y_LO].classList.add('badForm');
            formNodes[Y_HI].classList.add('badForm');
            messageSpan.innerText = "The table is limited to displaying " + CELL_LIMIT + " products. Please decrease the size of the ranges."
            messageSpan.classList.add('error');
            error_exists = true;
        } else if (multiplicationDoesOverflow(formValues[X_HI], formValues[Y_HI])) {
            /* Overflow occurs for some multiplications */
            formNodes[X_HI].classList.add('badForm');
            formNodes[Y_HI].classList.add('badForm');
            messageSpan.innerText = "The product of numbers in this range is too large to represent! Please enter smaller bounds."
            messageSpan.classList.add('error');
            error_exists = true;
        }
    }
    if (!error_exists) {
        /************************************************************************
            Valid inputs, create table
        *************************************************************************/
        messageSpan.innerText = 'Click on a cell to display the equation.';
        messageSpan.classList.remove('error');
        scroller = document.createElement('div');
        scroller.setAttribute('id', 'scroller');
        theTable = document.createElement("table");
        let t_top_row = document.createElement('tr');
        for (let i = formValues[X_LO] - 1; i <= formValues[X_HI]; i++) {
            /* Create the first row (X-axis table headers)*/
            let t_heading = document.createElement('th');
            if (i < formValues[X_LO]) {
                t_heading.innerText = '-';
            } else {
                t_heading.innerText = i;
            }
            t_top_row.appendChild(t_heading);
        }
        theTable.appendChild(t_top_row);
        for (let i = formValues[Y_LO]; i <= formValues[Y_HI]; i++) {
            /* Create subsequent rows */
            let t_row = document.createElement('tr');
            let t_heading = document.createElement('th');
            t_heading.innerText = i;  // (Y-axis table heading)
            t_row.appendChild(t_heading);
            for (let j = formValues[X_LO]; j <= formValues[X_HI]; j++) {
                /* table data creation */
                let t_data = document.createElement('td');
                t_data.innerText = i * j;  // calculate product
                let id_string = i + ' X ' + j;  // id_string is the equation that generated cell value
                t_data.setAttribute('id', id_string);
                t_data.onclick = selectTableCell;
                t_row.appendChild(t_data);
            }
            theTable.appendChild(t_row);
        }
        scroller.appendChild(theTable);
        table_holder.appendChild(scroller);
    }
}

/***********************************************************************
 * Helper Functions
**********************************************************************/
function clearPrevious(table_holder, messageSpan, badForms) {
    /* Clear table or previous error from last run */
    while (table_holder.firstChild) {
        table_holder.removeChild(table_holder.firstChild);
    }
    while (badForms.length) {
        badForms[0].classList.remove("badForm");
    }
    messageSpan.textContent = "";
}

let selectTableCell = function () {
    /* displays cell equation in messageSpan*/
    td_selected = document.getElementsByClassName('selected');
    while (td_selected.length) {
        /* unselect any selected cells */
        td_selected[0].classList.remove('selected');
    }
    this.classList.add('selected');
    let calc_string = this.getAttribute('id') + ' = ' + this.innerText;
    messageSpan.innerText = calc_string;
}

// This function was taken from:
// https://www.algotech.solutions/blog/javascript/handle-number-overflow-javascript/
function multiplicationDoesOverflow(a, b) {
    /* Returns true if overflow occurs during multiplication */
    if (a === 0 || b === 0) {
        return false;
    }  
    var c = a * b;
    return a !== c/b || b !== c/a;
}