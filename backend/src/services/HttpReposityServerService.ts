import { LogService } from "../fi/hg/core/LogService";
//import { createUser, User } from "./types/repository/user/User";
//import { REPOSITORY_NEW_IDENTIFIER } from "./simpleRepository/types/Repository";
import { Repository, REPOSITORY_NEW_IDENTIFIER } from "../fi/hg/core/simpleRepository/types/Repository";
import { JwtEngine } from "../fi/hg/backend/JwtEngine";
import { JwtService } from "../fi/hg/backend/JwtService";
import { LogLevel } from "../fi/hg/core/types/LogLevel";
import { RepositoryEntry } from "../fi/hg/core/simpleRepository/types/RepositoryEntry";
import { map } from "../fi/hg/core/modules/lodash";
import { StoredRepositoryItem } from "../fi/hg/core/simpleRepository/types/StoredRepositoryItem";

import { RepositoryServiceEvent } from "../fi/hg/core/simpleRepository/types/RepositoryServiceEvent";
import { RepositoryService } from "../fi/hg/core/simpleRepository/types/RepositoryService";
import { JsonObject, ReadonlyJsonObject } from "../fi/hg/core/Json";

import { RepositoryInitializer } from "../fi/hg/core/simpleRepository/types/RepositoryInitializer";
import { MemoryRepositoryInitializer } from "../fi/hg/core/simpleRepository/MemoryRepositoryInitializer"; //FIXME

import { Observer, ObserverCallback, ObserverDestructor } from "../fi/hg/core/Observer";

//memoryrepository
import { RepositoryItem } from "../fi/hg/core/simpleRepository/types/RepositoryItem";
import { MemoryRepository } from "../fi/hg/core/simpleRepository/MemoryRepository";


import { SharedClientService } from "../fi/hg/core/simpleRepository/types/SharedClientService";
import { MemorySharedClientService } from "../fi/hg/core/simpleRepository/MemorySharedClientService";
import { ClientRequest } from "http";
import { isEmpty } from "lodash";

// LIKE https://github.com/heusalagroup/fi.hg.dashboard/blob/a9889d7b90c53032992496ee5d1875f21de73b60/services/UserRepositoryService.ts

const LOG = LogService.createLogger('HttpReposityServerService');


/**
 * Default expiration time in minutes
 */
const DEFAULT_ACCESS_TOKEN_EXPIRATION_TIME = 300;

/*export interface Repository<T extends StoredRepositoryItem> {
    id: string,
    target: string
}*/

export type RepositoryServiceDestructor = ObserverDestructor;

export class HttpReposityServerService implements Repository<any>{
//export class HttpReposityServerService<T extends StoredRepositoryItem> implements Repository<T>{
    //export class HttpReposityServerService implements RepositoryService<StoredRepositoryItem> {

    public Event = RepositoryServiceEvent;

    protected readonly _sharedClientService: MemorySharedClientService
    protected readonly _observer: Observer<RepositoryServiceEvent>;
    protected _repository: Repository<StoredRepositoryItem> | undefined;
    protected _repositoryInitializer: RepositoryInitializer<StoredRepositoryItem> | undefined;

    public static setLogLevel(level: LogLevel) {
        LOG.setLogLevel(level);
    }


    /**
     *
     */
    public constructor(
        /*   sharedClientService: MemorySharedClientService,
           repositoryInitializer: MemoryRepositoryInitializer<StoredRepositoryItem>*/
        // repository: HttpReposityServerService,

    ) {

        this._observer = new Observer<RepositoryServiceEvent>("HttpRepositoryServerService");
        this._sharedClientService = new MemorySharedClientService;//sharedClientService;
        this._repositoryInitializer = new MemoryRepositoryInitializer(null);//repositoryInitializer;
        this._repository = undefined;
        //this._repository = repository;
    }

    public on(
        name: RepositoryServiceEvent,
        callback: ObserverCallback<RepositoryServiceEvent>
    ): RepositoryServiceDestructor {
        return this._observer.listenEvent(name, callback);
    }

    public async initialize(): Promise<void> {
        LOG.debug(`Initialization started`);
        await this._sharedClientService.waitForInitialization();
        this._repository = await this._repositoryInitializer.initializeRepository(this._sharedClientService.getClient());
        LOG.debug(`Initialization finished`);
        if (this._observer.hasCallbacks(RepositoryServiceEvent.INITIALIZED)) {
            this._observer.triggerEvent(RepositoryServiceEvent.INITIALIZED);
        }
    }

    public async createItem(data: any, members?: readonly string[]): Promise<RepositoryEntry<any>> {
        const item = await this._repository.updateOrCreateItem(data);

        //return (item);
        return HttpReposityServerService._prepareItem(item);
    }


    public async getAll(): Promise<RepositoryEntry<any>[]> {
        const list: readonly RepositoryEntry<StoredRepositoryItem>[] = await this._getAll();
       /* return map(list, (item: RepositoryEntry<StoredRepositoryItem>): RepositoryEntry<any> => {
            return (item)
        });*/
        return map(list, (item: RepositoryEntry<StoredRepositoryItem>) => HttpReposityServerService._prepareItem(item));

    }

    public async getSome(idList: readonly string[]): Promise<readonly RepositoryEntry<any>[] | undefined> {
        console.log("GETSOME ", JSON.stringify(idList))
        const list: readonly RepositoryEntry<StoredRepositoryItem>[] = await this._getSome(idList);
        //return map(list, (item: RepositoryEntry<StoredRepositoryItem>): RepositoryEntry<any> => {
        return map(list, (item: RepositoryEntry<StoredRepositoryItem>) => HttpReposityServerService._prepareItem(item));
         /*   return (
                item
            );
        });*/

    }

    public async findById(id: string, includeMembers?: boolean): Promise<RepositoryEntry<any> | undefined> {
        console.log("findById ", id)
        //return await this._repository.findById(id, includeMembers ? includeMembers : false);
        const item = await this._repository.findById(id, includeMembers ? includeMembers : false);
        return HttpReposityServerService._prepareItem(item);
    }

    public async waitById(id: string, includeMembers?: boolean, timeout?: number): Promise<RepositoryEntry<any>> {
        const item = await this._repository.waitById(id, includeMembers ? includeMembers : false, timeout ? timeout : undefined);
        return HttpReposityServerService._prepareItem(item);
    }


    public async findByProperty(propertyName: string, propertyValue: any): Promise<RepositoryEntry<any> | undefined> {
        const item = await this._repository.findByProperty(propertyName, propertyValue);
        return HttpReposityServerService._prepareItem(item);
        //return item;
    }

    public async getAllByProperty(propertyName: string, propertyValue: any): Promise<readonly RepositoryEntry<any>[]> {
        const list: readonly RepositoryEntry<StoredRepositoryItem>[] = await this._getAllByProperty(propertyName, propertyValue);
        /*return map(list, (item: RepositoryEntry<StoredRepositoryItem>): RepositoryEntry<any> => {
            return (item)
        });*/
        return map(list, (item: RepositoryEntry<StoredRepositoryItem>) => HttpReposityServerService._prepareItem(item));

    }

    public async findByIdAndUpdate(id: string, item: any): Promise<RepositoryEntry<any>> {
        const updatedItem = await this._repository.findByIdAndUpdate(id, item);
        return HttpReposityServerService._prepareItem(updatedItem);
    }

    public async update(id: string, data: any): Promise<RepositoryEntry<any>> {
        const updatedItem = await this._repository.update(id, data);
        return HttpReposityServerService._prepareItem(updatedItem);
    }



    public async deleteById(id: string): Promise<RepositoryEntry<any>> {
        return await this._repository.deleteById(id);
    }





      private static _prepareItem(item: RepositoryEntry<any>): RepositoryEntry<any> {
          return (
              item
         );
    }



    /*private static _prepareItem(item: RepositoryItem<any>): Repository<any> {

        return (
            item.id,
            item.target
        );
    }*/

    private async _getAll(): Promise<readonly RepositoryEntry<StoredRepositoryItem>[]> {
        if (!this._repository) throw new TypeError(`HttpRepositoryServerService: No repository constructed`);
        return await this._repository.getAll();
    }

    private async _getAllByProperty(propertyName: string, propertyValue: any): Promise<readonly RepositoryEntry<StoredRepositoryItem>[]> {
        if (!this._repository) throw new TypeError(`HttpRepositoryServerService: No repository constructed`);

        console.log(JSON.stringify(this._repository))

        return await this._repository.getAllByProperty(propertyName, propertyValue);
    }


    private async _getSome(
        idList: readonly string[]
    ): Promise<readonly RepositoryEntry<StoredRepositoryItem>[]> {
        console.log("LISTA ID", idList)
        if (!this._repository) throw new TypeError(`HttpRepositoryServerService: No repository constructed`);
        return await this._repository.getSome(idList);
    }

    public async updateOrCreateItem(item: any): Promise<RepositoryEntry<any>> {
        if (!this._repository) throw new TypeError(`HttpRepositoryServerService: No repository constructed`);
        return await this._repository.updateOrCreateItem(item);
    }



    /*private async updateOrCreateItem(item: any): Promise<RepositoryEntry<any>> {
        //throw new Error("Method not implemented.");
        return 
    }*/

    deleteByIdList(list: readonly string[]): Promise<readonly RepositoryEntry<any>[]> {
        throw new Error("Method not implemented.");
    }
    deleteByList(list: readonly RepositoryEntry<any>[]): Promise<readonly RepositoryEntry<any>[]> {
        throw new Error("Method not implemented.");
    }
    inviteToItem(id: string, members: readonly string[]): Promise<void> {
        throw new Error("Method not implemented.");
    }
    subscribeToItem(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    isRepositoryEntryList(list: any): list is RepositoryEntry<any>[] {
        throw new Error("Method not implemented.");
    }





    /**
     *
     * @param username
     * @param password
     * @param email
     */
    /*  public async createUser (
         username  : string,
         password  : string,
         email    ?: string
     ) : Promise<User> {
         const createdUser = await this._userService.createUser(
             createUserRepositoryItem(
                 REPOSITORY_NEW_IDENTIFIER,
                 createUser(
                     REPOSITORY_NEW_IDENTIFIER,
                     username,
                     password,
                     email
                 ),
                 username,
                 email
             )
         );
         if (!createdUser) throw new TypeError(`HttpReposityServerService.createUser: Could not create user: ${username}`);
         return createUser(
             createdUser?.id,
             createdUser?.target?.username,
             createdUser?.target?.password,
             createdUser?.target?.email
         );
     }*/







}

function T<T>(T: any) {
    throw new Error("Function not implemented.");
}
