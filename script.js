const inputSlider = document.querySelector("[data-lengthSlider]")
const lengthDisplay = document.querySelector("[data-lengthNumber]")
const passwordDisplay = document.querySelector("[data-passwordDisplay]")
const copyBtn = document.querySelector("[data-copy]")
const copyMsg = document.querySelector("[data-copyMsg]")
const uppercaseCheck = document.querySelector("#uppercase")
const lowercaseCheck = document.querySelector("#lowercase")
const numbersCheck = document.querySelector("#numbers")
const symbolsCheck = document.querySelector("#symbols")
const indicator = document.querySelector("[data-indicator]")
const generateBtn = document.querySelector(".generateButton")
const allCheckBox = document.querySelectorAll("input[type=checkbox]")
const symbols = '`~!@#$%^&*()_+-={}[]\|:;"/?.>,<';

let password = "";
let passwordLength = 10;
let checkCount = 0;
// handleSlider is used to reflect password length on UI
handleSlider();
// set strength circle color to gray
setIndicator("#ccc");

// SET PASSWORD LENGTH
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength - min) * 100 / (max - min)) + "% 100%";
}

// circle ka color or shadow generator
function setIndicator(color) {
    indicator.style.backgroundColor = color;
    // shadow khudse dede
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

// taking the range from min to max so that we can take any character between a to z and A to Z
function getRndInteger(min, max) {
    // Here floor is used to convert the float type number(having decimal) into integer
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
    return getRndInteger(0, 9);
}

function generateLowerCase() {
    // Here 97 is the ascii value of 'a' and 123 is the ascii value of 'z'
    // String.fromCharCode is used to convert integer into character
    return String.fromCharCode(getRndInteger(97, 122));
}

function generateUpperCase() {
    // Here 65 is the ascii value of 'A' and 91 is the ascii value of 'Z'
    return String.fromCharCode(getRndInteger(65, 90));
}

// to take any random symbol from the given symbols present at line number 13
function generateSymbol() {
    const randNum = getRndInteger(0, symbols.length);
    // charAt is used to tell as which symbol is kept at that particular index
    return symbols.charAt(randNum);
}

// To calculate the strength of the password generated
function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
        setIndicator("#0f0");
    } else if (
        (hasLower || hasUpper) &&
        (hasNum || hasSym) &&
        passwordLength >= 6
    ) {
        setIndicator("#ff0");
    } else {
        setIndicator("#f00");
    }
}

// To display "copied" text after clicking on copy image
async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch (e) {
        copyMsg.innerText = "Failed";
    }
    // to make copy wala span visible
    copyMsg.classList.add("active");
    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);

}

function shufflePassword(array) {
    // Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        // random j, find out using random function
        const j = Math.floor(Math.random() * (i + 1));
        // swap number at i index and j index
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;

}

function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if (checkbox.checked)
            checkCount++;
    })
    // special condition if the password length is lesser than the ticked boxes
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
})

// input slider ki functioning ke liye
inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
})

// By this code when passwordLength >= 0, we will be able to copy the code
copyBtn.addEventListener('click', () => {
    if (passwordDisplay.value)
        copyContent();
})

generateBtn.addEventListener('click', () => {
    // none of the checkboxes are selected
    if (checkCount <= 0) return;

    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    // let's start the journey to find new password

    // remove old password
    password = "";

    // let's put the stuff mentioned by checkboxes
    // if (uppercaseCheck.checked) {
    //     password += generateUpperCase();
    // }
    // if (lowercaseCheck.checked) {
    //     password += generateLowerCase();
    // }
    // if (numbersCheck.checked) {
    //     password += generateRandomNumber();
    // }
    // if (symbolsCheck.checked) {
    //     password += generateSymbol();
    // }

    let funcArr = [];

    if (uppercaseCheck.checked)
        funcArr.push(generateUpperCase);
    if (lowercaseCheck.checked)
        funcArr.push(generateLowerCase);
    if (numbersCheck.checked)
        funcArr.push(generateRandomNumber);
    if (symbolsCheck.checked)
        funcArr.push(generateSymbol);

    // compulsary addition (jo checkboxes tick ho gye hai)
    for (let i = 0; i < funcArr.length; i++) {
        password += funcArr[i]();
    }

    // remaining addition (let's say ki password length 10 hai or chaaro checkboxes tick hai toh compulasy 
    // addition ke 4 characters toh aa gye ab baaki 6 characters randomly kuch bhi ho skte hai  )
    for (let i = 0; i < passwordLength - funcArr.length; i++) {
        let randIndex = getRndInteger(0, funcArr.length);
        password += funcArr[randIndex]();
    }

    // Ab ek dikkat hai ki checkboxes ke according apna password bn raha hai means 1st character is uppercase
    // 2nd character is lowercase 3rd character is number and symbol.So we have to shuffle it.

    // Shuffe the password
    password = shufflePassword(Array.from(password));

    // Show in UI
    passwordDisplay.value = password;

    // Calculate the strength
    calcStrength();

});