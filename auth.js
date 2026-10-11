(function () {
    var USERS_KEY = "gadgetHubUsers";           
    var CURRENT_KEY = "gadgetHubCurrentUser";   
    var registerMode = false;                   


    function $(id) { return document.getElementById(id); }
    function getUsers() {
        try { return JSON.parse(localStorage.getItem(USERS_KEY) || "[]"); }
        catch (e) { return []; }
    }
    function saveUsers(users) {
        try { localStorage.setItem(USERS_KEY, JSON.stringify(users)); return true; }
        catch (e) { return false; }
    }
    function sameName(a, b) {
        return a.toLowerCase() === b.toLowerCase();
    }
    function say(text, ok) {
        var msg = $("loginMessage");
        if (!msg) return;
        msg.textContent = text;
        msg.style.color = ok ? "#4ade80" : "#f87171";
    }
    function ensureConfirmField() {
        var box = $("registerFields");
        if (box) return box;
        var pass = $("password");
        if (!pass) return null;


        box = document.createElement("div");
        box.id = "registerFields";
        box.style.display = "none";
        box.innerHTML =
            '<label class="input-title" for="confirmPassword">Confirm Password</label>' +
            '<input class="form-control" type="password" id="confirmPassword" placeholder="Re-enter password" autocomplete="new-password">';
        pass.parentNode.insertBefore(box, pass.nextSibling);
        return box;
    }

    function setMode(isRegister) {
        registerMode = isRegister;
        var fields = ensureConfirmField();
        if (fields) fields.style.display = isRegister ? "block" : "none";


        var loginBtn = $("loginButton");
        var toggleBtn = $("showRegister");
        var subtitle = document.querySelector(".login-subtitle");


        if (loginBtn) loginBtn.textContent = isRegister ? "Register" : "Login";
        if (toggleBtn) toggleBtn.textContent = isRegister ? "Back to Login" : "Create an Account";
        if (subtitle) subtitle.textContent = isRegister ? "Create Your Account" : "Login to Your Account";
        say("", true);
    }
    function updateNav() {
        var navLogin = document.querySelector(".login-nav-button");
        if (!navLogin) return;
        var current = null;
        try { current = localStorage.getItem(CURRENT_KEY); } catch (e) {}
        navLogin.textContent = current ? "Logout (" + current + ")" : "Login";
        navLogin.dataset.loggedIn = current ? "1" : "";
    }


    function register(username, password, users) {
        var confirmEl = $("confirmPassword");
        var confirmValue = confirmEl ? confirmEl.value : "";


        if (password.length < 4) {
            say("Password must be at least 4 characters.", false);
            return;
        }
        if (password !== confirmValue) {
            say("Passwords do not match.", false);
            return;
        }
        if (users.some(function (u) { return sameName(u.username, username); })) {
            say("That username is already taken.", false);
            return;
        }


        users.push({ username: username, password: password });
        if (!saveUsers(users)) {
            say("Could not save the account (browser storage is blocked).", false);
            return;
        }


        if (confirmEl) confirmEl.value = "";
        $("password").value = "";
        setMode(false);
        say("Account created! You can log in now.", true);
    }


    function logIn(username, password, users) {
        var match = users.find(function (u) {
            return sameName(u.username, username) && u.password === password;
        });


        if (!match) {
            say("Wrong username or password. No account yet? Tap Create an Account.", false);
            return;
        }


        try { localStorage.setItem(CURRENT_KEY, match.username); } catch (e) {}
        say("Welcome, " + match.username + "!", true);
        $("username").value = "";
        $("password").value = "";
        updateNav();
        // Short pause so the welcome message can be read, then go to the home page
        setTimeout(function () { location.hash = "home"; }, 700);
    }


    function submit() {
        var username = ($("username").value || "").trim();
        var password = $("password").value || "";


        if (!username || !password) {
            say("Please enter a username and password.", false);
            return;
        }


        var users = getUsers();
        if (registerMode) {
            register(username, password, users);
        } else {
            logIn(username, password, users);
        }
    }


    document.addEventListener("click", function (e) {
        var target = e.target;
        if (target.closest("#showRegister")) {
            e.preventDefault();
            setMode(!registerMode);
            return;
        }
        if (target.closest("#loginButton")) {
            e.preventDefault();
            submit();
            return;
        }
        var nav = target.closest(".login-nav-button");
        if (nav && nav.dataset.loggedIn) {
            e.preventDefault();
            try { localStorage.removeItem(CURRENT_KEY); } catch (err) {}
            updateNav();
            location.hash = "home";
        }
    });


    document.addEventListener("keydown", function (e) {
        if (e.key === "Enter" && e.target.closest && e.target.closest("#loginForm")) {
            e.preventDefault();
            submit();
        }
    });


    updateNav();
})();
