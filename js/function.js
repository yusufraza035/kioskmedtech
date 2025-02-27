document.addEventListener('DOMContentLoaded', function () {
    const toggleLangLink = document.getElementById('toggleLangLink');
    if (!toggleLangLink) {
        console.error('Element with id "toggleLangLink" not found.');
        return;
    }

    const localLang = localStorage.getItem('lang') || '';
    const currentLang = toggleLangLink.innerHTML || '';

    console.log('localLang:', localLang);
    console.log('currentLang:', currentLang);
    console.log('localLang length:', localLang.length);
    console.log('currentLang length:', currentLang.length);

    const normalizedLocalLang = localLang.trim().normalize();
    const normalizedCurrentLang = currentLang.trim().normalize();

    console.log('Normalized localLang:', normalizedLocalLang);
    console.log('Normalized currentLang:', normalizedCurrentLang);

    if (normalizedLocalLang === normalizedCurrentLang) {
        console.log('Condition matched. Calling togglelang().');
        togglelang();
    } else {
        console.log('Condition did not match.');
    }
  });
 function setLang(){
   localStorage.setItem('lang', document.getElementById('toggleLangLink').innerText);
   togglelang();
}

document.addEventListener('DOMContentLoaded', function () {
    // Find the element with the class .signoutpic
    const signoutLink = document.querySelector('.signoutpic');
    const localLang = localStorage.getItem('lang') || '';
    // Attach a click event listener to the signoutLink element
    signoutLink.addEventListener('click', function (event) {
        event.preventDefault(); // Prevent the default link behavior
	localStorage.setItem("lang", localLang)
        // Redirect to index.html
        window.location.href = 'index.html';
    });
});