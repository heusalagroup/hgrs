/**
 * System test for HttpRepositoryClient and hgrs.
 *
 * E.g. this test is meant to connect to the repository server and test real
 * functionality.
 */

import { HttpRepositoryClient } from "../fi/hg/core/simpleRepository/HttpRepositoryClient";
import { LogLevel } from "../fi/hg/core/types/LogLevel";
import { StoredRepositoryItem } from "../fi/hg/core/simpleRepository/types/StoredRepositoryItem";

HttpRepositoryClient.setLogLevel(LogLevel.NONE);

const HGRS_URL = process?.env?.HGRS_URL ?? 'http://localhost:8008';
const HGRS_USERNAME = 'app';
const HGRS_PASSWORD = 'p4ssw0rd123';

interface StoredTestRepositoryItem extends StoredRepositoryItem {

    /**
     * Unique ID
     */
    readonly id : string;

    /** Current item data as JSON string */
    readonly target : string;

}

describe('system', () => {

    describe('HttpRepositoryClient', () => {

        describe('#construct', () => {

            it('can create unauthenticated client object', () => {
                const client = new HttpRepositoryClient(HGRS_URL);
                expect(client).toBeDefined();
            });

        });

        /**
         */
        describe('#login', () => {

            const client : HttpRepositoryClient<StoredTestRepositoryItem> = new HttpRepositoryClient<StoredTestRepositoryItem>(HGRS_URL);

            beforeAll( () => {
                // expect(client.getState()).toBe(HttpRepositoryClientState.UNAUTHENTICATED);
            });

            it('can login', async () => {

                await client.login(HGRS_USERNAME, HGRS_PASSWORD);

                expect( client.isLoggedIn() ).toBe(true);

            });

        });

    });

});
