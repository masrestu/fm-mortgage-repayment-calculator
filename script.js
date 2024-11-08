function resetAll() {
    document.getElementById("mortgage-amount").value = "";
    document.getElementById("mortgage-term").value = "";
    document.getElementById("interest-rate").value = "";
    document.getElementById("type-repayment").checked = false;
    document.getElementById("type-interest-only").checked = false;
    document.getElementById("repayments").innerText = "";
    document.getElementById("total-repay").innerText = "";

    document.querySelector(".results").classList.add("empty");
}

function validateForm() {
    [...document.querySelectorAll(".invalid")].forEach(el => el.classList.remove("invalid"));

    const mortgageAmount = document.getElementById("mortgage-amount");
    const termInYears = document.getElementById("mortgage-term");
    const interestRate = document.getElementById("interest-rate");
    const type = document.querySelectorAll('input[name="mortgage-type"]');

    if (mortgageAmount.value == "") {
        mortgageAmount.classList.add("invalid");
    }
    if (termInYears.value == "") {
        termInYears.classList.add("invalid");
    }
    if (interestRate.value == "") {
        interestRate.classList.add("invalid");
    }
    if (![...type].some(type => type.checked)) {
        type[0].classList.add("invalid");
    }

    if ([...document.querySelectorAll(".invalid")].length > 0) return false;

    return true;
}

function calculateRepayments() {
    if (!validateForm()) return false;
    const mortgageAmount = parseFloat(removeAccounting(document.getElementById("mortgage-amount").value));
    const termInYears = parseFloat(removeAccounting(document.getElementById("mortgage-term").value));
    const termInMonths = termInYears * 12;
    const interestInYears = parseFloat(removeAccounting(document.getElementById("interest-rate").value)) / 100;
    const interestInMonths = interestInYears / 12;

    const type = document.querySelector('input[name="mortgage-type"]:checked');
    if (type == null) {
        alert("Please select a mortgage type.");
        return;
    }

    let monthlyRepayments = 0;
    let totalRepayments = 0;

    if (type.id == "type-repayment") {
        monthlyRepayments = interestInMonths ? mortgageAmount * (interestInMonths * (1 + interestInMonths) ** termInMonths) / ((1 + interestInMonths) ** termInMonths - 1) : mortgageAmount / termInMonths;
    }
    else if (type.id == "type-interest-only") {
        monthlyRepayments = mortgageAmount * interestInMonths;
    }

    totalRepayments = monthlyRepayments * termInMonths;

    document.getElementById("repayments").innerText = formatAccounting(monthlyRepayments.toFixed(2));
    document.getElementById("total-repay").innerText = formatAccounting(totalRepayments.toFixed(2));

    document.querySelector(".results").classList.remove("empty");
}

function formatAccounting(value) {
    if (value == "") return "";
    return new Intl.NumberFormat("en-GB").format(value);
}

function removeAccounting(value) {
    return value.replaceAll(",", "");
}

document.addEventListener("DOMContentLoaded", function() {
    // resetAll();
    const numbersInput = document.querySelectorAll("input[type='text']");

    numbersInput.forEach(input => {
        input.addEventListener("blur", function() {
            const value = this.value;
            const formattedValue = formatAccounting(value);
            this.value = formattedValue;
        });

        input.addEventListener("focus", function() {
            const value = this.value;
            const formattedValue = removeAccounting(value);
            this.value = formattedValue;
        });
    });
});