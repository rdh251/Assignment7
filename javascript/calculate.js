/*
	Ross Hall
	ross_hall@student.uml.edu
	UMass Lowell Computer Science Student
	COMP 4610 GUI Programming 1
	Assignment No.7: Using the jQuery Validation Plugin with Your Dynamic Table
    11/24/2018
    
    Description: This is the javascript file for the dynamic
    multiplication table website. This version uses the jQuery 
    plugin validate.js to perform realtime validation. 
    The main function is run every time the user clicks the
    calculate table button as long as the inputs are valid.
    One last validation check is performed in the main function
    limiting the number of cells of the table to keep run time
    reasonably fast. This validation is performed in the main function
    after submission because it is dependant on all four input values.  
*/
const CELL_LIMIT = 99999;
const NUMBER_LIMIT = Number.MAX_SAFE_INTEGER

/* indexes for arrays*/
const X_LO = 0;
const X_HI = 1;
const Y_LO = 2;
const Y_HI = 3;
// enable eager evaluation

// enable validation on focusout
$.validator.setDefaults({
    onfocusout: function (element) {
        $(element).valid();
    }
});

$().ready(function(){
    /* Form validation */
    $("#inputForm").validate({
        submitHandler: function() {
     //       $('#required').addClass('hide');
            main();
        },
        errorElement: "div",
        rules: {
            field1: {
                required: true,
                number: true,
                step: 1,
                max: NUMBER_LIMIT,
                min: -NUMBER_LIMIT
            },
            field2: {
                required: true,
                number: true,
                step: 1,
                max: NUMBER_LIMIT,
                min: -NUMBER_LIMIT
            },
            field3: {
                required: true,
                number: true,
                step: 1,
                max: NUMBER_LIMIT,
                min: -NUMBER_LIMIT
            },
            field4: {
                required: true,
                number: true,
                step: 1,
                max: NUMBER_LIMIT,
                min: -NUMBER_LIMIT
            }
        },
        messages: {
            field1: {
               required: "An integer must be specfied for every bound.",
                number: "Please specify a valid integer. Ex: -10000",
                step: "Please specify a valid integer. Ex: -10000",
                max: "Please enter an integer less than " + Number.MAX_SAFE_INTEGER + ".",
                min: "Please enter an integer greater than " + -Number.MAX_SAFE_INTEGER + "."
            },
            field2: {
                required: "An integer must be specified for every bound.",
                number: "Please specify a valid integer. Ex: -10000",
                step: "Please specify a valid integer. Ex: -10000",
                max: "Please enter an integer less than " + Number.MAX_SAFE_INTEGER + ".",
                min: "Please enter an integer greater than " + -Number.MAX_SAFE_INTEGER + "."
            },
            field3: {
                required: "An integer must be specified for every bound.",
                number: "Please specify a valid integer. Ex: -10000",
                step: "Please specify a valid integer. Ex: -10000",
                max: "Please enter an integer less than " + Number.MAX_SAFE_INTEGER + ".",
                min: "Please enter an integer greater than " + -Number.MAX_SAFE_INTEGER + "."
            },
            field4: {
                required: "An integer must be specified for every bound.",
                number: "Please specify a valid integer. Ex: -10000",
                step: "Please specify a valid integer. Ex: -10000",
                max: "Please enter an integer less than " + Number.MAX_SAFE_INTEGER + ".",
                min: "Please enter an integer greater than " + -Number.MAX_SAFE_INTEGER + "."
            }
        }
    });
});

function main() {
    /* Valid inputs, perform cell limit check */
    /* Clear previous errors */
    $('.badForm').removeClass("badForm");
    $('#multError').text("");
    let error_exists = false;

    formNodes = [];  // array to hold entire input nodes
    formNodes.push($("#lowerX"));
    formNodes.push($("#upperX"));
    formNodes.push($("#lowerY"));
    formNodes.push($("#upperY"));
    
    formValues = [];  // array to hold values in input fields
    let tempValue; 
    for (let i = 0; i < 4; i++) {
        tempValue = Number(formNodes[i].val())
        formValues.push(tempValue);
    }
//    if (!error_exists) {
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
        let x_size = Math.abs(formValues[X_HI] - formValues[X_LO]) + 1;
        let y_size = Math.abs(formValues[Y_HI] - formValues[Y_LO]) + 1; 

        if (x_size * y_size > CELL_LIMIT) {
            /* Too many cells in table */
            formNodes[X_LO].addClass('badForm');
            formNodes[X_HI].addClass('badForm');
            formNodes[Y_LO].addClass('badForm');
            formNodes[Y_HI].addClass('badForm');
            $('#multError').text("The table is limited to displaying " + CELL_LIMIT + " products. Please decrease the size of the ranges.");
            $('#multError').addClass('error');
            error_exists = true;        
        }
        /*overflow check not needed (number displayed as string in scientific notation*/
        /* else if (multiplicationDoesOverflow(formValues[X_HI], formValues[Y_HI])) {
            /* Overflow occurs for some multiplications */
         /*   formNodes[X_HI].classList.add('badForm');
            formNodes[Y_HI].classList.add('badForm');
            multError.innerText = "The product of numbers in this range is too large to represent! Please enter smaller bounds."
            multError.classList.add('error');
            error_exists = true;
}*/
    
    if (!error_exists) {
        /************************************************************************
            Valid inputs, create table
        *************************************************************************/
        $('#scroller').remove(); // clear previous table
        $('#messageSpan').text('Click on a cell to display the equation.');
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
        $('#tableHolder').append(scroller);
    }
}

/***********************************************************************
 * Helper Functions
**********************************************************************/
let selectTableCell = function () {
    td_selected = $('.selected');
    /* unselect any selected cells */
    td_selected.removeClass('selected');
    
    /* displays cell equation in messageSpan*/
    this.classList.add('selected');
    let calc_string = this.getAttribute('id') + ' = ' + this.innerText;
    $('#messageSpan').text(calc_string);
}

//overflow function not needed, large vals represents as string with e 
// This function was taken from: 
// https://www.algotech.solutions/blog/javascript/handle-number-overflow-javascript/
//function multiplicationDoesOverflow(a, b) {
    /* Returns true if overflow occurs during multiplication */
/*    if (a === 0 || b === 0) {
        return false;
    }  
    var c = a * b;
    return a !== c/b || b !== c/a;
}*/