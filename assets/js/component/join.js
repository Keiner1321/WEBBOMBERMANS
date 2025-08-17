function toggleOtherGender() {
    const genderSelect = document.getElementById('gender');
    const otherGenderRow = document.getElementById('other-gender-row');
    const otherGenderInput = document.getElementById('other_gender');

    if (genderSelect.value === 'otro') {
        otherGenderRow.style.display = 'flex';
        otherGenderInput.required = true;
    } else {
        otherGenderRow.style.display = 'none';
        otherGenderInput.required = false;
        otherGenderInput.value = '';
    }
}