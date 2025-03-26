window.onload = function() {
    // Define the 404 error page URL
    const errorPage = '/404-error.html';
    
    // Redirect to the error page if the current page is not found
    fetch(window.location.href)
        .then(response => {
            if (!response.ok) {
                window.location.href = errorPage;
            }
        })
        .catch(() => {
            window.location.href = errorPage;
        });
};
