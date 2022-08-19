// Copyright (c) 2022. Heusala Group <info@heusalagroup.fi>. All rights reserved.
/** tulisi olla omassa app.hgrs hakemistossa */


export enum HgrsQueryParam {

    /**
     * Query key: `i`
     */
    MATRIX = "m",

    /**
     * Query key: `c`
     */
    MEMORY = "c",

    /**
     * Query key: `p`
     */
    PARENT_LIST = "p",

    /**
     * Query key: `l`
     *
     * *Note!* Should be same as `EmailAuthQueryParam.LANGUAGE`
     */
    LANGUAGE = "l"

}

export function isHgrsQueryParam(value: any): value is HgrsQueryParam {
    switch (value) {
        case HgrsQueryParam.MATRIX:
        case HgrsQueryParam.MEMORY:
        case HgrsQueryParam.PARENT_LIST:
        case HgrsQueryParam.LANGUAGE:
            return true;

        default:
            return false;

    }
}

export function stringifyHgrsQueryParam(value: HgrsQueryParam): string {
    switch (value) {
        case HgrsQueryParam.MATRIX: return 'MATRIX';
        case HgrsQueryParam.MEMORY: return 'MEMORY';
        case HgrsQueryParam.PARENT_LIST: return 'PARENT_LIST';
        case HgrsQueryParam.LANGUAGE: return 'LANGUAGE';
    }
    throw new TypeError(`Unsupported HgrsQueryParam value: ${value}`);
}

export function parseHgrsQueryParam(value: any): HgrsQueryParam | undefined {

    switch (`${value}`.toUpperCase()) {

        case 'M':
        case 'MATRIX':
            return HgrsQueryParam.MATRIX;

        case 'C':
        case 'MEMORY':
            return HgrsQueryParam.MEMORY;

        case 'P':
        case 'PARENT_LIST':
            return HgrsQueryParam.PARENT_LIST;

        case 'L':
        case 'LANGUAGE':
            return HgrsQueryParam.LANGUAGE;

        default:
            return undefined;

    }

}