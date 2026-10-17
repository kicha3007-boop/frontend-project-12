// HTTP-клиент: JSON туда и обратно, ошибка несёт код ответа (401, 409) — по нему, а не по тексту,
// решают, что показать пользователю. Сетевая ошибка приходит без кода.
export class HttpError extends Error {
  constructor(status) {
    super(`Request failed with status ${status}`);
    this.status = status;
  }
}

const request = async (url, { method = "GET", body, token } = {}) => {
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};
  // Content-Type только вместе с телом: на DELETE без тела Fastify иначе отвечает 400
  const options =
    body === undefined
      ? { method, headers: authHeaders }
      : {
          method,
          headers: { ...authHeaders, "Content-Type": "application/json" },
          body: JSON.stringify(body),
        };
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new HttpError(response.status);
  }
  return response.json();
};

export default request;
