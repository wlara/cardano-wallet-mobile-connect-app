import { load } from "recaptcha-v3";

let recaptcha;

/**
 * Initializes recaptcha if it hasn't been initialized yet
 * and returns a recaptcha token.
 */
export const getRecaptchaHeaders = async (action) => {
    if (!recaptcha) {
        const siteKey = process.env.REACT_APP_RECAPTCHA_SITE_KEY
        if (!siteKey) {
            throw new Error("Missing REACT_APP_RECAPTCHA_SITE_KEY environment variable");
        }
        recaptcha = await load(siteKey, { autoHideBadge: true });
    }
    return {
        "g-recaptcha-platform": "Web",
        "g-recaptcha-token": await recaptcha.execute(action)
    };
};
