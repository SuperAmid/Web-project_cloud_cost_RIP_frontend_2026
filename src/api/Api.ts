/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface SerializerErrorResponse {
  error?: string;
}

export interface SerializerMessageResponse {
  message?: string;
}

export interface SerializerProviderRouterDraft {
  bandwidth_mbps?: number;
  cost_rub?: number;
  created_at?: string;
  description?: string;
  id?: number;
  image_key?: string;
  image_url?: string;
  name?: string;
  published_at?: string;
  status?: string;
  video_key?: string;
  video_url?: string;
}

export interface SerializerProviderRouterFeedItem {
  bandwidth_mbps?: number;
  cost_rub?: number;
  creator_name?: string;
  description?: string;
  id?: number;
  image_url?: string;
  is_liked?: number;
  likes_count?: number;
  name?: string;
  published_at?: string;
  video_url?: string;
}

export interface SerializerProviderRouterLikeRequest {
  like?: number;
}

export interface SerializerProviderRouterLikeResponse {
  is_liked?: number;
  likes_count?: number;
  provider_router_id?: number;
}

export interface SerializerProviderRouterListItem {
  bandwidth_mbps?: number;
  cost_rub?: number;
  description?: string;
  id?: number;
  image_url?: string;
  is_own?: number;
  likes_count?: number;
  name?: string;
  published_at?: string;
  video_url?: string;
}

export interface SerializerProviderRouterPublishRequest {
  bandwidth_mbps?: number;
  cost_rub?: number;
  description?: string;
}

export interface SerializerProviderRouterUserLoginRequest {
  email?: string;
  password?: string;
}

export interface SerializerProviderRouterUserLoginResponse {
  access_token?: string;
  /**
   * секунд до истечения
   * @example 3600
   */
  expires_in?: number;
  /** @example "Bearer" */
  token_type?: string;
  user?: SerializerProviderRouterUserResponse;
}

export interface SerializerProviderRouterUserRegisterRequest {
  display_name?: string;
  email?: string;
  password?: string;
}

export interface SerializerProviderRouterUserResponse {
  display_name?: string;
  email?: string;
  id?: number;
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "http://localhost:8080/api",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title provider_routers API
 * @version 1.0
 * @baseUrl http://localhost:8080/api
 * @contact
 *
 * Маршрутизаторы сети провайдера: список, лента, черновик, публикация, лайки.
 * Без авторизации доступно только чтение. Чтобы вызвать методы создателя,
 * выполните вход и нажмите Authorize: Bearer <access_token>.
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  providerRouterUsers = {
    /**
     * @description Токен из access_token передаётся в заголовке Authorization: Bearer <токен>.
     *
     * @tags provider_router_users
     * @name LoginProviderRouterUser
     * @summary Вход: выдача JWT
     * @request POST:/provider_router_users/login
     */
    loginProviderRouterUser: (
      body: SerializerProviderRouterUserLoginRequest,
      params: RequestParams = {},
    ) =>
      this.request<
        SerializerProviderRouterUserLoginResponse,
        SerializerErrorResponse
      >({
        path: `/provider_router_users/login`,
        method: "POST",
        body: body,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Текущий токен попадает в blacklist Redis до конца срока действия.
     *
     * @tags provider_router_users
     * @name LogoutProviderRouterUser
     * @summary Выход
     * @request POST:/provider_router_users/logout
     * @secure
     */
    logoutProviderRouterUser: (params: RequestParams = {}) =>
      this.request<SerializerMessageResponse, SerializerErrorResponse>({
        path: `/provider_router_users/logout`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Пароль хранится как bcrypt-хеш.
     *
     * @tags provider_router_users
     * @name RegisterProviderRouterUser
     * @summary Регистрация
     * @request POST:/provider_router_users/register
     */
    registerProviderRouterUser: (
      body: SerializerProviderRouterUserRegisterRequest,
      params: RequestParams = {},
    ) =>
      this.request<
        SerializerProviderRouterUserResponse,
        SerializerErrorResponse
      >({
        path: `/provider_router_users/register`,
        method: "POST",
        body: body,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  providerRouters = {
    /**
     * @description Только опубликованные, фильтры выполняются в БД. is_own = 1, если создатель — текущий пользователь (для гостя 0). Доступно без авторизации.
     *
     * @tags provider_routers
     * @name GetProviderRouters
     * @summary Список маршрутизаторов
     * @request GET:/provider_routers
     * @secure
     */
    getProviderRouters: (
      query?: {
        /** Минимальная пропускная способность, Мбит/с */
        min_bandwidth_mbps?: number;
        /** Максимальная стоимость, ₽ */
        max_cost_rub?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<SerializerProviderRouterListItem[], SerializerErrorResponse>(
        {
          path: `/provider_routers`,
          method: "GET",
          query: query,
          secure: true,
          format: "json",
          ...params,
        },
      ),

    /**
     * @description Файлы сохраняются в MinIO под латинскими именами, создатель — пользователь из токена.
     *
     * @tags provider_routers
     * @name CreateProviderRouter
     * @summary Создание черновика с фото и видео
     * @request POST:/provider_routers
     * @secure
     */
    createProviderRouter: (
      data: {
        /** Название */
        name: string;
        /**
         * Фото: jpg, jpeg, png, webp, svg до 10 МБ
         * @format binary
         */
        image: File;
        /**
         * Видео: mp4, webm, mov до 50 МБ
         * @format binary
         */
        video: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<SerializerProviderRouterDraft, SerializerErrorResponse>({
        path: `/provider_routers`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * @description Не более одного черновика у пользователя, id не указывается.
     *
     * @tags provider_routers
     * @name GetProviderRouterDraft
     * @summary Черновик текущего пользователя
     * @request GET:/provider_routers/draft
     * @secure
     */
    getProviderRouterDraft: (params: RequestParams = {}) =>
      this.request<SerializerProviderRouterDraft, SerializerErrorResponse>({
        path: `/provider_routers/draft`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Без id — первая опубликованная, с id — эта, с id и next=true — следующая (после последней — первая). is_liked = 1, если текущий пользователь лайкнул (для гостя 0). Доступно без авторизации.
     *
     * @tags provider_routers
     * @name GetProviderRouterFeed
     * @summary Лента: одна карточка
     * @request GET:/provider_routers/feed
     * @secure
     */
    getProviderRouterFeed: (
      query?: {
        /** Id маршрутизатора */
        id?: number;
        /** Следующая после id */
        next?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<SerializerProviderRouterFeedItem, SerializerErrorResponse>({
        path: `/provider_routers/feed`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description status = deleted, запись больше не отдаётся клиенту.
     *
     * @tags provider_routers
     * @name DeleteProviderRouter
     * @summary Логическое удаление своей записи
     * @request DELETE:/provider_routers/{id}
     * @secure
     */
    deleteProviderRouter: (id: number, params: RequestParams = {}) =>
      this.request<SerializerProviderRouterDraft, SerializerErrorResponse>({
        path: `/provider_routers/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description like = 1 ставит лайк, 0 снимает.
     *
     * @tags provider_routers
     * @name LikeProviderRouter
     * @summary Лайк от текущего пользователя
     * @request POST:/provider_routers/{id}/like
     * @secure
     */
    likeProviderRouter: (
      id: number,
      body: SerializerProviderRouterLikeRequest,
      params: RequestParams = {},
    ) =>
      this.request<
        SerializerProviderRouterLikeResponse,
        SerializerErrorResponse
      >({
        path: `/provider_routers/${id}/like`,
        method: "POST",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description draft → published, published_at ставит сервер. В той же транзакции заполняются описание и два поля по теме.
     *
     * @tags provider_routers
     * @name PublishProviderRouter
     * @summary Публикация своего черновика
     * @request PUT:/provider_routers/{id}/publish
     * @secure
     */
    publishProviderRouter: (
      id: number,
      body: SerializerProviderRouterPublishRequest,
      params: RequestParams = {},
    ) =>
      this.request<SerializerProviderRouterDraft, SerializerErrorResponse>({
        path: `/provider_routers/${id}/publish`,
        method: "PUT",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
}
