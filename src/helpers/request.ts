import axios, { AxiosRequestConfig, AxiosResponse } from "axios"

const instance = axios.create({})

instance.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    return Promise.reject(error)
  }
)

export interface Request {
  <T = any, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<T>
  <T = any, D = any>(config: AxiosRequestConfig<D>): Promise<T>

  get<T = any, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<T>
  post<T = any, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ): Promise<T>
  put<T = any, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ): Promise<T>
  patch<T = any, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ): Promise<T>
  delete<T = any, D = any>(
    url: string,
    config?: AxiosRequestConfig<D>
  ): Promise<T>
}

const request: Request = <T, D>(
  payload: string | AxiosRequestConfig<D>,
  config?: AxiosRequestConfig<D>
) =>
    requestHandler<T, D>(
      typeof payload === "string" ? instance(payload, config) : instance(payload)
    )
request.get = (url, config) => requestHandler(instance.get(url, config))
request.post = (url, data, config) =>
  requestHandler(instance.post(url, data, config))
request.put = (url, data, config) =>
  requestHandler(instance.put(url, data, config))
request.patch = (url, data, config) =>
  requestHandler(instance.patch(url, data, config))
request.delete = (url, config) => requestHandler(instance.delete(url, config))

function requestHandler<T = any, D = any>(
  handler: Promise<AxiosResponse<T, D>>
): Promise<T> {
  return new Promise((resolve, reject) => {
    handler
      .then((response) => resolve(response.data))
      .catch((error) => reject(error))
  })
}

export default request
