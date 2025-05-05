import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCyD5mO4vklYYsY8ts7vbwXNromqSqtncM",
    authDomain: "webproject-4a8e1.firebaseapp.com",
    databaseURL: "https://webproject-4a8e1-default-rtdb.firebaseio.com",
    projectId: "webproject-4a8e1",
    storageBucket: "webproject-4a8e1.firebasestorage.app",
    messagingSenderId: "934208444740",
    appId: "1:934208444740:web:e001b8e3da10809671df11",
    measurementId: "G-W4FFGKRXR2"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

async function loginUser() {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!email || !password) {
        Swal.fire("Ошибка", "Введите email и пароль", "error");
        return;
    }

    try {
        // Попытка входа через Firebase Authentication
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Дополнительная проверка в Realtime Database
        const snapshot = await get(ref(database, 'Authorization'));
        const users = snapshot.val() || {};
        
        const foundUser = Object.values(users).find(u => 
            u && (u.Login === email || u.email === email)
        );

        if (!foundUser) {
            await auth.signOut();
            throw new Error("Пользователь не найден в базе данных");
        }

        // Проверка роли и перенаправление
        switch(foundUser.ID_Post) {
            case "1": window.location.href = 'admin.html'; break;
            case "3": window.location.href = 'coach.html'; break;
            default: window.location.href = 'personalaccount.html';
        }

    } catch (error) {
        console.error("Ошибка входа:", error);
        let message = "Ошибка входа. Проверьте данные.";
        
        if (error.code === 'auth/user-not-found') message = "Пользователь не найден";
        if (error.code === 'auth/wrong-password') message = "Неверный пароль";
        if (error.code === 'auth/too-many-requests') message = "Слишком много попыток. Попробуйте позже";
        
        Swal.fire("Ошибка", message, "error");
    }
}

document.getElementById('loginbutton').addEventListener('click', loginUser);