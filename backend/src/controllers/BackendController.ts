// Copyright (c) 2022. Heusala Group <info@heusalagroup.fi>. All rights reserved.

import {
    GetMapping,
    RequestHeader,
    RequestMapping,
    RequestParam,
    PathVariable,
    PostMapping,
    PutMapping,
    RequestBody,
    DeleteMapping
} from "../fi/hg/core/Request";
import {
    HGRS_API_AUTHENTICATE_EMAIL_PATH,
    HGRS_API_GET_MY_ITEM_PATH,
    HGRS_API_GET_MY_ITEM_LIST_PATH,
    HGRS_API_GET_MY_ITEM_ALL_LIST_PATH,
    HGRS_API_GET_MY_ITEM_PROPERTY_LIST_PATH,
    //HGRS_API_UPDATE_MY_WORKSPACE_USER_USER_ID,
    HGRS_API_POST_MY_ITEM_PATH,
    HGRS_API_VERIFY_EMAIL_CODE_PATH,
    HGRS_API_VERIFY_EMAIL_TOKEN_PATH,
    HGRS_API_INDEX_PATH,
    HGRS_API_GET_MY_ITEM_ID,
    HGRS_API_DELETE_ITEM_PATH,
    //HGRS_API_DELETE_MY_ITEM_LIST_PATH,
    HGRS_API_UPDATE_MY_ITEM_PATH,
    HGRS_API_GET_ITEM_ID,
    VALID_ADMIN_DOMAINS
} from "../constants/hgrs-api";

import { RequestParamValueType } from "../fi/hg/core/request/types/RequestParamValueType";
import { isReadonlyJsonObject, ReadonlyJsonObject } from "../fi/hg/core/Json";
import { ResponseEntity } from "../fi/hg/core/request/ResponseEntity";
import { REPOSITORY_NEW_IDENTIFIER } from "../fi/hg/core/simpleRepository/types/Repository";
import { LogService } from "../fi/hg/core/LogService";
import { HttpReposityServerService } from "../services/HttpReposityServerService";
import { LogLevel } from "../fi/hg/core/types/LogLevel";
import { RepositoryEntry } from "../fi/hg/core/simpleRepository/types/RepositoryEntry";
import { StoredRepositoryItem } from "../fi/hg/core/simpleRepository/types/StoredRepositoryItem";
import { createErrorDTO, ErrorDTO } from "../fi/hg/core/types/ErrorDTO";
import { HGRS_AUTHORIZATION_HEADER_NAME } from "../constants/hgrs-headers";
import { filter, map, trim, uniq } from "../fi/hg/core/modules/lodash";
import { EmailAuthController } from "../fi/hg/backend/EmailAuthController";
import { JwtService } from "../fi/hg/backend/JwtService";
import { EmailTokenService } from "../fi/hg/backend/EmailTokenService";
import { RepositoryItem } from "../fi/hg/core/simpleRepository/types/RepositoryItem";

import { HgrsQueryParam } from "../types/hgrsQueryParams"; //"../app/procurenode/types/ProcureQueryParam";

const LOG = LogService.createLogger('BackendController');

@RequestMapping("/")
export class BackendController {

    public static setLogLevel(level: LogLevel) {
        LOG.setLogLevel(level);
    }

    private static _reposityServer: HttpReposityServerService;
    private static _emailTokenService: EmailTokenService;
    private static _emailAuthController: EmailAuthController;

    private static _service: string;

    public static setReposityServer(service: HttpReposityServerService) {
        this._reposityServer = service;
    }

    public static setEmailTokenService(service: EmailTokenService): void {
        this._emailTokenService = service;
    }

    public static setEmailAuthController(service: EmailAuthController): void {
        this._emailAuthController = service;
    }


    @GetMapping(HGRS_API_INDEX_PATH)
    public static async getIndex (
        @RequestHeader(HGRS_AUTHORIZATION_HEADER_NAME, {
            required: false,
            defaultValue: ''
        })
        token: string
    ): Promise<ResponseEntity<ReadonlyJsonObject | {readonly error: string}>> {
        try {

            return ResponseEntity.ok({
                hello: 'world abyone'
            } as unknown as ReadonlyJsonObject);

        } catch (err) {
            LOG.error(`ERROR: `, err);
            return ResponseEntity.internalServerError<{readonly error: string}>().body({
                error: 'Internal Server Error'
            });
        }
    }

    /** GET ALL
     * Returns all
    */
    @GetMapping(HGRS_API_GET_MY_ITEM_ALL_LIST_PATH)
    public static async getAll(
        @RequestHeader(HGRS_AUTHORIZATION_HEADER_NAME, {
            required: false,
            defaultValue: ''
        })
        token: string
    ): Promise<ResponseEntity<ReadonlyJsonObject | ErrorDTO>> {
        try {

            const listAll = await this._reposityServer.getAll();

            return ResponseEntity.ok(
                listAll as unknown as ReadonlyJsonObject
            );

        } catch (err) {
            LOG.error(`getAll: ERROR: `, err);
            return ResponseEntity.internalServerError<ErrorDTO>().body(
                createErrorDTO('Internal Server Error', 500)
            );
        }
    }


    /**
     * GET SOME EI TOIMI
     * @param idListString
     * Returns a list of something http://localhost:3000/items?idListString="f99df4
     */
    @GetMapping(HGRS_API_GET_MY_ITEM_LIST_PATH)
    public static async getSome(
        @RequestHeader(HGRS_AUTHORIZATION_HEADER_NAME, {
            required: false //oikeasti jos autentikaatio niin true VAIHDA !
        })
        token: string,
        @RequestParam('idListString', RequestParamValueType.STRING)
        idListString: string
        /*@RequestParam(HgrsQueryParam.PARENT_LIST, RequestParamValueType.STRING)
        idListString: " ",*/
    ): Promise<ResponseEntity<ReadonlyJsonObject | undefined | ErrorDTO>> {

        try {
            /*AUTH if ( !token ) {
                 LOG.warn(`Warning! No authentication token provided.`);
                 return ResponseEntity.internalServerError<ErrorDTO>().body(
                     createErrorDTO('Access denied', 403)
                 );
             }*/

            console.log("IDLISTSTRING ", idListString)
            const idList: readonly string[] | undefined = idListString ? (`${idListString ?? ''}`).split(' ').map(trim) : undefined;

            //const idList: readonly string[] | undefined = idListString ? (`${idListString ?? ''}`).split(' ').map(trim) : undefined;

            console.log("TEST", idList);

            //const idList: string = trim(idListString ?? '');
            /* AUTH const email: string | undefined = JwtService.decodePayloadSubject(token);
            if ( !email ) {
                LOG.warn(`Warning! Token did not have an email address.`, token);
                return ResponseEntity.internalServerError<ErrorDTO>().body(
                    createErrorDTO('Access denied', 403)
                );
            }
         
            if ( !this._emailTokenService.verifyToken(email, token, true) ) {
                LOG.debug(`getMyWorkspaceList: Access denied for email: `, email, token);
                return ResponseEntity.internalServerError<ErrorDTO>().body(
                    createErrorDTO('Access denied', 403)
                );
            }*/
            //do something
            //const response: ReadonlyJsonObject = { toimii: "toimii" }

            const response = await this._reposityServer.getSome(idList);

            console.log("Response", JSON.stringify(response))

            return ResponseEntity.ok(response as unknown as ReadonlyJsonObject);

        } catch (err) {
            LOG.error(`getSome: ERROR: `, err);
            return ResponseEntity.internalServerError<ErrorDTO>().body(
                createErrorDTO('Internal Server Error', 500)
            );
        }
    }

    /**
    * Item creation
    *
    * @param token
    * @param body
    */
    @PostMapping(HGRS_API_POST_MY_ITEM_PATH)
    public static async createItem(
        @RequestHeader(HGRS_AUTHORIZATION_HEADER_NAME, {
            required: false //MUUTA
        })
        token: string,
        //@PathVariable(HGRS_API_GET_MY_ITEM_ID, { required: true })
        //parentIdString: string,
        @RequestBody
        body: ReadonlyJsonObject
    ): Promise<any | ResponseEntity<ErrorDTO>> {
        try {

            /* if (!isReadonlyJsonObject(body)) {
                 LOG.debug(`createItem: Body not ReadonlyJsonObject: `, body);
                 return ResponseEntity.badRequest<ErrorDTO>().body(
                     createErrorDTO('Bad Request', 400)
                 );
             }*/

            //const itemId: string = trim(parentIdString ?? '');
            //LOG.debug(`createItem: itemId: `, itemId);

            /* if (!token) {
                 LOG.warn(`Warning! No authentication token provided in createItem`);
                 return ResponseEntity.internalServerError<ErrorDTO>().body(
                     createErrorDTO('Access denied', 403)
                 );
             }
 
             const email: string | undefined = JwtService.decodePayloadSubject(token);
             if (!email) {
                 LOG.warn(`Warning! Token did not have an email address in createTicket.`, token);
                 return ResponseEntity.internalServerError<ErrorDTO>().body(
                     createErrorDTO('Access denied', 403)
                 );
             }
 
             if (!this._emailTokenService.verifyToken(email, token, true)) {
                 LOG.debug(`createTicket: Access denied for email: `, email, token);
                 return ResponseEntity.internalServerError<ErrorDTO>().body(
                     createErrorDTO('Access denied', 403)
                 );
             }*/


            if (!body.id || !body.target) {
                LOG.warn(`Warning! No wanted params`);
                return ResponseEntity.internalServerError<ErrorDTO>().body(
                    createErrorDTO('Not found', 404)
                );

            }

            const newItemModel: StoredRepositoryItem = { //lisää muoto
                // ...body,
                id: (body?.id).toString(),
                target: (body?.target).toString()
            };
            console.log(`createItem: newItemModel= `, newItemModel);

            const item = await this._reposityServer.updateOrCreateItem(newItemModel);
            LOG.debug(`createItem: item= `, item);
            return item;

        } catch (err) {
            LOG.error(`createItem: ERROR: `, err);
            return ResponseEntity.internalServerError<ErrorDTO>().body(
                createErrorDTO('Internal Server Error', 500)
            );
        }
    }

    /**
    * Returns by item ID
    *
    * @param token
    * @param idString
    * http://localhost:3000/c/item?idString=820e0...
    */
    @GetMapping(HGRS_API_GET_MY_ITEM_PATH)
    public static async findById(
        @RequestHeader(HGRS_AUTHORIZATION_HEADER_NAME, {
            required: false
        })
        token: string,
        @RequestParam('idString', RequestParamValueType.STRING)
        idString: string
    ): Promise<any | ResponseEntity<ErrorDTO>> {
        try {

            /*  if ( !token ) {
                  LOG.warn(`Warning! No authentication token provided in getMyUserById.`);
                  return ResponseEntity.internalServerError<ErrorDTO>().body(
                      createErrorDTO('Access denied', 403)
                  );
              }*/

            //const workspaceId: string = trim(parentIdString ?? '');
            const itemId: string = trim(idString ?? '');

            /*  const email: string | undefined = JwtService.decodePayloadSubject(token);
              if ( !email ) {
                  LOG.warn(`Warning! Token did not have an email address in getMyUserById.`, token);
                  return ResponseEntity.internalServerError<ErrorDTO>().body(
                      createErrorDTO('Access denied', 403)
                  );
              }
  
              if ( !this._emailTokenService.verifyToken(email, token, true) ) {
                  LOG.debug(`getMyUserById: Access denied for email: `, email, token);
                  return ResponseEntity.internalServerError<ErrorDTO>().body(
                      createErrorDTO('Access denied', 403)
                  );
              }*/

            const result = await this._reposityServer.findById(itemId);

            if (!result) {
                return ResponseEntity.notFound<ErrorDTO>().body(
                    createErrorDTO('Not Found', 404)
                );
            }
            return result;

        } catch (err) {
            LOG.error(`findById: ERROR: `, err);
            return ResponseEntity.internalServerError<ErrorDTO>().body(
                createErrorDTO('Internal Server Error', 500)
            );
        }
    }

    /**
    * Returns by property and value
    *
    * @param token
    * @param parentIdString
    * @param idString
    * http://localhost:3000/c/items/property?property=target&propertyString=something
    */
    @GetMapping(HGRS_API_GET_MY_ITEM_PROPERTY_LIST_PATH)
    public static async getAllByProperty(
        @RequestHeader(HGRS_AUTHORIZATION_HEADER_NAME, {
            required: false
        })
        token: string,
        @RequestParam('property', RequestParamValueType.STRING)
        property: string,
        @RequestParam('propertyString', RequestParamValueType.STRING)
        propertyString: string

    ): Promise<any | ResponseEntity<ErrorDTO>> {
        try {

            /*  if ( !token ) {
                  LOG.warn(`Warning! No authentication token provided in getMyUserById.`);
                  return ResponseEntity.internalServerError<ErrorDTO>().body(
                      createErrorDTO('Access denied', 403)
                  );
              }*/

            //const workspaceId: string = trim(parentIdString ?? '');
            const propertyName: string = trim(property ?? '');
            const propertyValue: string = trim(propertyString ?? '');

            /*  const email: string | undefined = JwtService.decodePayloadSubject(token);
              if ( !email ) {
                  LOG.warn(`Warning! Token did not have an email address in getMyUserById.`, token);
                  return ResponseEntity.internalServerError<ErrorDTO>().body(
                      createErrorDTO('Access denied', 403)
                  );
              }
  
              if ( !this._emailTokenService.verifyToken(email, token, true) ) {
                  LOG.debug(`getMyUserById: Access denied for email: `, email, token);
                  return ResponseEntity.internalServerError<ErrorDTO>().body(
                      createErrorDTO('Access denied', 403)
                  );
              }*/

            const result = await this._reposityServer.getAllByProperty(propertyName, propertyValue);
            console.log("RESULT ", result)
            if (!result) {
                return ResponseEntity.notFound<ErrorDTO>().body(
                    createErrorDTO('Not Found', 404)
                );
            }
            return ResponseEntity.ok(result as unknown as ReadonlyJsonObject);

        } catch (err) {
            LOG.error(`getAllByProperty: ERROR: `, err);
            return ResponseEntity.internalServerError<ErrorDTO>().body(
                createErrorDTO('Internal Server Error', 500)
            );
        }
    }

    /**
     * Updates a item by ID
     * http://localhost:3000/c/item/84944d2d8fd1464654ab7f40391ba5270dc2de6f
     *
     * @param token
     * @param idString
     * @param body
     */
    @PostMapping(HGRS_API_UPDATE_MY_ITEM_PATH)
    public static async findByIdAndUpdate(
        @RequestHeader(HGRS_AUTHORIZATION_HEADER_NAME, {
            required: false //true oikeasti
        })
        token: string,
        //@PathVariable(DASHBOARD_API_UPDATE_MY_WORKSPACE_USER_WORKSPACE_ID, { required: true })
        //parentIdString: string,
        @PathVariable(HGRS_API_GET_ITEM_ID, { required: true })
        idString: string,
        @RequestBody
        body: ReadonlyJsonObject
    ): Promise<any | ResponseEntity<ErrorDTO>> {
        try {

            /* if (!isPartial?(body)) {
                 LOG.debug(`updateMyUserById: Not Partial<User> body: `, body);
                 return ResponseEntity.badRequest<ErrorDTO>().body(
                     createErrorDTO('Bad Request', 400)
                 );
             }*/

            /* if (!token) {
                 LOG.warn(`Warning! No authentication token provided in updateMyUserById`);
                 return ResponseEntity.internalServerError<ErrorDTO>().body(
                     createErrorDTO('Access denied', 403)
                 );
             }*/

            const itemId: string = trim(idString ?? '');
            LOG.debug(`findByIdAndUpdate: itemId: `, itemId);


            /* const email: string | undefined = JwtService.decodePayloadSubject(token);
             if (!email) {
                 LOG.warn(`Warning! Token did not have an email address in updateMyUserById.`, token);
                 return ResponseEntity.internalServerError<ErrorDTO>().body(
                     createErrorDTO('Access denied', 403)
                 );
             }
 
             if (!this._emailTokenService.verifyToken(email, token, true)) {
                 LOG.debug(`updateMyUserById: Access denied for email: `, email, token);
                 return ResponseEntity.internalServerError<ErrorDTO>().body(
                     createErrorDTO('Access denied', 403)
                 );
             }*/


            return await this._reposityServer.findByIdAndUpdate(
                itemId,
                body
            );

        } catch (err) {
            LOG.error(`findByIdAndUpdate: ERROR: `, err);
            return ResponseEntity.internalServerError<ErrorDTO>().body(
                createErrorDTO('Internal Server Error', 500)
            );
        }
    }

    /**
    * Item deletion 
    *
    * @param token
    */
    @DeleteMapping(HGRS_API_DELETE_ITEM_PATH)
    public static async deleteById(
        @RequestHeader(HGRS_AUTHORIZATION_HEADER_NAME, {
            required: false //true
        })
        token: string,
        @RequestParam('idString', RequestParamValueType.STRING)
        idString: string
    ): Promise<ResponseEntity<void | ErrorDTO>> {
        try {

            /*  if (!token) {
                  LOG.warn(`Warning! No authentication token provided in deleteWorkspaces`);
                  return ResponseEntity.internalServerError<ErrorDTO>().body(
                      createErrorDTO('Access denied', 403)
                  );
              }
  
              const email: string | undefined = JwtService.decodePayloadSubject(token);
              if (!email) {
                  LOG.warn(`Warning! Token did not have an email address in deleteWorkspaces.`, token);
                  return ResponseEntity.internalServerError<ErrorDTO>().body(
                      createErrorDTO('Access denied', 403)
                  );
              }
  
              if (!this._emailTokenService.verifyToken(email, token, true)) {
                  LOG.debug(`deleteWorkspaces: Access denied for email: `, email, token);
                  return ResponseEntity.internalServerError<ErrorDTO>().body(
                      createErrorDTO('Access denied', 403)
                  );
              }*/
            const itemId: string = trim(idString ?? '');
            LOG.debug(`deleteById: itemId: `, itemId);


            await this._reposityServer.deleteById(itemId);

        } catch (err) {
            LOG.error(`delete item: ERROR: `, err);
            return ResponseEntity.internalServerError<ErrorDTO>().body(
                createErrorDTO('Internal Server Error', 500)
            );
        }
    }


}
