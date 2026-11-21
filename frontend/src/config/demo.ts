const STORAGE_KEY = 'mvp.demo'
const DEMO_VALUE = '1'

function enabled(params: URLSearchParams): boolean {
  const value = params.get('demo')
  return value !== null && value !== '0' && value !== 'false'
}

function requested(): boolean {
  const query = new URLSearchParams(window.location.search)
  const hash = new URLSearchParams(
    window.location.hash.replace(/^#\??/, ''),
  )
  const path = window.location.pathname.replace(/\/+$/, '')
  return enabled(query) || enabled(hash) || path.endsWith('/demo')
}

/** Запоминает демо-режим на текущую вкладку. */
export function initDemoMode(): boolean {
  if (requested()) {
    try {
      sessionStorage.setItem(STORAGE_KEY, DEMO_VALUE)
    } catch {
      // sessionStorage может быть недоступен
    }
  }
  return isDemoMode()
}

export function isDemoMode(): boolean {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === DEMO_VALUE
  } catch {
    return false
  }
}
