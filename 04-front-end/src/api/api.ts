import axios, { AxiosResponse } from 'axios';
import { AppConfiguration } from '../config/app.config';

type ApiMethod = 'get' | 'post' | 'put' | 'delete';
export type ApiRole   = 'administrator';
type ApiResponseStatus = 'ok' | 'error' | 'login';

export interface ApiResponse {
    status: ApiResponseStatus,
    data: any,
}

export default function api(
    method: ApiMethod,
    path: string,
    role: ApiRole = 'administrator',
    body: any | undefined = undefined,
    attemptToRefresh: boolean = true,

): Promise<ApiResponse> {
    return new Promise<ApiResponse>(resolve => {
        axios({
            method: method,
            baseURL: AppConfiguration.API_URL,
            url: path,
            data: body ? JSON.stringify(body) : '',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer' + getAuthToken(),
            },
        })
        .then(res => responseHandler(res, resolve))
        .catch(async err => {
            if (attemptToRefresh && ("" + err).includes("401")) {
                const newToken: string|null = await refreshToken();

                if (newToken === null) {
                    return resolve({
                        status: 'login',
                        data: null,
                    });
                }

                saveAuthToken(newToken);

                api(method, path, role, body, false)
                    .then(res => resolve(res))
                    .catch(() => {
                        resolve({
                            status: 'login',
                            data: null,
                        });
                    });

                return;
            }
            if (err?.response?.status === 401) {
                return resolve({
                    status: 'login',
                    data: null,
                });
            }

            if (err?.response?.status === 403) {
                return resolve({
                    status: 'login',
                    data: 'Wrong role',
                });
            }

            resolve({
                status: 'error',
                data: err?.response,
            });
        });
    });
}

function responseHandler(res: AxiosResponse<any>, resolve: (data: ApiResponse) => void) {
    if (res?.status < 200 || res?.status >= 300) {
        return resolve({
            status: 'error',
            data: '' + res,
        });
    }

    resolve({
        status: 'ok',
        data: res.data,
    });
}

function getAuthToken(): string {
    return localStorage.getItem( "administrator-auth-token") ?? '';
}

function getRefreshToken(): string {
    return localStorage.getItem("administrator-refresh-token") ?? '';
}

export function saveAuthToken(token: string) {
    localStorage.setItem("administrator-auth-token", token);
}

export function saveRefreshToken(token: string) {
    localStorage.setItem("administrator-refresh-token", token);
}

export function saveIdentity(identity: string) {
    localStorage.setItem("administrator-identity", identity);
}

export function getIdentity(): string {
    return localStorage.getItem("administrator-identity") ?? '';
}

function refreshToken(): Promise<string|null> {
    return new Promise<string|null>(resolve => {
        axios({
            method: "post",
            baseURL: AppConfiguration.API_URL,
            url: "/auth/" + "administrator" + "/refresh",
            data: JSON.stringify({
                refreshToken: getRefreshToken(),
            }),
            headers: { 'Content-Type': 'application/json' },
        })
        .then(res => refreshTokenResponseHandler(res, resolve))
        .catch(() => {
            resolve(null);
        });
    });
}

function refreshTokenResponseHandler(res: AxiosResponse<any>, resolve: (data: string|null) => void) {
    if (res.status !== 200) {
        return resolve(null);
    }

    resolve(res.data?.authToken);
}