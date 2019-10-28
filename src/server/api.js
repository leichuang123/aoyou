import service from "./request"

export function test(data = {}) {
  service.post("/", {
    params: data
  })
}