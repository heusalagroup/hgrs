import { Language } from "../fi/hg/core/types/Language";
import { AuthEmailQueryParam } from "../fi/hg/core/auth/email/types/AuthEmailQueryParam";
import { CallbackWithLanguage } from "../fi/hg/core/auth/email/constants";

export const VALID_ADMIN_DOMAINS = ['example.fi', 'example.com'];

/**
 * `GET /`
 */
export const HGRS_API_INDEX_PATH = '/';
export const HGRS_API_GET_SERVICE_PATH = "service";
/**
 * `parentId`
 */
export const HGRS_API_GET_MY_ITEM_ID = "parentId";



// *************** AUTHENTICATIONS *************** //

/**
 * `POST /authenticate`
 */
export const HGRS_API_AUTHENTICATE_EMAIL_PATH = '/authenticate';

/**
 * `POST /authenticate/verify-token`
 */
export const HGRS_API_VERIFY_EMAIL_TOKEN_PATH = '/authenticate/verify-token';

/**
 * `POST /authenticate/verify-code`
 */
export const HGRS_API_VERIFY_EMAIL_CODE_PATH = '/authenticate/verify-code';

export const HGRS_AUTHENTICATE_EMAIL_URL_WITH_LANGUAGE: CallbackWithLanguage = (lang: Language) => `${HGRS_API_AUTHENTICATE_EMAIL_PATH}?${AuthEmailQueryParam.LANGUAGE}=${q(lang)}`;
export const HGRS_VERIFY_EMAIL_CODE_URL_WITH_LANGUAGE: CallbackWithLanguage = (lang: Language) => `${HGRS_API_VERIFY_EMAIL_TOKEN_PATH}?${AuthEmailQueryParam.LANGUAGE}=${q(lang)}`;
export const HGRS_VERIFY_EMAIL_TOKEN_URL_WITH_LANGUAGE: CallbackWithLanguage = (lang: Language) => `${HGRS_API_VERIFY_EMAIL_CODE_PATH}?${AuthEmailQueryParam.LANGUAGE}=${q(lang)}`;

// *************** ITEMS *************** //

/**
 * `GET /my/items`
 */
export const getServicePath = (service: string) => `/${encodeURIComponent(service)}}`;
export const getParentPath = (parent: string) => `/${encodeURIComponent(parent)}}`;

/**
 * Create a item
 *
 * `POST /my/item`
 */
export const HGRS_API_POST_MY_ITEM_PATH = "/item";
/**
 * `GET /my/items` + idListStrig[], getSome(), 
 */
export const HGRS_API_GET_MY_ITEM_LIST_PATH = "/{service}/items"; //

/**
 * `GET /my/items/property` + propertyName, propertyValue getAllByProperty(), 
 */
export const HGRS_API_GET_MY_ITEM_PROPERTY_LIST_PATH = "{service}/items/property";
/**
 * `GET /my/items/` getAll, 
 */
export const HGRS_API_GET_MY_ITEM_ALL_LIST_PATH = "/{service}/allitems";
/**
 * `GET /my/item` + idString findByIfd, 
 */
export const HGRS_API_GET_MY_ITEM_PATH = "/{service}/item";
/**
 * `POST /my/item/{id}` findByIdAndUpdate path
 */
export const HGRS_API_UPDATE_MY_ITEM_PATH = "/{service}/item/{id}";
/**
 * `id`
 */
export const HGRS_API_GET_ITEM_ID = "id";
/**
 * `DELETE /my/items`
 */
export const HGRS_API_DELETE_MY_ITEM_LIST_PATH = "/item";

function q(value: string): string {
    return encodeURIComponent(value);
}