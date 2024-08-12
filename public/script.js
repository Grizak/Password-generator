document.getElementById('generate-btn').addEventListener('click', generatePassword);
document.getElementById('copy-btn').addEventListener('click', copyPassword);

function generatePassword() {
    const length = document.getElementById('length').value;
    const includeUppercase = document.getElementById('uppercase').checked;
    const includeDigits = document.getElementById('digits').checked;
    const includeSymbols = document.getElementById('symbols').checked;

    const lower = "abcdefghijklmnopqrstuvwxyz";
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const digits = "0123456789";
    const symbols = "!@#$%^&*()_+[]{}|;:',.<>?";

    let allCharacters = lower;
    if (includeUppercase) allCharacters += upper;
    if (includeDigits) allCharacters += digits;
    if (includeSymbols) allCharacters += symbols;

    let password = "";
    for (let i = 0; i < length; i++) {
        password += allCharacters.charAt(Math.floor(Math.random() * allCharacters.length));
    }

    document.getElementById('password').value = password;
}

function copyPassword() {
    const passwordField = document.getElementById('password');
    passwordField.select();
    document.execCommand('copy');
    alert("Password copied to clipboard!");
}
