// frontend/src/setupTests.js
import '@testing-library/jest-dom'

// This line fixes "document is not defined"
import { vi } from 'vitest'
vi.stubGlobal('document', document)