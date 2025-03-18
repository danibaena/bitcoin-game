import { server } from "@/mocks/node"
import "@testing-library/jest-dom/vitest"

afterEach(() => {
  server.resetHandlers()
})

beforeAll(() => {
  server.listen()
})

afterAll(() => {
  server.close()
})
