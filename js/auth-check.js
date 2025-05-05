document.addEventListener('DOMContentLoaded', function() {
    auth.onAuthStateChanged((user) => {
        const authLink = document.getElementById('auth-link');
        const accountLink = document.getElementById('account-link');
        
        if (user) {
            // User is signed in
            if (authLink) authLink.style.display = 'none';
            if (accountLink) accountLink.style.display = 'block';
            
            // Check user role and redirect if needed
            db.collection('users').doc(user.uid).get()
                .then((doc) => {
                    if (doc.exists) {
                        const userData = doc.data();
                        const currentPage = window.location.pathname.split('/').pop();
                        
                        if (userData.role === 'admin' && currentPage !== 'admin.html') {
                            window.location.href = 'admin.html';
                        } else if (userData.role === 'coach' && currentPage !== 'coach.html') {
                            window.location.href = 'coach.html';
                        }
                    }
                });
        } else {
            // User is signed out
            if (authLink) authLink.style.display = 'block';
            if (accountLink) accountLink.style.display = 'none';
            
            // Redirect from protected pages
            const currentPage = window.location.pathname.split('/').pop();
            if (['personalaccount.html', 'admin.html', 'coach.html'].includes(currentPage)) {
                window.location.href = 'login.html';
            }
        }
    });
});