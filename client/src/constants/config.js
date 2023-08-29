export const BACKEND_BASE_URL = process.env.REACT_APP_API_BASE_URL;
export const ROOT = process.env.REACT_APP_SITE_BASE_URL;
export const PATH = {
    ROOT: ROOT,
    LANDING_PAGE: ROOT + 'landing/',
    LOGIN_PAGE: ROOT + 'login/',
    SIGNUP_PAGE: ROOT + 'signup/',
    VERIFIED_PAGE: ROOT + 'verify-email/:uidb64/:token',
    USER_SETUP_PAGE: ROOT + 'user-setup/',
    REWARDS_PAGE: ROOT + 'rewards/',
    PRODUCTS_PAGE: ROOT + 'products/',
    PRODUCT_DETAILS: ROOT + 'products/:productid/',
};
export const CLIENT_ID = parseInt(process.env.REACT_APP_CLIENT_ID);