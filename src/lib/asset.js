/* The site builds with base "./", so resolve public/ paths against it rather than the domain root. */
export const asset = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
