export default function({ store, redirect, route }) {
    // Check if the user is authenticated
        // Log the current route for debugging purposes
        console.log('Current Route:', route.path);
    if (!store.getters.getAuthToken) {
        // Redirect to the login page
        redirect("/login");
    }

    if(store.getters.getUserInfo.role <= 2) {
        console.log("Na admin be this")
    } else {
        console.log("Forbidden user")
    }
}