export default function({ store, redirect, route }) {
    // Check if the user is authenticated
        // Log the current route for debugging purposes
    if (!store.getters.getAuthToken) {
        // Redirect to the login page
        redirect("/login");
    }

}